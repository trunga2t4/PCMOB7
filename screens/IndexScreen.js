import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import { View, TouchableOpacity, Image } from "react-native";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import axios from "axios";
import { API, API_ITEMS, API_WHOAMI } from "../constants/API";
import { API_CREATE_CART, API_CREATE_ITEMS, API_CART } from "../constants/API";
import { useSelector } from "react-redux";
import { Button, Text, TextInput, useTheme, Avatar } from "react-native-paper";
import { commonStyles as styles } from "../styles/commonStyles";

export default function IndexScreen({ navigation, route }) {
  const { dark, colors } = useTheme();
  const isDark = dark;
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);

  const [photoId, setPhotoId] = useState(null);
  const [name, setName] = useState("");
  const [defaultQuantity, setDefaultQuantity] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [alertQuantity, setAlertQuantity] = useState(0);
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [location, setLocation] = useState("");
  const [isIngredient, setIsIngredient] = useState(0);

  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [selected, setSellected] = useState(-1);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: null,
      headerRight: () => (
        <TouchableOpacity onPress={newPost}>
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

  async function updatePost(id) {
    const item = {
      photoId: photoId,
      name: name,
      defaultQuantity: defaultQuantity,
      quantity: quantity,
      alertQuantity: alertQuantity,
      unit: unit,
      price: price,
      brand: brand,
      location: location,
      isIngredient: isIngredient,
    };
    console.log("Updating " + id);
    console.log(item);
    try {
      const response = await axios.put(API + API_ITEMS + `/${id}`, item, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      setSellected(-1);
      setPhotoId(null);
      setName("");
      setDefaultQuantity(1);
      setQuantity(0);
      setAlertQuantity(0);
      setUnit("");
      setPrice(0);
      setBrand("");
      setLocation("");
      setIsIngredient(1);
      getPosts();
    } catch (error) {
      console.log(error);
    }
  }

  async function addPost() {
    const item = {
      photoId: photoId,
      name: name,
      defaultQuantity: defaultQuantity,
      quantity: quantity,
      alertQuantity: alertQuantity,
      unit: unit,
      price: price,
      brand: brand,
      location: location,
      isIngredient: isIngredient,
    };
    console.log("create new Item ", item.name);
    console.log(item);
    try {
      const response = await axios.post(API + API_CREATE_ITEMS, item, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      setSellected(-1);
      setPhotoId(null);
      setName("");
      setDefaultQuantity(1);
      setQuantity(0);
      setAlertQuantity(0);
      setUnit("");
      setPrice(0);
      setBrand("");
      setLocation("");
      setIsIngredient(1);
      getPosts();
    } catch (error) {
      console.log(error);
    }
  }
  function newPost() {
    if (selected != 0) {
      setSellected(0);
      setPhotoId(null);
      setName("");
      setDefaultQuantity(1);
      setQuantity(0);
      setAlertQuantity(0);
      setUnit("");
      setPrice(0);
      setBrand("");
      setLocation("");
      setIsIngredient(1);
    } else {
      setSellected(-1);
      setPhotoId(null);
      setName("");
      setDefaultQuantity(1);
      setQuantity(0);
      setAlertQuantity(0);
      setUnit("");
      setPrice(0);
      setBrand("");
      setLocation("");
      setIsIngredient(1);
    }
  }

  async function addCart(item) {
    const itemId = item.id;
    const quantity = item.defaultQuantity;
    const price = Math.round(item.price * 100) / 100;
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

  function currentSelected({ item }) {
    if (selected == item.id) {
      setSellected(-1);
      setPhotoId(null);
      setName("");
      setDefaultQuantity(1);
      setQuantity(0);
      setAlertQuantity(0);
      setUnit("");
      setPrice(0);
      setBrand("");
      setLocation("");
      setIsIngredient(1);
    } else {
      setSellected(item.id);
      setPhotoId(item.photoId);
      setName(item.name);
      setDefaultQuantity(item.defaultQuantity);
      setQuantity(item.quantity);
      setAlertQuantity(item.alertQuantity);
      setUnit(item.unit);
      setPrice(Math.round(item.price * 100) / 100);
      setBrand(item.brand);
      setLocation(item.location);
      setIsIngredient(item.isIngredient);
    }
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={{
          padding: 10,
          paddingtop: 20,
          borderBottomColor: colors.onBackground,
          borderBottomWidth: 1,
          flexDirection: "column",
          backgroundColor:
            item.alertQuantity > item.quantity ? "#FF8888" : "transparent",
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
            <TouchableOpacity onPress={() => addCart(item)}>
              <FontAwesome
                name="cart-plus"
                size={20}
                color={colors.primaryVariant}
              />
            </TouchableOpacity>
            <Text style={[styles.text, { width: "50%" }]}>{item.name}</Text>
            <Text style={[styles.text, { width: "30%" }]}>
              {item.quantity} {item.unit}
            </Text>
            <TouchableOpacity onPress={() => deletePost(item.id)}>
              <FontAwesome name="trash" size={20} color="#a80000" />
            </TouchableOpacity>
          </View>
          {selected == item.id ? (
            <View
              style={{
                alignItems: "center",
                margin: 10,
              }}
            >
              {item.photoId == null || item.photoId == "" ? (
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
                    uri: item.photoId,
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
                <Text style={[styles.text, { width: "40%" }]}>Name:</Text>
                <TextInput
                  style={[styles.textInput, { width: "40%", margin: 1 }]}
                  mode="outlined"
                  value={name}
                  onChangeText={(name) => setName(name)}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.text, { width: "40%" }]}>
                  Default purchase:
                </Text>
                <TextInput
                  style={[styles.textInput, { width: "40%", margin: 1 }]}
                  keyboardType="numeric"
                  mode="outlined"
                  value={defaultQuantity.toString()}
                  onChangeText={(defaultQuantity) =>
                    setDefaultQuantity(Number(defaultQuantity))
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.text, { width: "40%" }]}>
                  Current quantity:
                </Text>
                <TextInput
                  style={[styles.textInput, { width: "40%", margin: 1 }]}
                  keyboardType="numeric"
                  mode="outlined"
                  value={quantity.toString()}
                  onChangeText={(quantity) => setQuantity(Number(quantity))}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.text, { width: "40%" }]}>
                  Alert quantity:
                </Text>
                <TextInput
                  style={[styles.textInput, { width: "40%", margin: 1 }]}
                  keyboardType="numeric"
                  mode="outlined"
                  value={alertQuantity.toString()}
                  onChangeText={(alertQuantity) =>
                    setAlertQuantity(Number(alertQuantity))
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.text, { width: "40%" }]}>Unit:</Text>
                <TextInput
                  style={[styles.textInput, { width: "40%", margin: 1 }]}
                  mode="outlined"
                  value={unit}
                  onChangeText={(unit) => setUnit(unit)}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.text, { width: "40%" }]}>
                  Latest price:
                </Text>
                <TextInput
                  style={[styles.textInput, { width: "40%", margin: 1 }]}
                  keyboardType="numeric"
                  mode="outlined"
                  value={price.toString()}
                  onChangeText={(price) => setPrice(Number(price))}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.text, { width: "40%" }]}>Brand:</Text>
                <TextInput
                  style={[styles.textInput, { width: "40%", margin: 1 }]}
                  mode="outlined"
                  value={brand}
                  onChangeText={(brand) => setBrand(brand)}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.text, { width: "40%" }]}>
                  Purchasing location:
                </Text>
                <TextInput
                  style={[styles.textInput, { width: "40%", margin: 1 }]}
                  mode="outlined"
                  value={location}
                  onChangeText={(location) => setLocation(location)}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.text, { width: "40%" }]}>
                  Ingredient ?
                </Text>
                <TextInput
                  style={[styles.textInput, { width: "40%", margin: 1 }]}
                  keyboardType="numeric"
                  mode="outlined"
                  value={isIngredient.toString()}
                  onChangeText={(isIngredient) =>
                    setIsIngredient(Number(isIngredient))
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  style={[
                    styles.button,
                    {
                      backgroundColor: colors.accent,
                      width: "80%",
                      padding: 5,
                      margin: 5,
                    },
                  ]}
                  icon="circle-edit-outline"
                  mode="contained"
                  dark={isDark}
                  onPress={() => updatePost(item.id)}
                >
                  Update Item
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        // Background Linear Gradient
        colors={[colors.backgroundTop, "transparent"]}
        style={styles.backgroundGradient}
      />
      {selected == 0 ? (
        <View
          style={{
            alignItems: "center",
            margin: 10,
          }}
        >
          {photoId == null || photoId == "" ? (
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
                uri: photoId,
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
            <Text style={[styles.text, { width: "40%" }]}>Name:</Text>
            <TextInput
              style={[styles.textInput, { width: "40%", margin: 1 }]}
              mode="outlined"
              value={name}
              onChangeText={(name) => setName(name)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.text, { width: "40%" }]}>
              Default purchase:
            </Text>
            <TextInput
              style={[styles.textInput, { width: "40%", margin: 1 }]}
              keyboardType="numeric"
              mode="outlined"
              value={defaultQuantity.toString()}
              onChangeText={(defaultQuantity) =>
                setDefaultQuantity(Number(defaultQuantity))
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.text, { width: "40%" }]}>
              Current quantity:
            </Text>
            <TextInput
              style={[styles.textInput, { width: "40%", margin: 1 }]}
              keyboardType="numeric"
              mode="outlined"
              value={quantity.toString()}
              onChangeText={(quantity) => setQuantity(Number(quantity))}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.text, { width: "40%" }]}>Alert quantity:</Text>
            <TextInput
              style={[styles.textInput, { width: "40%", margin: 1 }]}
              keyboardType="numeric"
              mode="outlined"
              value={alertQuantity.toString()}
              onChangeText={(alertQuantity) =>
                setAlertQuantity(Number(alertQuantity))
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.text, { width: "40%" }]}>Unit:</Text>
            <TextInput
              style={[styles.textInput, { width: "40%", margin: 1 }]}
              mode="outlined"
              value={unit}
              onChangeText={(unit) => setUnit(unit)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.text, { width: "40%" }]}>Latest price:</Text>
            <TextInput
              style={[styles.textInput, { width: "40%", margin: 1 }]}
              keyboardType="numeric"
              mode="outlined"
              value={price.toString()}
              onChangeText={(price) => setPrice(Number(price))}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.text, { width: "40%" }]}>Brand:</Text>
            <TextInput
              style={[styles.textInput, { width: "40%", margin: 1 }]}
              mode="outlined"
              value={brand}
              onChangeText={(brand) => setBrand(brand)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.text, { width: "40%" }]}>
              Purchasing location:
            </Text>
            <TextInput
              style={[styles.textInput, { width: "40%", margin: 1 }]}
              mode="outlined"
              value={location}
              onChangeText={(location) => setLocation(location)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={[styles.text, { width: "40%" }]}>Ingredient ?</Text>
            <TextInput
              style={[styles.textInput, { width: "40%", margin: 1 }]}
              keyboardType="numeric"
              mode="outlined"
              value={isIngredient.toString()}
              onChangeText={(isIngredient) =>
                setIsIngredient(Number(isIngredient))
              }
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              style={[
                styles.button,
                {
                  backgroundColor: colors.accent,
                  width: "80%",
                  padding: 5,
                  margin: 5,
                },
              ]}
              icon="playlist-plus"
              mode="contained"
              dark={isDark}
              onPress={() => addPost()}
            >
              Create Item
            </Button>
          </View>
        </View>
      ) : (
        <View></View>
      )}
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
