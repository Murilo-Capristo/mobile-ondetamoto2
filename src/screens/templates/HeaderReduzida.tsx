import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../../context/ThemeContext';
import Feather from 'react-native-vector-icons/Feather';

export default function HeaderReduzida() {
  const navigation = useNavigation();
  const { toggleTheme, isDark, theme } = useThemeContext();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('usuario');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <View
        style={[styles.topHeader, { backgroundColor: theme.colors.background }]}
      >
        <TouchableOpacity style={styles.linkProfile} onPress={handleLogout}>
          <Icon
            name="person-circle-outline"
            size={30}
            color={theme.colors.text}
          />
          <Text style={[styles.TextProfile, { color: theme.colors.text }]}>
            {auth.currentUser?.displayName || 'Usuário'}
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
          <Icon
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={24}
            color={theme.colors.onBackground}
          />
        </TouchableOpacity>
      </View>
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
    borderBottomWidth: 20,
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
  logo: {
    width: 120,
    resizeMode: 'contain',
    height: 45,
  },
});
