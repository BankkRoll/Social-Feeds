// types.d.ts

/**
 * User Types
 */

// Type for individual social platform
export interface SocialPlatform {
    active: boolean;
    social: string;
    title: string;
    description: string;
    thumbnailurl: string;
    siteurl: string;
  }
  
  // Type for the socials object, with dynamic keys corresponding to platform names
  export interface Socials {
    [key: string]: SocialPlatform;
  }
  
  // Type for user profile
  export interface Profile {
    userAddress: string;
    verifiedUser: boolean;
    location: string;
    occupation: string;
    emailaddress: string;
    timeStamp: string;
    userName: string;
    bio: string;
    avatarImg: string;
    bannerImg: string;
  }
  
  // Type for individual tweet
  export interface Tweet {
    id: string;
    active: boolean;
  }
  
  // Type for the tweets object, with dynamic keys
  export interface Tweets {
    [key: string]: Tweet;
  }
  
  /**
   * Color Palette Types
   */
  
  // Type for General settings in color palette
  export interface GeneralPalette {
    backgroundColor: string;
    font: string;
    templateId: string;
  }
  
  // Type for Header settings in color palette
  export interface HeaderPalette {
    userNameColor: string;
    userNameBackgroundColor: string;
    bioTextColor: string;
  }
  
  // Type for Socials settings in color palette
  export interface SocialsPalette {
    titleColor: string;
    descriptionColor: string;
  }
  
  // Type for Other Info settings in color palette
  export interface OtherInfoPalette {
    textColor: string;
  }
  
  // Type for Contact settings in color palette
  export interface ContactPalette {
    textColor: string;
    emailUnderlineColor: string;
  }
  
  // Complete Type for Color Palette
  export interface ColorPalette {
    general: GeneralPalette;
    header: HeaderPalette;
    socials: SocialsPalette;
    otherInfo: OtherInfoPalette;
    contact: ContactPalette;
  }
  
  // Type for user interface settings, extending ColorPalette
  export interface UserInterface extends ColorPalette {}
  
  /**
   * Main User Type
   */
  
  export interface User {
    profile: Profile;
    interface: UserInterface;
    socials: Socials;
    tweets: Tweets;
  }
  