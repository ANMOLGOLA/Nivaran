import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  home: { en: 'Home', hi: 'होम' },
  reportIssue: { en: 'Report Issue', hi: 'समस्या दर्ज करें' },
  myComplaints: { en: 'My Complaints', hi: 'मेरी शिकायतें' },
  schemes: { en: 'Schemes', hi: 'योजनाएं' },
  publicDashboard: { en: 'Public Dashboard', hi: 'सार्वजनिक डैशबोर्ड' },
  profile: { en: 'My Profile', hi: 'मेरी प्रोफ़ाइल' },
  settings: { en: 'Settings', hi: 'सेटिंग्स' },
  logout: { en: 'Logout', hi: 'लॉग आउट' },
  loading: { en: 'Loading Nivaran...', hi: 'निवारण लोड हो रहा है...' },
  civicCompanion: { en: 'AI Civic Companion', hi: 'एआई नागरिक साथी' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load from localStorage, default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nivaran_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem('nivaran_lang', lang);
    setLanguageState(lang);
  };

  const t = (key: keyof typeof translations): string => {
    return translations[key]?.[language] || (key as string);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
