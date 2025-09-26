import React, { useEffect, useState } from 'react';
import { Menu, Provider } from 'react-native-paper';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderReduzida from '../templates/HeaderReduzida';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';
const roxo = '#f900cf';
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

const motosMock = [
  { id: '2334', tipo: 'Scooter', placa: 'ABC1234' },
  { id: '1234', tipo: 'Custom', placa: 'XYZ5678' },
  { id: '4321', tipo: 'Sport', placa: 'DEF9012' },
];

const setoresMock = [
  { id: 'S1', nome: 'Administrativo' },
  { id: 'S2', nome: 'Manutenção' },
  { id: 'S3', nome: 'Logística' },
];

export default function SearchScreen() {
  const navigation = useNavigation();

  const route = useRoute<SearchScreenRouteProp>();
  const { param = 'motos' } = route.params || {};

  const [selectedTab, setSelectedTab] = useState(() => {
    return param
      ? categoryOptions.find((option) => option.id === param) ||
          categoryOptions[0]
      : categoryOptions[0];
  });
  const [filterVisible, setFilterVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [search, setSearch] = useState('');

  const relativeOptions = searchOptions.map((option) => {
    if (selectedTab.id === 'setores' && param && option.id === 'Placa') {
      return { ...option, id: 'Nome', label: 'Buscar Nome' };
    }
    return option;
  });
  const [selectedFilter, setSelectedFilter] = useState(searchOptions[0]);

  useEffect(() => {
    const currentIds = relativeOptions.map((option) => option.id);
    if (!currentIds.includes(selectedFilter.id)) {
      setSelectedFilter(relativeOptions[0]);
    }
  }, [selectedTab]);

  const renderResultados = () => {
    if (selectedTab.id === 'motos') {
      return (
        <View style={styles.resultadosContainer}>
          {motosMock.map((moto) => (
            <View key={moto.id} style={styles.resultadoItem}>
              <Text style={styles.resultadoTitulo}>ID: {moto.id}</Text>
              <Text>Tipo: {moto.tipo}</Text>
              <Text>Placa: {moto.placa}</Text>
            </View>
          ))}
        </View>
      );
    } else if (selectedTab.id === 'setores') {
      return (
        <View style={styles.resultadosContainer}>
          {setoresMock.map((setor) => (
            <TouchableOpacity
              key={setor.id}
              style={styles.resultadoItem}
              onPress={() =>
                (navigation as any).navigate('SetorDetailsScreen', {
                  setorId: setor.id,
                  setorNome: setor.nome,
                })
              }
            >
              <Text style={styles.resultadoTitulo}>ID: {setor.id}</Text>
              <Text>Nome: {setor.nome}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return null;
  };

  return (
    <Provider>
      <HeaderReduzida></HeaderReduzida>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.voltarBtn}
        >
          <Icon name="arrow-back" size={28} color={roxo_escuro} />
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.label}>
            Pesquise Motos ou Garagens Registradas.
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
              {selectedFilter.id}
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
  },
  voltarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
  },
  dropdownText: {
    marginRight: 5,
    color: '#a100ff',
    fontWeight: 'bold',
  },
  resultadosContainer: {
    marginTop: 20,
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
