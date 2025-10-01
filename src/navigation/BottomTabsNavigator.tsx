import Icon from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/appScreens/HomeScreen';
import SubmitScreen from '../screens/appScreens/SubmitScreen';
import SearchScreen from '../screens/appScreens/SearchScreen';
import { useThemeContext } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {
  const { theme } = useThemeContext(); // pega o tema atual

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          let iconName: string = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add' : 'add-outline';
          }

          return <Icon name={iconName} size={30} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface, // cinza adaptado
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          height: 70,
          borderTopColor: theme.colors.outline,
          borderTopWidth: 1,
        },
        tabBarItemStyle: {
          height: 80,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Add" component={SubmitScreen} />
    </Tab.Navigator>
  );
}
