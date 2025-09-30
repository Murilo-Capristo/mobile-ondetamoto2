import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HeaderReduzida from '../templates/HeaderReduzida';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Client, Message } from 'paho-mqtt';

const roxo_escuro = '#9F0095';

export default function CadastroMoto() {
  const navigation = useNavigation();

  const [detectedMotos, setDetectedMotos] = useState<
    { tag: string; setor: string }[]
  >([]);
  const [isDetecting, setIsDetecting] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clientRef = useRef<Client | null>(null);

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

    client.onMessageArrived = (message: Message) => {
      try {
        const payload = JSON.parse(message.payloadString); // { setor: "1", moto: "1234" }

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
      } catch (e) {
        console.error('Erro ao parsear mensagem MQTT:', e);
      }
    };

    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log('Conexão perdida: ' + responseObject.errorMessage);
      }
    };

    clientRef.current = client;

    return () => {
      if (client.isConnected()) client.disconnect();
    };
  }, []);

  const handleMoto = () => {
    setIsDetecting(true);
    setDetectedMotos([]);

    timeoutRef.current = setTimeout(() => {
      setIsDetecting(false);
      alert('Nenhuma moto detectada em 1 minuto. Tente novamente.');
    }, 60000);
  };

  useEffect(() => {
    if (detectedMotos.length > 0 && isDetecting) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsDetecting(false);
    }
  }, [detectedMotos]);


  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (clientRef.current && clientRef.current.isConnected()) {
        clientRef.current.disconnect();
      }
    };
  }, []);

  return (
    <View>
      <HeaderReduzida />
      <View style={styles.title}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.voltarBtn}
        >
          <Icon name="arrow-back" size={28} color={roxo_escuro} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Cadastro de Moto</Text>
      </View>

      <TouchableOpacity
        style={styles.detectarMoto}
        onPress={handleMoto}
        disabled={isDetecting}
      >
        <Icon name="wifi-tethering" style={styles.icon} />
        <Text style={styles.detecText}>Detectar Motocicleta</Text>
      </TouchableOpacity>

      {isDetecting ? (
        <View style={styles.boxBuscando}>
          <View style={styles.buscando}>
            <Text style={styles.titlebuscando}>Buscando...</Text>
          </View>
        </View>
      ) : (
        detectedMotos.length > 0 && (
          <View style={styles.boxBuscando}>
            <View style={styles.buscando}>
              <Text style={styles.titlebuscando}>Motos Detectadas:</Text>
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
                  <Text
                    style={styles.textMotos}
                  >{`Tag - ${moto.tag} | Setor - ${moto.setor}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  textMotos: { fontSize: 28, fontWeight: '400', color: '#000' },
  boxBuscando: {
    marginTop: 50,
    marginHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 10,
    backgroundColor: '#DCDEDF',
    borderRadius: 20,
  },
  titlebuscando: { fontSize: 18, fontWeight: '600', color: '#8b8b8b' },
  buscando: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  detecText: { fontSize: 29, fontWeight: '600', color: '#000' },
  detectarMoto: {
    marginTop: 50,
    margin: 40,
    paddingTop: 40,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDEDF',
    borderRadius: 20,
    borderColor: '#009213',
    borderWidth: 4,
  },
  title: { marginTop: 20, alignItems: 'center', justifyContent: 'center' },
  titleText: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  icon: {
    position: 'absolute',
    top: 0,
    right: 3,
    color: '#009213',
    fontSize: 35,
  },
});
