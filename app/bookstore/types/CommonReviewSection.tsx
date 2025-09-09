import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CommonReviewSectionProps {
  placeId: number;
  placeName: string;
  reviewCount: number;
}

export default function CommonReviewSection({
  placeId,
  placeName,
  reviewCount,
}: CommonReviewSectionProps) {
  const router = useRouter();

  const handleReviewPress = () => {
    router.push(`/bookstore/${placeId}/review`);
  };

  return (
    <View style={styles.section}>
      <View style={styles.reviewHeader}>
        <Text style={styles.sectionTitle}>후기</Text>
        <TouchableOpacity
          onPress={handleReviewPress}
          style={styles.reviewButton}
        >
          <Text style={styles.reviewButtonText}>후기 보기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reviewSummary}>
        <Text style={styles.reviewCount}>
          총 {reviewCount}개의 후기가 있습니다.
        </Text>
        <Text style={styles.reviewHint}>후기를 확인하고 작성해보세요!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333333",
  },
  reviewButton: {
    backgroundColor: "#0066CC",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reviewButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  reviewSummary: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
  },
  reviewCount: {
    fontSize: 17,
    color: "#333333",
    marginBottom: 8,
  },
  reviewHint: {
    fontSize: 15,
    color: "#666666",
  },
});
