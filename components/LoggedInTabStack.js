import React, { useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ItemStack from "./ItemStack";
import AccountStack from "./AccountStack";
import CartStack from "./CartStack";
import RecipesStack from "./RecipesStack";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

export default function LoggedInStack() {
  const isDark = useSelector((state) => state.pref.isDark);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Cart") {
            iconName = "shopping-cart";
          } else if (route.name === "Recipes") {
            iconName = "cutlery";
          } else if (route.name === "Item") {
            iconName = "list";
          } else if (route.name === "Account") {
            iconName = "user-secret";
          }
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: isDark ? "yellow" : "yellow",
        inactiveTintColor: "gray",
        style: {
          backgroundColor: isDark ? "#2C1238" : "#7E4380",
        },
      }}
    >
      <Tab.Screen name="Cart" component={CartStack} />
      <Tab.Screen name="Recipes" component={RecipesStack} />
      <Tab.Screen name="Item" component={ItemStack} />
      <Tab.Screen name="Account" component={AccountStack} />
    </Tab.Navigator>
  );
}
