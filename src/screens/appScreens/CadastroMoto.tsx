import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HeaderReduzida from '../templates/HeaderReduzida';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Client, Message } from 'paho-mqtt';
import { useThemeContext } from '../../context/ThemeContext';

export default function CadastroMoto() {
  const navigation = useNavigation();
  const { theme } = useThemeContext();

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
        // { setor: "1", moto: "1234" }
        const payload = JSON.parse(message.payloadString); 

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
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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
        style={[
          styles.detectarMoto,
          { backgroundColor: '#e4e3e3', borderColor: 'green' },
        ]}
        onPress={handleMoto}
        disabled={isDetecting}
      >
        <Icon name="wifi-tethering" style={[styles.icon, { color: 'green' }]} />
        <Text style={[styles.detecText, { color: 'black' }]}>
          Detectar Motocicleta
        </Text>
      </TouchableOpacity>

      {isDetecting ? (
        <View
          style={[
            styles.boxBuscando,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <View style={styles.buscando}>
            <Text
              style={[styles.titlebuscando, { color: theme.colors.onSurface }]}
            >
              Buscando...
            </Text>
          </View>
        </View>
      ) : (
        detectedMotos.length > 0 && (
          <View
            style={[
              styles.boxBuscando,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <View style={styles.buscando}>
              <Text
                style={[
                  styles.titlebuscando,
                  { color: theme.colors.onSurface },
                ]}
              >
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
                  <Text
                    style={[styles.textMotos, { color: theme.colors.text }]}
                  >
                    {`Tag - ${moto.tag} | Setor - ${moto.setor}`}
                  </Text>
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
  icon: {
    position: 'absolute',
    top: 0,
    right: 3,
    fontSize: 35,
  },
});
