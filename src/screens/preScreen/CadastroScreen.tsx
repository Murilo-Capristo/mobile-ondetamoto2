import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons';
import { RootStackParamList } from '../../navigation/RootNavigator';
import Modal from 'react-native-modal';
import { useState } from 'react';

const roxo = '#f900cf';
const roxo_escuro = '#9F0095';
const { width, height } = Dimensions.get('window');

type CadastroScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Cadastro'
>;

export default function Cadastro() {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleCadastro = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.popToTop();
    }, 2000);
  };

  const navigation = useNavigation<CadastroScreenNavigationProp>();
  return (
    <LinearGradient colors={[roxo, roxo_escuro]} style={styles.container}>
      <View>
        <TouchableOpacity>
          <Icon
            name="arrow-back-outline"
            size={30}
            color={'white'}
            style={{ marginTop: 30, marginLeft: 10 }}
            onPress={() => navigation.goBack()}
          />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/Vector.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <Text style={{ color: '#fff', fontSize: 30, fontWeight: '300' }}>
        Crie sua conta
      </Text>

      <View style={styles.formulario}>
        {/* Campo nome */}
        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color={'#fff'}></Icon>
          <TextInput
            placeholder="Nome"
            placeholderTextColor="#ccc"
            style={styles.input}
          />
        </View>

        {/* Campo email */}
        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color={'#fff'}></Icon>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#ccc"
            style={styles.input}
          />
        </View>
        {/* Campo senha */}
        <View style={styles.inputContainer}>
          <Icon name="lock-closed" size={20} color={'#fff'}></Icon>
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#ccc"
            style={styles.input}
          />
        </View>
      </View>
      <View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleCadastro();
          }}
        >
          <Text style={styles.textButton}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isModalVisible}
        animationIn="slideInDown"
        animationOut="slideOutUp"
        backdropOpacity={0} // Remove o fundo escuro
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Cadastro Bem-Sucedido!</Text>
        </View>
      </Modal>
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
    alignItems: 'flex-start',
    // marginBottom: 20,
    marginTop: 90,
  },
  logo: {
    width: 300,
    height: 100,
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
  },

  formulario: {
    width: '70%',
    height: '30%',
    borderRadius: 20,
    paddingBottom: 40,

    // marginTop:200,
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom:40,
  },
  textButton: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'semibold',
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: '20%',
    alignItems: 'center',
    marginBottom: 90,
    // marginTop: 20,
    width: '80%',
  },

  modal: {
    justifyContent: 'flex-start',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 50,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
