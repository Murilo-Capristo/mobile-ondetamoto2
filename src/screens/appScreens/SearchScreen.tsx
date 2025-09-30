import React, { useEffect, useState } from 'react';
import { Menu, Provider } from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
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

  const renderResultados = () => {
    if (loading) {
      return <Text>Carregando...</Text>;
    }

    if (selectedTab.id === 'motos') {
      return (
        <FlatList
          data={filtrarResultados(motos)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.resultadoItem}>
              <Text style={styles.resultadoTitulo}>ID: {item.id}</Text>
              <Text>Tag: {item.tag}</Text>
              <Text>Tipo: {item.nome}</Text>
              <Text>Placa: {item.placa}</Text>
            </View>
          )}
        />
      );
    } else {
      return (
        <FlatList
          data={filtrarResultados(setores)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultadoItem}
              onPress={() =>
                (navigation as any).navigate('SetorDetailsScreen', {
                  setorId: item.id,
                  setorNome: item.nome,
                })
              }
            >
              <Text style={styles.resultadoTitulo}>ID: {item.id}</Text>
              <Text>Nome: {item.nome}</Text>
            </TouchableOpacity>
          )}
        />
      );
    }
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
});
