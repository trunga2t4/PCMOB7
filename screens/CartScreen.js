import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { Text, View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { API, API_CART, API_WHOAMI } from "../constants/API";
import { useSelector } from "react-redux";

export default function IndexScreen({ navigation, route }) {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const isDark = useSelector((state) => state.pref.isDark);

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
      const response = await axios.get(API + API_CART, {
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
      const response = await axios.delete(API + API_CART + `/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      setPosts(posts.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  function renderItem({ item }) {
    if (item.isPurchased != 0) {
      return null;
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
          onPress={() =>
            navigation.navigate("CartEdit", {
              id: item.id,
            })
          }
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text}>{item.itemDetails.name}</Text>
            <Text style={styles.text}>
              {item.quantity} {item.itemDetails.unit}
            </Text>
            <Text style={styles.text}>{item.price} SGD</Text>
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
