import PlaceIcon from "@/components/icons/PlaceIcon";
import StarIcon from "@/components/icons/StarIcon";
import { getLikedPlacesAPI } from "@/types/api";
import { useGlobalState } from "@/types/globalState";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LikedPlaces() {
  const router = useRouter();
  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userLocation } = useGlobalState();

  // 찜한 장소 조회
  useEffect(() => {
    const fetchLikedPlaces = async () => {
      try {
        setIsLoading(true);

        // 전역 상태에서 사용자 위치 가져오기
        if (!userLocation) {
          console.log("전역 상태에 위치가 없습니다. 새로 위치를 가져옵니다.");

          // 위치 권한 요청
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            console.error("위치 권한이 거부되었습니다.");
            setIsLoading(false);
            return;
          }

          // 현재 위치 가져오기
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          const { latitude, longitude } = location.coords;
          console.log("새로 가져온 위치:", { latitude, longitude });

          // 찜한 장소 조회 API 호출
          const response = await getLikedPlacesAPI(latitude, longitude);

          if (response.isSuccess) {
            setPlaces(response.result);
            console.log("찜한 장소 조회 성공:", response.result);
          } else {
            console.error("찜한 장소 조회 실패:", response.message);
          }
        } else {
          // 전역 상태의 위치 사용
          console.log("전역 상태의 위치 사용:", userLocation);

          // 찜한 장소 조회 API 호출
          const response = await getLikedPlacesAPI(
            userLocation.latitude,
            userLocation.longitude,
          );

          if (response.isSuccess) {
            setPlaces(response.result);
            console.log("찜한 장소 조회 성공:", response.result);
          } else {
            console.error("찜한 장소 조회 실패:", response.message);
          }
        }
      } catch (error) {
        console.error("찜한 장소 조회 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLikedPlaces();
  }, [userLocation]);

  const renderPlaceItem = (place: any) => (
    <TouchableOpacity
      key={place.placeId}
      style={styles.placeItem}
      onPress={() =>
        router.push({
          pathname: `/bookstore/[id]`,
          params: {
            id: place.placeId.toString(),
            from: "likedPlaces",
          },
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.placeImageContainer}>
        {place.imageUrl ? (
          <Image source={{ uri: place.imageUrl }} style={styles.placeImage} />
        ) : (
          <View style={styles.placeImage} />
        )}
      </View>

      <View style={styles.placeInfo}>
        <View style={styles.nameContainer}>
          <Text style={styles.placeName}>
            {place.name.length > 12
              ? `${place.name.substring(0, 12)}...`
              : place.name}
          </Text>
          <Text style={styles.placeType}>
            {place.placeType === "TOURIST_SPOT"
              ? "관광지"
              : place.placeType === "RESTAURANT"
                ? "음식점"
                : place.placeType === "FESTIVAL"
                  ? "축제"
                  : place.placeType === "BOOKSTORE"
                    ? "독립서점"
                    : place.placeType}
          </Text>
        </View>

        <View style={styles.ratingContainer}>
          <StarIcon size={15} style={styles.starIcon} />
          <Text style={styles.ratingText}>
            {place.averageRating.toFixed(1)}
          </Text>
          <Text style={styles.reviewCountText}>({place.reviewCount})</Text>
          <Text style={styles.distanceText}>{place.distance.toFixed(1)}km</Text>
        </View>

        <View style={styles.addressContainer}>
          <PlaceIcon />
          <Text style={styles.addressText}>
            {place.address.length > 17
              ? `${place.address.substring(0, 17)}...`
              : place.address}
          </Text>
        </View>

        <TouchableOpacity style={styles.likedButton}>
          <Text style={styles.likedButtonText}>찜한 장소</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>찜한 장소를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.countContainer}>
        <Text style={styles.countText}>총 {places.length}개</Text>
      </View>

      {places.length > 0 ? (
        places.map(renderPlaceItem)
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>아직 찜한 장소가 없습니다.</Text>
        </View>
      )}
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
    backgroundColor: "#C5BFBB",
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
    fontSize: 15,
    color: "#262423",
    fontFamily: "SUIT-700",
    marginRight: 8,
  },
  placeType: {
    fontSize: 11,
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
    fontSize: 12,
    color: "#313131",
    marginRight: 4,
    fontFamily: "SUIT-700",
  },
  reviewCountText: {
    fontSize: 12,
    color: "#7E7E7E",
    marginRight: 8,
    fontFamily: "SUIT-500",
  },
  distanceText: {
    fontSize: 12,
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
    fontSize: 12,
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
    fontSize: 11,
    color: "#EEE9E6",
    fontFamily: "SUIT-500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 16,
    color: "#666666",
    fontFamily: "SUIT-500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
    fontFamily: "SUIT-500",
  },
});
