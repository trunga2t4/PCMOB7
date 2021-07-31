import { FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { TouchableOpacity, UIManager, LayoutAnimation } from "react-native";
import { ActivityIndicator, Keyboard } from "react-native";
import { API, API_LOGIN, API_SIGNUP } from "../constants/API";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logInAction } from "../redux/ducks/blogAuth";
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} //Needs to be manually enabled for android

export default function SignInSignUpScreen({ navigation }) {
  const [username, setUsername] = useState("U1");
  const [password, setPassword] = useState("P");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLogIn, setIsLogIn] = useState(true);
  const [errorText, setErrorText] = useState("");
  const dispatch = useDispatch();
  const isDark = useSelector((state) => state.pref.isDark);

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
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#B2D5E9", "transparent"]}
        style={styles.background}
      />
      <FontAwesome name="user" size={100} color="purple" />
      <Text style={[styles.title, { margin: 20 }]}>Log In</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Username:"
          placeholderTextColor="#003f5c"
          value={username}
          onChangeText={(username) => setUsername(username)}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password:"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          value={password}
          onChangeText={(pw) => setPassword(pw)}
        />
      </View>

      <View />
      <View>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.button}
            onPress={isLogIn ? login : signup}
          >
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator style={{ marginLeft: 10 }} />
          ) : (
            <View />
          )}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext({
            duration: 700,
            create: { type: "linear", property: "opacity" },
            update: { type: "spring", springDamping: 0.4 },
          });
          setIsLogIn(!isLogIn);
          setErrorText("");
        }}
      ></TouchableOpacity>
      <Text style={styles.errorText}>{errorText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 400,
  },
  container: {
    flex: 1,
    backgroundColor: "#E9B2E3",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 40,
    margin: 20,
  },
  switchText: {
    fontWeight: "400",
    fontSize: 20,
    marginTop: 20,
  },
  inputView: {
    backgroundColor: "#EEEEEE",
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: "blue",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "400",
    fontSize: 20,
    margin: 20,
    color: "yellow",
  },
  errorText: {
    fontSize: 15,
    color: "red",
    marginTop: 20,
  },
});
