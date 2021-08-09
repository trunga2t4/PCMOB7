import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import CameraScreen from "../screens/CameraScreen";

import { commonStyles } from "../styles/commonStyles";
import { useTheme } from "react-native-paper";

const InnerStack = createStackNavigator();

export default function AccountStack() {
  const { colors } = useTheme();
  const styles = { ...commonStyles };
  const headerOptions = {
    headerStyle: [styles.header, { backgroundColor: colors.backgroundHeader }],
    headerTitleStyle: [styles.headerTitle, { color: colors.primaryVariant }],
    headerTintColor: colors.primaryVariant,
  };

  return (
    <InnerStack.Navigator>
      <InnerStack.Screen
        component={AccountScreen}
        name="Account"
        options={{
          title: "My Account",
          ...headerOptions,
        }}
      />
      <InnerStack.Screen
        component={CameraScreen}
        name="Camera"
        options={{
          title: "Take a photo",
          ...headerOptions,
        }}
      />
    </InnerStack.Navigator>
  );
}
