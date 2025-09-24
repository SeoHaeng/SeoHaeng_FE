import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" animated />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#262423",
          tabBarInactiveTintColor: "#C5BFBB",
          headerShown: false,
          tabBarLabelStyle: {
            fontFamily: "SUIT-500",
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "홈",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="home-filled" size={28} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="milestone"
          options={{
            title: "이정표",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="location-dot" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="maru"
          options={{
            title: "마루",
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbox-ellipses" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="preference"
          options={{
            title: "취향길목",
            tabBarIcon: ({ color }) => (
              <FontAwesome6 name="signs-post" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="memory"
          options={{
            title: "기억마당",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="bookmark-multiple"
                size={22}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
