import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Client } from 'paho-mqtt';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderReduzida from '../templates/HeaderReduzida';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useThemeContext } from '../../context/ThemeContext';

export default function SetorDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { setorId, setorNome } = route.params as {
    setorId: string;
    setorNome: string;
  };
  const { theme } = useThemeContext();

  // Estado das mensagens
  const [messages, setMessages] = useState<
    { tag: string; status: 'entrando' | 'saindo' }[]
  >([]);
  const payloadGlobal = useRef<any>(null);

  // Ref para guardar status das motos
  const statusMotos = useRef<{ [tag: string]: 'entrando' | 'saindo' }>({});

  useEffect(() => {
    const client = new Client(
      '104.41.50.188',
      8080,
      '/mqtt',
      'clientId-' + Math.random().toString(16).substr(2, 8),
    );

    client.connect({
      userName: 'admin',
      password: 'otm-password-VM#',
      useSSL: false,
      onSuccess: () => {
        console.log('MQTT conectado');
        client.subscribe('rfid-moto/leituras');
      },
      onFailure: (err) => {
        console.log('Erro conexão MQTT:', err);
      },
    });

    client.onMessageArrived = (message) => {
      const payloadJson = JSON.parse(message.payloadString);
      payloadGlobal.current = payloadJson;

      const tag = payloadJson.moto;

      // Alterna o status
      const novoStatus =
        statusMotos.current[tag] === 'entrando' ? 'saindo' : 'entrando';
      statusMotos.current[tag] = novoStatus;

      // Adiciona no estado para renderização
      setMessages((oldMsgs) => [...oldMsgs, { tag, status: novoStatus }]);
    };

    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('Conexão perdida: ' + responseObject.errorMessage);
      }
    };

    return () => {
      if (client.isConnected()) client.disconnect();
    };
  }, []);

  return (
    <>
      <HeaderReduzida />
      <View
        style={[styles.container, { backgroundColor: theme.colors.surface }]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.voltarBtn}
        >
          <IconIon name="arrow-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>

        <Text
          style={[
            styles.title1,
            {
              backgroundColor: theme.colors.primary,
              color: theme.colors.onPrimary,
            },
          ]}
        >
          Logs de Entrada e Saída do Setor
        </Text>

        <Text style={[styles.title, { color: theme.colors.primary }]}>
          Id: <Text style={{ color: theme.colors.secondary }}>{setorId}</Text>{' '}
          {'  '}
          Nome:{' '}
          <Text style={{ color: theme.colors.secondary }}>{setorNome}</Text>
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          Leituras RFID Recebidas:
        </Text>

        <ScrollView style={styles.scroll}>
          {messages.map((msg, index) => (
            <View
              key={index}
              style={[
                styles.messageBox,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.outline,
                },
              ]}
            >
              <Text style={[styles.messageText, { color: theme.colors.text }]}>
                Tag: {msg.tag}{' '}
                {msg.status === 'entrando'
                  ? 'Entrando no Setor'
                  : 'Saindo do Setor'}{' '}
                {payloadGlobal.current?.setor}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  voltarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    top: -10,
    left: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'sans-serif-condensed',
  },
  title1: {
    borderRadius: 10,
    padding: 12,
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'sans-serif-condensed',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  scroll: {
    marginTop: 5,
  },
  messageBox: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
  },
});
