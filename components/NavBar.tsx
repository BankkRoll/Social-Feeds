import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DocumentData, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebaseClient";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { colorPalettes } from "../lib/colorPalettes";
import { Skeleton } from "./ui/skeleton";

const Navbar: React.FC = () => {
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const address = useAddress();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const checkOrCreateUser = async () => {
      if (address && db) {
        const userRef = doc(db, "users", address);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        } else {
          const randomPalette =
            colorPalettes[Math.floor(Math.random() * colorPalettes.length)];

          const newUser = {
            verifiedUser: false,
            proUser: false,
            profile: {
              userAddress: address,
              location: "",
              occupation: "",
              emailaddress: "",
              timeStamp: new Date().toISOString(),
              userName: "",
              bio: "",
              avatarImg:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png",
              bannerImg:
                "https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg",
            },
            interface: {
              ...randomPalette,
            },
            socials: {
              twitter: {
                active: false,
                social: "twitter",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
              facebook: {
                active: false,
                social: "facebook",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
              instagram: {
                active: false,
                social: "instagram",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
              snapchat: {
                active: false,
                social: "snapchat",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
              tiktok: {
                active: false,
                social: "tiktok",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
              kick: {
                active: false,
                social: "kick",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
              youtube: {
                active: false,
                social: "youtube",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
              onlyfans: {
                active: false,
                social: "onlyfans",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
              fansly: {
                active: false,
                social: "fansly",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
              linkedin: {
                active: false,
                social: "linkedin",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
              github: {
                active: false,
                social: "github",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
              website: {
                active: false,
                social: "website",
                title: "",
                description: "",
                thumbnailurl: "",
                siteurl: "",
              },
            },
            tweets: {
              tweet1: { id: "", active: false },
              tweet2: { id: "", active: false },
            },
          };
          await setDoc(userRef, newUser);
          console.log("New user created");
        }
      }
      setIsLoading(false);
    };

    checkOrCreateUser();
  }, [address, db]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <div className="flex-shrink-0">
          <Link href="/">
            <img
              className="md:h-12 md:w-52 h-8 w-32"
              src="/testr.png"
              alt="SocialTree"
            />
          </Link>
        </div>

        {isLoading ? (
          <Skeleton className="w-8 h-8 rounded-full" />
        ) : address ? (
          <>
            <div className="flex items-center space-x-1 md:space-x-4">
              <ConnectWallet
                theme={"dark"}
                btnTitle={"Login"}
                modalTitle={"Choose Your Login"}
                modalSize={"wide"}
                welcomeScreen={{ title: "" }}
              />
              <Link href="/profile">
                <img
                  src={userData?.profile?.avatarImg}
                  alt="Profile"
                  className="rounded-full w-8 h-8"
                  onError={(e) => {
                    e.currentTarget.src = "/";
                  }}
                />
              </Link>
            </div>
          </>
        ) : (
          <ConnectWallet
            theme={"dark"}
            btnTitle={"Login"}
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

export default Navbar;
