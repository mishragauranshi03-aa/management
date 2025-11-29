import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider as PaperProvider } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthProvider } from "./src/context/AuthContext";

// Screens
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import AdminDashboard from "./src/screens/AdminDashboard";
import EmployeeDashboard from "./src/screens/EmployeeDashboards";
import ManageEmployees from "./src/screens/ManageEmployees";
import ManageTasks from "./src/screens/ManageTasks";

const Stack = createStackNavigator();

export default function App() {
  const [initialState, setInitialState] = useState();
  const [isReady, setIsReady] = useState(false);

  //  Restore navigation state if available
  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem("NAVIGATION_STATE");
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;
        if (state !== undefined) {
          setInitialState(state);
        }
      } catch (e) {
        console.log("Failed to load navigation state", e);
      }
      setIsReady(true);
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return null; //  yahan aap splash ya loader bhi laga sakte ho
  }

  return (
    <AuthProvider>
      <PaperProvider>
        <NavigationContainer
          initialState={initialState}
          onStateChange={
            (state) =>
              AsyncStorage.setItem("NAVIGATION_STATE", JSON.stringify(state)) //  Save navigation state
          }
        >
          {/* <ScrollView contentContainerStyle={styles.scrollContainer}> */}
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{ headerShown: false }}
            >
              {/* Header hidden (jaise pehle tha) */}
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
              <Stack.Screen
                name="EmployeeDashboard"
                component={EmployeeDashboard}
              />

              {/* Sirf in do pages me header + back button enable */}
              <Stack.Screen
                name="ManageEmployees"
                component={ManageEmployees}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="ManageTasks"
                component={ManageTasks}
                options={{ headerShown: true }}
              />
            </Stack.Navigator>
          {/* </ScrollView> */}
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider> 
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#e8f0fe",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100, // space for scroll end
  }});