import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../../context/ThemeContext'; // Importa o contexto

const roxo = '#f900cf';

export default function HeaderTemplate() {
  const navigation = useNavigation();
  const { theme, toggleTheme, isDark } = useThemeContext(); // Acesso ao tema

  const handleLogout = async () => {
    await AsyncStorage.removeItem('usuario');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <View style={styles.topHeader}>
        {/* Botão de Perfil */}
        <TouchableOpacity style={styles.linkProfile} onPress={handleLogout}>
          <Icon
            name="person-circle-outline"
            size={30}
            color={theme.colors.onBackground}
          />
          <Text
            style={[styles.textProfile, { color: theme.colors.onBackground }]}
          >
            {auth.currentUser?.displayName || 'Usuário'}
          </Text>
        </TouchableOpacity>

        {/* Botão de alternância de tema */}
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <Icon
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={theme.colors.onBackground}
          />
        </TouchableOpacity>

        {/* Logo */}
        <Image
          source={require('../../../assets/logo-preenchida.png')}
          style={styles.logo}
        />
      </View>

      {/* Título */}
      <View style={styles.title}>
        <Text style={[styles.textTitle, { color: theme.colors.onBackground }]}>
          Controle total em tempo real.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomColor: roxo,
    borderBottomWidth: 20,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 10,
    position: 'relative',
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30,
    textAlign: 'center',
  },
  textTitle: {
    fontSize: 20,
    fontWeight: '500',
  },
  textProfile: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  linkProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    height: 50,
    left: 20,
    top: 30,
  },
  themeToggle: {
    position: 'absolute',
    right: 20,
    top: 30,
  },
  logo: {
    width: 120,
    height: 45,
    resizeMode: 'contain',
  },
});
