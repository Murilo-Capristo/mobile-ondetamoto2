import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import HeaderReduzida from '../templates/HeaderReduzida';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Notifications from 'expo-notifications';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Provider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';

export default function NotificationScreen() {
  const { t } = useTranslation();

  const { theme } = useThemeContext();
  const navigation = useNavigation();

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(new Date());

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  async function setupNotifications() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default Notifications',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
  }

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
      if (status !== 'granted') {
        Alert.alert(t('notifications.permissionDenied'), t('notifications.enableNotifications'));
      }
    })();

    setupNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Usuário interagiu:', response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  const showAndroidDateTimePicker = () => {
    let selectedDate = Date.now();

    DateTimePickerAndroid.open({
      value: new Date(),
      mode: 'date',
      onChange: (event, date) => {
        if (event.type === 'set' && date) {
          selectedDate = date;
          DateTimePickerAndroid.open({
            value: date,
            mode: 'time',
            is24Hour: true,
            onChange(event, time) {
              if (time) {
                selectedDate?.setHours(time.getHours());
                selectedDate?.setMinutes(time.getMinutes());
                selectedDate?.setSeconds(0);
                setScheduledDate(selectedDate);
                scheduleDateNotification(selectedDate);
              }
            },
          });
        }
      },
    });
  };

  const scheduleDateNotification = async (date: Date) => {
    if (!permissionGranted)
      return Alert.alert(
        t('notifications.permissionDenied'),
        t('notifications.enableNotifications')
      );

    const messages = [
      {
        title: t('notifications.reminderTitle1'),
        subtitle: t('notifications.reminderSubtitle1'),
        body: t('notifications.reminderBody1'),
      },
      {
        title: t('notifications.reminderTitle2'),
        subtitle: t('notifications.reminderSubtitle2'),
        body: t('notifications.reminderBody2'),
      },
      {
        title: t('notifications.reminderTitle3'),
        subtitle: t('notifications.reminderSubtitle3'),
        body: t('notifications.reminderBody3'),
      },
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: randomMessage.title,
        subtitle: randomMessage.subtitle,
        body: randomMessage.body,
        sound: 'default',
      },
      trigger: { type: 'date', date },
    });

    Alert.alert(
      t('notifications.notificationScheduled'),
      t('notifications.notificationScheduledAt', { date: date.toLocaleString() })
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top', 'left', 'right']}
    >
      <Provider>
        <HeaderReduzida />
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltarBtn}>
            <Icon name="arrow-back" size={28} color={theme.colors.primary} />
          </TouchableOpacity>

          <View
            style={[
              styles.card,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
            ]}
          >
            <Text style={[styles.title, { color: theme.colors.primary }]}>
              {t('notifications.title')}
            </Text>

            <Text style={[styles.subtitle, { color: theme.colors.onSurface }]}>
              {t('notifications.subtitle')}
            </Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={showAndroidDateTimePicker}
            >
              <Text style={styles.buttonText}>
                {t('notifications.scheduleButton', 'Agendar Notificação')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Provider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  voltarBtn: { position: 'absolute', top: 20, left: 20 },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 18, textAlign: 'center', opacity: 0.8 },

  button: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    elevation: 2,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
