import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from 'react-native';
export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" animated/>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#716C69",
          headerShown: false,
          tabBarStyle: {
            padding: 0,
          }
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
