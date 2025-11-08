import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderReduzida from '../templates/HeaderReduzida';
import IconIon from 'react-native-vector-icons/Ionicons';
import { useThemeContext } from '../../context/ThemeContext';
import { connectMotoMqtt, disconnectMotoMqtt } from '../../services/mqttService';
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';



export default function SetorDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { setorId, setorNome } = route.params as { setorId: string; setorNome: string };
  const { theme } = useThemeContext();
  const { t } = useTranslation();


  const [messages, setMessages] = useState<{ tag: string; status: 'entrando' | 'saindo' }[]>([]);
  const [loading, setLoading] = useState(true);

  const payloadGlobal = useRef<any>(null);
  const statusMotos = useRef<{ [tag: string]: 'entrando' | 'saindo' }>({});
  const clientRef = useRef<any>(null);

  useEffect(() => {
  clientRef.current = connectMotoMqtt(
    (payload) => {
      console.log(payload)
      if (payload.setor !== setorId.toString()) return;

      payloadGlobal.current = payload;
      const tag = payload.moto;

      const novoStatus =
        statusMotos.current[tag] === 'entrando' ? 'saindo' : 'entrando';

      statusMotos.current[tag] = novoStatus;

      setMessages((oldMsgs) => [...oldMsgs, { tag, status: novoStatus }]);
      if (loading) setLoading(false);
    },
    (err) => {
      console.error('Erro MQTT:', err);
      if (loading) setLoading(false);
    }
  );

  return () => {
    disconnectMotoMqtt(clientRef.current);
  };
}, [setorId]);


  return (
<SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background  }} edges={['top', 'left', 'right']}>
      <HeaderReduzida />
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltarBtn}>
          <IconIon name="arrow-back" size={28} color={theme.colors.primary} />
        </TouchableOpacity>

        <Text style={[styles.title1, { backgroundColor: theme.colors.primary, color: theme.colors.onPrimary }]}>
          {t('setorDetails.logsTitle')} {/* "Logs de Entrada e Saída do Setor" */}
        </Text>

        <Text style={[styles.title, { color: theme.colors.primary }]}>
          {t('setorDetails.id')}: <Text style={{ color: theme.colors.secondary }}>{setorId}</Text>{' '}
          {'  '}
          {t('setorDetails.name')}: <Text style={{ color: theme.colors.secondary }}>{setorNome}</Text>
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.text }]}>
          {t('setorDetails.rfidReadings')} {/* "Leituras RFID Recebidas:" */}
        </Text>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ color: theme.colors.text, marginTop: 10 }}>
              {t('setorDetails.connectingMqtt')} {/* "Conectando ao MQTT..." */}
            </Text>          
          </View>
        ) : (
          <ScrollView style={styles.scroll}>
            {messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBox,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
                ]}
              >
                <Text style={[styles.messageText, { color: theme.colors.text }]}>
                  {t('setorDetails.tag')}: {msg.tag}{' '}
                  {msg.status === 'entrando' ? t('setorDetails.entering') : t('setorDetails.leaving')} {/* "Entrando no Setor" / "Saindo do Setor" */}
                  {' '} {payloadGlobal.current?.setor}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
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
