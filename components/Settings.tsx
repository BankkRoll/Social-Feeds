import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import {
  setDoc,
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseClient";
import { useAddress } from "@thirdweb-dev/react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { User, Profile, Socials, Tweets, SocialPlatform, Tweet } from "../type";
import { useToast } from "./ui/use-toast";
import { ToastAction } from "./ui/toast";
import { useRouter } from "next/router";
import Link from "next/link";

interface SettingsProps {
  userData: User;
}

const Settings: React.FC<SettingsProps> = ({ userData }) => {
  const address = useAddress();
  const { toast } = useToast();
  const router = useRouter();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profile, setProfile] = useState<Profile>(userData.profile || {});
  const [tweets, setTweets] = useState<Tweets>(
    userData.tweets || {
      tweet1: { id: "", active: true },
      tweet2: { id: "", active: true },
    }
  );
  const [socials, setSocials] = useState<Socials>(userData.socials || {});
  const [deleteStep, setDeleteStep] = useState(0);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile: Profile) => ({ ...prevProfile, [name]: value }));
  };

  const handleTweetChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    tweetKey: keyof Tweets,
    field: "id" | "active"
  ) => {
    const value = field === "id" ? e.target.value : e.target.value === "true";
    setTweets((prevTweets: Tweets) => ({
      ...prevTweets,
      [tweetKey]: {
        ...prevTweets[tweetKey],
        [field]: value,
      },
    }));
  };

  const handleSocialChange = (
    e: ChangeEvent<HTMLInputElement>,
    platform: keyof Socials
  ) => {
    const { name, value } = e.target;
    setSocials((prevSocials: Socials) => ({
      ...prevSocials,
      [platform]: {
        ...prevSocials[platform],
        [name]: value,
      },
    }));
  };

  const handleSocialActiveChange = (
    e: ChangeEvent<HTMLSelectElement>,
    platform: keyof Socials
  ) => {
    const value = e.target.value === "true";
    setSocials((prevSocials: Socials) => ({
      ...prevSocials,
      [platform]: {
        ...prevSocials[platform],
        active: value,
      },
    }));
  };

  const handleImageChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setImageFile: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setImageFile(file);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to upload the image. Please try again.",
        });
      }
    }
  };

  const uploadToImgbb = async (imageFile: File, apiKey: string) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${apiKey}`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (response.ok) {
      const json = await response.json();
      return json.data.url;
    } else {
      throw new Error("Failed to upload image to Imgbb");
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (address && db) {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("profile.userName", "==", profile.userName)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty && address !== querySnapshot.docs[0].id) {
        toast({
          variant: "destructive",
          title: "Username Taken",
          description:
            "The username is already taken. Please choose another one.",
        });
        return;
      }

      const imgbbApiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      let avatarUrl: string | null = null;
      let bannerUrl: string | null = null;

      if (imgbbApiKey) {
        if (avatarFile) {
          avatarUrl = await uploadToImgbb(avatarFile, imgbbApiKey);
        }
        if (bannerFile) {
          bannerUrl = await uploadToImgbb(bannerFile, imgbbApiKey);
        }
      }

      const updatedProfile = {
        ...profile,
        avatarImg: avatarUrl || profile.avatarImg,
        bannerImg: bannerUrl || profile.bannerImg,
      };

      const userRef = doc(db, "users", address);
      try {
        await updateDoc(userRef, {
          profile: updatedProfile,
          socials: { ...socials },
          tweets: { ...tweets },
        });

        const profileUrl = `/${profile.userName}`;
        const copyToClipboard = () => {
          navigator.clipboard.writeText(profileUrl);

          toast({
            variant: "success",
            title: "Copied",
            description: `Successfully copied ${profileUrl}`,
          });
        };

        toast({
          variant: "success",
          title: "Success",
          description: "Your settings have been successfully saved.",
          action: (
            <div className="flex space-x-4">
              <Link href={profileUrl} target="_blank" rel="noopener noreferrer">
                <ToastAction altText="View">View</ToastAction>
              </Link>
              <ToastAction altText="Copy" onClick={copyToClipboard}>
                Copy
              </ToastAction>
            </div>
          ),
        });
      } catch (error) {
        console.error("Error updating document:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save your settings. Please try again.",
        });
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteStep === 0) {
      setDeleteStep(1);
      return;
    }

    if (deleteStep === 1) {
      setDeleteStep(2);
      return;
    }

    if (deleteStep === 2) {
      if (address && db) {
        const userRef = doc(db, "users", address);
        try {
          await deleteDoc(userRef);
          toast({
            variant: "destructive",
            title: "Account Deleted",
            description: "Your account has been successfully deleted.",
          });

          router.push("/");
        } catch (error) {
          console.error("Error deleting document:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to delete your account. Please try again.",
          });
        }
      }
      setDeleteStep(0);
    }
  };

  return (
    <div className="settings-container mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-wider">
          Welcome, {profile.userName || "User"}!
        </h1>
        <p className="text-lg text-gray-600">
          Edit your profile and make it unique for your custom site.
        </p>
      </div>
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Basic Information</h2>
          <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="relative cursor-pointer inline-block">
              <img
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : profile.avatarImg
                }
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover shadow-md hover:grayscale"
              />
              <div
                className="absolute top-0 left-0 w-24 h-24 flex items-center justify-center rounded-full bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
                onClick={() => document.getElementById("avatarImg")?.click()}
              >
                <img className="w-10 h-10" src="/addimg.png" alt="Twitter" />
              </div>
              <input
                type="file"
                accept="image/*"
                id="avatarImg"
                className="hidden"
                onChange={(e) => handleImageChange(e, setAvatarFile)}
              />
            </div>

            <div className="relative cursor-pointer inline-block">
              <img
                src={
                  bannerFile
                    ? URL.createObjectURL(bannerFile)
                    : profile.bannerImg
                }
                alt="Banner"
                className="w-48 md:w-60 h-48 md:h-60 object-cover rounded-md shadow-md hover:grayscale"
              />
              <div
                className="absolute top-0 left-0 w-full h-full flex items-center justify-center rounded-md bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
                onClick={() => document.getElementById("bannerImg")?.click()}
              >
                <img className="w-10 h-10" src="/addimg.png" alt="Twitter" />
              </div>
              <input
                type="file"
                accept="image/*"
                id="bannerImg"
                className="hidden"
                onChange={(e) => handleImageChange(e, setBannerFile)}
              />
            </div>
          </div>

          <Input
            className="bg-input shadow-sm rounded-lg mb-2 p-2"
            name="userName"
            value={profile.userName || ""}
            onChange={(e) => handleProfileChange(e)}
            placeholder="Username"
          />
          <Input
            className="bg-input shadow-sm rounded-lg mb-2 p-2"
            name="bio"
            value={profile.bio || ""}
            onChange={(e) => handleProfileChange(e)}
            placeholder="Bio"
          />
          <Input
            className="bg-input shadow-sm rounded-lg mb-2 p-2"
            name="emailaddress"
            type="email"
            value={profile.emailaddress || ""}
            onChange={(e) => handleProfileChange(e)}
            placeholder="Email Address"
          />
          <Input
            className="bg-input shadow-sm rounded-lg mb-2 p-2"
            name="location"
            value={profile.location || ""}
            onChange={(e) => handleProfileChange(e)}
            placeholder="Location"
          />
          <Input
            className="bg-input shadow-sm rounded-lg mb-2 p-2"
            name="occupation"
            value={profile.occupation || ""}
            onChange={(e) => handleProfileChange(e)}
            placeholder="Occupation"
          />
        </div>

        <h2>Social Media</h2>
        <Accordion type="single" collapsible>
          {Object.entries(socials).map(([platform, details]) => {
            const { active, title, description, thumbnailurl, siteurl } =
              details!;
            return (
              <AccordionItem value={platform} key={platform}>
                <AccordionTrigger>{platform}</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-row mb-2">
                    <label className="block text-lg font-semibold m-2">
                      Active
                    </label>
                    <select
                      value={active?.toString() || "false"}
                      onChange={(e) => handleSocialActiveChange(e, platform)}
                      className="bg-input shadow-sm rounded-lg p-2"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                  <Input
                    name="title"
                    value={title || ""}
                    onChange={(e) => handleSocialChange(e, platform)}
                    placeholder="Title"
                    className="bg-input shadow-sm rounded-lg mb-2 p-2"
                  />
                  <Input
                    name="description"
                    value={description || ""}
                    onChange={(e) => handleSocialChange(e, platform)}
                    placeholder="Description"
                    className="bg-input shadow-sm rounded-lg mb-2 p-2"
                  />
                  <Input
                    name="thumbnailurl"
                    value={thumbnailurl || ""}
                    onChange={(e) => handleSocialChange(e, platform)}
                    placeholder="Thumbnail URL"
                    className="bg-input shadow-sm rounded-lg mb-2 p-2"
                  />
                  <Input
                    name="siteurl"
                    value={siteurl || ""}
                    onChange={(e) => handleSocialChange(e, platform)}
                    placeholder="Site URL"
                    className="bg-input shadow-sm rounded-lg mb-2 p-2"
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <h2>Tweets</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="tweets">
            <AccordionTrigger>Tweets</AccordionTrigger>
            <AccordionContent>
              {Object.keys(tweets).map((tweetKey) => (
                <div
                  key={tweetKey}
                  className="flex items-center justify-between mb-4"
                >
                  <div className="flex-1 mr-2">
                    <label
                      htmlFor={tweetKey}
                      className="block text-lg font-semibold mb-2"
                    >
                      {tweetKey}
                    </label>
                    <Input
                      id={tweetKey}
                      name={tweetKey}
                      value={tweets[tweetKey]?.id || ""}
                      onChange={(e) => handleTweetChange(e, tweetKey, "id")}
                      placeholder="Enter tweet ID"
                      className="bg-input shadow-sm rounded-lg p-2"
                    />
                  </div>
                  <div className="flex-1 ml-2">
                    <label className="block text-lg font-semibold mb-2">
                      Active
                    </label>
                    <select
                      value={tweets[tweetKey]?.active?.toString() || "false"}
                      onChange={(e) => handleTweetChange(e, tweetKey, "active")}
                      className="bg-input shadow-sm rounded-lg p-2"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex justify-center space-x-4">
          <Button
            className="py-2 px-6 text-lg font-semibold rounded-lg shadow-md"
            type="submit"
          >
            Save Changes
          </Button>
          <Button
            className="py-2 px-6 text-lg rounded-lg shadow-md text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
            type="button"
            onClick={handleDeleteAccount}
          >
            {deleteStep === 0
              ? "Delete Account"
              : deleteStep === 1
              ? "Are you sure?"
              : "Confirm Deletion"}{" "}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
