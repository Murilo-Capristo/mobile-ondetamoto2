import { Client, Message } from 'paho-mqtt';

const MQTT_HOST = '104.41.50.188';
const MQTT_PORT = 8080;
const MQTT_TOPIC = 'rfid-moto/leituras';
const MQTT_USER = 'admin';
const MQTT_PASSWORD = 'otm-password-VM#';

export function connectMotoMqtt(onMessageCallback, onErrorCallback) {
  const client = new Client(
    MQTT_HOST,
    MQTT_PORT,
    '/mqtt',
    'clientId-' + Math.random().toString(16).substr(2, 8),
  );

  client.connect({
    userName: MQTT_USER,
    password: MQTT_PASSWORD,
    useSSL: false,
    onSuccess: () => {
      console.log('MQTT conectado');
      client.subscribe(MQTT_TOPIC);
    },
    onFailure: (err) => {
      console.error('Erro ao conectar MQTT:', err);
      if (onErrorCallback) onErrorCallback(err);
    },
  });

  client.onMessageArrived = (message) => {
    try {
      const payload = JSON.parse(message.payloadString);
      console.log('Mensagem recebida do MQTT:', payload);
      onMessageCallback(payload);
    } catch (e) {
      console.error('Erro ao parsear mensagem MQTT:', e);
    }
  };

  client.onConnectionLost = (responseObject) => {
    if (responseObject.errorCode !== 0) {
      console.log('Conexão perdida: ' + responseObject.errorMessage);
    }
  };

  return client;
}

export function disconnectMotoMqtt(client) {
  if (client && client.isConnected()) {
    client.disconnect();
    console.log('MQTT desconectado');
  }
}
