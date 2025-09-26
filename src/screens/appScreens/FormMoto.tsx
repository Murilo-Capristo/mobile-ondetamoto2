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

export default function FormMoto() {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleCadastro = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      navigation.popToTop();
    }, 2000);
  };
  const route = useRoute();
  const { tagId } = route.params;

  const navigation = useNavigation();

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [selectedSetor, setSelectedSetor] = useState<string | null>(null);
  const [dropdownSetorVisible, setDropdownSetorVisible] = useState(false);
  const [placa, setPlaca] = useState('');

  const handleLimpar = () => {
    setPlaca('');
    setSelectedTipo(null);
    setSelectedSetor(null);
  };

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
          <Text style={styles.textTag}>Tag {tagId}</Text>
        </View>

        <View style={styles.drawer}>
          <Menu
            visible={dropdownVisible}
            onDismiss={() => setDropdownVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setDropdownVisible(true)}
                style={styles.dropdown}
              >
                <Text
                  style={[
                    styles.dropdownText,
                    selectedTipo && { color: roxo_escuro },
                  ]}
                >
                  {selectedTipo
                    ? tipoOptions.find((opt) => opt.id === selectedTipo)?.label
                    : 'Tipo'}
                </Text>
                <Icon name="chevron-down" size={20} />
              </TouchableOpacity>
            }
          >
            {tipoOptions.map((option) => (
              <Menu.Item
                key={option.id}
                onPress={() => {
                  setSelectedTipo(option.id);
                  setDropdownVisible(false);
                }}
                titleStyle={{
                  color: 'purple',
                }}
                title={option.label}
              />
            ))}
          </Menu>

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
                  {selectedSetor
                    ? tipoSetores.find((set) => set.id === selectedSetor)?.label
                    : 'Setor'}
                </Text>
                <Icon name="chevron-down" size={20} />
              </TouchableOpacity>
            }
          >
            {tipoSetores.map((setor) => (
              <Menu.Item
                key={setor.id}
                onPress={() => {
                  setSelectedSetor(setor.id);
                  setDropdownSetorVisible(false);
                }}
                titleStyle={{
                  color: 'purple',
                }}
                title={setor.label}
              />
            ))}
          </Menu>
        </View>

        <TextInput
          style={styles.placa}
          placeholder="Placa"
          value={placa}
          onChangeText={setPlaca}
        />
      </View>
      <View style={styles.containerBotao}>
        <TouchableOpacity
          style={styles.cadasBtn}
          onPress={() => handleCadastro()}
        >
          <Text style={styles.cadasText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dadosContainer}>
        <Text style={styles.dadosTitulo}>Dados preenchidos:</Text>
        <Text style={styles.dadosTexto}>Placa: {placa || '-'}</Text>
        <Text style={styles.dadosTexto}>Tipo: {selectedTipo || '-'}</Text>
        <Text style={styles.dadosTexto}>Setor: {selectedSetor || '-'}</Text>

        <TouchableOpacity style={styles.limparBtn} onPress={handleLimpar}>
          <Text style={styles.limparText}>Limpar</Text>
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
  },
  dropdownText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '300',
  },
  dadosContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  dadosTitulo: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },

  dadosTexto: {
    fontSize: 14,
    marginBottom: 2,
  },

  limparBtn: {
    marginTop: 10,
    backgroundColor: '#aaa',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },

  limparText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tag: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginTop: 20,
  },
  textTag: {
    color: '#e205bd',
    fontSize: 38,
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
  placa: {
    alignSelf: 'flex-start',
    marginLeft: 65,
    borderRadius: 5,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingRight: 150,
    paddingBottom: 3,
  },
  textPlaca: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: 50,
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
