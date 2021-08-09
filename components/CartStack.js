import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CartScreen from "../screens/CartScreen";
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
        name="Cart"
        component={CartScreen}
        options={{
          title: "My Shopping Cart",
          ...headerOptions,
          headerLeft: null,
        }}
      />
    </InnerStack.Navigator>
  );
}
