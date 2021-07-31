import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CartScreen from "../screens/CartScreen";
import CartEditScreen from "../screens/CartEditScreen";
import { commonStyles, darkStyles, lightStyles } from "../styles/commonStyles";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";

const InnerStack = createStackNavigator();

export default function ItemStack() {
  const isDark = useSelector((state) => state.pref.isDark);
  const styles = { ...commonStyles, ...(isDark ? darkStyles : lightStyles) };
  const headerOptions = {
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: styles.headerTint,
  };

  return (
    <InnerStack.Navigator>
      <InnerStack.Screen
        name="Cart"
        component={CartScreen}
        options={{ title: "My Shopping Cart", ...headerOptions }}
      />
      <InnerStack.Screen
        name="CartEdit"
        component={CartEditScreen}
        options={{ title: "Edit Cart Item", ...headerOptions }}
      />
    </InnerStack.Navigator>
  );
}
