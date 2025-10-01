import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PaperProvider } from 'react-native-paper';
import { ThemeProvider, useThemeContext } from './src/context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

function MainApp() {
  const { theme } = useThemeContext();

  // useEffect(() => {
  //   const clearDetectedMotos = async () => {
  //     try {
  //       await AsyncStorage.removeItem('detectedMotos');
  //       console.log('Motos detectadas foram limpas ao iniciar o aplicativo.');
  //     } catch (error) {
  //       console.error('Erro ao limpar motos detectadas:', error);
  //     }
  //   };

  //   clearDetectedMotos();
  // }, []);

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootNavigator />
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
