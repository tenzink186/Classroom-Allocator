
import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import BuildingsScreen from "./src/screens/BuildingsScreen";
import BuildingClassroomsScreen from "./src/screens/BuildingClassroomsScreen";
import ClassroomDetailsScreen from "./src/screens/ClassroomDetailsScreen";
import MapScreen from "./src/screens/MapScreen";
import AdminScreen from "./src/screens/AdminScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { user, loading } = useAuth();
  const { navigationTheme, isDark, colors } = useTheme();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
    <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.background} />
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator>

        {!user ? (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "" }}
            />

            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ title: "" }}
            />
          </>
        ) : (
          <>
            {/* Home Screen */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: "" }}
            />

            {/* Search Screen */}
            <Stack.Screen
              name="Search"
              component={SearchScreen}
              options={{ title: "" }}
            />

            {/* Buildings Screen */}
            <Stack.Screen
              name="Buildings"
              component={BuildingsScreen}
              options={{ title: "" }}
            />

            {/* Building Classrooms Screen */}
            <Stack.Screen
              name="BuildingClassrooms"
              component={BuildingClassroomsScreen}
              options={{ title: "" }}
            />

            {/* Classroom Details Screen */}
            <Stack.Screen
              name="Details"
              component={ClassroomDetailsScreen}
              options={{ title: "" }}
            />

            {/* Campus Map */}
            <Stack.Screen
              name="Map"
              component={MapScreen}
              options={{ title: "" }}
            />

            {/* Admin Screen */}
            <Stack.Screen
              name="Admin"
              component={AdminScreen}
              options={{ title: "" }}
            />

            {/* Profile Screen */}
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />

            {/* Edit Profile Screen */}
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ headerShown: false }}
            />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
