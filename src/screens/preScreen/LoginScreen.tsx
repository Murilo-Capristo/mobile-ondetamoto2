import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useState, useEffect } from 'react';
import { login, register } from '../../services/authService';
import React from 'react';
import { ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';

const roxo = '#f900cf';
const roxo_escuro = '#9F0095';

type AuthScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function AuthScreen() {
  const { setUser } = useAuth();
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const { t } = useTranslation();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaConfirm, setSenhaConfirm] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const role = 'ADMIN';

  useEffect(() => {
    setIsButtonDisabled(!(email.trim() && senha.trim()));
  }, [email, senha]);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const token = await login(email, senha);
      if (!token || token.trim() === '') {
        throw new Error(t('auth.invalidToken'));
      }

      const newUser = { email, token };
      await setUser(newUser);

      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'HomeScreen' }],
        });
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || t('auth.loginError'));
      setErrorModalVisible(true);
      setTimeout(() => setErrorModalVisible(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !senha || !senhaConfirm) {
      setErrorMessage(t('auth.fillAll'));
      setErrorModalVisible(true);
      setTimeout(() => setErrorModalVisible(false), 3000);
      return;
    }

    if (senha !== senhaConfirm) {
      setErrorMessage(t('auth.passwordMismatch'));
      setErrorModalVisible(true);
      setTimeout(() => setErrorModalVisible(false), 3000);
      return;
    }

    setLoading(true);
    try {
      await register(email, senha, role);
      setSuccessModalVisible(true);
      setTimeout(() => {
        setSuccessModalVisible(false);
        setIsLogin(true);
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || t('auth.registerError'));
      setErrorModalVisible(true);
      setTimeout(() => setErrorModalVisible(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={[roxo, roxo_escuro]} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, width: '100%' }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: 20,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/Vector.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.title}>
            {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
          </Text>

          <View style={styles.formulario}>
            <View style={styles.inputContainer}>
              <Icon name="mail-outline" size={20} color={'#fff'} />
              <TextInput
                placeholder={t('auth.email')}
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
                placeholder={t('auth.password')}
                placeholderTextColor="#ccc"
                style={styles.input}
                value={senha}
                onChangeText={setSenha}
                secureTextEntry={!showSenha}
                onSubmitEditing={() => {
                  if (isLogin && !isButtonDisabled && !loading) {
                    handleLogin();
                  }
                }}
              />
              <TouchableOpacity onPress={() => setShowSenha(!showSenha)}>
                <Icon name={showSenha ? 'eye-outline' : 'eye-off-outline'} size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Icon name="lock-closed" size={20} color={'#fff'} />
                <TextInput
                  placeholder={t('auth.confirmPassword')}
                  placeholderTextColor="#ccc"
                  style={styles.input}
                  value={senhaConfirm}
                  onChangeText={setSenhaConfirm}
                  secureTextEntry={!showSenha}
                />
              </View>
            )}
          </View>

          <View style={{ width: '100%', alignItems: 'center' }}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: isButtonDisabled ? '#ccc' : '#fff' }]}
              onPress={isLogin ? handleLogin : handleRegister}
              disabled={isButtonDisabled || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={roxo_escuro} />
              ) : (
                <Text style={styles.textButton}>
                  {isLogin ? t('auth.login') : t('auth.register')}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginBottom: 40, alignItems: 'center' }}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '300' }}>
                {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal isVisible={successModalVisible} style={styles.modal}>
        <View style={styles.modalContainerSuccess}>
          <Text style={styles.modalTitle}>
            {isLogin ? t('auth.loginSuccess') : t('auth.registerSuccess')}
          </Text>
        </View>
      </Modal>

      <Modal isVisible={errorModalVisible} style={styles.modal}>
        <View style={styles.modalContainerError}>
          <Text style={styles.modalTitle}>{errorMessage}</Text>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginTop: 90 },
  logo: { width: 300, height: 100 },
  title: { color: '#fff', fontSize: 28, fontWeight: '300', marginBottom: 20 },
  input: { flex: 1, fontSize: 18, color: '#fff' },
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
  textButton: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  button: {
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: '20%',
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
  },
  modal: { justifyContent: 'flex-start', margin: 0 },
  modalContainerSuccess: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 50,
  },
  modalContainerError: {
    backgroundColor: '#FF4C4C',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 50,
  },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
