import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Camera } from "expo-camera";
import { FontAwesome } from "@expo/vector-icons";
import { lightStyles } from "../styles/commonStyles";

export default function CameraScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Text>Camera Screen</Text>
    </View>
  );
}
