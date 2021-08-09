import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView, Keyboard } from "react-native";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import axios from "axios";
import {
  API,
  API_WHOAMI,
  API_USERS,
  API_CREATE_RECIPE,
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
  Image,
} from "react-native";
import { logOutAction } from "../redux/ducks/blogAuth";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
} //Needs to be manually enabled for android

export default function RecipeCreateScreen({ navigation, route }) {
  const { dark, colors } = useTheme();
  const isDark = dark;
  const [recipeName, setRecipeName] = useState("");
  const [photoId, setPhotoId] = useState(null);
  const [description, setDescription] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  async function createRecipe() {
    //Keyboard.dismiss();
    const post = {
      name: recipeName,
      photoId: photoId,
      description: description,
    };
    try {
      const response = await axios.post(API + API_CREATE_RECIPE, post, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      navigation.navigate("Recipes");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.backgroundTop, "transparent"]}
        style={styles.backgroundGradient}
      />
      <View style={[styles.containerInput]}>
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
        <Text style={[styles.title, { marginTop: 20 }]}>New Recipe</Text>
        <View style={styles.inputView}>
          <TextInput
            style={[styles.textInput, { height: 45 }]}
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
                height: 200,
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            style={[styles.button50, { backgroundColor: colors.accent }]}
            icon="backspace"
            mode="contained"
            dark={isDark}
            onPress={() => navigation.navigate("Recipes")}
          >
            Back
          </Button>
          <Button
            style={[styles.button50, { backgroundColor: colors.accent }]}
            icon="noodles"
            mode="contained"
            dark={isDark}
            onPress={() => createRecipe()}
          >
            Create Recipe
          </Button>
        </View>
      </View>
    </View>
  );
}
