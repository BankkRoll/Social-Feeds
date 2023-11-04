import React, { useEffect, useState } from "react";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardContent,
  GlowCardFooter,
} from "./ui/card-glow";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { useAddress } from "@thirdweb-dev/react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseClient";

export default function Subscription() {
  const address = useAddress();
  const [proUser, setProUser] = useState<boolean | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      toast({
        variant: "success",
        title: "Order placed! You will receive an email confirmation.",
      });
    }
    if (query.get("canceled")) {
      toast({
        variant: "destructive",
        title:
          "Order canceled -- continue to shop around and checkout when you’re ready.",
      });
    }
  }, []);

  useEffect(() => {
    if (address) {
      const fetchProUserStatus = async () => {
        const userRef = doc(db, "users", address);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setProUser(userDoc.data()?.proUser);
        }
      };

      fetchProUserStatus();
    }
  }, [address]);

  const handleManageAccount = () => {
    window.location.href = "https://dashboard.stripe.com/";
  };

  return (
    <div className="subscription-container mx-auto p-8 flex justify-center">
      <GlowCard className="max-w-md">
        <GlowCardHeader>
          <h1 className="text-3xl font-semibold tracking-wider">
            Subscription
          </h1>
        </GlowCardHeader>
        <GlowCardContent>
          {proUser ? (
            <>
              <p className="text-lg text-gray-600 mb-4">
                Your account is currently active.
              </p>
              <Button
                className="view-account-button"
                onClick={handleManageAccount}
              >
                View or Manage Account
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4">
                Subscribe to SocialFeeds
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                $2.00 Monthly SocialFeeds Membership.
              </p>
              <img
                src="https://stripe-camo.global.ssl.fastly.net/9e510da673e212fe011175cfa53885990a5191baae1c9eaf22b315f1ac7db873/68747470733a2f2f66696c65732e7374726970652e636f6d2f6c696e6b732f4d44423859574e6a644638785445707459334e4c59544a4c633359786154463166475a7358327870646d56664f455a7557564a58516d745763334e74526c644859574a46567a56314e33517a30304168584461546835"
                alt="Subscription Image"
                className="w-full h-64 object-cover mb-4"
              />
            </>
          )}
        </GlowCardContent>
        <GlowCardFooter className="flex justify-center">
          {!proUser && (
            <form action="/api/checkout_sessions" method="POST">
              <input type="hidden" name="userAddress" value={address} />
              <Button
                type="submit"
                className="checkout-button"
                disabled={!address}
              >
                Sign Up!
              </Button>
            </form>
          )}
        </GlowCardFooter>
      </GlowCard>
    </div>
  );
}
