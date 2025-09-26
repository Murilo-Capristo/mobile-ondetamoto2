import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Client, Message } from 'paho-mqtt';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderReduzida from '../templates/HeaderReduzida';
import IconIon from 'react-native-vector-icons/Ionicons';

const roxo = '#f900cf';
const roxo_escuro = '#9F0095';
const roxo_texto = '#a100ff';

export default function SetorDetailsScreen() {
  const navigation = useNavigation();


  const route = useRoute();
  const { setorId } = route.params as { setorId: string };
  const { setorNome } = route.params as { setorNome: string };

  const [messages, setMessages] = useState([]);

  const payloadGlobal = useRef<any>(null);

  const mensagens = [];

  const verificarMensagens = (msg) => {
    let i = 0;
    for (i in mensagens) {
      if (mensagens[i] === msg) {
        return ` Saindo Do Setor ${payloadGlobal.current.setor}`;
      }
    }
    mensagens.push(msg);
    return ` Entrando No Setor ${payloadGlobal.current.setor}`;
  };

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
      console.log(
        `Mensagem no tópico ${message.destinationName}: ${message.payloadString}`,
      );
      const payloadJson = JSON.parse(message.payloadString);
      payloadGlobal.current = payloadJson;

      setMessages((oldMsgs) => [...oldMsgs, payloadJson.moto]);
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

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.voltarBtn}
        >
          <IconIon name="arrow-back" size={28} color={roxo_escuro} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title1}>Logs de Entrada e Saída do Setor</Text>
        </View>

        <Text style={styles.title}>
          Id: <Text style={{ color: roxo_texto }}>{setorId} </Text>
          Nome: <Text style={{ color: roxo_texto }}>{setorNome}</Text>
        </Text>
        <Text style={styles.subtitle}>Leitura RFID Recebidas:</Text>
        <ScrollView style={styles.scroll}>
          {messages.map((msg, index) => (
            <View key={index} style={styles.messageBox}>
              <Text style={styles.messageText}>
                MotoID: {msg} {verificarMensagens(msg)}
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
    backgroundColor: '#fce4ec', // rosa claro
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
    flexDirection: 'column',
    fontWeight: '900',
    color: '#880e4f', // rosa escuro
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'sans-serif-condensed',
  },
  title1: {
    backgroundColor: roxo_escuro,
    borderRadius: 10,
    padding: 12,
    fontSize: 25,
    flexDirection: 'column',
    fontWeight: '900',
    color: '#ffffff', // rosa escuro
    textAlign: 'center',
    marginBottom: 15,
    fontFamily: 'sans-serif-condensed',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ad1457', // rosa médio
    marginBottom: 10,
  },
  scroll: {
    marginTop: 5,
  },
  messageBox: {
    backgroundColor: '#f8bbd0', // rosa médio claro
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#ad1457',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    color: '#4a148c', // roxo escuro para contraste
    fontSize: 16,
  },
});
