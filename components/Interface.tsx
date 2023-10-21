import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebaseClient";  // Assuming you import it the same way
import { useAddress } from "@thirdweb-dev/react";
import { Button } from './ui/button';
import { CircularColorPicker } from './ui/color-picker';
import { FontCombobox } from './ui/combobox';
import { toast } from './ui/use-toast';
import { ToastAction } from './ui/toast';
import { User, UserInterface } from '../type';

interface InterfaceProps {
  interfaceData: UserInterface;
  userData: User;
}

const Interface: React.FC<InterfaceProps> = ({ interfaceData, userData }) => {
  const address = useAddress();
  const siteurl = "https://socialfeed.vercel.com";
  const [selectedFont, setSelectedFont] = useState<string>(interfaceData?.general?.font || "");
  const [settings, setSettings] = useState<any>(interfaceData || {
    general: { backgroundColor: '', font: selectedFont, templateId: '' },
    header: { userNameColor: '', userNameBackgroundColor: '', bioTextColor: '' },
    socials: { titleColor: '', descriptionColor: '' },
    otherInfo: { textColor: '' },
    contact: { textColor: '', emailUnderlineColor: '' },
  });
  const [gradientColors, setGradientColors] = useState<string[]>([]);
  const [useGradient, setUseGradient] = useState<boolean>(false);

  const updateBackgroundSetting = (type: 'color' | 'gradient', value: any) => {
    let newSettings = {...settings};
    if (type === 'color') {
      setUseGradient(false);
      newSettings.general.backgroundColor = value;
    } else if (type === 'gradient') {
      setUseGradient(true);
      newSettings.general.backgroundColor = `linear-gradient(${gradientColors.join(',')})`;
    }
    setSettings(newSettings);
  };


  const updateColorSetting = (newColor: string, category: string, key: string) => {
    const newSettings = { ...settings };
    newSettings[category][key] = newColor;
    setSettings(newSettings);
  };


  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (address && db) {
      const userRef = doc(db, "users", address);
      try {
        await setDoc(userRef, {
          interface: { ...settings, general: { ...settings.general, font: selectedFont } },
        }, { merge: true });
        
        const profileUrl = `${siteurl}/${userData.profile.userName}`;
        const copyToClipboard = () => {
          navigator.clipboard.writeText(profileUrl);
  
          // Trigger a new toast to notify the user that the URL was copied
          toast({
            variant: "success",
            title: "Copied",
            description: `Successfully copied ${profileUrl}`,
          });
        };
        
        toast({
          variant: "success",
          title: "Success",
          description: "Your interface settings have been successfully saved.",
          action: (
            <div className="flex space-x-4">
              <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                <ToastAction altText="View">
                  View
                </ToastAction>
              </a>
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
          description: "Failed to save your interface settings. Please try again.",
        });
      }
    }
  };

  
  useEffect(() => {
    if (userData && userData.interface) {
      setSettings(userData.interface);
    }
  }, [userData]);
  
  return (
    <div className="interface-settings-container mx-auto p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold tracking-wider">Interface Settings</h1>
        <p className="text-lg text-gray-600">Customize your interface.</p>
      </div>
      
      <form onSubmit={handleFormSubmit} className="space-y-8">
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold">General</h2>
    <div className="flex flex-col">
  <div className="flex justify-between items-center mb-4">
    <label className="text-lg">Background Color:</label>
    {useGradient ? (
      <button onClick={() => setUseGradient(false)}>
        Enable Solid
      </button>
    ) : (
      <CircularColorPicker
        value={settings.general.backgroundColor}
        onChange={(newColor) => updateBackgroundSetting('color', newColor)}
      />
    )}
  </div>
  <div className="flex justify-between items-center">
    <label className="text-lg">Gradient Colors:</label>
    {useGradient ? (
      <div className="flex space-x-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <CircularColorPicker
            key={i}
            value={gradientColors[i] || ''}
            onChange={(newColor) => {
              const newGradientColors = [...gradientColors];
              newGradientColors[i] = newColor;
              setGradientColors(newGradientColors);
              updateBackgroundSetting('gradient', newGradientColors);
            }}
          />
        ))}
      </div>
    ) : (
      <button onClick={() => setUseGradient(true)}>
        Enable Gradient
      </button>
    )}
  </div>
</div>


  {/* Font Dropdown */}
  <FontCombobox selectedFont={selectedFont} setSelectedFont={setSelectedFont} />
  </div>

  <div className="space-y-4">
    <h2 className="text-2xl font-semibold">Header</h2>
    <div className="flex justify-between items-center">
      <label className="text-lg">User Name Color:</label>
      <CircularColorPicker
        value={settings.header.userNameColor}
        onChange={(newColor) => updateColorSetting(newColor, 'header', 'userNameColor')}
      />
    </div>
    <div className="flex justify-between items-center">
      <label className="text-lg">User Name Background Color:</label>
      <CircularColorPicker
        value={settings.header.userNameBackgroundColor}
        onChange={(newColor) => updateColorSetting(newColor, 'header', 'userNameBackgroundColor')}
      />
    </div>
    <div className="flex justify-between items-center">
      <label className="text-lg">Bio Text Color:</label>
      <CircularColorPicker
        value={settings.header.bioTextColor}
        onChange={(newColor) => updateColorSetting(newColor, 'header', 'bioTextColor')}
      />
    </div>
  </div>
  {/* Socials Section */}
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold">Socials</h2>
    <div className="flex justify-between items-center">
      <label className="text-lg">Title Color:</label>
      <CircularColorPicker
        value={settings.socials.titleColor}
        onChange={(newColor) => updateColorSetting(newColor, 'socials', 'titleColor')}
      />
    </div>
    <div className="flex justify-between items-center">
      <label className="text-lg">Description Color:</label>
      <CircularColorPicker
        value={settings.socials.descriptionColor}
        onChange={(newColor) => updateColorSetting(newColor, 'socials', 'descriptionColor')}
      />
    </div>
  </div>

  {/* Other Info Section */}
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold">Other Info</h2>
    <div className="flex justify-between items-center">
      <label className="text-lg">Text Color:</label>
      <CircularColorPicker
        value={settings.otherInfo.textColor}
        onChange={(newColor) => updateColorSetting(newColor, 'otherInfo', 'textColor')}
      />
    </div>
  </div>

  {/* Contact Section */}
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold">Contact</h2>
    <div className="flex justify-between items-center">
      <label className="text-lg">Text Color:</label>
      <CircularColorPicker
        value={settings.contact.textColor}
        onChange={(newColor) => updateColorSetting(newColor, 'contact', 'textColor')}
      />
    </div>
    <div className="flex justify-between items-center">
      <label className="text-lg">Email Underline Color:</label>
      <CircularColorPicker
        value={settings.contact.emailUnderlineColor}
        onChange={(newColor) => updateColorSetting(newColor, 'contact', 'emailUnderlineColor')}
      />
    </div>
  </div>

  {/* Submit Button */}
  <div className="flex justify-center">
    <Button className='py-2 px-6 text-lg font-semibold rounded-lg shadow-md' type="submit">
      Save Changes
    </Button>
  </div>
</form>



    </div>
  );
};

export default Interface;
