import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface BookstoreBadgeProps {
  text?: string;
}

export default function BookstoreBadge({
  text = "독립서점",
}: BookstoreBadgeProps) {
  return (
    <View style={styles.badgeContainer}>
      <Image source={require("@/assets/images/bookStoreBadge.png")} />
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBD6D3",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginLeft: 3,
  },
});
