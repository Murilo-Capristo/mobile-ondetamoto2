import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import HeaderReduzida from '../templates/HeaderReduzida';
import { Provider, Menu } from 'react-native-paper';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../context/ThemeContext';
import { useSetorService } from '../../services/setorService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next'; 

export default function CadastroSetor() {
      const { t } = useTranslation(); 
  

  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeContext();

  const [nome, setNome] = useState('');
  const [tamanho, setTamanho] = useState('');
  const [tipo, setTipo] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const { createSetor } = useSetorService();
  const idEstabelecimento = 1;
  const tiposSetor = ['MANUTENCAO', 'USAVEIS', 'QUEBRADAS'];

  const handleCadastro = async () => {
    if (!nome || !tamanho || !tipo) {
    alert(t('cadastroSetor.fillAll'));

      return;
    }

    setLoading(true);
    try {
      await createSetor({ 
        nome,
        tamanho: tamanho.toString(),
        tipo,
        idEstabelecimento 
      });
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        navigation.popToTop();
      }, 2000);
    } catch (err) {
    alert(t('cadastroSetor.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top', 'left', 'right']}
    >
      <Provider theme={theme}>
        <View style={{ flex: 1, backgroundColor: theme.colors.surface }}>
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
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.outline,
              },
            ]}
          >
            <View style={styles.tag}>
              <Text style={[styles.textTag, { color: theme.colors.primary }]}>
                {t('cadastroSetor.title')}
              </Text>
            </View>

            {/* Nome */}
            <View style={[styles.inputWrapper, { borderBottomColor: theme.colors.outline }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.onSurface }]}
                placeholder={t('cadastroSetor.name')}
                placeholderTextColor={theme.colors.outline}
                value={nome}
                onChangeText={setNome}
                returnKeyType="done"
              />
            </View>

            {/* Tamanho */}
            <View style={[styles.inputWrapper, { borderBottomColor: theme.colors.outline }]}>
              <TextInput
                style={[styles.input, { color: theme.colors.onSurface }]}
                placeholder={t('cadastroSetor.size')}
                placeholderTextColor={theme.colors.outline}
                keyboardType="numeric"
                value={tamanho}
                onChangeText={setTamanho}
                returnKeyType="done"
              />
            </View>

            {/* Dropdown Tipo */}
            <View style={[styles.inputWrapper, { borderBottomColor: theme.colors.outline, borderBottomWidth: 0, paddingVertical: 8 }]}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity
                    style={[
                      styles.dropdownButton,
                      { borderColor: theme.colors.outline },
                    ]}
                    onPress={() => setMenuVisible(true)}
                  >
                    <Text
                      style={{
                        color: tipo ? theme.colors.onSurface : theme.colors.outline,
                      }}
                    >
                      {tipo || t('cadastroSetor.selectType')}
                    </Text>
                    <IconIon
                      name="chevron-down"
                      size={20}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                }
              >
                {tiposSetor.map((item) => (
                  <Menu.Item
                    key={item}
                    onPress={() => {
                      setTipo(item);
                      setMenuVisible(false);
                    }}
                    title={item}
                  />
                ))}
              </Menu>
            </View>
          </View>

          <View style={styles.containerBotao}>
            <TouchableOpacity
              style={[styles.cadasBtn, { backgroundColor: theme.colors.primary }]}
              onPress={handleCadastro}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.cadasText}>{t('cadastroSetor.button')}
</Text>
              )}
            </TouchableOpacity>
          </View>

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
                <Text style={styles.modalTitle}>{t('cadastroSetor.success')}
</Text>
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
    margin: 20,
    paddingVertical: 20,
    width: '90%',
    alignSelf: 'center',
  },
  voltarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 20,
    left: 20,
  },
  tag: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 10,
  },
  textTag: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },

  inputWrapper: {
    width: '85%',           
    borderBottomWidth: 1,   
    marginBottom: 16,
    alignSelf: 'center',
  },
  input: {
    width: '100%',          
    paddingVertical: 8,
    fontSize: 16,
  },

  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    width: '100%',
  },

  containerBotao: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    margin: 20,
    marginHorizontal: 20,
  },
  cadasBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  cadasText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  modal: {
    justifyContent: 'flex-start',
    margin: 0,
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