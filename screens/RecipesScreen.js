import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { Text, Image, View, TouchableOpacity } from "react-native";
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

export default function IndexScreen({ navigation, route }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.pref.isDark);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={addPost}>
          <FontAwesome
            name="plus-circle"
            size={24}
            style={{ color: "#0108AE", marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  });
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

  async function addCart(item) {}

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={{
          padding: 20,
          paddingBottom: 10,
          width: "50%",
        }}
        onLongPress={() =>
          navigation.navigate("RecipeEdit", {
            id: item.id,
          })
        }
        onPress={() => addCart(item)}
      >
        <Text style={styles.text}>{item.name}</Text>
        <Image
          style={styles.logo}
          source={{
            uri: item.photoId,
          }}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#B2D5E9", "transparent"]}
        style={styles.background}
      />
      <FlatList
        data={posts}
        renderItem={renderItem}
        style={[{ width: "100%" }]}
        numColumns={2}
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
  container2: {
    backgroundColor: "#E9B2E3",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
  },
  text: {
    color: "black",
    fontSize: 20,
  },
  logo: {
    width: 180,
    height: 180,
    borderBottomRightRadius: 50,
    borderTopLeftRadius: 50,
  },
});
