import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import IconFont from 'react-native-vector-icons/Fontisto';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import HeaderTemplate from '../templates/HeaderTemplate';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useThemeContext } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 40;

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useThemeContext(); // pega o tema atual

  const featureCards = [
    {
      title: 'Motos',
      navegacao: 'SearchScreen',
      param: 'motos',
      icon: (
        <IconFont name="motorcycle" size={50} color={theme.colors.primary} />
      ),
    },
    {
      title: 'Cadastrar Moto',
      navegacao: 'CadastroMoto',
      param: 'motos',
      icon: (
        <Feather name="plus-square" size={50} color={theme.colors.primary} />
      ),
    },
    {
      title: 'Setores',
      navegacao: 'SearchScreen',
      param: 'setores',
      icon: <MCI name="garage" size={50} color={theme.colors.primary} />,
    },
    {
      title: 'Cadastrar Setor',
      navegacao: 'CadastroSetor',
      param: 'setores',
      icon: (
        <Feather name="plus-square" size={50} color={theme.colors.primary} />
      ),
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <HeaderTemplate />
      <View style={styles.subtitle}>
        <Text style={{ color: theme.colors.text }}>Garagem 100% digital</Text>
      </View>
      <View style={styles.container}>
        {featureCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={() => {
              navigation.navigate(card.navegacao, { param: card.param });
            }}
          >
            <View style={styles.iconContainer}>{card.icon}</View>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              {card.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: -4,
  },
  subtitle: {
    marginLeft: 30,
    marginTop: 30,
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    padding: 20,
    justifyContent: 'space-between',
    margin: 10,
    borderRadius: 10,
    width: cardWidth,
    height: cardWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: {
    height: 60,
    justifyContent: 'center',
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
