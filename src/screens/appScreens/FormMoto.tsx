import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import HeaderReduzida from '../templates/HeaderReduzida';
import { Menu, Provider } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useThemeContext } from '../../context/ThemeContext';
import { createMoto } from '../../services/motoService';
import { getSetores } from '../../services/setorService';
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';


export default function FormMoto() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [setores, setSetores] = useState<{ id: number; nome: string }[]>([]);
  const route = useRoute();
  const { tagId, setor } = route.params as { tagId: string; setor?: string };
  const navigation = useNavigation();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [dropdownSetorVisible, setDropdownSetorVisible] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [selectedSetor, setSelectedSetor] = useState<number | null>(
    setor ? Number(setor) : null,
  );
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeContext();

  useEffect(() => {
    const loadSetores = async () => {
      try {
        const data = await getSetores();
        setSetores(data);
      } catch (err) {
        console.error('Erro ao carregar setores:', err);
      }
    };
    loadSetores();
  }, []);

  const handleCadastro = async () => {
    if (!selectedTipo || !placa || !selectedSetor) {
      alert('Preencha todos os campos antes de cadastrar.');
      return;
    }

    setLoading(true);
    try {
      await createMoto({
        nome: selectedTipo,
        tag: tagId,
        placa: placa,
        setorId: selectedSetor,
      });

      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.popToTop();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Erro ao cadastrar moto');
    } finally {
      setLoading(false);
    }
  };

  const handleLimpar = () => {
    setPlaca('');
    setSelectedTipo(null);
    setSelectedSetor(null);
  };

  return (

    <SafeAreaView style={{flex: 1}}>
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
                      {
                        color: selectedTipo
                          ? theme.colors.primary
                          : theme.colors.outline,
                      },
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
                  title={option}
                  titleStyle={{ color: theme.colors.primary }}
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
                      {
                        color: selectedSetor
                          ? theme.colors.primary
                          : theme.colors.outline,
                      },
                    ]}
                  >
                    {selectedSetor
                      ? setores.find((s) => s.id === selectedSetor)?.nome
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
              {setores.map((s) => (
                <Menu.Item
                  key={s.id}
                  onPress={() => {
                    setSelectedSetor(s.id);
                    setDropdownSetorVisible(false);
                  }}
                  title={s.nome}
                  titleStyle={{ color: theme.colors.primary }}
                />
              ))}
            </Menu>
          </View>

          <TextInput
            style={[styles.placa, { borderBottomColor: theme.colors.outline, color: '#f900cf' }]}
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
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.cadasText}>Cadastrar</Text>
            )}
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
              ? setores.find((s) => s.id === selectedSetor)?.nome
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
              style={[styles.modalContainer, { backgroundColor: theme.colors.success }]}
            >
              <Text style={styles.modalTitle}>Cadastro Bem-Sucedido!</Text>
            </View>
          </View>
        </Modal>
      </View>
    </Provider>
    </SafeAreaView>
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
  voltarBtn: { flexDirection: 'row', alignItems: 'center', top: 20, left: 20 },
  cadasText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
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
  dropdownText: { fontSize: 16, fontWeight: '300' },
  dadosContainer: { paddingHorizontal: 20, marginTop: 10 },
  dadosTitulo: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  dadosTexto: { fontSize: 14, marginBottom: 2 },
  limparBtn: {
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  limparText: { color: '#fff', fontWeight: 'bold' },
  tag: { padding: 10, borderRadius: 5, marginBottom: 20, marginTop: 20 },
  textTag: { fontSize: 32, fontWeight: '700', textAlign: 'center' },
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
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
