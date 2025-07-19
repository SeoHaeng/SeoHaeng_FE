import { Image, ScrollView, Text, View } from "react-native";

export default function Bookmark() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ alignItems: "center" }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        <Text
          style={{ fontSize: 13, color: "#716C69", fontFamily: "SUIT-500" }}
        >
          총 6개
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Image source={require("@/assets/images/filter.png")} />
          <Text
            style={{ fontSize: 13, color: "#716C69", fontFamily: "SUIT-500" }}
          >
            필터
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", gap: 5 }}>
        <View style={{ flexDirection: "column", gap: 5 }}>
          <Image source={require("@/assets/images/마루 목업.png")} />
          <Image source={require("@/assets/images/마루 목업.png")} />
          <Image source={require("@/assets/images/마루 목업.png")} />
          <Image source={require("@/assets/images/마루 목업.png")} />
          <Image source={require("@/assets/images/마루 목업.png")} />
          <Image source={require("@/assets/images/마루 목업.png")} />
        </View>
        <View style={{ flexDirection: "column", gap: 5, paddingTop: 50 }}>
          <Image source={require("@/assets/images/마루 목업.png")} />
          <Image source={require("@/assets/images/마루 목업.png")} />
          <Image source={require("@/assets/images/마루 목업.png")} />
        </View>
      </View>
    </ScrollView>
  );
}
