import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LikedPlaces() {
  // 예시 데이터
  const places = [
    {
      id: 1,
      name: "한낮의 바다 독립서점",
      rating: 4.2,
      reviewCount: 103,
      distance: "1.2 km",
      address: "양양시 금하로 760, 지상 1층",
      image: require("@/assets/images/독립서점.png"),
    },
    {
      id: 2,
      name: "한낮의 바다 독립서점",
      rating: 4.2,
      reviewCount: 103,
      distance: "1.2 km",
      address: "양양시 금하로 760, 지상 1층",
      image: require("@/assets/images/독립서점.png"),
    },
  ];

  const renderPlaceItem = (place: any) => (
    <View key={place.id} style={styles.placeItem}>
      <View style={styles.placeImageContainer}>
        <Image source={place.image} style={styles.placeImage} />
        <TouchableOpacity style={styles.bookmarkIcon}>
          <Text style={styles.bookmarkText}>🔖</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.placeInfo}>
        <Text style={styles.placeName}>{place.name}</Text>

        <View style={styles.ratingContainer}>
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.ratingText}>
            {place.rating}({place.reviewCount})
          </Text>
          <Text style={styles.distanceText}>{place.distance}</Text>
        </View>

        <View style={styles.addressContainer}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.addressText}>{place.address}</Text>
        </View>

        <TouchableOpacity style={styles.likedButton}>
          <Text style={styles.likedButtonText}>찜한 장소</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.countContainer}>
        <Text style={styles.countText}>총 {places.length}개</Text>
      </View>

      {places.map(renderPlaceItem)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  countContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  countText: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "SUIT-500",
  },
  placeItem: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  placeImageContainer: {
    position: "relative",
    marginRight: 15,
  },
  placeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  bookmarkIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  bookmarkText: {
    fontSize: 12,
  },
  placeInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  placeName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 5,
    fontFamily: "SUIT-700",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  starIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    color: "#666666",
    marginRight: 8,
    fontFamily: "SUIT-500",
  },
  distanceText: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "SUIT-500",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  addressText: {
    fontSize: 12,
    color: "#999999",
    flex: 1,
    fontFamily: "SUIT-400",
  },
  likedButton: {
    alignSelf: "flex-end",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  likedButtonText: {
    fontSize: 12,
    color: "#666666",
    fontFamily: "SUIT-500",
  },
});
