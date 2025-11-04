import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';
import { AuthProvider } from './src/context/UserContext';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}

function MainApp() {
  const { theme } = useThemeContext();

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
