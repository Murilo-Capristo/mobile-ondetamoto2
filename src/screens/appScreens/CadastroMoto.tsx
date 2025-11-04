import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import HeaderReduzida from '../templates/HeaderReduzida';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../../context/ThemeContext';
import {
  connectMotoMqtt,
  disconnectMotoMqtt,
} from '../../services/mqttService';
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';


export default function CadastroMoto() {
  const navigation = useNavigation();
  const { theme } = useThemeContext();

  const [detectedMotos, setDetectedMotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const clientRef = useRef(null);

  useEffect(() => {
    const client = connectMotoMqtt((payload) => {
      setDetectedMotos((oldMotos) => {
        const existe = oldMotos.some((m) => m.tag === payload.moto);
        if (!existe) {
          return [
            { tag: payload.moto, setor: payload.setor },
            ...oldMotos,
          ].slice(0, 3);
        }
        return oldMotos;
      });
    });

    clientRef.current = client;

    return () => {
      disconnectMotoMqtt(clientRef.current);
    };
  }, []);

  const handleMoto = () => {
    setLoading(true);
    setDetectedMotos([]);

    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      alert('Nenhuma moto detectada em 1 minuto. Tente novamente.');
    }, 60000);
  };

  useEffect(() => {
    if (detectedMotos.length > 0 && loading) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setLoading(false);
    }
  }, [detectedMotos]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      disconnectMotoMqtt(clientRef.current);
    };
  }, []);

  return (

<SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <HeaderReduzida />

      <View style={styles.title}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.voltarBtn}
        >
          <Icon name="arrow-back" size={28} color={theme.colors.secondary} />
        </TouchableOpacity>
        <Text style={[styles.titleText, { color: theme.colors.text }]}>
          Cadastro de Moto
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.detectarMoto, { backgroundColor: '#e4e3e3', borderColor: 'green' }]}
        onPress={handleMoto}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <>
            <Icon name="wifi-tethering" style={[styles.icon, { color: 'green' }]} />
            <Text style={[styles.detecText, { color: 'black' }]}>
              Detectar Motocicleta
            </Text>
          </>
        )}
      </TouchableOpacity>

      {loading && (
        <View style={[styles.boxBuscando, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.buscando}>
            <Text style={[styles.titlebuscando, { color: theme.colors.onSurface }]}>
              Buscando...
            </Text>
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
          </View>
        </View>
      )}

      {!loading && detectedMotos.length > 0 && (
        <View style={[styles.boxBuscando, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.buscando}>
            <Text style={[styles.titlebuscando, { color: theme.colors.onSurface }]}>
              Motos Detectadas:
            </Text>
            {detectedMotos.map((moto, index) => (
              <TouchableOpacity
                key={index}
                style={styles.motos}
                onPress={() =>
                  navigation.navigate('FormMoto', {
                    tagId: moto.tag,
                    setor: moto.setor,
                  })
                }
              >
                <Text style={[styles.textMotos, { color: theme.colors.text }]}>
                  {`Tag - ${moto.tag} | Setor - ${moto.setor}`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  voltarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
  },
  motos: {
    marginTop: 10,
    paddingTop: 10,
    borderTopColor: '#e6e6e6',
    borderTopWidth: 1,
    width: '100%',
  },
  textMotos: { fontSize: 28, fontWeight: '400' },
  boxBuscando: {
    marginTop: 50,
    marginHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  titlebuscando: { fontSize: 18, fontWeight: '600' },
  buscando: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  detecText: { fontSize: 29, fontWeight: '600' },
  detectarMoto: {
    marginTop: 50,
    margin: 40,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 4,
  },
  title: { marginTop: 20, alignItems: 'center', justifyContent: 'center' },
  titleText: { fontSize: 28, fontWeight: 'bold' },
  icon: { position: 'absolute', top: 0, right: 3, fontSize: 35 },
});
