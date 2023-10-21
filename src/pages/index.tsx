import React, { useEffect, useState } from 'react';
import AboutUs from "../../components/About";
import Features from "../../components/Features";
import FeaturedProfiles from "../../components/FeaturedProfiles";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseClient";
import FootBar from '../../components/FootBar';

const CACHE_KEY = 'randomProfiles';
const CACHE_DURATION = 1000 * 60 * 60 * 2;

export default function Home() {
  const [randomProfiles, setRandomProfiles] = useState<DocumentData[] | null>(null);

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

      // Update state
      setRandomProfiles(slicedProfiles);

      // Cache data
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: slicedProfiles,
        timestamp: new Date().getTime(),
      }));
    };

    fetchAllProfiles();
  }, []);

  return (
    <div className="bg-background max-w-4xl m-auto flex flex-col items-center justify-center min-h-screen">      
      <AboutUs />
      <Features />
      <FeaturedProfiles randomProfiles={randomProfiles} />
      <FootBar />
    </div>
  );
}
