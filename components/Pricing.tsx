// components/Pricing.tsx
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  GlowCard,
  GlowCardContent,
  GlowCardFooter,
  GlowCardHeader,
} from "./ui/card-glow";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseClient";

const PricePlan: React.FC = () => {
  const address = useAddress();
  const [proUser, setProUser] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProUserStatus = async () => {
      if (!address) {
        return;
      }
      setIsLoading(true);
      const userRef = doc(db, "users", address);
      const userDoc = await getDoc(userRef);
      setProUser(userDoc.data()?.proUser || null);
      setIsLoading(false);
    };

    if (address) {
      fetchProUserStatus();
    } else {
      setIsLoading(false);
    }
  }, [address]);

  if (isLoading) {
    return <p className="text-lg text-gray-600 mb-4">Loading...</p>;
  }

  if (proUser) {
    return null;
  }

  return (
    <div className="bg-background text-foreground flex flex-col items-center justify-center my-10">
      <div className="text-center">
        {address ? (
          <form action="/api/checkout_sessions" method="POST">
            <GlowCard className="max-w-md">
              <GlowCardHeader>
                <h1 className="text-3xl font-semibold tracking-wider text-center">
                  Subscription
                </h1>
              </GlowCardHeader>
              <GlowCardContent>
                <h2 className="text-2xl font-semibold mb-4">
                  Subscribe to SocialFeeds
                </h2>
                <p className="text-lg text-gray-600 mb-4">
                  $2.00 Monthly SocialFeeds Membership.
                </p>
              </GlowCardContent>
              <GlowCardFooter className="flex justify-center">
                <input type="hidden" name="userAddress" value={address} />
                <Button
                  type="submit"
                  className="checkout-button"
                  disabled={!address}
                >
                  Sign Up!
                </Button>
              </GlowCardFooter>
            </GlowCard>
          </form>
        ) : (
          <ConnectWallet
            theme={"dark"}
            btnTitle={"Get Started"}
            modalTitle={"Choose Your Login"}
            modalSize={"wide"}
            welcomeScreen={{ title: "" }}
            style={{
              margin: "20px 20px",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PricePlan;
