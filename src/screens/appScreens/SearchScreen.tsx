import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Modal, ActivityIndicator } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderReduzida from '../templates/HeaderReduzida';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useThemeContext } from '../../context/ThemeContext';
import { useMotoService } from '../../services/motoService';
import { getSetores, updateSetor, deleteSetor } from '../../services/setorService';
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useAuth } from '../../context/UserContext';

const { user } = useAuth();


const categoryOptions = [
  { id: 'motos', label: 'Motos' },
  { id: 'setores', label: 'Setores' },
];

export default function SearchScreen() {
  const { getMotos, updateMoto, deleteMoto } = useMotoService();

  const { theme } = useThemeContext();
  const navigation = useNavigation();
  const route = useRoute();
  const { param = 'motos' } = route.params || {};

  const [selectedTab, setSelectedTab] = useState(
    param ? categoryOptions.find(o => o.id === param) || categoryOptions[0] : categoryOptions[0]
  );

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [search, setSearch] = useState('');
  const [editando, setEditando] = useState<{ [key: number]: any }>({});
  const [motos, setMotos] = useState<any[]>([]);
  const [setores, setSetores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const showSuccessModal = () => setSuccessModalVisible(true);

  useEffect(() => {
    const timer = setTimeout(() => setSuccessModalVisible(false), 2000);
    return () => clearTimeout(timer);
  }, [successModalVisible]);

  const fetchData = async () => {
  try {
    setLoading(true);
    if (selectedTab.id === 'motos') {

      const data = await getMotos(0);
      
      
      setMotos(data.content || []); 
      console.log(data.content);
    } else {
      const data = await getSetores();
      setSetores(data);
    }
  } catch (err) {
    console.error('Erro ao buscar dados:', err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchData();
    setDropdownVisible(false);
  }, [selectedTab]);

  const atualizarItem = async (item: any) => {
    try {
      if (selectedTab.id === 'motos') await updateMoto(item.id, item);
      else await updateSetor(item.id, item);

      await fetchData();
      showSuccessModal(); // Apenas mostre o modal

    } catch (err) {
      console.error('Erro ao atualizar:', err);
    }
  };

  

  const renderItem = useCallback(({ item }) => {
    if (selectedTab.id === 'motos') {
      return (
        <MotoItem 
          item={item} 
          onUpdate={atualizarItem} 
          onDelete={excluirItem} 
          theme={theme} 
        />
      );
    }
    return (
      <SetorItem
        item={item}
        onUpdate={atualizarItem}
        onDelete={excluirItem}
        onNavigate={(setorId, setorNome) => 
          navigation.navigate('SetorDetailsScreen', { setorId, setorNome })
        }
        theme={theme}
      />
    );
  }, [selectedTab.id, theme, navigation]);

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
            await fetchData();
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
  

  return (
<SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>

    <Provider >
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
          style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
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
              style={[styles.dropdown, { backgroundColor: theme.colors.surface, marginLeft: 10 }]} 
            >
              <Text style={[styles.dropdownText, { color: theme.colors.primary }]}>{selectedTab.label}</Text>
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
    {filtrarResultados(selectedTab.id === 'motos' ? motos : setores).length === 0 ? (
      <View style={styles.emptyContainer}>
        <Icon name="search-outline" size={50} color={theme.colors.onSurface} />
        <Text style={[styles.emptyText, { color: theme.colors.onSurface }]}>
           {selectedTab.id === 'motos' ? 'Nenhuma moto encontrada' : 'Nenhum setor encontrado'}
        </Text>
      </View>
    ) : (
      <FlatList
          data={dadosFiltrados} 
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem} 
          
          // Otimizações:
          windowSize={5}
          initialNumToRender={7}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
        />
    )}
  </>
)}

      </View>

      <Modal visible={successModalVisible} transparent onRequestClose={() => setSuccessModalVisible(false)}>
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
  // 1. O estado de edição agora é LOCAL
  const [edicao, setEdicao] = useState(item);

  const handleUpdate = () => onUpdate(edicao);
  const handleDelete = () => onDelete(item.id);

  // 2. Atualiza o estado local
  const handleChange = (campo, text) => {
    setEdicao(prev => ({ ...prev, [campo]: text }));
  };

  return (
    <View style={[styles.resultadoItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
      <Text style={[styles.resultadoTitulo, { color: theme.colors.primary }]}>ID: {item.id}</Text>
      {['tag', 'marca', 'placa'].map((campo) => (
        <React.Fragment key={campo}>
          <Text style={[styles.labelPequena, { color: theme.colors.text }]}>{campo.toUpperCase()}</Text>
          <TextInput
            style={[styles.editInput, { backgroundColor: theme.colors.background, color: theme.colors.text, borderColor: theme.colors.outline }]}
            value={edicao[campo] || ''} // Lê do estado local
            onChangeText={(text) => handleChange(campo, text)} // Atualiza o estado local
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
  // 1. O estado de edição também é LOCAL
  const [edicao, setEdicao] = useState(item);

  const handleUpdate = () => onUpdate(edicao);
  const handleDelete = () => onDelete(item.id);
  const handleNavigate = () => onNavigate(item.id, edicao.nome);

  // 2. Funções locais para atualizar o estado
  const handleChange = (campo, text) => {
    setEdicao(prev => ({ ...prev, [campo]: text }));
  };
  const handleNumericChange = (campo, text) => {
    setEdicao(prev => ({ ...prev, [campo]: parseInt(text, 10) || 0 }));
  };

  return (
    <View style={[styles.resultadoItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
      <Text style={[styles.resultadoTitulo, { color: theme.colors.primary }]}>ID: {item.id}</Text>
      <Text style={[styles.labelPequena, { color: theme.colors.text }]}>Nome</Text>
      <TextInput
        style={[styles.editInput, { backgroundColor: theme.colors.background, color: theme.colors.text, borderColor: theme.colors.outline }]}
        value={edicao.nome || ''}
        onChangeText={(text) => handleChange('nome', text)}
        placeholder="Nome"
        placeholderTextColor={theme.colors.onSurface}
      />
      <Text style={[styles.labelPequena, { color: theme.colors.text }]}>Capacidade</Text>
      <TextInput
        style={[styles.editInput, { backgroundColor: theme.colors.background, color: theme.colors.text, borderColor: theme.colors.outline }]}
        value={String(edicao.tamanho ?? '')}
        keyboardType="numeric"
        onChangeText={(text) => handleNumericChange('tamanho', text)}
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
  container: {
    padding: 16,
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
  emptyContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 40,
},
emptyText: {
  fontSize: 16,
  marginTop: 10,
  textAlign: 'center',
  opacity: 0.7,
},

  input: {
    flex: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
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
  filterButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterOptions: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 5,
  },
  filterItem: {
    padding: 8,
    borderBottomWidth: 1,
  },
  dropdown: {
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
    fontWeight: 'bold',
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
});
