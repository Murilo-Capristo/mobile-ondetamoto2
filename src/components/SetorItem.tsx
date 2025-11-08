import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface SetorItemProps {
  item: any;
  onUpdate: (data: any) => void;
  onDelete: (id: number) => void;
  onNavigate: (id: number, nome: string) => void;
  theme: any;
}

const SetorItem = ({ item, onUpdate, onDelete, onNavigate, theme }: SetorItemProps) => {
  const [edicao, setEdicao] = useState(item);

  useEffect(() => setEdicao(item), [item]);

  const handleChange = (campo: string, valor: string | number) => {
    setEdicao(prev => ({ ...prev, [campo]: valor }));
  };

  const handleUpdate = () => {
    console.log('Atualizando setor:', edicao);
    onUpdate(edicao);
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
      ]}
    >
      <Text style={[styles.titulo, { color: theme.colors.primary }]}>
        ID: {item.id}
      </Text>

      {/* Nome */}
      <Text style={[styles.label, { color: theme.colors.text }]}>Nome</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.outline }]}
        value={edicao.nome || ''}
        onChangeText={text => handleChange('nome', text)}
        placeholder="Nome"
        placeholderTextColor={theme.colors.onSurface}
      />

      {/* Capacidade */}
      <Text style={[styles.label, { color: theme.colors.text }]}>Capacidade</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.outline }]}
        value={String(edicao.tamanho ?? '')}
        keyboardType="numeric"
        onChangeText={text => handleChange('tamanho', parseInt(text) || 0)}
        placeholder="Capacidade"
        placeholderTextColor={theme.colors.onSurface}
      />

      {/* Tipo (somente leitura) */}
      <Text style={[styles.label, { color: theme.colors.text }]}>Tipo</Text>
      <View
        style={[
          styles.tipoBox,
          { borderColor: theme.colors.outline, backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>
          {edicao.tipo || '—'}
        </Text>
      </View>

      {/* Botões */}
      <View style={styles.acoes}>
        <TouchableOpacity onPress={handleUpdate}>
          <AntDesign name="checkcircle" size={24} color="green" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onDelete(item.id)} style={{ marginLeft: 10 }}>
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onNavigate(item.id, edicao.nome)}
          style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}
        >
          <AntDesign name="dashboard" size={24} color="blue" />
          <Text style={{ color: theme.colors.text, marginLeft: 4 }}>Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SetorItem;

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  tipoBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  acoes: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
});
