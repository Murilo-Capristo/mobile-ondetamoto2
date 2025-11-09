import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import IconFont from 'react-native-vector-icons/Fontisto';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import HeaderTemplate from '../templates/HeaderTemplate';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useThemeContext } from '../../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 40;

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeScreen'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme } = useThemeContext();
  const { t } = useTranslation();

  const featureCards = [
    {
      new: false,
      title: t('home.motos'),
      navigation: 'SearchScreen',
      param: 'motos',
      icon: <IconFont name="motorcycle" size={50} color={theme.colors.primary} />,
    },
    {
      new: false,
      title: t('home.addMoto'),
      navigation: 'CadastroMoto',
      param: 'motos',
      icon: <Feather name="plus-square" size={50} color={theme.colors.primary} />,
    },
    {
      new: false,
      title: t('home.setores'),
      navigation: 'SearchScreen',
      param: 'setores',
      icon: <MCI name="garage" size={50} color={theme.colors.primary} />,
    },
    {
      new: false,
      title: t('home.addSetor'),
      navigation: 'CadastroSetor',
      param: 'setores',
      icon: <Feather name="plus-square" size={50} color={theme.colors.primary} />,
    },
    {
      new: true,
      title: t('home.reminders'),
      navigation: 'NotificationScreen',
      param: 'notifications',
      icon: <Feather name="bell" size={50} color={theme.colors.primary} />,
    },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top', 'left', 'right']}
    >
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <HeaderTemplate />
        <View style={styles.subtitle}>
          <Text style={{ color: theme.colors.text }}>{t('home.subtitle')}</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            {featureCards.map((card, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.card, { backgroundColor: theme.colors.surface }]}
                onPress={() => navigation.navigate(card.navigation, { param: card.param })}
              >
                {card.new && (
                  <View style={styles.newBadge}>
                    <Text style={styles.newText}>{t('home.new')}</Text>
                  </View>
                )}
                <View style={styles.iconContainer}>{card.icon}</View>
                <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{card.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 30, alignItems: 'center' },
  container: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  subtitle: { marginLeft: 30, marginTop: 30, marginBottom: 30, textAlign: 'center' },
  card: {
    padding: 20,
    justifyContent: 'space-between',
    margin: 10,
    borderRadius: 10,
    width: cardWidth,
    height: cardWidth,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  iconContainer: { height: 60, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { marginTop: 10, fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#e53935',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  newText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
});
