import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView, Image } from "react-native";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import axios from "axios";
import { API, API_WHOAMI, API_USERS, API_SIGNUP } from "../constants/API";
import { useSelector, useDispatch } from "react-redux";
import { Button, Text, TextInput } from "react-native-paper";
import { useTheme, Avatar, Title } from "react-native-paper";
import { commonStyles as styles } from "../styles/commonStyles";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { logOutAction } from "../redux/ducks/blogAuth";

export default function AccountScreen({ navigation }) {
  const { dark, colors } = useTheme();
  const isDark = dark;
  const action = {
    viewInfo: 0,
    editInfo: 1,
    editPass: 2,
    createUser: 3,
    viewUsers: 4,
  };

  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [alias, setAlias] = useState("");
  const [photoId, setPhotoId] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [option, setOption] = useState(0);
  const [errorText, setErrorText] = useState("");
  const [infoText, setInfoText] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  async function onRefresh() {
    setRefreshing(true);
    const response = await getUser();
    setRefreshing(false);
  }

  async function getUser() {
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response.data);
      setUser(response.data);
      if (option == action.viewInfo) {
        setAlias(response.data.alias);
        setPhotoId(response.data.photoId);
      } else {
        setAlias("");
        setPhotoId("");
      }
      try {
        const response2 = await axios.get(API + API_USERS, {
          headers: { Authorization: `JWT ${token}` },
        });
        setUsers(response2.data);
      } catch (error) {
        console.log(error.response.data);
      }
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
    }
  }

  function signOut() {
    dispatch({ ...logOutAction() });
    navigation.navigate("SignIn");
  }

  async function deleteUser(id) {
    console.log("Deleting user " + id);
    try {
      const response = await axios.delete(API + API_USERS + `/${id}`, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      setUsers(users.filter((item) => item.id !== id));
    } catch (error) {
      console.log(error);
    }
    setAlias(user.alias);
    setPhotoId(user.photoId);
    setOption(action.viewInfo);
    setOldPassword("");
    setPassword("");
    setPassword2("");
    setInfoText("");
    setErrorText("");
  }

  function viewUser() {
    setAlias(user.alias);
    setPhotoId(user.photoId);
    setOption(action.viewInfo);
    setOldPassword("");
    setPassword("");
    setPassword2("");
    setInfoText("");
    setErrorText("");
  }

  function viewUsers() {
    setAlias(user.alias);
    setPhotoId(user.photoId);
    setOption(action.viewUsers);
    setOldPassword("");
    setPassword("");
    setPassword2("");
    setInfoText("");
    setErrorText("");
  }

  function editUser() {
    setAlias(user.alias);
    setPhotoId(user.photoId);
    setOption(action.editInfo);
    setOldPassword("");
    setPassword("");
    setPassword2("");
    setInfoText("");
    setErrorText("");
  }

  async function updateUser() {
    const post = {
      alias: alias,
      photoId: photoId,
    };
    setOldPassword("");
    setPassword("");
    setPassword2("");
    console.log("Updating user ", username);
    try {
      const response = await axios.put(API + API_USERS + `/${user.id}`, post, {
        headers: { Authorization: `JWT ${token}` },
      });
      console.log(response);
      getUser();
      setOption(action.viewInfo);
      setInfoText("Info updated");
    } catch (error) {
      console.log(error);
      setErrorText("Updating info failed");
    }
  }

  function editPassword() {
    setAlias(user.alias);
    setPhotoId(user.photoId);
    setOption(action.editPass);
    setOldPassword("");
    setPassword("");
    setPassword2("");
    setInfoText("");
    setErrorText("");
  }

  async function updatePasword() {
    const post = {
      oldPassword: oldPassword,
      password: password,
    };
    setOldPassword("");
    console.log("Updating user's password ", username);
    if (password != "" && password == password2) {
      setPassword("");
      setPassword2("");
      try {
        const response = await axios.put(
          API + API_USERS + `/${user.id}`,
          post,
          {
            headers: { Authorization: `JWT ${token}` },
          }
        );
        console.log(response);
        getUser();
        setOption(action.viewInfo);
        setInfoText("Password updated");
      } catch (error) {
        console.log(error);
        setErrorText("Updating password failed");
      }
    } else {
      setPassword("");
      setPassword2("");
      setErrorText("passwords mismatched");
    }
  }

  async function newUser() {
    setAlias("");
    setPhotoId("");
    setOption(action.createUser);
    setOldPassword("");
    setPassword("");
    setPassword2("");
    setInfoText("");
    setErrorText("");
  }

  async function createNewUser() {
    const post = {
      username: username,
      password: password,
      alias: alias,
      photoId: photoId,
    };
    console.log("creating new user: ", username);
    if (password != "" && password == password2) {
      setPassword("");
      setPassword2("");
      try {
        const response = await axios.post(API + API_SIGNUP, post, {
          headers: { Authorization: `JWT ${token}` },
        });
        console.log(response);
        getUser();
        setOldPassword("");
        setPassword("");
        setPassword2("");
        setErrorText("");
        setOption(action.viewInfo);
        setInfoText("user", username, "created with password", password);
      } catch (error) {
        console.log(error);
        setInfoText("");
        setErrorText("creating user failed");
      }
    } else {
      setInfoText("");
      setErrorText("passwords mismatched");
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerLeft: null,
      headerRight: () => (
        <TouchableOpacity onPress={signOut}>
          <FontAwesome
            name="sign-out"
            size={24}
            style={{ color: colors.primaryVariant, marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  });
  useEffect(() => {
    console.log("Setting up nav listener");
    const removeListener = navigation.addListener("focus", () => {
      console.log("Running nav listener");
      setUser(<ActivityIndicator />);
      getUser();
    });
    getUser();
    return removeListener;
  }, []);

  function renderItem({ item }) {
    return (
      <View
        style={{
          padding: 10,
          paddingtop: 20,
          borderBottomColor: colors.onBackground,
          borderBottomWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "transparent",
        }}
      >
        <Text style={[styles.text, { width: "30%" }]}>{item.username}</Text>
        <Text style={[styles.boldText, { width: "60%" }]}>{item.alias} </Text>
        <TouchableOpacity onPress={() => deleteUser(item.id)}>
          <FontAwesome name="trash" size={20} color="#a80000" />
        </TouchableOpacity>
      </View>
    );
  }

  return !user ? (
    <View>
      <Text>"Loading"</Text>
    </View>
  ) : (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.backgroundTop, "transparent"]}
        style={styles.backgroundGradient}
      />
      <Button
        style={[styles.button100, { backgroundColor: colors.backgroundHeader }]}
        icon="eye"
        mode="contained"
        dark={isDark}
        onPress={() => viewUser()}
      >
        Show Info
      </Button>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          style={[
            styles.button50,
            { backgroundColor: colors.backgroundHeader },
          ]}
          icon="account-edit"
          mode="contained"
          dark={isDark}
          onPress={() => editUser()}
        >
          Update Info
        </Button>
        <Button
          style={[
            styles.button50,
            { backgroundColor: colors.backgroundHeader },
          ]}
          icon="lock-reset"
          mode="contained"
          dark={isDark}
          onPress={() => editPassword()}
        >
          Change Password
        </Button>
      </View>
      {user.isAdmin ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            style={[
              styles.button50,
              { backgroundColor: colors.backgroundHeader },
            ]}
            icon="account-plus"
            mode="contained"
            dark={isDark}
            onPress={() => newUser()}
          >
            New user (Admin)
          </Button>
          <Button
            style={[
              styles.button50,
              { backgroundColor: colors.backgroundHeader },
            ]}
            icon="account-multiple"
            mode="contained"
            dark={isDark}
            onPress={() => viewUsers()}
          >
            All users (Admin)
          </Button>
        </View>
      ) : (
        <View></View>
      )}
      <View style={[{ alignItems: "center", width: "90%" }]}>
        {option == action.viewInfo ? (
          <View style={[styles.containerInput]}>
            {user.photoId == null || user.photoId == "" ? (
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
                  uri: user.photoId,
                }}
              />
            )}

            <Title style={[styles.title, { paddingBottom: 5 }]}>{alias}</Title>
            <Text style={[styles.text, { textAlign: "center" }]}>
              Role: {user.isAdmin ? "Admin" : "User"}
            </Text>
            <Text style={[styles.text, { textAlign: "center" }]}>
              Login Id: {user.username}
            </Text>
          </View>
        ) : (
          <View></View>
        )}

        {option == action.editInfo ? (
          <View style={[styles.containerInput]}>
            {user.photoId == null || user.photoId == "" ? (
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
                  uri: user.photoId,
                }}
              />
            )}

            <View style={styles.inputView}>
              <TextInput
                style={[styles.textInput, { height: 45 }]}
                mode="outlined"
                placeholder="Alias:"
                value={alias}
                onChangeText={(alias) => setAlias(alias)}
              />
            </View>
            <Button
              style={[styles.button100, { backgroundColor: colors.accent }]}
              icon="account-edit"
              mode="contained"
              dark={isDark}
              onPress={() => updateUser()}
            >
              Update Your Info
            </Button>
          </View>
        ) : (
          <View></View>
        )}
        {option == action.editPass ? (
          <View style={[styles.containerInput]}>
            {user.photoId == null || user.photoId == "" ? (
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
                  uri: user.photoId,
                }}
              />
            )}

            <View style={styles.inputView}>
              <TextInput
                style={[styles.textInput, { height: 45 }]}
                mode="outlined"
                placeholder="Old password:"
                secureTextEntry={true}
                value={oldPassword}
                onChangeText={(pw) => setOldPassword(pw)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={[styles.textInput, { height: 45 }]}
                mode="outlined"
                placeholder="New password:"
                secureTextEntry={true}
                value={password}
                onChangeText={(pw) => setPassword(pw)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={[styles.textInput, { height: 45 }]}
                mode="outlined"
                placeholder="Repeat new password:"
                secureTextEntry={true}
                value={password2}
                onChangeText={(pw) => setPassword2(pw)}
              />
            </View>
            <Button
              style={[styles.button100, { backgroundColor: colors.accent }]}
              icon="lock-reset"
              mode="contained"
              dark={isDark}
              onPress={() => updatePasword()}
            >
              Change your password
            </Button>
          </View>
        ) : (
          <View></View>
        )}
        {option == action.createUser ? (
          <View style={[styles.containerInput]}>
            <View
              style={{
                alignItems: "center",
                margin: 10,
              }}
            >
              {user.photoId == null || user.photoId == "" ? (
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
                    uri: user.photoId,
                  }}
                />
              )}
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={[styles.textInput, { height: 45 }]}
                mode="outlined"
                placeholder="Username"
                value={username}
                onChangeText={(username) => setUsername(username)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={[styles.textInput, { height: 45 }]}
                mode="outlined"
                placeholder="Alias:"
                value={alias}
                onChangeText={(alias) => setAlias(alias)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={[styles.textInput, { height: 45 }]}
                mode="outlined"
                placeholder="New password:"
                secureTextEntry={true}
                value={password}
                onChangeText={(pw) => setPassword(pw)}
              />
            </View>
            <View style={styles.inputView}>
              <TextInput
                style={[styles.textInput, { height: 45 }]}
                mode="outlined"
                placeholder="Repeat new password:"
                secureTextEntry={true}
                value={password2}
                onChangeText={(pw) => setPassword2(pw)}
              />
            </View>
            <Button
              style={[styles.button100, { backgroundColor: colors.accent }]}
              icon="account-plus"
              mode="contained"
              dark={isDark}
              onPress={() => createNewUser()}
            >
              Create User
            </Button>
          </View>
        ) : (
          <View></View>
        )}

        {option == action.viewUsers ? (
          <View>
            <Title style={[styles.title, { paddingBottom: 5 }]}>
              All Users
            </Title>
            <FlatList
              data={users}
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
        ) : (
          <View></View>
        )}
        <Text style={styles.errorText}>{errorText}</Text>
        <Text style={styles.text}>{infoText}</Text>
      </View>
    </View>
  );
}
