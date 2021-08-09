import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Image } from "react-native";
import { View, TouchableOpacity } from "react-native";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import axios from "axios";
import { API, API_CART, API_WHOAMI } from "../constants/API";
import { useSelector } from "react-redux";
import { Button, Text, TextInput, useTheme, Avatar } from "react-native-paper";
import { commonStyles as styles } from "../styles/commonStyles";

export default function IndexScreen({ navigation, route }) {
  const { dark, colors } = useTheme();
  const isDark = dark;
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const [quantity, setQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [selected, setSellected] = useState(-1);

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

  async function updatePost(id) {
    const cart = {
      quantity: quantity,
      price: totalPrice,
    };
    console.log("Updating " + id);
    try {
      const response = await axios.put(API + API_CART + `/${id}`, cart, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      setSellected(-1);
      setQuantity(0);
      setTotalPrice(0);
      getPosts();
    } catch (error) {
      console.log(error);
    }
  }

  async function purchasePost(id) {
    const cart = {
      quantity: quantity,
      price: totalPrice,
      isPurchased: 1,
    };
    console.log("Updating " + id);
    try {
      const response = await axios.put(API + API_CART + `/${id}`, cart, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      setSellected(-1);
      setQuantity(0);
      setTotalPrice(0);
      getPosts();
    } catch (error) {
      console.log(error);
    }
  }

  function currentSelected({ item }) {
    if (selected == item.id) {
      setSellected(-1);
      setQuantity(0);
      setTotalPrice(0);
    } else {
      setSellected(item.id);
      setQuantity(item.quantity);
      setTotalPrice(Math.round(item.price * 100) / 100);
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
            borderBottomColor: colors.onBackground,
            borderBottomWidth: 1,
            flexDirection: "column",
            backgroundColor: "transparent",
          }}
          onPress={() => currentSelected({ item })}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={[styles.boldText, { width: "40%" }]}>
                {item.itemDetails.name}
              </Text>
              <Text style={[styles.text, { width: "25%" }]}>
                {item.quantity} {item.itemDetails.unit}
              </Text>
              <Text style={[styles.text, { width: "25%" }]}>
                {Math.round(item.price * 100) / 100} SGD
              </Text>
              <TouchableOpacity onPress={() => deletePost(item.id)}>
                <Fontisto
                  name="shopping-basket-remove"
                  size={20}
                  color="#a80000"
                />
              </TouchableOpacity>
            </View>
            {selected == item.id ? (
              <View
                style={{
                  alignItems: "center",
                  margin: 10,
                }}
              >
                {item.itemDetails.photoId == null ||
                item.itemDetails.photoId == "" ? (
                  <Image
                    style={[styles.logo100, { opacity: 0.5 }]}
                    source={{
                      uri: "https://static.wikia.nocookie.net/gensin-impact/images/6/6f/Item_Sashimi_Platter.png",
                    }}
                  />
                ) : (
                  <Image
                    style={[styles.logo100, { opacity: 0.5 }]}
                    source={{
                      uri: item.itemDetails.photoId,
                    }}
                  />
                )}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.text, { width: "30%" }]}>Quantity:</Text>
                  <TextInput
                    style={[styles.textInput, { width: "50%", margin: 1 }]}
                    keyboardType="numeric"
                    mode="outlined"
                    value={quantity.toString()}
                    onChangeText={(quantity) => setQuantity(Number(quantity))}
                  />
                  <Text style={[styles.text, { width: "20%" }]}>
                    {item.itemDetails.unit}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.text, { width: "30%" }]}>
                    Total price:
                  </Text>
                  <TextInput
                    style={[styles.textInput, { width: "50%", margin: 1 }]}
                    keyboardType="numeric"
                    mode="outlined"
                    value={totalPrice.toString()}
                    onChangeText={(totalPrice) =>
                      setTotalPrice(Number(totalPrice))
                    }
                  />
                  <Text style={[styles.text, { width: "20%" }]}>SGD</Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    style={[
                      styles.button50,
                      { backgroundColor: colors.accent },
                    ]}
                    icon="cart-plus"
                    mode="contained"
                    dark={isDark}
                    onPress={() => updatePost(item.id)}
                  >
                    Update
                  </Button>
                  <Button
                    style={[
                      styles.button50,
                      { backgroundColor: colors.accent },
                    ]}
                    icon="currency-usd"
                    mode="contained"
                    dark={isDark}
                    onPress={() => purchasePost(item.id)}
                  >
                    Purchase
                  </Button>
                </View>
              </View>
            ) : (
              <View></View>
            )}
          </View>
        </TouchableOpacity>
      );
    }
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
