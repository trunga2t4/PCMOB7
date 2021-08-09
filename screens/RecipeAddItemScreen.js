import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { View, TouchableOpacity } from "react-native";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import axios from "axios";
import { API, API_ITEMS, API_WHOAMI } from "../constants/API";
import {
  API_CREATE_CART,
  API_CREATE_RECIPE_ITEM,
  API_CART,
} from "../constants/API";
import { useSelector } from "react-redux";
import { Button, Text, TextInput, useTheme, Avatar } from "react-native-paper";
import { commonStyles as styles } from "../styles/commonStyles";

export default function RecipeAddItemScreen({ navigation, route }) {
  const recipe = route.params.recipe;
  const { dark, colors } = useTheme();
  const isDark = dark;
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    //console.log("Setting up nav listerner");
    const removeListerner = navigation.addListener("focus", () => {
      //console.log("Running nav listerner");
      getPosts();
    });
    getPosts;
    return removeListerner;
  });

  async function getPosts() {
    try {
      const response = await axios.get(API + API_ITEMS, {
        headers: { Authorization: `JWT ${token}` },
      });
      //console.log(response.data);
      const response2 = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      setUser(response2.data);
      setPosts(response.data);
    } catch (error) {
      console.log(error.response.data);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignIn");
      }
    }
  }

  async function addToRecipe(item) {
    const recipeItem = {
      recipeId: recipe.id,
      itemId: item.id,
      quantity: item.defaultQuantity,
    };
    try {
      const response = await axios.post(
        API + API_CREATE_RECIPE_ITEM,
        recipeItem,
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignIn");
      }
    }
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={{
          height: 50,
          borderColor: colors.onBackground,
          borderWidth: 1,
          width: "33%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            item.alertQuantity > item.quantity ? "#FF8888" : "transparent",
        }}
        onPress={() => addToRecipe(item)}
      >
        <Text style={[styles.text, { width: "100%", textAlign: "center" }]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        // Background Linear Gradient
        colors={[colors.backgroundTop, "transparent"]}
        style={styles.backgroundGradient}
      />
      <Button
        style={[styles.button100, { backgroundColor: colors.backgroundHeader }]}
        icon="backspace"
        mode="contained"
        dark={isDark}
        onPress={() => navigation.navigate("RecipeEdit", { item: recipe })}
      >
        Back to recipe
      </Button>
      <FlatList
        data={posts}
        renderItem={renderItem}
        style={{ width: "100%" }}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
