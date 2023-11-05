import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseClient";
import { useAddress } from "@thirdweb-dev/react";

const LoadingScreen: React.FC = () => {
  const [isLoading, setLoading] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const address = useAddress();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (address) {
        const docRef = doc(db, "users", address);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setBackgroundColor(docSnap.data().interface.loading.backgroundColor);
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchData();
  }, [address]);

  const logoPath = "/testr.png";

  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        ease: "easeInOut",
        duration: 1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  };

  const bounce = {
    animate: {
      y: ["0%", "100%", "0%"],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        loop: Infinity,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          className="z-50 fixed inset-0 flex flex-col items-center justify-center"
          style={{ backgroundColor }}
          variants={container}
          initial="hidden"
          animate="show"
          exit="exit"
        >
          <motion.img
            src={logoPath}
            alt="Loading"
            className="mb-6 w-64 h-24"
            variants={item}
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0],
              boxShadow: [
                "0px 0px 0px 0px rgba(255,255,255,0)",
                "0px 0px 8px 2px rgba(255,255,255,1)",
                "0px 0px 0px 0px rgba(255,255,255,0)",
              ],
            }}
            transition={{
              loop: Infinity,
              ease: "easeInOut",
              duration: 2,
            }}
          />
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="bg-white rounded-full w-4 h-4"
                variants={item}
                custom={i}
                animate={bounce.animate}
                transition={{
                  delay: i * 0.2,
                  ...bounce.animate.transition,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
