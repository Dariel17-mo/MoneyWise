
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface UserSettings {
  name: string;
  email: string;
  currency: string;
  currencySymbol: string;
  language: string;
  theme: "light" | "dark" | "system";
  zenMode: boolean;
  compactView: boolean;
}

interface UserSettingsContextType {
  userSettings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const defaultSettings: UserSettings = {
  name: "",
  email: "",
  currency: "CRC",
  currencySymbol: "₡",
  language: "Español",
  theme: "system",
  zenMode: false,
  compactView: false,
};

const USER_SETTINGS_KEY = "finance_user_settings";

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const UserSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const savedSettings = localStorage.getItem(USER_SETTINGS_KEY);
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(userSettings));
  }, [userSettings]);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setUserSettings(prevSettings => {
      const updatedSettings = { ...prevSettings, ...newSettings };
      return updatedSettings;
    });
  };

  return (
    <UserSettingsContext.Provider value={{ userSettings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  );
};

export const useUserSettings = (): UserSettingsContextType => {
  const context = useContext(UserSettingsContext);
  if (context === undefined) {
    throw new Error("useUserSettings must be used within a UserSettingsProvider");
  }
  return context;
};
