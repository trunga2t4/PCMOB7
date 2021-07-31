import React, { useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import SignInScreen from "./screens/SignInScreen";
import LoggedInTabStack from "./components/LoggedInTabStack";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider, useSelector } from "react-redux";
import store from "./redux/configureStore";

const Stack = createStackNavigator();

export function App() {
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.pref.isDark);
  console.log(token);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  return loading ? (
    <View style={styles.container}>
      <ActivityIndicator />
    </View>
  ) : (
    <NavigationContainer>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack.Navigator
        mode="modal"
        headerMode="none"
        initialRouteName={token != null ? "Logged In" : "SignInSignUp"}
        animationEnabled={false}
      >
        <Stack.Screen component={LoggedInTabStack} name="Logged In" />
        <Stack.Screen component={SignInScreen} name="SignIn" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
