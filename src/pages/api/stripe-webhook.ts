import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const sig = req.headers["stripe-signature"]!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    const subscription = event.data.object as Stripe.Subscription;
    const userAddress = subscription.metadata.userAddress;
    const userRef = doc(db, "users", userAddress);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        if (userAddress) {
          await setDoc(userRef, { proUser: true }, { merge: true });
        }
        break;

      case "customer.subscription.deleted":
        if (userAddress) {
          await setDoc(userRef, { proUser: false }, { merge: true });
        }
        break;

      case "customer.subscription.paused":
        if (userAddress) {
          await setDoc(userRef, { proUser: false }, { merge: true });
        }
        break;

      case "customer.subscription.resumed":
        if (userAddress) {
          await setDoc(userRef, { proUser: true }, { merge: true });
        }
        break;

      default:
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
