import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DeepLinkingScreen from "./Screens/DeepLinkingScreen.js";
import HomeScreen from "./Screens/HomeScreen.js";
import TagDetailScreen from "./Screens/TagDetailScreen.js";
import WriteNdefScreen from "./Screens/WriteNdefScreen.js";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Home" }} />
        <Stack.Screen name="Tag" component={TagDetailScreen} options={{ title: "Tag Detail" }} />
        <Stack.Screen
          name="WriteNdef"
          component={WriteNdefScreen}
          options={{ title: "Write NDEF" }}
        />
        <Stack.Screen
          name="DeepLinking"
          component={DeepLinkingScreen}
          options={{ title: "Deep Link" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
