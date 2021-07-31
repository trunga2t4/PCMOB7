import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { Text, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { API, API_ITEMS, API_WHOAMI, API_CREATE_CART } from "../constants/API";
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
    navigation.navigate("Create");
  }

  async function getPosts() {
    try {
      const response = await axios.get(API + API_ITEMS, {
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

  async function deletePost(id) {
    console.log("Deleting " + id);
    try {
      const response = await axios.delete(API + API_ITEMS + `/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      setPosts(posts.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  async function addCart(item) {
    const itemId = item.id;
    const quantity = item.defaultQuantity;
    const price = item.price;
    try {
      const response = await axios.post(
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
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data);
      if ((error.response.data.error = "Invalid token")) {
        navigation.navigate("SignIn");
      }
    }
  }

  function renderItem({ item }) {
    if (item.alertQuantity > item.quantity) {
      return (
        <TouchableOpacity
          style={{
            padding: 10,
            paddingtop: 20,
            borderBottomColor: "#0108AE",
            backgroundColor: "#FF8888",
            borderBottomWidth: 1,
            flexDirection: "column",
          }}
          onLongPress={() =>
            navigation.navigate("Edit", {
              id: item.id,
            })
          }
          onPress={() => addCart(item)}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>
              {item.quantity} {item.unit}
            </Text>
            <TouchableOpacity onPress={() => deletePost(item.id)}>
              <FontAwesome name="trash" size={20} color="#a80000" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={{
            padding: 10,
            paddingtop: 20,
            borderBottomColor: "#0108AE",
            borderBottomWidth: 1,
            flexDirection: "column",
          }}
          onLongPress={() =>
            navigation.navigate("Edit", {
              id: item.id,
            })
          }
          onPress={() => addCart(item)}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text}>{item.name}</Text>
            <Text style={styles.text}>
              {item.quantity} {item.unit}
            </Text>
            <TouchableOpacity onPress={() => deletePost(item.id)}>
              <FontAwesome name="trash" size={20} color="#a80000" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    }
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
        style={{ width: "100%" }}
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
  boldText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "black",
  },
  text: {
    color: "black",
    fontSize: 20,
  },
});
