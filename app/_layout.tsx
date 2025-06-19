import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "SUIT-400": require("@/assets/fonts/SUIT-Regular.ttf"),
    "SUIT-500": require("@/assets/fonts/SUIT-Medium.ttf"),
    "SUIT-600": require("@/assets/fonts/SUIT-SemiBold.ttf"),
    "SUIT-700": require("@/assets/fonts/SUIT-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" animated />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#716C69",
          headerShown: false,
          tabBarStyle: {
            padding: 0,
          },
          tabBarLabelStyle: {
            fontFamily: "SUIT-500",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "홈",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="milestone"
          options={{
            title: "이정표",
            tabBarIcon: ({ color }) => (
              <Ionicons name="flag" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="maru"
          options={{
            title: "마루",
            tabBarIcon: ({ color }) => (
              <Ionicons name="book" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="preference"
          options={{
            title: "취향길목",
            tabBarIcon: ({ color }) => (
              <Ionicons name="heart" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="memory"
          options={{
            title: "기억마당",
            tabBarIcon: ({ color }) => (
              <Ionicons name="images" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
