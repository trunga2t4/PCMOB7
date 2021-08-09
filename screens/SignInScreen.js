import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, Text, StyleSheet, Appearance } from "react-native";
import { TouchableOpacity, UIManager, LayoutAnimation } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ActivityIndicator, Keyboard } from "react-native";
import { API, API_LOGIN, API_SIGNUP } from "../constants/API";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logInAction } from "../redux/ducks/blogAuth";
import { setMode } from "../redux/ducks/accountPref.js";
import { commonStyles as styles } from "../styles/commonStyles";
import {
  useTheme,
  IconButton,
  TextInput,
  Button,
  Title,
} from "react-native-paper";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} //Needs to be manually enabled for android

export default function SignInSignUpScreen({ navigation, props }) {
  const dispatch = useDispatch();
  const { dark, colors } = useTheme();
  const [username, setUsername] = useState("U1");
  const [password, setPassword] = useState("P");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const isDark = dark;

  async function login() {
    console.log("---- Login time ----");
    Keyboard.dismiss();
    try {
      setLoading(true);
      const response = await axios.post(API + API_LOGIN, {
        username,
        password,
      });
      console.log("Success logging in!");
      dispatch({ ...logInAction(), payload: response.data.access_token });
      setLoading(false);
      setUsername("");
      setPassword("");
      navigation.navigate("Logged In");
    } catch (error) {
      setLoading(false);
      console.log("Error logging in!");
      console.log(error);
      setErrorText(error.response.data.description);
      if ((error.response.status = 404)) {
        setErrorText("User does not exist");
      }
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={[colors.backgroundTop, "transparent"]}
        style={styles.backgroundGradient}
      />
      <View style={[{ alignItems: "center", width: "90%" }]}>
        <FontAwesome name="user" size={100} color={colors.primary} />
        <Title style={[styles.title]}>Log In</Title>
        <View style={styles.inputView}>
          <TextInput
            mode="outlined"
            style={[styles.textInput, { height: 60 }]}
            placeholder="Username:"
            value={username}
            onChangeText={(username) => setUsername(username)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={[styles.textInput, { height: 60 }]}
            mode="outlined"
            placeholder="Password:"
            secureTextEntry={true}
            value={password}
            onChangeText={(pw) => setPassword(pw)}
          />
        </View>
        <Button
          style={[
            styles.button,
            { backgroundColor: colors.accent, width: "100%", padding: 10 },
          ]}
          icon="account"
          mode="contained"
          dark={isDark}
          onPress={login}
        >
          Log In
        </Button>
      </View>

      <View>
        {loading ? <ActivityIndicator style={{ marginLeft: 10 }} /> : <View />}
      </View>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext({
            duration: 700,
            create: { type: "linear", property: "opacity" },
            update: { type: "spring", springDamping: 0.4 },
          });
          setErrorText("");
        }}
      ></TouchableOpacity>
      <Text style={styles.errorText}>{errorText}</Text>
    </View>
  );
}
