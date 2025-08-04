import IndependentBookstoreIcon from "@/components/icons/IndependentBookstoreIcon";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BookstoreBadgeProps {
  text?: string;
}

export default function BookstoreBadge({
  text = "독립서점",
}: BookstoreBadgeProps) {
  return (
    <View style={styles.badgeContainer}>
      <IndependentBookstoreIcon width={10} height={10} />
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBD6D3",
    borderRadius: 5,
    paddingHorizontal: 3,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginLeft: 3,
  },
});
