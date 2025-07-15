import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { MyCollectionsPage } from './src/my-collections-page.tsx';
import { CardsPage } from './src/cards-page.tsx';
import { LoginPage } from './src/login-page.tsx';
import { MenuProvider } from 'react-native-popup-menu';
import { QuizPage } from './src/quiz-page.tsx';
import { useCallback } from 'react';
import { TextButton } from './src/components/text-button.tsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { colors } from './src/theme/colors.ts';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export type StackParams = {
  LoginPage: undefined;
  MyCollectionsPage: undefined;
  CardsPage: { collectionName: string };
  QuizPage: { collectionName: string };
};

const Stack = createNativeStackNavigator<StackParams>();

const RootStack = () => {
  const headerRight = useCallback(() => {
    return <TextButton label="Quiz" />;
  }, []);

  return (
    <Stack.Navigator
      initialRouteName="MyCollectionsPage"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.light_cyan[500],
        },
        headerTintColor: colors.night[500],
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen
        name="MyCollectionsPage"
        component={MyCollectionsPage}
        options={{
          title: 'My Collections',
        }}
      />
      <Stack.Screen
        name="CardsPage"
        component={CardsPage}
        options={{
          title: 'Cards',
          headerRight,
        }}
      />
      <Stack.Screen
        name="QuizPage"
        component={QuizPage}
        options={{
          title: 'Quiz',
        }}
      />
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
          </SafeAreaProvider>
        </NavigationContainer>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}
