import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import './index.css';
import { LanguageProvider } from './context/LanguageContext.js';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next'; // Import initReactI18next

// Import JSON translations
import enTranslation from './locals/english.json';
import odTranslation from './locals/Odia.json'; // Assuming this is for French, update the import if necessary
import hiTranslation from './locals/hindi.json'; 
import mhTranslation from './locals/marathi.json'; 
import taTranslation from './locals/tamil.json'; 
import tlTranslation from './locals/telugu.json'; 

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      od: {
        translation: odTranslation
      },
      hi: {
        translation: hiTranslation
      },
      mh: {
        translation: mhTranslation
      },
      ta: {
        translation: taTranslation
      },
      tl: {
        translation: tlTranslation
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// Render the root component
ReactDOM.createRoot(document.getElementById('root')).render(
    <LanguageProvider>
      <App />
    </LanguageProvider>

);
