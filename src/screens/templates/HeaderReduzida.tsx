import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const roxo = '#f900cf';

export default function HeaderReduzida() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('usuario');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.topHeader}>
          <TouchableOpacity
            style={styles.linkProfile}
            onPress={handleLogout}
          >
            <Icon name="person-circle-outline" size={30} color={'#000'} />
            <Text style={styles.TextProfile}>
              {auth.currentUser?.displayName || 'Usuário'}
            </Text>
          </TouchableOpacity>
          <View>
            <Image
              source={require('../../../assets/logo-preenchida.png')}
              style={styles.logo}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingTop: 30,
    paddingBottom: 10,
    position: 'relative',
  },
  header: {
    backgroundColor: '#fff',
    borderBottomColor: roxo,
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
    resizeMode: 'contain',
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
