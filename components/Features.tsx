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
      title: "One-Stop Social Hub",
      description:
        "Break free from the constraints of Linktree with a unified profile that integrates links from all your social platforms, creating a centralized hub for your online presence and simplifying audience engagement.",
      size: "lg",
    },
    {
      title: "Versatile Network Integration",
      description:
        "Our platform stands out with support for a diverse array of social networks, from mainstream platforms like Twitter to niche networks like OnlyFans. Ensure no part of your online persona is left behind.",
      size: "md",
    },
    {
      title: "Tailored Customization",
      description:
        "Upgrade from Linktree's limited customization with our dynamic features. Personalize your profile with unique layouts, color palettes, and styles that resonate with your brand's identity.",
      size: "md",
    },
    {
      title: "Insightful Analytics",
      description:
        "Stay ahead with real-time analytics that provide a deeper understanding of your audience's interactions. Monitor link clicks and user engagement, and refine your strategy for maximum impact.",
      size: "lg",
    },
    {
      title: "SEO-Optimized Profiles",
      description:
        "Boost your online visibility with SEO-optimized profiles. Customize metadata, keywords, and descriptions to enhance your search engine rankings, driving more organic traffic to your profile.",
      size: "lg",
    },
    {
      title: "Effortless Profile Sharing",
      description:
        "Our platform ensures that sharing your profile is a breeze, no matter the medium. With clean and concise links, you can share your profile effortlessly on social media, emails, or even text messages.",
      size: "md",
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
