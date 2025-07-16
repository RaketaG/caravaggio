import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { MyCollectionsPage } from './src/screens/my-collections-page.tsx';
import { CardsPage } from './src/screens/cards-page.tsx';
import { LoginPage } from './src/screens/login-page.tsx';
import { MenuProvider } from 'react-native-popup-menu';
import { QuizPage } from './src/screens/quiz-page.tsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/toast-config.tsx';

export type StackParams = {
  LoginPage: undefined;
  MyCollectionsPage: undefined;
  CardsPage: { collectionName: string };
  QuizPage: { collectionName: string };
};

const Stack = createNativeStackNavigator<StackParams>();

const RootStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyCollectionsPage"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="MyCollectionsPage" component={MyCollectionsPage} />
      <Stack.Screen name="CardsPage" component={CardsPage} />
      <Stack.Screen name="QuizPage" component={QuizPage} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView>
      <MenuProvider>
        <NavigationContainer>
          <SafeAreaProvider>
            <RootStack />
            <Toast config={toastConfig} />
          </SafeAreaProvider>
        </NavigationContainer>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}
