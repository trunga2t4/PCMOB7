import React from "react";
import { Appearance } from "react-native";
import { StatusBar } from "expo-status-bar";
import SignInScreen from "./screens/SignInScreen";
import LoggedInTabStack from "./components/LoggedInTabStack";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as StoreProvider } from "react-redux";
import { useSelector } from "react-redux";
import { DefaultTheme, DarkTheme } from "react-native-paper";
import { Provider as PaperProvider } from "react-native-paper";
import store from "./redux/configureStore";

const colorScheme = Appearance.getColorScheme();
const isDark = colorScheme === "dark";
console.log("colorScheme:", colorScheme, "/ isDark: ", isDark);

const myLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#2069e0",
    primaryVariant: "#0108AE",
    accent: "#BB99EE",
    accentVariant: "#018786",
    background: "#E9B2E3",
    backgroundTop: "#B2D5E9",
    backgroundHeader: "#8BC7E9",
    surface: "#8BC7E9",
    error: "#B00020",
    text: "black",
    onSurface: "#000000",
    onBackground: "#000000",
    onPrimary: "#FFFFFF",
    onPrimaryVariant: "#000000",
    onAccent: "#000000",
    onAccentVariant: "#000000",
    //disabled: color(black).alpha(0.26).rgb().string(),
    //placeholder: color(black).alpha(0.54).rgb().string(),
    //backdrop: color(black).alpha(0.5).rgb().string(),
    //notification: pinkA400,
  },
};

const myDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#BB86FC",
    primaryVariant: "#f4d47c",
    accent: "#03DAC5",
    accentVariant: "#018786",
    background: "#3F1A51",
    backgroundTop: "#070033",
    backgroundHeader: "#0E0062",
    surface: "#0E0062",
    error: "#B00020",
    text: "white",
    onSurface: "#FFFFFF",
    onBackground: "#FFFFFF",
    onPrimary: "#000000",
    onPrimaryVariant: "#FFFFFF",
    onAccent: "#FFFFFF",
    onAccentVariant: "#FFFFFF",
    //disabled: color(black).alpha(0.26).rgb().string(),
    //placeholder: color(black).alpha(0.54).rgb().string(),
    //backdrop: color(black).alpha(0.5).rgb().string(),
    //notification: pinkA400,
  },
};

const Stack = createStackNavigator();

export function App() {
  const token = useSelector((state) => state.auth.token);
  console.log("App token", token);

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack.Navigator
        mode="modal"
        headerMode="none"
        initialRouteName={token != null ? "Logged In" : "SignIn"}
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
    <StoreProvider store={store}>
      <PaperProvider theme={isDark ? myDarkTheme : myLightTheme}>
        <App />
      </PaperProvider>
    </StoreProvider>
  );
}
