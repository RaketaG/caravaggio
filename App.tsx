import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { MyCollectionsPage } from "./src/my-collections-page.tsx";
import { CardsPage } from "./src/cards-page.tsx";
import { LoginPage } from "./src/login-page.tsx";

export type StackParams = {
  LoginPage: undefined;
  MyCollectionsPage: undefined;
  CardsPage: {collectionName: string};
};

const Stack = createNativeStackNavigator<StackParams>();

const RootStack = () => {
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
        options={{ title: 'My Collections' }}
      />
      <Stack.Screen
        name="CardsPage"
        component={CardsPage}
        options={{ title: 'Cards' }}
      />
    </Stack.Navigator>
  );
};

export default function App () {

  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
};
