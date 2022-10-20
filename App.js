import React, {useContext} from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import VerAgenda from "./screens/VerAgenda";
import NuevoContacto from "./screens/NuevoContacto";
import ContactoDetalle from "./screens/ContactoDetalle";
import { UserContext, UserProvider } from "./context/UserContext";
import Login from "./screens/Login";


const Stack = createStackNavigator();
function MyStack() {
  const {user} = useContext(UserContext)
  if (!user) { return <Login />}
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="VerAgenda"
        component={VerAgenda}
        options={{ title: "Agenda" }}
      />
      <Stack.Screen
        name="NuevoContacto"
        component={NuevoContacto}
        options={{ title: "Nuevo Contacto" }}
      />
      <Stack.Screen
        name="ContactoDetalle"
        component={ContactoDetalle}
        options={{ title: "Detalle del Contacto" }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <UserProvider >
    <NavigationContainer>
      <MyStack /> 
    </NavigationContainer>
    </UserProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
