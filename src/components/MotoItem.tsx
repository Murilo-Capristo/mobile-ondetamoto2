import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface MotoItemProps {
  item: any;
  onUpdate: (data: any) => void;
  onDelete: (id: number) => void;
  theme: any;
}

const MotoItem = React.memo(({ item, onUpdate, onDelete, theme }: MotoItemProps) => {
  const [edicao, setEdicao] = useState(item);

  const handleUpdate = () => onUpdate(edicao);
  const handleDelete = () => onDelete(item.id);
  const handleChange = (campo: string, text: string) => setEdicao(prev => ({ ...prev, [campo]: text }));

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

export default MotoItem;

const styles = StyleSheet.create({
  resultadoItem: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 10,
  },
  resultadoTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  labelPequena: {
    fontSize: 12,
    marginTop: 4,
    marginBottom: 2,
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 6,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
});
