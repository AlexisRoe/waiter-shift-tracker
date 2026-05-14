import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import de from './de.json';
import en from './en.json';

i18n.use(initReactI18next).init({
  resources: {
    de: { translation: de },
    en: { translation: en },
  },
  lng: 'de', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already safe from xss
  },
});

export default i18n;
