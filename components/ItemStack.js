import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import IndexScreen from "../screens/IndexScreen";
import { commonStyles as styles } from "../styles/commonStyles";
import { useTheme } from "react-native-paper";

const InnerStack = createStackNavigator();

export default function ItemStack() {
  const { colors } = useTheme();
  const headerOptions = {
    headerStyle: [styles.header, { backgroundColor: colors.backgroundHeader }],
    headerTitleStyle: [styles.headerTitle, { color: colors.primaryVariant }],
    headerTintColor: colors.primaryVariant,
  };

  return (
    <InnerStack.Navigator>
      <InnerStack.Screen
        name="Index"
        component={IndexScreen}
        options={{ title: "Item List", ...headerOptions }}
      />
    </InnerStack.Navigator>
  );
}
