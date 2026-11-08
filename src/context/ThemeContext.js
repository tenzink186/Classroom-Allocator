
import React, {
  createContext,
  useContext,
  useMemo,
} from "react";

import { useColorScheme } from "react-native";

import {
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";

const ThemeContext = createContext(null);

const lightColors = {
  mode: "light",

  // Main backgrounds
  background: "#F8F9FA",
  card: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceMuted: "#F1F5F9",

  // Primary colours
  primary: "#2563EB",
  primaryDark: "#1D4ED8",

  // Typography
  text: "#1A202C",
  secondaryText: "#718096",
  mutedText: "#64748B",
  placeholder: "#94A3B8",

  // Borders and inputs
  border: "#E2E8F0",
  inputBackground: "#FFFFFF",

  // Icons
  icon: "#2563EB",

  // Status colours
  success: "#0D9488",
  danger: "#E53E3E",
  warning: "#D97706",

  // Navigation
  tabBar: "#FFFFFF",

  // Additional surfaces
  secondarySurface: "#EBF8FF",
  accentSurface: "#FAF5FF",

  // Availability
  availableBackground: "#E6FFFA",
  availableText: "#0D9488",

  // Capacity warning
  warningBackground: "#FFFAF0",
  warningText: "#D97706",

  // Conflict
  conflictBackground: "#FFF5F5",
  conflictText: "#E53E3E",

  // Departments
  departmentABackground: "#EBF8FF",
  departmentA: "#2563EB",

  departmentBBackground: "#FAF5FF",
  departmentB: "#7C3AED",

  statusBar: "dark-content",
};

const darkColors = {
  mode: "dark",

  // Main backgrounds
  background: "#0F1115",
  card: "#1A1D24",
  surface: "#1A1D24",
  surfaceMuted: "#2D323F",

  // Primary colours
  primary: "#60A5FA",
  primaryDark: "#3B82F6",

  // Typography
  text: "#F1F5F9",
  secondaryText: "#94A3B8",
  mutedText: "#CBD5E1",
  placeholder: "#64748B",

  // Borders and inputs
  border: "#2D323F",
  inputBackground: "#1A1D24",

  // Icons
  icon: "#60A5FA",

  // Status colours
  success: "#34D399",
  danger: "#FCA5A5",
  warning: "#FBBF24",

  // Navigation
  tabBar: "#1A1D24",

  // Additional surfaces
  secondarySurface: "#172554",
  accentSurface: "#2E1065",

  // Availability
  availableBackground: "#064E3B",
  availableText: "#34D399",

  // Capacity warning
  warningBackground: "#451A03",
  warningText: "#FBBF24",

  // Conflict
  conflictBackground: "#7F1D1D",
  conflictText: "#FCA5A5",

  // Departments
  departmentABackground: "#172554",
  departmentA: "#60A5FA",

  departmentBBackground: "#2E1065",
  departmentB: "#C084FC",

  statusBar: "light",
};

export function ThemeProvider({ children }) {

  // Automatically follow device appearance
  const systemColorScheme = useColorScheme();

  const isDark = systemColorScheme === "dark";

  const value = useMemo(() => {

    const colors = isDark ? darkColors : lightColors;

    const base = isDark ? DarkTheme : DefaultTheme;

    return {
      colors,
      isDark,

      navigationTheme: {
        ...base,

        colors: {
          ...base.colors,

          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.primary,
        },
      },
    };

  }, [isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {

  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "ThemeProvider is not wrapping this component"
    );
  }

  return context;
}
