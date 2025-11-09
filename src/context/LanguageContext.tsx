import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n/i88n';
import * as Localization from 'expo-localization';

interface LanguageContextProps {
  language: string;
  toggleLanguage: () => void;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'pt',
  toggleLanguage: () => {},
  setLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('pt');

  useEffect(() => {
    (async () => {
      // tenta pegar idioma salvo
      const savedLang = await AsyncStorage.getItem('language');

      if (savedLang) {
        setLanguageState(savedLang);
        i18n.changeLanguage(savedLang);
      } else {
        // pega idioma padrão do sistema
        const systemLang = Localization.locale.startsWith('es') ? 'es' : 'pt';
        setLanguageState(systemLang);
        i18n.changeLanguage(systemLang);
      }
    })();
  }, []);

  useEffect(() => {
    // Carrega a preferência de idioma ao iniciar o app
    (async () => {
      const savedLang = await AsyncStorage.getItem('language');
      if (savedLang) {
        setLanguageState(savedLang);
        i18n.changeLanguage(savedLang);
      }
    })();
  }, []);

  const setLanguage = async (lang: string) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'es' : 'pt');
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
