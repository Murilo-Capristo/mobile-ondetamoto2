// i18next
// react-i18next
// expo-localization

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import es from './locales/es.json';
import pt from './locales/pt.json';

const resources = {
  es: { translation: es },
  pt: { translation: pt },
};

const deviceLanguage = getLocales()[0]?.languageCode || 'pt';

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'pt',
  interpolation: { escapeValue: false },
});

export default i18n;
