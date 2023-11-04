import { buffer } from 'micro';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

const webhookSecret: string = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.log(`❌ Error message: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    console.log('✅ Success:', event.id);

    // Ensure the event data object is of type Subscription
    const eventData = event.data.object as Stripe.Subscription;

    if ('object' in eventData && eventData.object !== "subscription") {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
      return res.status(400).send(`Webhook Error: Expected a subscription event`);
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
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

export default cors(webhookHandler as any);
