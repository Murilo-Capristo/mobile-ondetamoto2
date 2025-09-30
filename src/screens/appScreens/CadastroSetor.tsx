import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import HeaderReduzida from '../templates/HeaderReduzida';
import { Provider } from 'react-native-paper';
import { useState } from 'react';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const roxo_escuro = '#9F0095';
const roxo = '#f900cf';

export default function CadastroSetor() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  // states para inputs
  const [nome, setNome] = useState('');
  const [tamanho, setTamanho] = useState('');

  const handleCadastro = async () => {
    try {
      const response = await fetch('http://191.235.235.207:5294/api/setor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 0,
          nome: nome,
          tamanho: parseInt(tamanho, 10), // transforma string em número
        }),
      });

      if (response.ok) {
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.popToTop();
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error('Erro no cadastro:', errorText);
        alert('Erro ao cadastrar setor!');
      }
    } catch (err) {
      console.error('Erro na requisição:', err);
      alert('Falha de conexão com o servidor!');
    }
  };

  return (
    <Provider style={{ backgroundColor: '#fff' }}>
      <HeaderReduzida />
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

        <TextInput
          style={styles.nome}
          placeholder="Nome personalizado"
          value={nome}
          onChangeText={setNome}
        />

        <View style={styles.viewTam}>
          <TextInput
            style={styles.placa}
            placeholder="Tamanho Máximo Suportado (ex.: 100 )"
            keyboardType="numeric"
            value={tamanho}
            onChangeText={setTamanho}
          />
        </View>
      </View>
      <View style={styles.containerBotao}>
        <TouchableOpacity style={styles.cadasBtn} onPress={handleCadastro}>
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
});
