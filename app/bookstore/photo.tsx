import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function PhotoTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>서점 사진</Text>
      <View style={styles.photoGrid}>
        <Image
          source={require("@/assets/images/서점.png")}
          style={styles.photoItem}
        />
        <Image
          source={require("@/assets/images/독립서점.png")}
          style={styles.photoItem}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    minHeight: 400,
  },
  tabTitle: {
    fontSize: 13,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 15,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoItem: {
    width: "48%",
    height: 150,
    borderRadius: 8,
  },
});
