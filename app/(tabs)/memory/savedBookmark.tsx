import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SavedBookmark() {
  return (
    <View style={styles.container}>
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>저장 책갈피</Text>
        <Text style={styles.emptySubtext}>아직 저장된 책갈피가 없습니다.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
    fontFamily: "SUIT-700",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "SUIT-500",
  },
});
