import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../../firebaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const origin = req.headers.origin;
  const userAddress = req.body.userAddress;

  if (!origin) {
    res.status(400).end("Origin header is missing");
    return;
  }

  if (req.method === "POST") {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: "price_1O8nlKKa2Ksv1i1ufcPf1wt2",
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${origin}/profile?success=true`,
        cancel_url: `${origin}/?canceled=true`,
        metadata: { userAddress },
      });

      if (session.id && userAddress) {
        const userRef = doc(db, "users", userAddress);
        await setDoc(userRef, { stripeSessionId: session.id }, { merge: true });
      }

      if (session.url) {
        res.redirect(303, session.url);
      } else {
        res.status(400).json({ error: "Stripe session URL is missing" });
      }
    } catch (err) {
      res
        .status((err as Stripe.StripeRawError).statusCode || 500)
        .json((err as Stripe.StripeRawError).message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
