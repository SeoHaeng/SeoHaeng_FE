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
      name: "한낮의 바다",
      type: "독립서점",
      rating: 4.2,
      reviewCount: 103,
      distance: "1.2 km",
      address: "양양시 금하로 760, 지상 1층",
      image: require("@/assets/images/독립서점.png"),
    },
    {
      id: 2,
      name: "한낮의 바다",
      type: "독립서점",
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
      </View>

      <View style={styles.placeInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.placeType}>{place.type}</Text>
        </View>
        <Image
          source={require("@/assets/images/scrap.png")}
          style={styles.scrapIcon}
        />

        <View style={styles.ratingContainer}>
          <Image
            source={require("@/assets/images/Star.png")}
            style={styles.starIcon}
          />
          <Text style={styles.ratingText}>{place.rating}</Text>
          <Text style={styles.reviewCountText}>({place.reviewCount})</Text>
          <Text style={styles.distanceText}>{place.distance}</Text>
        </View>

        <View style={styles.addressContainer}>
          <Image source={require("@/assets/images/place.png")} />
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
    paddingHorizontal: 10,
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
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderRadius: 5,
    marginBottom: 10,
  },
  placeImageContainer: {
    position: "relative",
    marginRight: 15,
  },
  placeImage: {
    width: 101,
    height: 101,
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
    paddingVertical: 3,
    height: 101,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  placeName: {
    fontSize: 17,
    color: "#262423",
    fontFamily: "SUIT-700",
    marginRight: 8,
  },
  placeType: {
    fontSize: 12,
    color: "#716C69",
    fontFamily: "SUIT-500",
  },
  scrapIcon: {
    width: 14,
    height: 22,
    position: "absolute",
    top: 5,
    right: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 13,
    color: "#313131",
    marginRight: 4,
    fontFamily: "SUIT-700",
  },
  reviewCountText: {
    fontSize: 13,
    color: "#7E7E7E",
    marginRight: 8,
    fontFamily: "SUIT-500",
  },
  distanceText: {
    fontSize: 13,
    color: "#262423",
    fontFamily: "SUIT-700",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  addressText: {
    fontSize: 13,
    color: "#716C69",
    marginLeft: 5,
    flex: 1,
    fontFamily: "SUIT-500",
  },
  likedButton: {
    alignSelf: "flex-end",
    backgroundColor: "#C5BFBB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginTop: 5,
  },
  likedButtonText: {
    fontSize: 13,
    color: "#EEE9E6",
    fontFamily: "SUIT-500",
  },
});
