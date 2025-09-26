import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import IconFont from 'react-native-vector-icons/Fontisto';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderTemplate from '../templates/HeaderTemplate';
import HeaderReduzida from '../templates/HeaderReduzida';
import { useNavigation } from '@react-navigation/native';

const roxo = '#f900cf';
const roxo_escuro = '#9F0095';
const featureCards = [
  {
    title: 'Motos',
    navegacao: 'CadastroMoto',
    icon: <IconFont name="motorcycle" size={50} color={roxo_escuro} />,
  },
  {
    title: 'Setores',
    navegacao: 'CadastroSetor',
    icon: <MCI name="garage" size={50} color={roxo_escuro} />,
  },
];

export default function SubmitScreen() {
  const navigation = useNavigation();

  return (
    <View>
      <HeaderReduzida></HeaderReduzida>
      <View style={styles.title}>
        <Text style={styles.text}> O que deseja Cadastrar?</Text>
      </View>
      <View style={styles.container}>
        {featureCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => {
              navigation.navigate(card.navegacao);
            }}
          >
            <View style={styles.iconContainer}>{card.icon}</View>
            <Text style={styles.cardTitle}>{card.title}</Text>
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
    backgroundColor: '#fff',
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    fontWeight: 'semibold',
    color: '#000',
  },
  card: {
    padding: 20,
    justifyContent: 'space-between',
    margin: 20,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
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
    color: '#000',
  },
});
