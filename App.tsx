import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// NÃO IMPORTE O RootNavigator AQUI EM CIMA
// import RootNavigator from './src/navigation/RootNavigator';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/UserContext';
import { LanguageProvider } from './src/context/LanguageContext';
import './src/i18n/i88n';
export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <MainApp />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const { theme } = useThemeContext();

  // IMPORTE O RootNavigator AQUI DENTRO
  // Usamos 'require' para fazer a importação de forma atrasada (lazy).
  // Isso garante que o UserContext já foi carregado antes do RootNavigator.
  // Correção do erro [runtime Not ready]: TypeError: Cannot read property 'useContext' of null, js engine: hermes, stack:
  const RootNavigator = require('./src/navigation/RootNavigator').default;

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
