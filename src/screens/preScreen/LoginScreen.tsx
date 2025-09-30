import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

const roxo = '#f900cf';
const roxo_escuro = '#9F0095';

type AuthScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export default function AuthScreen() {
  const navigation = useNavigation<AuthScreenNavigationProp>();

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    setIsButtonDisabled(!(email.trim() && password.trim()));
  }, [email, password]);

  const onLoginPress = async () => {
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      const user = response.user;
      console.log('Login realizado com sucesso:', user.uid);
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    } catch (error) {
      Alert.alert(
        'Ops!',
        'Não foi possível fazer login. Verifique suas credenciais e tente novamente.',
      );
    }
  };

  const onRegisterPress = async () => {
    if (!name || !email || !password) {
      Alert.alert('Atenção!', 'Por favor, preencha todos os campos.');
      return;
    }
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = response.user;

      await updateProfile(user, { displayName: name });

      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeScreen' }],
      });
    } catch (error: any) {
      Alert.alert('Problemas ao cadastrar!', error.message);
    }
  };

  return (
    <LinearGradient colors={[roxo, roxo_escuro]} style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/Vector.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>
        {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
      </Text>

      {/* Formulário */}
      <View style={styles.formulario}>
        {!isLogin && (
          <View style={styles.inputContainer}>
            <Icon name="person" size={20} color={'#fff'} />
            <TextInput
              placeholder="Nome"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color={'#fff'} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-closed" size={20} color={'#fff'} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#ccc"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      {/* Botão */}
      <View style={{ width: '100%', alignItems: 'center' }}>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isButtonDisabled ? '#ccc' : '#fff' },
          ]}
          onPress={isLogin ? onLoginPress : onRegisterPress}
          disabled={isButtonDisabled}
        >
          <Text style={styles.textButton}>
            {isLogin ? 'Entrar' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginBottom: 40, alignItems: 'center' }}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '300' }}>
            {isLogin
              ? 'Não possui uma conta? Crie aqui'
              : 'Já possui conta? Entrar'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 90,
  },
  logo: {
    width: 300,
    height: 100,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    width: '80%',
    marginVertical: 8,
  },
  formulario: {
    width: '80%',
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: '20%',
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
});
