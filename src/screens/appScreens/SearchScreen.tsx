import React, { useEffect, useState } from 'react';
import { Menu, Provider } from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderReduzida from '../templates/HeaderReduzida';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';

const roxo_escuro = '#9F0095';
const roxo_texto = '#a100ff';

type SearchScreenRouteProp = RouteProp<RootStackParamList, 'SearchScreen'>;

const searchOptions = [
  { id: 'Id', label: 'Buscar ID' },
  { id: 'Tipo', label: 'Buscar Tipo' },
  { id: 'Placa', label: 'Buscar Placa' },
];

const categoryOptions = [
  { id: 'motos', label: 'Motos' },
  { id: 'setores', label: 'Setores' },
];

export default function SearchScreen() {
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const showSuccessModal = () => {
    setSuccessModalVisible(true);
    setTimeout(() => {
      setSuccessModalVisible(false);
    }, 2000);
  };

  
  const navigation = useNavigation();
  const route = useRoute<SearchScreenRouteProp>();
  const { param = 'motos' } = route.params || {};

  const [selectedTab, setSelectedTab] = useState(() =>
    param
      ? categoryOptions.find((option) => option.id === param) ||
        categoryOptions[0]
      : categoryOptions[0],
  );
  const [filterVisible, setFilterVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [editando, setEditando] = useState<{ [key: number]: any }>({});

  const [motos, setMotos] = useState<any[]>([]);
  const [setores, setSetores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const relativeOptions = searchOptions.map((option) => {
    if (selectedTab.id === 'setores' && option.id === 'Placa') {
      return { id: 'Nome', label: 'Buscar Nome' };
    }
    return option;
  });

  const [selectedFilter, setSelectedFilter] = useState(relativeOptions[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (selectedTab.id === 'motos') {
          const res = await fetch('http://191.235.235.207:5294/api/Moto');
          const data = await res.json();
          setMotos(data);
        } else {
          const res = await fetch('http://191.235.235.207:5294/api/Setor');
          const data = await res.json();
          setSetores(data);
        }
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab]);

  const filtrarResultados = (itens: any[]) => {
    if (!search) return itens;

    return itens.filter((item) => {
      const campo =
        selectedFilter.id.toLowerCase() === 'id'
          ? item.id?.toString()
          : selectedFilter.id.toLowerCase() === 'tag'
          ? item.tipo
          : selectedFilter.id.toLowerCase() === 'nome'
          ? item.tipo
          : selectedFilter.id.toLowerCase() === 'placa'
          ? item.placa
          : item.nome;

      return campo?.toLowerCase().includes(search.toLowerCase());
    });
  };

  const atualizarItem = async (item: any) => {
    const url = selectedTab.id === 'motos'
      ? `http://191.235.235.207:5294/api/moto/${item.id}`
      : `http://191.235.235.207:5294/api/setor/${item.id}`;

    try {
      await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });

      const res = await fetch(
        selectedTab.id === 'motos'
          ? 'http://191.235.235.207:5294/api/Moto'
          : 'http://191.235.235.207:5294/api/Setor',
      );
      const data = await res.json();
      selectedTab.id === 'motos' ? setMotos(data) : setSetores(data);

      setEditando((prev) => {
        const novo = { ...prev };
        delete novo[item.id];
        showSuccessModal();
        return novo;
      });
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
            const url = selectedTab.id === 'motos'
              ? `http://191.235.235.207:5294/api/moto/${id}`
              : `http://191.235.235.207:5294/api/setor/${id}`;

            await fetch(url, {
              method: 'DELETE',
            });

            const res = await fetch(
              selectedTab.id === 'motos'
                ? 'http://191.235.235.207:5294/api/Moto'
                : 'http://191.235.235.207:5294/api/Setor',
            );
            const data = await res.json();
            selectedTab.id === 'motos' ? setMotos(data) : setSetores(data);
            showSuccessModal();
          } catch (err) {
            console.error('Erro ao excluir:', err);
          }
        },
      },
    ]);
  };

  const renderResultados = () => {
    if (loading) {
      return <Text>Carregando...</Text>;
    }

    const data = selectedTab.id === 'motos' ? motos : setores;

    return (
      <FlatList
        data={filtrarResultados(data)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const edicao = editando[item.id] || item;

          return (
            <View style={styles.resultadoItem}>
              <Text style={styles.resultadoTitulo}>ID: {item.id}</Text>

              {selectedTab.id === 'motos' ? (
                <>
                  <Text style={styles.labelPequena}>Tag</Text>
                  <TextInput
                    style={styles.editInput}
                    value={edicao.tag}
                    onChangeText={(text) =>
                      setEditando((prev) => ({
                        ...prev,
                        [item.id]: { ...edicao, tag: text },
                      }))
                    }
                    placeholder="Tag"
                  />
                  <Text style={styles.labelPequena}>Tipo</Text>
                  <TextInput
                    style={styles.editInput}
                    value={edicao.nome}
                    onChangeText={(text) =>
                      setEditando((prev) => ({
                        ...prev,
                        [item.id]: { ...edicao, nome: text },
                      }))
                    }
                    placeholder="Tipo"
                  />
                  <Text style={styles.labelPequena}>Placa</Text>
                  <TextInput
                    style={styles.editInput}
                    value={edicao.placa}
                    onChangeText={(text) =>
                      setEditando((prev) => ({
                        ...prev,
                        [item.id]: { ...edicao, placa: text },
                      }))
                    }
                    placeholder="Placa"
                  />
                </>
              ) : (
                <>
                  <Text style={styles.labelPequena}>Nome</Text>
                  <TextInput
                    style={styles.editInput}
                    value={edicao.nome}
                    onChangeText={(text) =>
                      setEditando((prev) => ({
                        ...prev,
                        [item.id]: { ...edicao, nome: text },
                      }))
                    }
                    placeholder="Nome"
                  />
                  <Text style={styles.labelPequena}>Capacidade</Text>
                  <TextInput
                    style={styles.editInput}
                    value={String(edicao.tamanho ?? '')}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      setEditando((prev) => ({
                        ...prev,
                        [item.id]: {
                          ...edicao,
                          tamanho: parseInt(text) || 0,
                        },
                      }))
                    }
                    placeholder="Capacidade"
                  />
                </>
              )}

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => atualizarItem(edicao)}>
                  <AntDesign name="checkcircle" size={24} color="green" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => excluirItem(item.id)}
                  style={{ marginLeft: 10 }}
                >
                  <AntDesign name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          );

        }}
      />
    );
  };

  return (
    <Provider>
      <HeaderReduzida />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.voltarBtn}
        >
          <Icon name="arrow-back" size={28} color={roxo_escuro} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.label}>
            Pesquise Motos ou Setores Registrados.
          </Text>
          <Menu
            visible={dropdownVisible}
            onDismiss={() => setDropdownVisible(false)}
            anchor={
              <TouchableOpacity
                onPress={() => setDropdownVisible(true)}
                style={styles.dropdown}
              >
                <Text style={styles.dropdownText}>{selectedTab.label}</Text>
                <Icon name="chevron-down" size={20} />
              </TouchableOpacity>
            }
          >
            {categoryOptions.map((option) => (
              <Menu.Item
                key={option.id}
                onPress={() => {
                  setSelectedTab(option);
                  setDropdownVisible(false);
                }}
                title={option.label}
              />
            ))}
          </Menu>
        </View>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="Pesquise aqui..."
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity
            onPress={() => setFilterVisible(!filterVisible)}
            style={styles.filterButton}
          >
            <AntDesign name="filter" size={30} color="#000" />
            <Text style={{ marginLeft: 5, color: roxo_texto }}>
              {selectedFilter.label}
            </Text>
          </TouchableOpacity>
        </View>

        {filterVisible && (
          <View style={styles.filterOptions}>
            {relativeOptions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.filterItem}
                onPress={() => {
                  setSelectedFilter(item);
                  setFilterVisible(false);
                }}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {renderResultados()}
      </View>
          <Modal
      visible={successModalVisible}
      transparent
      onRequestClose={() => setSuccessModalVisible(false)}
    >
      <View style={styles.modal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Operação realizada com sucesso!</Text>
        </View>
      </View>
    </Modal>

    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#f2f2f2',
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

  filterButton: {
    marginLeft: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterOptions: {
    marginTop: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 5,
  },
  filterItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdown: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  voltarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
  },
  dropdownText: {
    marginRight: 5,
    color: roxo_texto,
    fontWeight: 'bold',
  },
  resultadoItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  resultadoTitulo: {
    fontWeight: 'bold',
    color: roxo_escuro,
    marginBottom: 4,
  },
  editInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
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
    color: '#333',   
  },
});
