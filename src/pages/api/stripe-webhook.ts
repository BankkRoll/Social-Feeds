import { buffer } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const updateUserStatus = async (userAddress: string, proUser: boolean, subscriptionStatus: string) => {
  const userRef = doc(db, "users", userAddress);
  await setDoc(userRef, { proUser, subscriptionStatus }, { merge: true });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    const data: Stripe.Event.Data = event.data;
    const eventType: string = event.type;
    const subscription: Stripe.Subscription = data.object as Stripe.Subscription;
    const userAddress: string = subscription.metadata?.userAddress || "";

    switch (eventType) {
      case "customer.subscription.created":
        await updateUserStatus(userAddress, true, "active");
        break;
      case "customer.subscription.deleted":
        await updateUserStatus(userAddress, false, "deleted");
        break;
      case "customer.subscription.paused":
        await updateUserStatus(userAddress, false, "paused");
        break;
      case "customer.subscription.resumed":
        await updateUserStatus(userAddress, true, "active");
        break;
      case "customer.subscription.updated":
        const newStatus = subscription.status;
        await updateUserStatus(userAddress, newStatus === "active", newStatus);
        break;
      default:
        return res.status(400).end();
    }

    res.json({ received: true });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
