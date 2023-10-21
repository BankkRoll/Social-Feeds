import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  DocumentData,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../firebaseClient";
import Link from "next/link";
import { Tweet } from "react-tweet";

interface TweetType {
  id: string;
  active: boolean;
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [interfaceData, setInterfaceData] = useState<any>(null);
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (interfaceData?.general?.font) {
      document.body.setAttribute("data-font", interfaceData?.general?.font);
    }
  }, [interfaceData?.general?.font]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (slug && db) {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("profile.userName", "==", slug));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setUserData(doc.data());
            setInterfaceData(doc.data().interface);
          });
        } else {
          router.push("/");
        }
      }
    };

    fetchUserData();
  }, [slug, db, router]);

  const backgroundStyle = interfaceData?.general?.backgroundColor.startsWith(
    "linear-gradient"
  )
    ? { background: interfaceData?.general?.backgroundColor }
    : { backgroundColor: interfaceData?.general?.backgroundColor };

  return (
    <div
      className="flex flex-col items-center bg-background min-h-screen"
      style={{
        ...backgroundStyle,
        fontFamily: `"${interfaceData?.general?.font}"`,
      }}
    >
      <div
        className="relative w-full max-w-2xl mb-6"
        style={{
          color: interfaceData?.header?.userNameColor,
          backgroundColor: interfaceData?.header?.userNameBackgroundColor,
        }}
      >
        <div className="relative w-full h-full overflow-hidden">
          <img
            className="object-cover w-full h-full"
            src={userData?.profile?.bannerImg}
            alt="Profile Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-90"></div>
          <div className="absolute bottom-16 left-12 flex items-center">
            <h1
              className="text-xl text-white"
              style={{
                color: interfaceData?.header?.userNameColor,
                fontFamily: `"${interfaceData?.general?.font}"`,
              }}
            >
              <span
                className="text-background px-4 py-1 rounded-full"
                style={{
                  backgroundColor:
                    interfaceData?.header?.userNameBackgroundColor,
                  fontFamily: `"${interfaceData?.general?.font}"`,
                }}
              >
                @{userData?.profile?.userName || "User Profile"}
              </span>
            </h1>
            {userData?.verifiedUser && (
              <img
                src="/Verified.svg"
                alt="Verified"
                className="text-primary w-14 h-14 ml-2"
              />
            )}
          </div>
          <p
            className="absolute bottom-4 left-12 text-md text-white"
            style={{
              color: interfaceData?.header?.bioTextColor,
              fontFamily: `"${interfaceData?.general?.font}"`,
            }}
          >
            {userData?.profile?.bio}
          </p>
        </div>
      </div>

      <div className="max-w-2xl grid grid-cols-2 px-4 gap-2  md:px-0 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Object.keys(userData?.socials || {}).map((platform) => {
          const isActive = userData?.socials[platform]?.active;
          const svgPath = `/svg/${platform}.svg`;

          return isActive ? (
            <a
              href={
                /^https?:\/\//.test(userData?.socials[platform]?.siteurl)
                  ? userData?.socials[platform]?.siteurl
                  : `http://${userData?.socials[platform]?.siteurl}`
              }
              key={platform}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="relative rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-200 ease-in-out">
                <img
                  className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-200 ease-in-out"
                  src={userData?.socials[platform]?.thumbnailurl}
                  alt={`${platform} Thumbnail`}
                />
                <div className="absolute top-2 right-2 p-2">
                  <img className="w-10 h-10" src={svgPath} alt={platform} />
                </div>
                <div className="absolute bottom-0 left-0 p-4 bg-black bg-opacity-60">
                  <h3
                    className="text-white text-lg"
                    style={{ color: interfaceData?.socials?.titleColor }}
                  >
                    {userData?.socials[platform]?.title}
                  </h3>
                  <p
                    className="text-white text-sm"
                    style={{ color: interfaceData?.socials?.descriptionColor }}
                  >
                    {userData?.socials[platform]?.description}
                  </p>
                </div>
              </div>
            </a>
          ) : null;
        })}
      </div>

      <div className="max-w-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {userData?.tweets
          ? (Object.values(userData.tweets) as TweetType[]).map(
              (tweet, index) =>
                tweet.active ? (
                  <Tweet key={index} id={String(tweet.id)} />
                ) : null
            )
          : null}
      </div>

      <div
        className="p-6 space-y-4"
        style={{ color: interfaceData?.otherInfo?.textColor }}
      >
        <div className="flex gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <img
                src="/svg/location.svg"
                alt="Location Icon"
                className="w-6 h-6"
              />
              <span className="text-lg font-medium">Location:</span>
              <span className="text-lg">{userData?.profile?.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="/svg/occupation.svg"
                alt="Occupation Icon"
                className="w-6 h-6"
              />
              <span className="text-lg font-medium">Occupation:</span>
              <span className="text-lg">{userData?.profile?.occupation}</span>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="/svg/email.svg"
                alt="Occupation Icon"
                className="w-6 h-6"
              />
              <span className="text-lg font-medium">Email:</span>
              <a
                href={`mailto:${userData?.profile?.emailaddress}`}
                className="text-lg underline"
                style={{
                  textDecorationColor:
                    interfaceData?.contact?.emailUnderlineColor,
                }}
              >
                {userData?.profile?.emailaddress}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex py-6">
        Powered by&nbsp;
        <a
          href="https://socialfeeds.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="h-6 w-24" src="/testr.png" alt="SocialTree" />
        </a>
      </div>
    </div>
  );
};

export default UserProfile;
