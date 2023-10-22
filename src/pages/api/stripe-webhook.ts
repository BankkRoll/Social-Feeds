import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { doc, setDoc, collection, where, getDocs, addDoc, updateDoc, query } from "firebase/firestore";
import { db } from "../../../firebaseClient";
import { buffer } from "micro";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const reqBuffer = await buffer(req);
    const payload = reqBuffer.toString();
    const signature = req.headers["stripe-signature"]!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const userRef = collection(db, "users");

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        const subscription = event.data.object as Stripe.Subscription;
        const userAddress = subscription.metadata.userAddress;
        const snapshot = await getDocs(query(userRef, where("userAddress", "==", userAddress)));
        
        if (!snapshot.empty) {
          const docRef = snapshot.docs[0].ref;
          const proStatus = ["customer.subscription.created", "customer.subscription.updated", "customer.subscription.resumed"].includes(event.type);
          await updateDoc(docRef, { proUser: proStatus });
        }
        break;
    }

    res.status(200).json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
