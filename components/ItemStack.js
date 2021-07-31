import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import IndexScreen from "../screens/IndexScreen";
import CreateScreen from "../screens/CreateScreen";
import EditScreen from "../screens/EditScreen";
import { lightStyles } from "../styles/commonStyles";

const InnerStack = createStackNavigator();

export default function ItemStack() {
  const styles = lightStyles;
  const headerOptions = {
    headerStyle: styles.header,
    headerTitleStyle: styles.headerTitle,
    headerTintColor: styles.headerTint,
  };

  return (
    <InnerStack.Navigator>
      <InnerStack.Screen
        name="Index"
        component={IndexScreen}
        options={{ title: "Item List", ...headerOptions }}
      />
      <InnerStack.Screen
        name="Create"
        component={CreateScreen}
        options={{ title: "Create Item", ...headerOptions }}
      />
      <InnerStack.Screen
        name="Edit"
        component={EditScreen}
        options={{ title: "Edit Item", ...headerOptions }}
      />
    </InnerStack.Navigator>
  );
}
