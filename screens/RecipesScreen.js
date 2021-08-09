import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { Image, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import {
  API,
  API_RECIPES,
  API_WHOAMI,
  API_CREATE_CART,
  API_RECIPE_ITEM,
  API_CART,
} from "../constants/API";
import { useSelector } from "react-redux";
import { Button, Text, TextInput, useTheme, Avatar } from "react-native-paper";
import { commonStyles as styles } from "../styles/commonStyles";

export default function IndexScreen({ navigation, route }) {
  const { dark, colors } = useTheme();
  const isDark = dark;
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: null,
      headerRight: () => (
        <TouchableOpacity onPress={addPost}>
          <FontAwesome
            name="plus-circle"
            size={24}
            style={{ color: colors.primaryVariant, marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  });
  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    const removeListerner = navigation.addListener("focus", () => {
      getPosts();
    });
    getPosts;
    return removeListerner;
  });

  function addPost() {
    navigation.navigate("RecipeCreate");
  }

  async function getPosts() {
    try {
      const response = await axios.get(API + API_RECIPES, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
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

  async function onRefresh() {
    setRefreshing(true);
    const response = await getPosts();
    setRefreshing(false);
  }

  async function addCart(item) {
    try {
      const response = await axios.get(API + API_RECIPE_ITEM, {
        headers: { Authorization: `JWT ${token}` },
      });
      const recipeItemData = response.data;
      for (let i = 0; i < recipeItemData.length; i++) {
        if (recipeItemData[i].recipeId == item.id) {
          const itemId = recipeItemData[i].itemId;
          const quantity = recipeItemData[i].itemDetails.defaultQuantity;
          const price = recipeItemData[i].itemDetails.price;
          const response3 = await axios.post(
            API + API_CREATE_CART,
            {
              itemId,
              quantity,
              price,
            },
            {
              headers: { Authorization: `JWT ${token}` },
            }
          );
          console.log(response3.data);
        }
      }
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
          padding: 10,
          paddingBottom: 0,
          width: "33%",
        }}
        onLongPress={() =>
          navigation.navigate("RecipeEdit", {
            item,
          })
        }
        onPress={() => addCart(item)}
      >
        {item.photoId == null || item.photoId == "" ? (
          <Image
            style={[styles.logo, { opacity: 0.5 }]}
            source={{
              uri: "https://static.wikia.nocookie.net/gensin-impact/images/6/6f/Item_Sashimi_Platter.png",
            }}
          />
        ) : (
          <Image
            style={[styles.logo, { opacity: 0.5 }]}
            source={{
              uri: item.photoId,
            }}
          />
        )}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text style={[styles.boldText, { color: colors.onSurface }]}>
            {item.name}
          </Text>
          <Text>Future use</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.backgroundTop, "transparent"]}
        style={styles.backgroundGradient}
      />
      <FlatList
        data={posts}
        renderItem={renderItem}
        style={[{ width: "100%" }]}
        numColumns={3}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl
            colors={["#9Bd35A", "#689F38"]}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
}
