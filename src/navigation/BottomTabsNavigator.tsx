import Icon from 'react-native-vector-icons/Ionicons';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/appScreens/HomeScreen';
import SubmitScreen from '../screens/appScreens/SubmitScreen';
import SearchScreen from '../screens/appScreens/SearchScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabsNavigator() {
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
        tabBarActiveTintColor: '#f900cf',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#DCDEDF',
          height: 70,
        },
        tabBarItemStyle: {
          height: 80,
          paddingTop: 10,
          paddingBottom: 10,
        },

        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Add"
        component={SubmitScreen}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
