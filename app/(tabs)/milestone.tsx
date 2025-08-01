// app/milestone.tsx
import KakaoMap, { KakaoMapRef } from "@/components/KakaoMap";
import * as Location from "expo-location";
import { useRef, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Milestone() {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.8228, // 강원도 춘천시
    longitude: 127.7322,
  });
  const [selectedFilter, setSelectedFilter] = useState("가볼만한 관광지");
  const webViewRef = useRef<KakaoMapRef>(null);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 필요", "위치 정보에 접근하려면 권한이 필요합니다.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(newLocation);

      if (webViewRef.current) {
        const message = JSON.stringify({
          type: "updateLocation",
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
        });
        webViewRef.current.postMessage(message);
      }

      console.log("현재 위치로 이동:", newLocation);
    } catch (error) {
      console.error("위치 가져오기 실패:", error);
      Alert.alert("오류", "현재 위치를 가져올 수 없습니다.");
    }
  };

  return (
    <View style={styles.container}>
      {/* 카카오맵 컴포넌트 */}
      <KakaoMap
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
        ref={webViewRef}
      />

      {/* 상단 검색바 */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="서점, 책방, 공간 검색"
          placeholderTextColor="#999999"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Image
            source={require("@/assets/images/Search.png")}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 필터 버튼들 */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Image
            source={require("@/assets/images/이정표/bookStay.png")}
            style={styles.filterIcon}
            resizeMode="contain"
          />
          <Text style={styles.filterText}>북스테이</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Image
            source={require("@/assets/images/이정표/독립서점.png")}
            style={styles.filterIcon}
            resizeMode="contain"
          />
          <Text style={styles.filterText}>독립서점</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Image
            source={require("@/assets/images/이정표/공간책갈피.png")}
            style={styles.filterIcon}
            resizeMode="contain"
          />
          <Text style={styles.filterText}>공간책갈피</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Image
            source={require("@/assets/images/이정표/bookCafe.png")}
            style={styles.filterIcon}
            resizeMode="contain"
          />
          <Text style={styles.filterText}>북카페</Text>
        </TouchableOpacity>
      </View>

      {/* 나의 위치 버튼 */}
      <TouchableOpacity
        style={styles.myLocationButton}
        onPress={getCurrentLocation}
      >
        <Image
          source={require("@/assets/images/이정표/myLocation.png")}
          style={styles.myLocationIcon}
        />
      </TouchableOpacity>
      {/* 버튼 컨테이너 */}
      <View style={styles.buttonContainer}>
        {/* 메인 액션 버튼 */}
        <TouchableOpacity style={styles.mainActionButton}>
          <Image
            source={require("@/assets/images/이정표/취향독립서점.png")}
            style={styles.actionButtonIcon}
          />
          <Text style={styles.actionButtonText}>
            내 취향에 맞는 독립서점 찾기
          </Text>
        </TouchableOpacity>
        {/* 줌 버튼 */}
        <TouchableOpacity style={styles.zoomButton}>
          <Text style={styles.zoomIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 카드 */}
      <View style={styles.bottomCard}>
        <Text style={styles.locationName}>옥천동</Text>

        {/* 하단 필터 버튼들 */}
        <View style={styles.bottomFilterContainer}>
          <View style={styles.bottomFilterButton}>
            <Text style={styles.bottomFilterText}>주변 맛집</Text>
          </View>
          <View
            style={[styles.bottomFilterButton, styles.selectedFilterButton]}
          >
            <Text style={[styles.bottomFilterText, styles.selectedFilterText]}>
              가볼만한 관광지
            </Text>
          </View>
          <View style={styles.bottomFilterButton}>
            <Text style={styles.bottomFilterText}>뜨는 핫플</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    position: "absolute",
    top: 30,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#C5BFBB",
  },
  searchButton: {
    marginLeft: 10,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  filterContainer: {
    position: "absolute",
    top: 90,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterIcon: {
    width: 13,
    height: 13,
  },
  filterText: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#716C69",
  },
  myLocationButton: {
    position: "absolute",
    top: 135,
    left: 20,
    width: 45,
    height: 45,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  myLocationIcon: {
    width: 20,
    height: 20,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 125,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  zoomButton: {
    width: 50,
    height: 50,
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#302E2D",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoomIcon: {
    fontSize: 28,
    fontFamily: "SUIT-800",
    color: "#262423",
  },
  bottomCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  locationName: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#000000",
    marginBottom: 15,
  },
  bottomFilterContainer: {
    flexDirection: "row",
    gap: 10,
  },
  bottomFilterButton: {
    backgroundColor: "#DBD6D3",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedFilterButton: {
    backgroundColor: "#4D4947",
  },
  bottomFilterText: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#9D9896",
  },
  selectedFilterText: {
    color: "#FFFFFF",
  },
  mainActionButton: {
    backgroundColor: "rgba(38, 36, 35, 0.56)",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonIcon: {
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
});
