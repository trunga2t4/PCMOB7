import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View,
  Switch,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { commonStyles, lightStyles } from "../styles/commonStyles";
import axios from "axios";
import { API, API_WHOAMI } from "../constants/API";

import { useSelector, useDispatch } from "react-redux";
import { logOutAction } from "../redux/ducks/blogAuth";

import { FontAwesome } from "@expo/vector-icons";

export default function AccountScreen({ navigation }) {
  const [username, setUsername] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const styles = { ...commonStyles, ...lightStyles };

  const dispatch = useDispatch();

  async function getUsername() {
    console.log("---- Getting user name ----");
    console.log(`Token is ${token}`);
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log("Got user name!");
      setUsername(response.data.username);
    } catch (error) {
      console.log("Error getting user name");
      if (error.response) {
        console.log(error.response.data);
        if (error.response.data.status_code === 401) {
          signOut();
          navigation.navigate("SignIn");
        }
      } else {
        console.log(error);
      }
      // We should probably go back to the login screen???
    }
  }

  function signOut() {
    dispatch({ ...logOutAction() });
    navigation.navigate("SignIn");
  }
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={signOut}>
          <FontAwesome
            name="sign-out"
            size={24}
            style={{ color: "#0108AE", marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  });
  useEffect(() => {
    console.log("Setting up nav listener");
    // Check for when we come back to this screen
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUsername(<ActivityIndicator />);
      getUsername();
    });
    getUsername();
    return removeListener;
  }, []);

  return (
    <View style={[styles.container, { alignItems: "center" }]}>
      <Text style={{ marginTop: 20 }}>Account Screen</Text>
      <Text>{username}</Text>
    </View>
  );
}
