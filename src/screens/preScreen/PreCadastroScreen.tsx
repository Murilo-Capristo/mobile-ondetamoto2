import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RootStackParamList } from '../../navigation/RootNavigator';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const fontSizeButton = 46;
const fontSizeText = 20;
const roxo = '#f900cf';
const roxo_escuro = '#9F0095';

type PreCadastroScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PreCadastro'
>;
export default function PreCadastro() {
  const navigation = useNavigation<PreCadastroScreenNavigationProp>();

  const features = [
    'Organize e monitore motos, setores e acessos em um único lugar.',
    'Plataforma digital para cadastro, rastreio e gestão de motocicletas.',
    'Economize tempo e aumente o controle com tecnologia fácil de usar.',
  ];
  return (
    <ScrollView style={styles.container}>
      {/* Logo */}
      <View>
        <View>
          <TouchableOpacity>
            <Icon
              name="arrow-back-outline"
              size={30}
              color={roxo_escuro}
              style={{ marginTop: 30, marginLeft: 10 }}
              onPress={() => navigation.goBack()}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo-preenchida.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.title}>
          Simplifique a gestão de sua garagem com a tecnologia mais avançada
        </Text>

        <Text style={styles.textBelowButton}>Novo por aqui?</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.push('Login');
          }}
        >
          <Text style={styles.buttonText}>Conecte Já</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.illustrationContainer}>
        <Image
          source={require('../../../assets/Parking-rafiki.png')}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Text key={index} style={styles.featureItem}>
            • {feature}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 80,
    marginTop: 30,
  },
  heroSection: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#85007c',
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
  },
  textBelowButton: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 0,
  },
  illustration: {
    width: width * 0.8,
    height: height * 0.3,
  },
  featuresContainer: {
    marginTop: 20,
    paddingHorizontal: 8,
  },
  featureItem: {
    fontSize: 18,
    color: '#000',
    marginBottom: 12,
  },
});
