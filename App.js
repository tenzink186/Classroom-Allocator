
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider, useAuth } from "./src/context/AuthContext";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import ClassroomDetailsScreen from "./src/screens/ClassroomDetailsScreen";
import MapScreen from "./src/screens/MapScreen";
import AdminScreen from "./src/screens/AdminScreen";
import ProfileScreen from "./src/screens/ProfileScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>

        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "ClassFind" }}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "Create account" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "ClassFind" }}
            />

            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{ title: "Find a classroom" }}
            />

            <Stack.Screen
              name="Details"
              component={ClassroomDetailsScreen}
              options={{ title: "Classroom details" }}
            />

            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{ title: "Campus directions" }}
            />

            <Stack.Screen
              name="Admin"
              component={AdminScreen}
              options={{ title: "Classroom management" }}
            />

            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
