import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigator from "./src/navigation/RootNavigator";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "./src/screens/contexts/UserContext";
import { useNavigation } from '@react-navigation/native';

export default function App() {
  useEffect(() => {
    const clearDetectedMotos = async () => {
        try {
            await AsyncStorage.removeItem('detectedMotos');
            console.log('Motos detectadas foram limpas ao iniciar o aplicativo.');
        } catch (error) {
            console.error('Erro ao limpar motos detectadas:', error);
        }
    };

    clearDetectedMotos();
}, []);



  return (

    <AuthProvider>

    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootNavigator />
    </GestureHandlerRootView>
 
    </AuthProvider>


    
  );
  }
  