// app/maru/popularity/[id].tsx
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookstoreDetail() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        position: "relative",
      }}
    >
      <View
        style={{
          height: 70,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          source={require("@/assets/images/Back.png")}
          style={{ position: "absolute", left: 20, zIndex: 1 }}
        />
        <Text style={{ fontSize: 15 }}>북챌린지 서점</Text>
      </View>
      <Image source={require("@/assets/images/서점.png")} />
      <View style={{ padding: 20, flexDirection: "column", gap: 10 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Text style={{ fontSize: 17 }}>이스트씨네</Text>
            <Image source={require("@/assets/images/독립서점.png")} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image source={require("@/assets/images/FilledHeart.png")} />
            <Image source={require("@/assets/images/Share.png")} />
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text>리뷰</Text>
            <Text style={{ color: "#9D9896" }}>212</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <Image source={require("@/assets/images/Star.png")} />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Text>4.2</Text>
              <Image
                source={require("@/assets/images/서점 리뷰 더보기 화살표.png")}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
