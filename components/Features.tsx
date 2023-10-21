import React from "react";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardTitle,
  GlowCardDescription,
  GlowCardContent,
} from "./ui/card-glow";

const Features: React.FC = () => {
  const cards = [
    {
      title: "Unified Social Profiles",
      description:
        "Seamlessly integrate multiple social platforms into one unified profile. Streamline your online presence effortlessly.",
      size: "md",
    },
    {
      title: "Extensive Social Support",
      description:
        "From Twitter to OnlyFans, we provide expansive support for numerous social networks, enabling a comprehensive online reach.",
      size: "lg",
    },
    {
      title: "Dynamic Customization",
      description:
        "Personalize your profile and social links with our intuitive customization features. Reflect your brand, your way.",
      size: "lg",
    },
    {
      title: "Real-time Analytics",
      description:
        "Access insightful analytics to understand your audience better. Make data-driven decisions to optimize engagement.",
      size: "md",
    },
    {
      title: "Robust Security",
      description:
        "Prioritize your privacy with our top-notch security measures. Keep your data and your profile secure and confidential.",
      size: "md",
    },
    {
      title: "Seamless Sharing",
      description:
        "Share your unified profile effortlessly across the web. Our platform is optimized for flawless sharing on various mediums.",
      size: "lg",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <GlowCard
          key={index}
          className={`${
            card.size === "lg" ? "md:col-span-2" : "md:col-span-1"
          } col-span-1`}
        >
          <GlowCardHeader className="bg-card">
            <GlowCardTitle>{card.title}</GlowCardTitle>
          </GlowCardHeader>
          <GlowCardContent className="bg-card">
            <GlowCardDescription>{card.description}</GlowCardDescription>
          </GlowCardContent>
        </GlowCard>
      ))}
    </div>
  );
};

export default Features;
