import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAddress } from "@thirdweb-dev/react";
import { doc, getDoc } from "firebase/firestore";
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
import { UserInterface } from "../../type";

interface InterfaceProps {
  interfaceData: UserInterface;
}

const Profile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>({});

  const address = useAddress();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      if (address && db) {
        const userRef = doc(db, "users", address);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data() || {});
          setLoading(false);
        } else {
          router.push("/");
        }
      }
    };

    fetchUserData();
  }, [address, db, router]);

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
          </TabsList>
        </div>

        <div className="w-3/4 p-4 bg-popover rounded-lg">
          <TabsContent value="settings">
            <Settings userData={userData} />
          </TabsContent>
          <TabsContent value="interface">
            <InterfaceSettings
              userData={userData}
              interfaceData={userData.interfaceData}
            />
          </TabsContent>
          <TabsContent value="subscription">
            <div className="text-foreground">Coming soon!</div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default Profile;
