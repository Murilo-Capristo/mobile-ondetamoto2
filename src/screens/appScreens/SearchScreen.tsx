import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import HeaderReduzida from '../templates/HeaderReduzida';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useThemeContext } from '../../context/ThemeContext';
import { useMotoService } from '../../services/motoService';
import { useSetorService } from '../../services/setorService';
import MotoItem from '../../components/MotoItem';
import SetorItem from '../../components/SetorItem';

const categoryOptions = [
  { id: 'motos', label: 'Motos' },
  { id: 'setores', label: 'Setores' },
];

export default function SearchScreen() {
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { param = 'motos' } = route.params || {};

  const { getMotos, updateMoto, deleteMoto } = useMotoService();
  const { getSetores, updateSetor, deleteSetor } = useSetorService();

  const [selectedTab, setSelectedTab] = useState(
    categoryOptions.find(o => o.id === param) || categoryOptions[0]
  );

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [motos, setMotos] = useState<any[]>([]);
  const [setores, setSetores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const showSuccessModal = () => setSuccessModalVisible(true);
  useEffect(() => {
    const timer = setTimeout(() => setSuccessModalVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [successModalVisible]);

  const fetchData = async (pageNumber = 0) => {
    try {
      setLoading(true);
      if (selectedTab.id === 'motos') {
        const data = await getMotos(pageNumber);
        setMotos(data.content || []);
        setTotalPages(data.totalPages || 1);
      } else {
        const data = await getSetores(pageNumber);
        setSetores(data.content || []);
        setTotalPages(data.totalPages || 1);
      }
      setPage(pageNumber);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(0);
    setDropdownVisible(false);
  }, [selectedTab]);

  const atualizarItem = async (item: any) => {
    try {
      if (selectedTab.id === 'motos') {
        await updateMoto(item.id, item);
      } else {
        const payload = {
          nome: item.nome,
          tipo: item.tipo,
          tamanho: item.tamanho,
          idEstabelecimento:
            typeof item.idEstabelecimento === 'object'
              ? item.idEstabelecimento.id
              : item.idEstabelecimento,
        };
        await updateSetor(item.id, payload);
      }

      await fetchData(page);
      showSuccessModal();
    } catch (err) {
      console.error('Erro ao atualizar:', err);
      Alert.alert('Erro', 'Falha ao atualizar setor.');
    }
  };


  const excluirItem = (id: number) => {
    Alert.alert('Confirmação', 'Deseja realmente excluir este item?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            if (selectedTab.id === 'motos') await deleteMoto(id);
            else await deleteSetor(id);
            await fetchData(page);
            showSuccessModal();
          } catch (err) {
            console.error('Erro ao excluir:', err);
          }
        },
      },
    ]);
  };

  const filtrarResultados = (itens: any[]) => {
    if (!search) return itens;
    const searchLower = search.toLowerCase();
    return itens.filter(item =>
      Object.values(item).join(' ').toLowerCase().includes(searchLower)
    );
  };

  const dadosFiltrados = useMemo(
    () => filtrarResultados(selectedTab.id === 'motos' ? motos : setores),
    [search, motos, setores, selectedTab.id]
  );

  const renderItem = useCallback(
    ({ item }) =>
      selectedTab.id === 'motos' ? (
        <MotoItem item={item} onUpdate={atualizarItem} onDelete={excluirItem} theme={theme} />
      ) : (
        <SetorItem
          item={item}
          onUpdate={atualizarItem}
          onDelete={excluirItem}
          onNavigate={(setorId, setorNome) =>
            navigation.navigate('SetorDetailsScreen', { setorId, setorNome })
          }
          theme={theme}
        />
      ),
    [selectedTab.id, theme, navigation]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <Provider>
        <HeaderReduzida />
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltarBtn}>
            <Icon name="arrow-back" size={28} color={theme.colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.label, { color: theme.colors.text }]}>
            Pesquise Motos ou Setores Registrados.
          </Text>

          {/* Filtro */}
          <View style={styles.searchRow}>


            <Menu
              visible={dropdownVisible}
              onDismiss={() => setDropdownVisible(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setDropdownVisible(true)}
                  style={[styles.dropdown, { backgroundColor: theme.colors.surface }]}
                >
                  <Text style={[styles.dropdownText, { color: theme.colors.primary }]}>
                    {selectedTab.label}
                  </Text>
                  <Icon name="chevron-down" size={20} color={theme.colors.text} />
                </TouchableOpacity>
              }
            >
              {categoryOptions.map(option => (
                <Menu.Item key={option.id} onPress={() => setSelectedTab(option)} title={option.label} />
              ))}
            </Menu>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
          ) : dadosFiltrados.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="search-outline" size={50} color={theme.colors.onSurface} />
              <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
                Nenhum {selectedTab.label.toLowerCase()} encontrado.
              </Text>
            </View>
          ) : (
            <FlatList
              data={dadosFiltrados}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
            />
          )}
        </View>

        {/*  Modal de sucesso */}
        <Modal visible={successModalVisible} transparent>
          <View style={styles.modal}>
            <View style={[styles.modalContainer, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.modalTitle}>Operação realizada com sucesso!</Text>
            </View>
          </View>
        </Modal>
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  label: { fontSize: 14, marginVertical: 10 },
  voltarBtn: { flexDirection: 'row', alignItems: 'center', position: 'absolute', left: 20 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  input: { flex: 1, borderRadius: 8, paddingHorizontal: 10, height: 40 },
  dropdown: {
    padding: 10,
    marginLeft: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: { marginRight: 5, fontWeight: 'bold' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 },
  emptyText: { fontSize: 16, marginTop: 10, textAlign: 'center', opacity: 0.7 },
  modal: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingTop: 50,
  },
  modalContainer: { padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 50 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
});
