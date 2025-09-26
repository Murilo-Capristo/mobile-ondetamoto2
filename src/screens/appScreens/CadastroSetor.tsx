import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import HeaderReduzida from '../templates/HeaderReduzida';
import { Menu, Provider } from 'react-native-paper';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

const roxo_escuro = '#9F0095';
const roxo = '#f900cf';
const tipoOptions = [
  { id: 'Quebrada', label: 'Quebrada' },
  { id: 'Ok', label: 'Ok' },
];

const tipoSetores = [
  { id: 'Roxo', label: 'Roxo' },
  { id: 'Verde', label: 'Verde' },
];

export default function CadastroSetor() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleCadastro = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.popToTop();
    }, 2000);
  };
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [dropdownSetorVisible, setDropdownSetorVisible] = useState(false);

  return (
    <Provider style={{ backgroundColor: '#fff' }}>
      <HeaderReduzida></HeaderReduzida>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.voltarBtn}
      >
        <IconIon name="arrow-back" size={28} color={roxo_escuro} />
      </TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.tag}>
          <Text style={styles.textTag}>Cadastro de Setor</Text>
        </View>

        <TextInput style={styles.nome} placeholder="Nome personalizado" />

        <View style={styles.drawer}>
          <Menu
            visible={dropdownSetorVisible}
            onDismiss={() => setDropdownSetorVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setDropdownSetorVisible(true)}
                style={styles.dropdown}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    selectedSetor && { color: roxo_escuro },
                  ]}
                >
                  {selectedSetor ? selectedSetor : 'Tipo'}
                </Text>
                <Icon name="chevron-down" size={20} color="#000" />
              </TouchableOpacity>
            }
          >
            {tipoSetores.map((option) => (
              <Menu.Item
                key={option.id}
                onPress={() => {
                  setSelectedSetor(option.label);
                  setDropdownSetorVisible(false);
                }}
                title={option.label}
              />
            ))}
          </Menu>
        </View>

        <View style={styles.viewTam}>
          <TextInput
            style={styles.placa}
            placeholder="Tamanho Máximo Suportado (ex.: 100 “motos” )"
          />
        </View>
      </View>
      <View style={styles.containerBotao}>
        <TouchableOpacity
          style={styles.cadasBtn}
          onPress={() => handleCadastro()}
        >
          <Text style={styles.cadasText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cadastro Bem-Sucedido!</Text>
          </View>
        </View>
      </Modal>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    margin: 40,
  },
  cadasBtn: {
    backgroundColor: roxo,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  voltarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 20,
    left: 20,
  },

  cadasText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  containerBotao: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 40,
    marginHorizontal: 20,
  },
  dropdown: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 2,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderRadius: 8,
    justifyContent: 'space-between',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '300',
  },
  tag: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  textTag: {
    color: '#e205bd',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  drawer: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 5,
    marginBottom: 20,
    flexDirection: 'row',
  },
  nome: {
    alignSelf: 'flex-start',
    marginLeft: 35,
    borderRadius: 5,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingRight: 90,
    paddingBottom: 1,
  },
  viewTam: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
  },
  placa: {
    alignSelf: 'flex-start',
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
  textPlaca: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
