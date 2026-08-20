import React, { createContext, useContext, useState } from 'react';
import { Language, TranslationDictionary, translations } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('axumite_app_language');
      if (stored === 'en' || stored === 'ti' || stored === 'de') {
        return stored as Language;
      }
      const userProfile = localStorage.getItem('axumite_user_profile');
      if (userProfile) {
        const parsed = JSON.parse(userProfile);
        if (parsed.preferredLanguage === 'en') return 'en';
        if (parsed.preferredLanguage === 'de') return 'de';
      }
    } catch {
      // ignore storage errors
    }
    return 'ti'; // Default to Tigrinya
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('axumite_app_language', lang);
      // Synchronize with user profile if it exists
      const userProfileStr = localStorage.getItem('axumite_user_profile');
      if (userProfileStr) {
        const parsed = JSON.parse(userProfileStr);
        parsed.preferredLanguage = lang === 'en' ? 'en' : lang === 'de' ? 'de' : 'ti-ER';
        localStorage.setItem('axumite_user_profile', JSON.stringify(parsed));
      }
    } catch (err) {
      console.error('Failed to save language preference:', err);
    }
  };

  const toggleLanguage = () => {
    if (language === 'ti') setLanguage('en');
    else if (language === 'en') setLanguage('de');
    else setLanguage('ti');
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language] || translations.en,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
