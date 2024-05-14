// LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import i18n from 'i18next';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Retrieve the selected language from local storage
    return localStorage.getItem('language') || 'en';
  });


  useEffect(() => {
    // Change the language in i18n and update local storage when language changes
    i18n.changeLanguage(language);
    localStorage.setItem('language', language);
  }, [language]);

  const changeLanguage = (newLanguage) => {
    i18n.changeLanguage(newLanguage);
    setLanguage(newLanguage);
  };

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, changeLanguage } },
    children
  );
};

export const useLanguage = () => useContext(LanguageContext);
