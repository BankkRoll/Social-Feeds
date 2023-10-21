import { ConnectWallet } from "@thirdweb-dev/react";
import React from "react";

const AboutUs: React.FC = () => {
  return (
    <div className="bg-background text-foreground min-h-[50vh] flex flex-col items-center justify-center space-y-12 px-4 md:px-0">
      <section className="text-center space-y-4">
        <h1 className="text-6xl font-extrabold tracking-tight">
          Welcome to{" "}
          <img
            className="flex inline-flex h-16 w-64"
            src="/testr.png"
            alt="SocialTree"
          />
        </h1>
        <p className="text-2xl font-medium">
          Unify Your Online Presence Like Never Before
        </p>
      </section>

      <div className="text-center">
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
      </div>
    </div>
  );
};

export default AboutUs;
