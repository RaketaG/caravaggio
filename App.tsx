import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { MyCollectionsPage } from "./src/my-collections-page.tsx";
import { CardsPage } from "./src/cards-page.tsx";
import { LoginPage } from "./src/login-page.tsx";
import { MenuProvider } from "react-native-popup-menu";
import { QuizzPage } from "./src/quizz-page.tsx";
import { useCallback } from "react";
import { TextButton } from "./src/components/text-button.tsx";

export type StackParams = {
  LoginPage: undefined;
  MyCollectionsPage: undefined;
  CardsPage: {collectionName: string};
  QuizzPage: {collectionName: string};
};

const Stack = createNativeStackNavigator<StackParams>();

const RootStack = () => {
  const headerRight = useCallback(()=>{
    return <TextButton label="Quizz"/>
  },[])
  
  return (
    <Stack.Navigator initialRouteName="MyCollectionsPage" >
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{
          title: "Login"
        }}
      />
      <Stack.Screen
        name="MyCollectionsPage"
        component={MyCollectionsPage}
        options={{
          title: 'My Collections'
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
        name="QuizzPage"
        component={QuizzPage}
        options={{
          title: 'Quizz'
        }}
      />
    </Stack.Navigator>
  );
};

export default function App () {

  return (
    <MenuProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </MenuProvider>
  );
};
