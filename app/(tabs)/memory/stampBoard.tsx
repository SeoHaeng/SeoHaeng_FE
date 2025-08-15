import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface Stamp {
  id: number;
  city: string;
  date: string;
  collected: boolean;
  image: any;
}

interface StampBoardProps {
  stamps: Stamp[];
}

export default function StampBoard({ stamps }: StampBoardProps) {
  const renderStamp = (stamp: Stamp) => {
    if (stamp.collected) {
      return (
        <View key={stamp.id} style={styles.stampItem}>
          <View style={styles.stampImageContainer}>
            <Image
              source={require("@/assets/images/stamp_basic.png")}
              style={styles.stampImage}
            />

            <View style={styles.stampOverlay}>
              <Text style={styles.stampCity}>{stamp.city}</Text>
              <Text style={styles.stampDate}>{stamp.date}</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View key={stamp.id} style={styles.stampItem}>
          <View style={styles.emptyStamp}>
            <Image source={require("@/assets/images/stamp_basic.png")} />
          </View>
        </View>
      );
    }
  };

  return <View style={styles.stampGrid}>{stamps.map(renderStamp)}</View>;
}

const styles = StyleSheet.create({
  stampGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  stampItem: {
    width: 115,
    aspectRatio: 1,
    marginBottom: 7,
  },
  stampImageContainer: {
    flex: 1,
    borderRadius: 5,
    overflow: "hidden",
    position: "relative",
  },
  stampImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  stampEmoji: {
    fontSize: 24,
  },
  stampOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  stampCity: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "SUIT-600",
    marginBottom: 2,
    textAlign: "center",
  },
  stampDate: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "SUIT-400",
    textAlign: "center",
  },
  emptyStamp: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
});
