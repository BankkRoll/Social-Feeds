import React, { useEffect, useState } from "react";
import Features from "../../components/Features";
import FeaturedProfiles from "../../components/FeaturedProfiles";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseClient";
import FootBar from "../../components/FootBar";
import PricePlan from "../../components/Pricing";
import Image from "next/image";
import Head from "next/head";

const CACHE_KEY = "randomProfiles";
const CACHE_DURATION = 1000 * 60 * 60 * 2;

export default function Home() {
  const [randomProfiles, setRandomProfiles] = useState<DocumentData[] | null>(
    null,
  );

  useEffect(() => {
    const fetchAllProfiles = async () => {
      const cachedData = localStorage.getItem(CACHE_KEY);

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        const currentTime = new Date().getTime();

        if (currentTime - timestamp < CACHE_DURATION) {
          setRandomProfiles(data);
          return;
        }
      }

      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const allProfiles: DocumentData[] = [];

      querySnapshot.forEach((doc) => {
        allProfiles.push(doc.data());
      });

      allProfiles.sort(() => Math.random() - 0.5);
      const slicedProfiles = allProfiles.slice(0, 6);

      setRandomProfiles(slicedProfiles);

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: slicedProfiles,
          timestamp: new Date().getTime(),
        }),
      );
    };

    fetchAllProfiles();
  }, []);

  return (
    <>
      <Head>
        <title>{`SocialFeeds | Social Profile`}</title>
        <meta
          name="description"
          content={`Connect on platforms like Twitter, Kick, Twitch, YouTube, OnlyFans, and more with SocialFeeds.`}
        />
        <meta
          name="keywords"
          content="Unified Social Profile, SocialFeeds, Social Media, Twitter, OnlyFans"
        />
        <link rel="canonical" href={`https://socialfeeds.vercel.app/`} />

        <meta property="og:title" content={`SocialFeeds | Social Profile`} />
        <meta
          property="og:description"
          content={`Connect with on multiple platforms with SocialFeeds.`}
        />
        <meta
          property="og:image"
          content={`https://socialfeeds.vercel.app/og.png`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://socialfeeds.vercel.app/`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={`@bankkroll_eth`} />
        <meta name="twitter:title" content={`SocialFeeds | Social Profile`} />
        <meta
          name="twitter:description"
          content={`Connect with on multiple platforms with SocialFeeds.`}
        />
        <meta
          name="twitter:image"
          content={`https://socialfeeds.vercel.app/og.png`}
        />
      </Head>

      <div className="bg-background max-w-4xl m-auto flex flex-col items-center justify-center min-h-screen">
        <section className="text-center space-y-4 my-24">
          <h1 className="text-6xl font-extrabold tracking-tight">
            Welcome to{" "}
            <Image
              width={300}
              height={300}
              className="inline-flex h-16 w-64"
              src="/testr.png"
              alt="SocialFeeds"
            />
          </h1>
          <p className="text-2xl font-medium">
            Unify Your Online Presence Like Never Before
          </p>
        </section>
        <Features />
        <PricePlan />

        <FeaturedProfiles randomProfiles={randomProfiles} />
        <FootBar />
      </div>
    </>
  );
}
