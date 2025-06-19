import { Image, Text, View } from "react-native";

export default function Memory() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          width: 360,
          height: 85,
          backgroundColor: "#DBD6D3",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "#C5BFBB",
          paddingHorizontal: 15,
          paddingVertical: 20,
          flexDirection: "column",
          gap: 5,
          position: "relative",
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: "#716C69",
            fontFamily: "SUIT-500",
          }}
        >
          아직 책이 오지 않았어요
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: "#302E2D",
            fontFamily: "SUIT-700",
          }}
        >
          어떤 책이 올까요?
        </Text>
        <Image
          source={require("@/assets/images/empty_book.png")}
          style={{ position: "absolute", bottom: -2, right: 30 }}
        />
      </View>
    </View>
  );
}
