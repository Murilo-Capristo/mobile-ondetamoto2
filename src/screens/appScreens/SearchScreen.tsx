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
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderReduzida from '../templates/HeaderReduzida';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeContext } from '../../context/ThemeContext';
import { useMotoService } from '../../services/motoService';
import { useSetorService } from '../../services/setorService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/UserContext';

const categoryOptions = [
  { id: 'motos', label: 'Motos' },
  { id: 'setores', label: 'Setores' },
];

export default function SearchScreen() {
  const { getMotos, updateMoto, deleteMoto } = useMotoService();
  const { getSetores, updateSetor, deleteSetor } = useSetorService();
  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { param = 'motos' } = route.params || {};

  const [selectedTab, setSelectedTab] = useState(
    param ? categoryOptions.find(o => o.id === param) || categoryOptions[0] : categoryOptions[0]
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
        setPage(pageNumber);
      } else {
        const data = await getSetores(pageNumber);
        setSetores(data);
        setTotalPages(1);
        setPage(0);
      }
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
      if (selectedTab.id === 'motos') await updateMoto(item.id, item);
      else await updateSetor(item.id, item);

      await fetchData(page);
      showSuccessModal();
    } catch (err) {
      console.error('Erro ao atualizar:', err);
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
      Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchLower)
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
    <SafeAreaView style={{ flex: 1, paddingTop: 10 }} edges={['top', 'left', 'right']}>
      <Provider>
        <HeaderReduzida />
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltarBtn}>
            <Icon name="arrow-back" size={28} color={theme.colors.primary} />
          </TouchableOpacity>

          <Text style={[styles.label, { color: theme.colors.text, marginBottom: 10, marginTop: 10 }]}>
            Pesquise Motos ou Setores Registrados.
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.colors.surface, color: theme.colors.text },
              ]}
              placeholder="Pesquise aqui..."
              placeholderTextColor={theme.colors.onSurface}
              value={search}
              onChangeText={setSearch}
            />

            <Menu
              visible={dropdownVisible}
              onDismiss={() => setDropdownVisible(false)}
              anchor={
                <TouchableOpacity
                  onPress={() => setDropdownVisible(true)}
                  style={[
                    styles.dropdown,
                    { backgroundColor: theme.colors.surface, marginLeft: 10 },
                  ]}
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
          ) : (
            <>
              {dadosFiltrados.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Icon name="search-outline" size={50} color={theme.colors.onSurface} />
                  <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
                    {selectedTab.id === 'motos'
                      ? 'Nenhuma moto encontrada'
                      : 'Nenhum setor encontrado'}
                  </Text>
                </View>
              ) : (
                <>
                  <FlatList
                    data={dadosFiltrados}
                    keyExtractor={item => item.id.toString()}
                    renderItem={renderItem}
                    windowSize={5}
                    initialNumToRender={7}
                    maxToRenderPerBatch={10}
                    removeClippedSubviews={true}
                  />

                  {/* Controles de paginação */}
                  {selectedTab.id === 'motos' && totalPages > 1 && (
                    <View style={styles.paginationContainer}>
                      <TouchableOpacity
                        disabled={page === 0}
                        onPress={() => fetchData(page - 1)}
                        style={[styles.pageButton, page === 0 && styles.disabledButton]}
                      >
                        <Text style={styles.pageButtonText}>◀ Anterior</Text>
                      </TouchableOpacity>

                      <Text style={[styles.pageInfo, { color: theme.colors.text }]}>
                        Página {page + 1} de {totalPages}
                      </Text>

                      <TouchableOpacity
                        disabled={page + 1 >= totalPages}
                        onPress={() => fetchData(page + 1)}
                        style={[
                          styles.pageButton,
                          page + 1 >= totalPages && styles.disabledButton,
                        ]}
                      >
                        <Text style={styles.pageButtonText}>Próxima ▶</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </View>

        <Modal
          visible={successModalVisible}
          transparent
          onRequestClose={() => setSuccessModalVisible(false)}
        >
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

const MotoItem = React.memo(({ item, onUpdate, onDelete, theme }) => {
  const [edicao, setEdicao] = useState(item);
  const handleUpdate = () => onUpdate(edicao);
  const handleDelete = () => onDelete(item.id);
  const handleChange = (campo, text) => setEdicao(prev => ({ ...prev, [campo]: text }));

  return (
    <View
      style={[
        styles.resultadoItem,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
      ]}
    >
      <Text style={[styles.resultadoTitulo, { color: theme.colors.primary }]}>ID: {item.id}</Text>
      {['tag', 'marca', 'placa'].map(campo => (
        <React.Fragment key={campo}>
          <Text style={[styles.labelPequena, { color: theme.colors.text }]}>
            {campo.toUpperCase()}
          </Text>
          <TextInput
            style={[
              styles.editInput,
              {
                backgroundColor: theme.colors.background,
                color: theme.colors.text,
                borderColor: theme.colors.outline,
              },
            ]}
            value={edicao[campo] || ''}
            onChangeText={text => handleChange(campo, text)}
            placeholder={campo.toUpperCase()}
            placeholderTextColor={theme.colors.onSurface}
          />
        </React.Fragment>
      ))}
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleUpdate}>
          <AntDesign name="checkcircle" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={{ marginLeft: 10 }}>
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

const SetorItem = React.memo(({ item, onUpdate, onDelete, onNavigate, theme }) => {
  const [edicao, setEdicao] = useState(item);
  const handleUpdate = () => onUpdate(edicao);
  const handleDelete = () => onDelete(item.id);
  const handleNavigate = () => onNavigate(item.id, edicao.nome);
  const handleChange = (campo, text) => setEdicao(prev => ({ ...prev, [campo]: text }));
  const handleNumericChange = (campo, text) =>
    setEdicao(prev => ({ ...prev, [campo]: parseInt(text, 10) || 0 }));

  return (
    <View
      style={[
        styles.resultadoItem,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
      ]}
    >
      <Text style={[styles.resultadoTitulo, { color: theme.colors.primary }]}>ID: {item.id}</Text>
      <Text style={[styles.labelPequena, { color: theme.colors.text }]}>Nome</Text>
      <TextInput
        style={[
          styles.editInput,
          {
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            borderColor: theme.colors.outline,
          },
        ]}
        value={edicao.nome || ''}
        onChangeText={text => handleChange('nome', text)}
        placeholder="Nome"
        placeholderTextColor={theme.colors.onSurface}
      />
      <Text style={[styles.labelPequena, { color: theme.colors.text }]}>Capacidade</Text>
      <TextInput
        style={[
          styles.editInput,
          {
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            borderColor: theme.colors.outline,
          },
        ]}
        value={String(edicao.tamanho ?? '')}
        keyboardType="numeric"
        onChangeText={text => handleNumericChange('tamanho', text)}
        placeholder="Capacidade"
        placeholderTextColor={theme.colors.onSurface}
      />
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleUpdate}>
          <AntDesign name="checkcircle" size={24} color="green" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={{ marginLeft: 10 }}>
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNavigate} style={{ marginLeft: 10 }}>
          <AntDesign name="dashboard" size={24} color="blue" />
        </TouchableOpacity>
        <Text style={{ color: theme.colors.text }}> Dashboard</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  label: { fontSize: 14, marginBottom: 10 },
  voltarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
  },
  dropdown: {
    padding: 10,
    margin: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownText: {
    marginRight: 5,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  resultadoItem: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  resultadoTitulo: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 6,
    marginVertical: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 6,
  },
  labelPequena: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyText: { fontSize: 16, marginTop: 10, textAlign: 'center', opacity: 0.7 },
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  pageButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#007bff',
    borderRadius: 6,
  },
  disabledButton: { backgroundColor: '#aaa' },
  pageButtonText: { color: '#fff', fontWeight: 'bold' },
  pageInfo: { fontSize: 14, fontWeight: '500' },
});
