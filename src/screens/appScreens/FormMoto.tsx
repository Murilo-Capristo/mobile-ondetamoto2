import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import HeaderReduzida from '../templates/HeaderReduzida';
import { Menu, Provider } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useThemeContext } from '../../context/ThemeContext';

export default function FormMoto() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [setores, setSetores] = useState<{ id: number; nome: string }[]>([]);
  const route = useRoute();
  const { tagId } = route.params as { tagId: string };
  const { setor } = route.params as { setor: string };
  console.log('Route params:', route.params);
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [selectedSetor, setSelectedSetor] = useState<number | null>(
    setor ? Number(setor) : null,
  );
  const [dropdownSetorVisible, setDropdownSetorVisible] = useState(false);
  const [placa, setPlaca] = useState('');
  const { theme } = useThemeContext();

  useEffect(() => {
    fetch('http://191.235.235.207:5294/api/setor')
      .then((res) => res.json())
      .then((data) => setSetores(data))
      .catch((err) => console.error('Erro ao carregar setores:', err));
  }, []);

  useEffect(() => {
    if (setores.length > 0 && setor) {
      const setorNum = Number(setor);
      const setorExiste = setores.some((s) => s.id === setorNum);
      if (setorExiste) setSelectedSetor(setorNum);
    }
  }, [setores, setor]);

  const handleCadastro = async () => {
    try {
      const response = await fetch('http://191.235.235.207:5294/api/moto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: 0,
          nome: selectedTipo,
          tag: tagId,
          placa: placa,
        }),
      });

      if (!response.ok) throw new Error('Erro ao cadastrar moto');

      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.popToTop();
      }, 2000);
    } catch (error) {
      console.error(error);
      alert('Erro ao cadastrar moto');
    }
  };

  const handleLimpar = () => {
    setPlaca('');
    setSelectedTipo(null);
    setSelectedSetor(null);
  };

  return (
    <Provider theme={theme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline,
            },
          ]}
        >
          <View style={styles.tag}>
            <Text style={[styles.textTag, { color: theme.colors.primary }]}>
              Tag {tagId}
            </Text>
          </View>

          {/* Dropdown Tipo */}
          <View style={styles.drawer}>
            <Menu
              visible={dropdownVisible}
              onDismiss={() => setDropdownVisible(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setDropdownVisible(true)}
                  style={[
                    styles.dropdown,
                    { borderBottomColor: theme.colors.outline },
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      { color: theme.colors.outline },
                      selectedTipo && { color: theme.colors.primary },
                    ]}
                  >
                    {selectedTipo || 'Tipo'}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={20}
                    color={theme.colors.onSurface}
                  />
                </TouchableOpacity>
              }
            >
              {['Quebrada', 'Ok'].map((option) => (
                <Menu.Item
                  key={option}
                  onPress={() => {
                    setSelectedTipo(option);
                    setDropdownVisible(false);
                  }}
                  titleStyle={{ color: theme.colors.primary }}
                  title={option}
                />
              ))}
            </Menu>

            {/* Dropdown Setor */}
            <Menu
              visible={dropdownSetorVisible}
              onDismiss={() => setDropdownSetorVisible(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setDropdownSetorVisible(true)}
                  style={[
                    styles.dropdown,
                    { borderBottomColor: theme.colors.outline },
                  ]}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      { color: theme.colors.outline },
                      selectedSetor && { color: theme.colors.primary },
                    ]}
                  >
                    {selectedSetor
                      ? setores.find((s) => s.id === selectedSetor)?.nome ||
                        `Setor ${selectedSetor}`
                      : 'Setor'}
                  </Text>
                  <Icon
                    name="chevron-down"
                    size={20}
                    color={theme.colors.onSurface}
                  />
                </TouchableOpacity>
              }
            >
              {setores.map((setor) => (
                <Menu.Item
                  key={setor.id}
                  onPress={() => {
                    setSelectedSetor(setor.id);
                    setDropdownSetorVisible(false);
                  }}
                  titleStyle={{ color: theme.colors.primary }}
                  title={setor.nome}
                />
              ))}
            </Menu>
          </View>

          <TextInput
            style={[
              styles.placa,
              { borderBottomColor: theme.colors.outline, color: '#f900cf' },
            ]}
            placeholder="Placa"
            placeholderTextColor={theme.colors.outline}
            value={placa}
            onChangeText={setPlaca}
          />
        </View>

        {/* Botão cadastrar */}
        <View style={styles.containerBotao}>
          <TouchableOpacity
            style={[styles.cadasBtn, { backgroundColor: theme.colors.primary }]}
            onPress={handleCadastro}
          >
            <Text style={styles.cadasText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        {/* Dados preenchidos */}
        <View style={styles.dadosContainer}>
          <Text style={[styles.dadosTitulo, { color: theme.colors.primary }]}>
            Dados preenchidos:
          </Text>
          <Text style={[styles.dadosTexto, { color: theme.colors.onSurface }]}>
            Placa: {placa || '-'}
          </Text>
          <Text style={[styles.dadosTexto, { color: theme.colors.onSurface }]}>
            Tipo: {selectedTipo || '-'}
          </Text>
          <Text style={[styles.dadosTexto, { color: theme.colors.onSurface }]}>
            Setor:{' '}
            {selectedSetor
              ? setores.find((s) => s.id === selectedSetor)?.nome ||
                `${selectedSetor}`
              : '-'}
          </Text>

          <TouchableOpacity
            style={[styles.limparBtn, { backgroundColor: theme.colors.error }]}
            onPress={handleLimpar}
          >
            <Text style={styles.limparText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de sucesso */}
        <Modal
          visible={isModalVisible}
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modal}>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: theme.colors.success },
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
  dropdown: {
    borderBottomWidth: 1,
    padding: 2,
    paddingHorizontal: 20,
    flexDirection: 'row',
    borderRadius: 8,
  },
  dropdownText: {
    fontSize: 16,
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
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  drawer: {
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
    paddingRight: 150,
    paddingBottom: 3,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: 50,
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
