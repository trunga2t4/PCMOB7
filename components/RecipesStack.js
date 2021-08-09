import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RecipesScreen from "../screens/RecipesScreen";
import RecipeCreateScreen from "../screens/RecipeCreateScreen";
import RecipeAddItemScreen from "../screens/RecipeAddItemScreen";
import RecipeEditScreen from "../screens/RecipeEditScreen";
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
        name="Recipes"
        component={RecipesScreen}
        options={{ title: "My Recipes", headerLeft: null, ...headerOptions }}
      />
      <InnerStack.Screen
        name="RecipeCreate"
        component={RecipeCreateScreen}
        options={{ title: "Create Recipe", headerLeft: null, ...headerOptions }}
      />
      <InnerStack.Screen
        name="RecipeEdit"
        component={RecipeEditScreen}
        options={{ title: "Edit Recipe", headerLeft: null, ...headerOptions }}
      />
      <InnerStack.Screen
        name="RecipeAddItem"
        component={RecipeAddItemScreen}
        options={{
          title: "Add Item to recipe",
          headerLeft: null,
          headerRight: null,
          ...headerOptions,
        }}
      />
    </InnerStack.Navigator>
  );
}
