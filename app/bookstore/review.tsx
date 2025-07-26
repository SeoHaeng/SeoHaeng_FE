import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ReviewTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>서점 후기</Text>
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewerName}>책벌레123</Text>
          <Text style={styles.reviewDate}>2024.01.15</Text>
        </View>
        <Text style={styles.reviewText}>
          정말 아늑한 분위기의 서점이에요! 영화와 책을 동시에 즐길 수 있어서
          좋았습니다.
        </Text>
      </View>
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Text style={styles.reviewerName}>독서광</Text>
          <Text style={styles.reviewDate}>2024.01.10</Text>
        </View>
        <Text style={styles.reviewText}>
          북챌린지 이벤트도 진행하고 있어서 더욱 특별한 경험이었어요.
        </Text>
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
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3E0",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  reviewText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#000000",
    lineHeight: 20,
  },
});
