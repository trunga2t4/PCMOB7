import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RecipesScreen from "../screens/RecipesScreen";
import RecipeCreateScreen from "../screens/RecipeCreateScreen";
import RecipeAddItemScreen from "../screens/RecipeAddItemScreen";
import RecipeEditScreen from "../screens/RecipeEditScreen";
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
        name="Recipes"
        component={RecipesScreen}
        options={{ title: "My Recipes", ...headerOptions }}
      />
      <InnerStack.Screen
        name="RecipeCreate"
        component={RecipeCreateScreen}
        options={{ title: "Create Recipe", ...headerOptions }}
      />
      <InnerStack.Screen
        name="RecipeEdit"
        component={RecipeEditScreen}
        options={{ title: "Edit Recipe", ...headerOptions }}
      />
      <InnerStack.Screen
        name="RecipeAddItem"
        component={RecipeAddItemScreen}
        options={{ title: "Add Item to recipe", ...headerOptions }}
      />
    </InnerStack.Navigator>
  );
}
