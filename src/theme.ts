// src/theme.ts

import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

const baseColors = {
  roxo: '#f900cf',
  roxo_escuro: '#9F0095',
  sucesso: '#4CAF50',
  erro: '#ff0000',
};

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  dark: false,
  colors: {
    ...MD3LightTheme.colors,
    primary: baseColors.roxo,
    secondary: baseColors.roxo_escuro,
    background: '#ffffff',
    surface: '#F3E8FF',
    text: '#000000',
    onSurface: '#333333',
    onBackground: '#000000',
    outline: '#cccccc',
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  dark: true,
  colors: {
    ...MD3DarkTheme.colors,
    primary: baseColors.roxo,
    secondary: baseColors.roxo_escuro,
    background: '#121212',
    surface: '#1f1f1f',
    text: '#ffffff',
    onSurface: '#dddddd',
    onBackground: '#ffffff',
    outline: '#444444',
  },
};

export const appColors = baseColors;
