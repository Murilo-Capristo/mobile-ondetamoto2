import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function Splash() {
  const navigation = useNavigation();

  useEffect(() => {
    const verificarLogin = async () => {
      const usuarioJSON = await AsyncStorage.getItem('usuario');
      if (usuarioJSON) {
        const usuario = JSON.parse(usuarioJSON);
        if (usuario.user) {
          navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
          return;
        }
      }
      navigation.reset({ index: 0, routes: [{ name: 'Landing' }] });
    };

    verificarLogin();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#f900cf" />
    </View>
  );
}
