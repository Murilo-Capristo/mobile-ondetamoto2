import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Landing from '../screens/preScreen/LandingScreen';
import PreCadastro from '../screens/preScreen/PreCadastroScreen';
import Login from '../screens/preScreen/LoginScreen';
import HomeScreen from '../screens/appScreens/HomeScreen';
import BottomTabsNavigator from './BottomTabsNavigator';
import SearchScreen from '../screens/appScreens/SearchScreen';
import SubmitScreen from '../screens/appScreens/SubmitScreen';
import CadastroMoto from '../screens/appScreens/CadastroMoto';
import CadastroSetor from '../screens/appScreens/CadastroSetor';
import FormMoto from '../screens/appScreens/FormMoto';
import SetorDetailsScreen from '../screens/appScreens/SetorDetailsScreen';
import Splash from '../screens/Splash';

export type RootStackParamList = {
  Splash: undefined;
  Landing: undefined;
  PreCadastro: undefined;
  Login: undefined;
  HomeScreen: undefined;
  SearchScreen: { param: string };
  SubmitScreen: { param: string };
  CadastroMoto: undefined;
  CadastroSetor: undefined;
  FormMoto: undefined;
  SetorDetailsScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Splash" component={Splash} />
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="PreCadastro" component={PreCadastro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CadastroMoto" component={CadastroMoto} />
        <Stack.Screen name="CadastroSetor" component={CadastroSetor} />
        <Stack.Screen name="FormMoto" component={FormMoto} />
        <Stack.Screen
          name="SetorDetailsScreen"
          component={SetorDetailsScreen}
        />

        <Stack.Screen
          name="HomeScreen"
          component={BottomTabsNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SearchScreen"
          component={SearchScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SubmitScreen"
          component={SubmitScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
