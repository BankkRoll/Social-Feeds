import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAddress } from "@thirdweb-dev/react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebaseClient";
import Settings from "../../components/Settings";
import InterfaceSettings from "../../components/Interface";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import { Skeleton } from "../../components/ui/skeleton";
import Subscription from "../../components/Subscription";
import Analytics from "../../components/Analytics";

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>({});
  const isProUser = userData?.proUser;

  const address = useAddress();
  const router = useRouter();
  const [slug, setSlug] = useState<string | null>(null);
  const { success } = router.query;

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      if (address && db) {
        const userRef = doc(db, "users", address);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setLoading(false);

          // Calculate the slug from the user's userName
          const userName = data?.profile?.userName;
          const generatedSlug = userName?.toLowerCase().replace(/ /g, "-");
          setSlug(generatedSlug);
        } else {
          router.push("/");
        }
      }
    };

    const verifyPayment = async () => {
      if (address && success) {
        const userRef = doc(db, "users", address);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const sessionId = userData.stripeSessionId;

          const response = await fetch("/api/getSession", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId }),
          });

          if (response.ok) {
            const session = await response.json();

            if (session.payment_status === "paid") {
              await setDoc(userRef, { proUser: true }, { merge: true });
            }
          }
        }
      }
    };

    fetchUserData();
    verifyPayment();
  }, [address, db, router, success]);

  if (loading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="profile-container mx-auto flex p-2 md:p-4 max-w-5xl">
      <Tabs defaultValue="settings" className="w-full flex">
        <div className="w-1/4 p-2 md:p-4 bg-background">
          <TabsList
            direction="vertical"
            className="bg-popover flex flex-col space-y-2"
          >
            <TabsTrigger
              value="settings"
              className="p-2 rounded-lg cursor-pointer hover:bg-background"
            >
              Settings
            </TabsTrigger>
            <TabsTrigger
              value="interface"
              className="p-2 rounded-lg cursor-pointer hover:bg-background"
            >
              Interface
            </TabsTrigger>
            <TabsTrigger
              value="subscription"
              className="p-2 rounded-lg cursor-pointer hover:bg-background"
            >
              Subscription
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="p-2 rounded-lg cursor-pointer hover:bg-background"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="w-3/4 p-4 bg-popover rounded-lg">
          <TabsContent value="settings">
            {isProUser ? (
              <Settings userData={userData} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-semibold mb-4">Settings</h2>
                <p className="text-lg text-gray-600 text-center">
                  Please subscribe to access this section.
                </p>
                <Subscription />
              </div>
            )}
          </TabsContent>
          <TabsContent value="interface">
            {isProUser ? (
              <InterfaceSettings
                userData={userData}
                interfaceData={userData.interfaceData}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-semibold mb-4">
                  Interface Settings
                </h2>
                <p className="text-lg text-gray-600 text-center">
                  Please subscribe to access this section.
                </p>
                <Subscription />
              </div>
            )}
          </TabsContent>
          <TabsContent value="subscription">
            <div className="flex flex-col items-center justify-center h-full">
              <h2 className="text-2xl font-semibold mb-4">
                Subscription Settings
              </h2>
              <p className="text-lg text-gray-600 text-center">
                Here you can subscribe to the monthly subscription.
              </p>
              <Subscription />
            </div>
          </TabsContent>
          <TabsContent value="analytics">
            {isProUser ? (
              <Analytics />
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
                <p className="text-lg text-gray-600 text-center">
                  Please subscribe to access this section.
                </p>
                <Subscription />
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Profile;
