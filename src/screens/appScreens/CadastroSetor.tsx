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
import { useThemeContext } from '../../context/ThemeContext';

export default function CadastroSetor() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const { theme } = useThemeContext(); //  pega o tema atual

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
    <Provider theme={theme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
        <HeaderReduzida />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.voltarBtn}
        >
          <IconIon name="arrow-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>

        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <View style={styles.tag}>
            <Text style={[styles.textTag, { color: theme.colors.primary }]}>
              Cadastro de Setor
            </Text>
          </View>

          <TextInput
            style={[
              styles.nome,
              {
                borderBottomColor: theme.colors.outline,
                color: theme.colors.onSurface,
              },
            ]}
            placeholder="Nome personalizado"
            placeholderTextColor={theme.colors.outline}
            value={nome}
            onChangeText={setNome}
          />

          <View
            style={[
              styles.viewTam,
              { borderBottomColor: theme.colors.outline },
            ]}
          >
            <TextInput
              style={[styles.placa, { color: theme.colors.onSurface }]}
              placeholder="Tamanho Máximo Suportado (ex.: 100)"
              placeholderTextColor={theme.colors.outline}
              keyboardType="numeric"
              value={tamanho}
              onChangeText={setTamanho}
            />
          </View>
        </View>

        <View style={styles.containerBotao}>
          <TouchableOpacity
            style={[styles.cadasBtn, { backgroundColor: theme.colors.primary }]}
            onPress={handleCadastro}
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
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: theme.colors.sucesso }, 
              ]}
            >
              <Text style={styles.modalTitle}>Cadastro Bem-Sucedido!</Text>
            </View>
          </View>
        </Modal>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    margin: 40,
  },
  cadasBtn: {
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
    paddingRight: 90,
    paddingBottom: 1,
  },
  viewTam: {
    borderBottomWidth: 1,
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
