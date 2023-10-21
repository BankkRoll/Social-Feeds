import React, { useEffect, useState } from 'react';
import AboutUs from "../../components/About";
import Features from "../../components/Features";
import FeaturedProfiles from "../../components/FeaturedProfiles";
import { DocumentData, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseClient";
import FootBar from '../../components/FootBar';

export default function Home() {
  const [randomProfiles, setRandomProfiles] = useState<DocumentData[] | null>(null);

  useEffect(() => {
    const fetchAllProfiles = async () => {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      const allProfiles: DocumentData[] = [];
      
      querySnapshot.forEach((doc) => {
        allProfiles.push(doc.data());
      });
      
      allProfiles.sort(() => Math.random() - 0.5);
      setRandomProfiles(allProfiles.slice(0, 6));
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
