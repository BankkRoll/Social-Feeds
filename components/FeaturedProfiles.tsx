import React from "react";
import {
  GlowCard,
  GlowCardHeader,
  GlowCardContent,
  GlowCardTitle,
  GlowCardDescription,
  GlowCardImage,
} from "./ui/card-glow";
import { DocumentData } from "firebase/firestore";

interface FeaturedProfilesProps {
  randomProfiles: DocumentData[] | null;
}

const FeaturedProfiles: React.FC<FeaturedProfilesProps> = ({
  randomProfiles,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 md:p-0">
      <h2 className="text-2xl m-12 col-span-full text-center">
        Featured Profiles:
      </h2>
      {randomProfiles?.map((profile, index) => {
        if (
          profile.profile.userName &&
          profile.profile.bannerImg &&
          profile.profile.avatarImg &&
          profile.profile.bio
        ) {
          return (
            <a href={`/${profile.profile.userName}`} key={index}>
              <GlowCard className="h-full">
                <div className="relative">
                  <GlowCardHeader className="h-32">
                    <GlowCardImage
                      className="object-cover h-full w-full"
                      src={profile.profile.bannerImg}
                      alt={`${profile.profile.userName}'s Banner`}
                    />
                  </GlowCardHeader>
                  <img
                    src={profile.profile.avatarImg}
                    alt={`${profile.profile.userName}'s Avatar`}
                    className="absolute bottom-0 left-8 transform translate-y-1 w-16 h-16 rounded-full border-2 border-white"
                  />
                </div>
                <GlowCardContent className="flex flex-col justify-between m-4">
                  <div>
                    <GlowCardTitle className="text-left">
                      {profile.profile.userName}
                      {profile.verifiedUser && (
                        <img
                          src="/Verified.svg"
                          alt="Verified"
                          className="text-primary w-6 h-6 inline-block align-middle ml-2"
                        />
                      )}
                    </GlowCardTitle>
                  </div>
                  <GlowCardDescription className="text-left">
                    {profile.profile.bio}
                  </GlowCardDescription>
                </GlowCardContent>
              </GlowCard>
            </a>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

export default FeaturedProfiles;
