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
        variant: "warning",
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
              <p className="text-lg text-gray-600 mb-4">1 Day Free Trial</p>
              <p className="text-lg text-gray-600">$3 per month after</p>
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
