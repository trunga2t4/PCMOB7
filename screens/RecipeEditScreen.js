import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Image,
} from "react-native";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import axios from "axios";
import {
  API,
  API_WHOAMI,
  API_RECIPE_ITEM,
  API_RECIPES,
} from "../constants/API";
import { useSelector, useDispatch } from "react-redux";
import { Button, Text, TextInput } from "react-native-paper";
import { useTheme, Avatar, Title } from "react-native-paper";
import { commonStyles as styles } from "../styles/commonStyles";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  UIManager,
} from "react-native";
import { logOutAction } from "../redux/ducks/blogAuth";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} //Needs to be manually enabled for android

export default function RecipeEditScreen({ navigation, route }) {
  const recipe = route.params.item;
  const { dark, colors } = useTheme();
  const isDark = dark;
  const [user, setUser] = useState(null);
  const [recipeName, setRecipeName] = useState(route.params.item.name);
  const [photoId, setPhotoId] = useState(route.params.item.photoId);
  const [description, setDescription] = useState(route.params.item.description);

  const [posts, setPosts] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showItem, setShowItem] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [selected, setSellected] = useState(-1);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: null,
      headerRight: () => (
        <TouchableOpacity onPress={() => deleteRecipe()}>
          <FontAwesome
            name="trash"
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
      const response = await axios.get(API + API_RECIPE_ITEM, {
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

  async function updatePost(id) {
    const item = {
      quantity: quantity,
    };
    console.log("Updating " + id);
    try {
      const response = await axios.put(API + API_RECIPE_ITEM + `/${id}`, cart, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      setSellected(-1);
      setQuantity(0);
      getPosts();
    } catch (error) {
      console.log(error);
    }
  }

  function currentSelected({ item }) {
    if (selected == item.id) {
      setSellected(-1);
      setQuantity(0);
    } else {
      setSellected(item.id);
      setQuantity(item.quantity);
    }
  }

  async function deletePost(id) {
    console.log("Deleting " + id);
    try {
      const response = await axios.delete(API + API_RECIPE_ITEM + `/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      setPosts(posts.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    const response = await getPosts();
    setRefreshing(false);
  }

  async function deleteRecipe() {
    console.log("Deleting " + recipe.id);
    try {
      const response = await axios.delete(
        API + API_RECIPES + `/${route.params.item.id}`,
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      console.log(response);
      navigation.navigate("Recipes");
    } catch (error) {
      console.log(error);
    }
  }

  async function editRecipe() {
    //Keyboard.dismiss();
    const post = {
      name: recipeName,
      photoId: photoId,
      description: description,
    };
    try {
      const response = await axios.put(
        API + API_RECIPES + `/${route.params.item.id}`,
        post,
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      console.log(response);
      navigation.navigate("Recipes");
    } catch (error) {
      console.log(error);
    }
  }

  function renderItem({ item }) {
    if (item.recipeId != recipe.id) {
      return null;
    } else {
      return (
        <TouchableOpacity
          style={{
            padding: 5,
            paddingtop: 10,
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

                <Button
                  style={[styles.button100, { backgroundColor: colors.accent }]}
                  icon="playlist-check"
                  mode="contained"
                  dark={isDark}
                  onPress={() => updatePost(item.id)}
                >
                  Update
                </Button>
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          style={[
            styles.button33,
            { backgroundColor: colors.backgroundHeader },
          ]}
          icon="backspace"
          mode="contained"
          dark={isDark}
          onPress={() => navigation.navigate("Recipes")}
        >
          Back
        </Button>
        <Button
          style={[
            styles.button33,
            { backgroundColor: colors.backgroundHeader },
          ]}
          icon="pencil"
          mode="contained"
          dark={isDark}
          onPress={() => setShowItem(false)}
        >
          Show Info
        </Button>
        <Button
          style={[
            styles.button33,
            { backgroundColor: colors.backgroundHeader },
          ]}
          icon="playlist-edit"
          mode="contained"
          dark={isDark}
          onPress={() => setShowItem(true)}
        >
          Show Items
        </Button>
      </View>
      {!showItem ? (
        <View style={[styles.containerInput]}>
          {recipe.photoId == null || recipe.photoId == "" ? (
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
                uri: recipe.photoId,
              }}
            />
          )}
          <View style={styles.inputView}>
            <TextInput
              style={[
                styles.textInput,
                { height: 40, fontSize: 30, fontWeight: "bold" },
              ]}
              mode="outlined"
              placeholder="recipe name"
              value={recipeName}
              onChangeText={(recipeName) => setRecipeName(recipeName)}
            />
          </View>
          <View style={styles.inputView}>
            <TextInput
              style={[
                styles.textInput,
                {
                  height: 100,
                  fontSize: 16,
                  textAlign: "left",
                  multiline: "true",
                  textAlignVertical: "top",
                  numberOfLines: 10,
                },
              ]}
              mode="outlined"
              placeholder="description:"
              value={description}
              onChangeText={(description) => setDescription(description)}
            />
          </View>
          <Button
            style={[styles.button50, { backgroundColor: colors.accent }]}
            icon="noodles"
            mode="contained"
            dark={isDark}
            onPress={() => editRecipe()}
          >
            Edit
          </Button>
        </View>
      ) : (
        <View style={[{ alignItems: "center", width: "100%" }]}>
          <Button
            style={[
              styles.button100,
              { backgroundColor: colors.backgroundHeader },
            ]}
            icon="plus"
            mode="contained"
            dark={isDark}
            onPress={() => navigation.navigate("RecipeAddItem", { recipe })}
          >
            Add item
          </Button>
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
      )}
    </View>
  );
}
