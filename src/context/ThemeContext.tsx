import React, { createContext, useContext, useState, ReactNode } from 'react';
import { lightTheme, darkTheme } from '../theme';
import { MD3Theme } from 'react-native-paper';

type ThemeContextType = {
  theme: MD3Theme;
  toggleTheme: () => void;
  isDark: boolean;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error('useThemeContext deve estar dentro de ThemeProvider');
  return context;
};
