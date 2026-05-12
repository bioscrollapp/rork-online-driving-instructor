import { Tabs } from "expo-router";
import { Home, Dumbbell, PlayCircle, TrendingUp } from "lucide-react-native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Colors from "@/constants/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: "#B6B19E",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarBackground: () => <View style={styles.tabBg} />,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={24} strokeWidth={focused ? 2.8 : 2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="practice"
        options={{
          title: "Practice",
          tabBarIcon: ({ color, focused }) => (
            <Dumbbell color={color} size={24} strokeWidth={focused ? 2.8 : 2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: "Videos",
          tabBarIcon: ({ color, focused }) => (
            <PlayCircle color={color} size={24} strokeWidth={focused ? 2.8 : 2.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ color, focused }) => (
            <TrendingUp color={color} size={24} strokeWidth={focused ? 2.8 : 2.2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    borderTopWidth: 0,
    backgroundColor: "transparent",
    elevation: 0,
    height: Platform.select({ ios: 88, android: 72, default: 72 }),
    paddingTop: 8,
  },
  tabBg: {
    flex: 1,
    backgroundColor: Colors.warmWhite,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginTop: 3,
  },
  tabItem: {
    paddingVertical: 4,
  },
});
