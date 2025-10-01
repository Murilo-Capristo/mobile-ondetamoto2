import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import IconFont from 'react-native-vector-icons/Fontisto';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderReduzida from '../templates/HeaderReduzida';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../context/ThemeContext';

export default function SubmitScreen() {
  const navigation = useNavigation();
  const { theme } = useThemeContext(); 

  const featureCards = [
    {
      title: 'Motos',
      navegacao: 'CadastroMoto',
      icon: (
        <IconFont name="motorcycle" size={50} color={theme.colors.primary} />
      ),
    },
    {
      title: 'Setores',
      navegacao: 'CadastroSetor',
      icon: <MCI name="garage" size={50} color={theme.colors.primary} />,
    },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <HeaderReduzida />

      <View style={styles.title}>
        <Text style={[styles.text, { color: theme.colors.onBackground }]}>
          O que deseja Cadastrar?
        </Text>
      </View>

      <View style={styles.cardContainer}>
        {featureCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate(card.navegacao)}
          >
            <View style={styles.iconContainer}>{card.icon}</View>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
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
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 100,
    textAlign: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: '600',
  },
  card: {
    padding: 20,
    justifyContent: 'space-between',
    margin: 20,
    borderRadius: 10,
    width: 150,
    height: 150,
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
