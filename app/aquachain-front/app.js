"use client";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { AppRegistry } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Context
import { LanguageProvider } from "./LanguageContext";

// Screens
import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import ReportScreen from "./screens/ReportScreen";
import SavedReportsScreen from "./screens/SavedReportsScreen";
import ProjectSelectionScreen from "./ProjectSelectionScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="ProjectSelection"
              component={ProjectSelectionScreen}
            />
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Report" component={ReportScreen} />
            <Stack.Screen name="SavedReports" component={SavedReportsScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}

// App Registry
AppRegistry.registerComponent("main", () => App);