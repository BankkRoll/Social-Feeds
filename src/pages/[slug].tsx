import React, { useEffect, useState } from "react";
import {
  DocumentData,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseClient";
import { Tweet } from "react-tweet";
import LoadingScreen from "../../components/ui/loading";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

interface TweetType {
  id: string;
  active: boolean;
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<DocumentData | null>(null);
  const [interfaceData, setInterfaceData] = useState<any>(null);
  const router = useRouter();
  const { slug } = router.query;
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

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
          querySnapshot.forEach(async (documentSnapshot) => {
            const data = documentSnapshot.data();
            setUserData(data);
            setInterfaceData(data.interface);

            setTimeout(() => {
              setShowLoadingScreen(false);
            }, 2500);

            const userId = documentSnapshot.id;
            const userViewsRef = collection(db, "users", userId, "views");
            await addDoc(userViewsRef, {
              timestamp: new Date().toISOString(),
              platform: navigator.userAgent,
              referrer: document.referrer,
              slug: slug,
            });

            const userDoc = doc(db, "users", userId);
            await updateDoc(userDoc, {
              totalViews: (data.totalViews || 0) + 1,
            });
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
    <>
<Head>
  <title>{userData?.profile?.userName ? `${userData.profile.userName} | SocialTree` : "SocialTree"}</title>
  <meta
    name="description"
    content={`View ${
      userData?.profile?.userName || "User"
    }'s unified social profile. Connect on platforms like Twitter, OnlyFans, and more with SocialTree.`}
  />
  <meta
    name="keywords"
    content="Unified Social Profile, SocialTree, Social Media, Twitter, OnlyFans"
  />
  <link
    rel="canonical"
    href={`https://socialfeeds.vercel.app/${userData?.profile?.userName}`}
  />

  <meta
    property="og:title"
    content={`Unified Social Profile for ${
      userData?.profile?.userName || "User"
    } | SocialTree`}
  />
  <meta
    property="og:description"
    content={`Connect with ${
      userData?.profile?.userName || "User"
    } on multiple platforms with SocialTree.`}
  />
  <meta property="og:type" content="website" />
  <meta
    property="og:url"
    content={`https://socialfeeds.vercel.app/${userData?.profile?.userName}`}
  />

  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:site"
    content={`@${
      userData?.socials?.twitter?.siteurl?.split("/").pop() ||
      "yourTwitterHandle"
    }`}
  />
  <meta
    name="twitter:title"
    content={`Unified Social Profile for ${
      userData?.profile?.userName || "User"
    } | SocialTree`}
  />
  <meta
    name="twitter:description"
    content={`Connect with ${
      userData?.profile?.userName || "User"
    } on multiple platforms with SocialTree.`}
  />

  {userData?.profile?.userName && userData.profile?.avatarImg && userData.profile?.bannerImg && (
    <>
      <meta
        property="og:image"
        content={`https://socialfeeds.vercel.app/api/og?userName=${encodeURIComponent(userData.profile.userName)}&avatarUrl=${encodeURIComponent(userData.profile.avatarImg)}&bannerUrl=${encodeURIComponent(userData.profile.bannerImg)}`}
      />
      <meta
        name="twitter:image"
        content={`https://socialfeeds.vercel.app/api/og?userName=${encodeURIComponent(userData.profile.userName)}&avatarUrl=${encodeURIComponent(userData.profile.avatarImg)}&bannerUrl=${encodeURIComponent(userData.profile.bannerImg)}`}
      />
    </>
  )}
</Head>


      {showLoadingScreen && <LoadingScreen />}

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
            <Image
              className="object-cover w-full h-full"
              src={userData?.profile?.bannerImg}
              alt="Profile Banner"
              width={800}
              height={800}
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
                <Image
                  src="/Verified.svg"
                  alt="Verified"
                  className="text-primary w-14 h-14 ml-2"
                  width={500}
                  height={500}
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

        <div className="max-w-2xl grid grid-cols-2 px-4 gap-2 md:px-0 md:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(userData?.socials || {}).map((platform) => {
            const isActive = userData?.socials[platform]?.active;
            const svgPath = `/svg/${platform}.svg`;

            if (!isActive) return null;

            const siteurl = userData?.socials[platform]?.siteurl;
            const clickable = siteurl && siteurl.length > 0;

            const Wrapper = clickable ? "a" : "div";

            const href = /^https?:\/\//.test(siteurl)
              ? siteurl
              : `http://${siteurl}`;

            return (
              <Wrapper
                {...(clickable && {
                  href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                key={platform}
              >
                <div className="relative rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-200 ease-in-out">
                  <Image
                    className="object-cover w-full h-full filter grayscale group-hover:grayscale-0 transition-all duration-200 ease-in-out"
                    src={userData?.socials[platform]?.thumbnailurl}
                    alt={`${platform} Thumbnail`}
                    width={500}
                    height={500}
                  />
                  <div className="absolute top-2 right-2 p-2">
                    <div className="bg-white rounded-full p-1">
                      <Image
                        width="64"
                        height="64"
                        className="w-8 h-8"
                        src={svgPath}
                        alt={platform}
                      />
                    </div>
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
                      style={{
                        color: interfaceData?.socials?.descriptionColor,
                      }}
                    >
                      {userData?.socials[platform]?.description}
                    </p>
                  </div>
                </div>
              </Wrapper>
            );
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
                <Image
                  src="/svg/location.svg"
                  alt="Location Icon"
                  className="w-6 h-6"
                  width="24"
                  height="24"
                />
                <span className="text-lg font-medium">Location:</span>
                <span className="text-lg">{userData?.profile?.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  src="/svg/occupation.svg"
                  alt="Occupation Icon"
                  className="w-6 h-6"
                  width="24"
                  height="24"
                />
                <span className="text-lg font-medium">Occupation:</span>
                <span className="text-lg">{userData?.profile?.occupation}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Image
                  src="/svg/email.svg"
                  alt="Occupation Icon"
                  className="w-6 h-6"
                  width="24"
                  height="24"
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
            <Image
              width="200"
              height="100"
              className="h-6 w-24"
              src="/testr.png"
              alt="SocialTree"
            />
          </a>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
