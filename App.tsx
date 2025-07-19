import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { MyCollectionsPage } from './src/screens/my-collections-page.tsx';
import { CardsPage } from './src/screens/cards-page.tsx';
import { LoginPage } from './src/screens/login-page.tsx';
import { MenuProvider } from 'react-native-popup-menu';
import { QuizPage } from './src/screens/quiz-page.tsx';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { toastConfig } from './src/components/toast-config.tsx';
import { colors } from './src/theme/colors.ts';
import { HeaderButton } from './src/components/header-button.tsx';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export type StackParams = {
  LoginPage: undefined;
  MyCollectionsPage: undefined;
  CardsPage: { collectionName: string };
  QuizPage: { collectionName: string };
};

const Stack = createNativeStackNavigator<StackParams>();

const RootStack = () => {
  const headerLeft = (navigation: NativeStackNavigationProp<StackParams>) => {
    return <HeaderButton action="back" onAction={() => navigation.goBack()} />;
  };

  return (
    <Stack.Navigator
      initialRouteName="MyCollectionsPage"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.lightCyan,
        },
        headerTitleAlign: 'center',
        headerTintColor: colors.night.standard,
        headerTitleStyle: {
          fontFamily: 'SpaceMono-Bold',
          fontSize: 24,
        },
      }}
    >
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen
        name="MyCollectionsPage"
        component={MyCollectionsPage}
        options={{ title: 'Collections' }}
      />
      <Stack.Screen
        name="CardsPage"
        component={CardsPage}
        options={({ navigation }) => ({
          title: 'Cards',
          headerLeft: () => headerLeft(navigation)
        })}
      />
      <Stack.Screen
        name="QuizPage"
        component={QuizPage}
        options={({ navigation }) => ({
          title: 'Quiz',
          headerLeft: () => headerLeft(navigation)
        })}
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView>
      <MenuProvider>
        <NavigationContainer>
          <RootStack />
          <Toast config={toastConfig} />
        </NavigationContainer>
      </MenuProvider>
    </GestureHandlerRootView>
  );
}
