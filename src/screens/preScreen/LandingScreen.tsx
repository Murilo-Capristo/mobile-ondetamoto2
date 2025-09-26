import { StatusBar } from 'expo-status-bar';
import { Button, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

const roxo = '#f900cf';
const roxo_escuro = '#9F0095';
const { width, height } = Dimensions.get('window');
const fontSizeButton = 46;
const fontSizeText = 20;

type LandingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Landing'
>;

export default function Landing() {
  const navigation = useNavigation<LandingScreenNavigationProp>();

  return (
    <LinearGradient colors={[roxo, roxo_escuro]} style={styles.container}>
      <View style={styles.view1}>
        <Image
          source={require('../../../assets/Vector.png')}
          style={styles.logo}
        />
      </View>

      <View style={styles.view2}>
        <Image
          source={require('../../../assets/Parking-rafiki.png')}
          style={styles.imagem}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.push('Login')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.text}>Novo por aqui?</Text>

        <TouchableOpacity
          style={styles.buttonCadastro}
          onPress={() => navigation.push('PreCadastro')}
        >
          <Text style={{ color: '#000000', fontSize: fontSizeText }}>
            Conecte Já
          </Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>

      <View style={styles.footer}>
        <Text>Todos os direitos reservados aos criadores.</Text>
        <Text>github.com/ondetamoto</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    backgroundColor: '#780371',
    alignItems: 'center',
    paddingHorizontal: '20%',
    paddingVertical: 10,
    marginTop: 20,
    marginBottom: 30,
    width: '100%',
  },
  footer: {
    width: '100%',
    padding: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  buttonCadastro: {
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingHorizontal: '10%',
    paddingVertical: 10,
    marginTop: 20,
    marginBottom: 30,
    width: '100%',
  },
  text: {
    color: '#fff',
    fontSize: fontSizeText,
    fontWeight: 'semibold',
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: fontSizeButton,
    fontWeight: 'semibold',
    textAlign: 'center',
  },
  imagem: {
    width: width * 0.6,
    height: height * 0.3,
    resizeMode: 'contain',
    marginTop: 20,
  },
  logo: {
    width: '70%',
    height: '70%',
    resizeMode: 'contain',
    bottom: -30,
  },
  view1: {
    marginBottom: 20,
    width: '100%',
    height: '20%',
    alignItems: 'center',
  },
  view2: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
