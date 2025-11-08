import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../../context/ThemeContext';
import LogoutDialog from '../../components/LogoutDialog';
import { useAuth } from '../../context/UserContext';
import i18n from "../../i18n/i88n";
import { useLanguage } from '../../context/LanguageContext';



export default function HeaderReduzida() {
  const { user } = useAuth();

  const navigation = useNavigation();
  const { toggleTheme, isDark, theme } = useThemeContext();
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const { language, setLanguage } = useLanguage();

  
  const handleLogout = async () => {
    await AsyncStorage.removeItem('usuario');
    
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const toggleLanguage = async () => {
    const newLang = language === 'pt' ? 'es' : 'pt';
    setLanguage(newLang);              // Atualiza o contexto global
    i18n.changeLanguage(newLang);      // Atualiza o i18n
    await AsyncStorage.setItem('language', newLang); // Salva preferência
  };


  return (
    
    
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.topHeader, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity style={styles.linkProfile} onPress={() => setLogoutDialogVisible(true)}>
          <Icon name="person-circle-outline" size={30} color={theme.colors.text} />
          <Text style={[styles.TextProfile, { color: theme.colors.text }]}>
            {user?.email
            ? user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1).toLowerCase()
            : 'Logout'}
          </Text>
        </TouchableOpacity>

        <View>
          <Image
            source={require('../../../assets/logo-preenchida.png')}
            style={styles.logo}
          />
        </View>

        {/* Botão de alternância de tema */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={{ position: 'absolute', right: 20, top: 30 }}
        >
          <Icon name={isDark ? 'sunny-outline' : 'moon-outline'} size={24} color={theme.colors.onBackground} />
        </TouchableOpacity>
      </View>


        {/* Botão de idioma */}
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <Text style={{ color: theme.colors.onBackground, fontWeight: 'bold' }}>
            {language.toUpperCase()}
          </Text>
        </TouchableOpacity>


      {/* Componente do dialog */}
      <LogoutDialog
        visible={logoutDialogVisible}
        onCancel={() => setLogoutDialogVisible(false)}
        onConfirm={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 10,
    position: 'relative',
  },
  header: {
    borderBottomColor: '#f900cf',
    borderBottomWidth: 10,
    
  },
  TextProfile: {
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
      languageToggle: {
    position: 'absolute',
    right: 70,
    top: 33,
    backgroundColor: "#7e7e7e",
    padding: 2,
    borderRadius: 12
  },
  logo: {
    width: 120,
    resizeMode: 'contain',
    height: 45,
  },
});
