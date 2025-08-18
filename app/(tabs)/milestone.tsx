// app/milestone.tsx
import { bookCafeData } from "@/assets/mockdata/bookCafeData";
import { bookStayData } from "@/assets/mockdata/bookStayData";
import { bookmarkData } from "@/assets/mockdata/bookmarkData";
import { festivalData } from "@/assets/mockdata/festivalData";
import { independentBookstoreData } from "@/assets/mockdata/independentBookstoreData";
import { restaurantData } from "@/assets/mockdata/restaurantData";
import { touristData } from "@/assets/mockdata/touristData";
import KakaoMap, { KakaoMapRef } from "@/components/KakaoMap";
import SelectedMarkerModal from "@/components/SelectedMarkerModal";
import BackIcon from "@/components/icons/BackIcon";
import BookCafeIcon from "@/components/icons/BookCafeIcon";
import BookStayIcon from "@/components/icons/BookStayIcon";
import HotPlaceIcon from "@/components/icons/HotPlaceIcon";
import IndependentBookstoreIcon from "@/components/icons/IndependentBookstoreIcon";
import MyLocationIcon from "@/components/icons/MyLocationIcon";
import RestaurantIcon from "@/components/icons/RestaurantIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import SpaceBookmarkIcon from "@/components/icons/SpaceBookmarkIcon";
import TouristSpotIcon from "@/components/icons/TouristSpotIcon";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function Milestone() {
  const params = useLocalSearchParams();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 37.8228, // 강원도 춘천시
    longitude: 127.7322,
  });
  const [selectedFilter, setSelectedFilter] = useState("가볼만한 관광지");
  const [selectedBottomFilter, setSelectedBottomFilter] =
    useState("가볼만한 관광지");
  const [selectedBottomFilters, setSelectedBottomFilters] = useState<string[]>(
    [],
  ); // 다중 선택을 위한 배열 상태 추가
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    text: string;
    type: string;
    distance?: string;
    address?: string;
  } | null>(null);
  const [currentAddress, setCurrentAddress] = useState("옥천동");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [activeFilterText, setActiveFilterText] = useState("");
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [filterType, setFilterType] = useState<string | undefined>(undefined); // 필터 타입 상태 추가
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null); // 활성화된 마커 ID
  const [isWebViewReady, setIsWebViewReady] = useState(false); // WebView 준비 상태
  const webViewRef = useRef<KakaoMapRef>(null);

  // WebView 로드 완료 후 준비 상태 설정
  const handleWebViewLoad = () => {
    console.log("🌐 WebView 로드 완료");
    setTimeout(() => {
      console.log("✅ WebView 준비 상태를 true로 설정");
      setIsWebViewReady(true);
    }, 2000); // 2초 후 준비 상태 설정
  };

  // URL 파라미터에서 선택된 위치 정보 처리
  useEffect(() => {
    if (params.selectedLocation) {
      try {
        const location = JSON.parse(params.selectedLocation as string);
        setSelectedLocation(location);

        // 주소가 있는 경우 좌표로 변환하여 지도 이동
        if (location.address) {
          console.log("선택된 위치 정보:", location);
          moveToAddress(location.address, location);
        }
      } catch (error) {
        console.error("Error parsing selected location:", error);
      }
    }
  }, [params.selectedLocation]);

  // 주소를 좌표로 변환하여 지도 이동
  const moveToAddress = async (address: string, locationData: any) => {
    try {
      console.log("주소 변환 시작:", address);

      // 이스트쓰네 선택 시 강릉으로 이동
      let newLocation;

      if (address.includes("강릉시")) {
        // 이스트쓰네 좌표로 이동 (위도: 37.6853735495694, 경도: 129.039668458113)
        newLocation = {
          latitude: 37.6853735495694,
          longitude: 129.039668458113,
        };
        console.log("이스트쓰네로 이동:", newLocation);
      } else {
        console.log("알 수 없는 주소:", address);
        return;
      }

      console.log("최종 좌표:", newLocation);
      setCurrentLocation(newLocation);
      setIsLocationSelected(true); // 위치가 선택되었음을 표시

      // 지도 이동을 위해 카카오맵 컴포넌트 props 업데이트
      // webViewRef가 준비될 때까지 기다린 후 지도 이동
      const tryMoveMap = () => {
        if (webViewRef.current) {
          // 지도 이동 메시지 전송
          const moveMessage = JSON.stringify({
            type: "updateLocation",
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          });
          console.log("지도 이동 메시지:", moveMessage);
          webViewRef.current.postMessage(moveMessage);

          // 마커 표시 메시지 전송
          const markerMessage = JSON.stringify({
            type: "showMarker",
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            markerType: "bookstoreActive", // 활성화된 서점 마커
            markerTitle:
              locationData.text || locationData.name || "선택된 위치",
          });
          console.log("마커 표시 메시지:", markerMessage);
          webViewRef.current.postMessage(markerMessage);

          console.log("지도 이동 완료:", newLocation);
        } else {
          console.log("webViewRef가 아직 준비되지 않음, 100ms 후 재시도");
          setTimeout(tryMoveMap, 100);
        }
      };

      // 즉시 시도
      tryMoveMap();
    } catch (error) {
      console.error("주소 변환 실패:", error);
    }
  };

  // 마커 선택 시 처리
  const handleMarkerSelected = (markerData: any) => {
    console.log("🎯 마커 선택됨:", markerData.id, markerData.name);
    setActiveMarkerId(markerData.id);
    setIsFilterActive(false); // 필터 비활성화
  };

  // 선택된 마커 정보를 activeMarkerId로부터 계산
  const selectedMarker = useMemo(() => {
    if (!activeMarkerId) return null;

    // 모든 마커 데이터에서 해당 ID 찾기
    const allData = [
      ...independentBookstoreData,
      ...bookCafeData,
      ...bookStayData,
      ...bookmarkData,
      ...restaurantData,
      ...touristData,
      ...festivalData,
    ];

    const markerData = allData.find((item) => item.id === activeMarkerId);
    if (!markerData) return null;

    return {
      id: markerData.id,
      name: markerData.name,
      lat: markerData.latitude,
      lng: markerData.longitude,
    };
  }, [activeMarkerId]);

  // activeMarkerId 변경 시 로그 출력 및 인포박스 업데이트
  useEffect(() => {
    console.log("🔄 activeMarkerId 변경됨:", activeMarkerId);
    if (activeMarkerId) {
      console.log("📍 활성화된 마커 ID:", activeMarkerId);

      // WebView에 인포박스 상태 업데이트 요청
      if (webViewRef.current) {
        setTimeout(() => {
          const message = JSON.stringify({
            type: "updateBookstoreMarkerImage",
            id: activeMarkerId,
            isActive: true,
          });
          console.log("📤 WebView에 메시지 전송:", message);
          webViewRef.current?.postMessage(message);
        }, 100); // 100ms 지연
      }
    } else {
      console.log("❌ 마커 선택 해제됨");

      // WebView에 모든 인포박스 닫기 요청
      if (webViewRef.current) {
        webViewRef.current.postMessage(
          JSON.stringify({
            type: "closeAllInfoWindows",
          }),
        );
      }
    }
  }, [activeMarkerId, webViewRef]);

  const getCurrentLocation = async () => {
    try {
      console.log("내 위치 버튼 클릭 - 현재 위치 가져오기 시작");
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

      console.log("내 위치로 이동:", newLocation);
      setCurrentLocation(newLocation);
      setIsLocationSelected(false); // 내 위치로 이동했으므로 선택된 위치 플래그 해제

      // 주소 정보 가져오기
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      });

      if (addressResponse.length > 0) {
        const address = addressResponse[0];
        const district =
          address.district || address.subregion || "알 수 없는 지역";
        setCurrentAddress(district);
      }

      if (webViewRef.current) {
        const message = JSON.stringify({
          type: "updateLocation",
          latitude: newLocation.latitude,
          longitude: newLocation.longitude,
        });
        webViewRef.current.postMessage(message);
      }

      console.log("내 위치로 이동 완료:", newLocation);
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
        filterType={filterType} // 필터 타입 전달
        bottomFilterTypes={selectedBottomFilters.map((filter) => {
          // 필터 이름을 mockData의 type과 매칭
          switch (filter) {
            case "주변 맛집":
              return "맛집";
            case "가볼만한 관광지":
              return "관광지";
            case "뜨는 축제":
              return "축제";
            default:
              return filter;
          }
        })} // 하단 필터 타입들 전달
        activeMarkerId={activeMarkerId} // 활성화된 마커 ID 전달
        onActiveMarkerChange={setActiveMarkerId} // 마커 ID 변경 콜백 전달
        onLoad={handleWebViewLoad} // WebView 로드 완료 핸들러
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log("📱 React Native 메시지 수신:", data);

            if (data.type === "markerSelected") {
              handleMarkerSelected(data);
            } else if (data.type === "mapReady") {
              console.log("🗺️ 지도 준비됨 - WebView 준비 상태 설정");
              setIsWebViewReady(true);
            }
          } catch (error) {
            console.log("메시지 파싱 오류:", error);
          }
        }}
      />

      {/* 상단 검색바 */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => {
          if (!selectedMarker) {
            router.push("/search");
          }
        }}
      >
        {(isFilterActive || selectedMarker) && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (isFilterActive) {
                setIsFilterActive(false);
                setActiveFilterText("");
                setFilterType(undefined); // 필터 타입 초기화 (모든 마커 표시)
              } else if (activeMarkerId) {
                setActiveMarkerId(null); // 선택된 마커 해제
              }
            }}
          >
            <BackIcon style={styles.backIcon} width={14} height={14} />
          </TouchableOpacity>
        )}
        <TextInput
          style={[
            styles.searchInput,
            isFilterActive && styles.filterActiveSearchInput,
            selectedLocation && styles.selectedLocationSearchInput,
            selectedMarker && styles.selectedMarkerSearchInput,
          ]}
          value={
            isFilterActive
              ? activeFilterText
              : selectedMarker
                ? selectedMarker.name
                : selectedLocation
                  ? selectedLocation.text || selectedLocation.name
                  : ""
          }
          placeholder="서점, 책방, 공간 검색"
          placeholderTextColor="#999999"
          editable={false}
        />
        {selectedLocation ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSelectedLocation(null);
              setIsLocationSelected(false); // 위치 선택 플래그 리셋
              // 지도는 현재 위치에 그대로 유지 (getCurrentLocation 호출하지 않음)
            }}
          >
            <Text style={styles.clearButtonText}>×</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.searchButton}>
            <SearchIcon style={styles.searchIcon} color="#999999" />
          </View>
        )}
      </TouchableOpacity>

      {/* 필터 버튼들 */}
      <View
        style={[
          styles.filterContainer,
          (isFilterActive || selectedLocation || selectedMarker) &&
            styles.hiddenFilterContainer,
        ]}
      >
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setIsFilterActive(true);
            setActiveFilterText("북스테이");
            setFilterType("북스테이"); // 필터 타입 설정
          }}
        >
          <BookStayIcon style={styles.filterIcon} color="#716C69" />
          <Text style={styles.filterText}>북스테이</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setIsFilterActive(true);
            setActiveFilterText("독립서점");
            setFilterType("독립서점"); // 필터 타입 설정
          }}
        >
          <IndependentBookstoreIcon style={styles.filterIcon} color="#716C69" />
          <Text style={styles.filterText}>독립서점</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setIsFilterActive(true);
            setActiveFilterText("공간책갈피");
            setFilterType("책갈피"); // 필터 타입 설정 (mockData의 type과 일치)
          }}
        >
          <SpaceBookmarkIcon style={styles.filterIcon} color="#716C69" />
          <Text style={styles.filterText}>공간책갈피</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setIsFilterActive(true);
            setActiveFilterText("북카페");
            setFilterType("북카페"); // 필터 타입 설정
          }}
        >
          <BookCafeIcon style={styles.filterIcon} color="#716C69" />
          <Text style={styles.filterText}>북카페</Text>
        </TouchableOpacity>
      </View>

      {/* 나의 위치 버튼 */}
      <TouchableOpacity
        style={[
          styles.myLocationButton,
          (isFilterActive || selectedLocation) && styles.hiddenElement,
        ]}
        onPress={async () => {
          try {
            // 현재 위치 가져오기
            const { status } =
              await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
              Alert.alert(
                "권한 필요",
                "위치 정보에 접근하려면 권한이 필요합니다.",
              );
              return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const newLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };

            console.log("내 위치로 이동:", newLocation);
            setCurrentLocation(newLocation);
            setIsLocationSelected(false);

            // 주소 정보 가져오기
            const addressResponse = await Location.reverseGeocodeAsync({
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
            });

            if (addressResponse.length > 0) {
              const address = addressResponse[0];
              const district =
                address.district || address.subregion || "알 수 없는 지역";
              setCurrentAddress(district);
            }

            // 지도를 내 위치로 이동하고 마커 업데이트
            if (webViewRef.current) {
              webViewRef.current.moveToLocation(
                newLocation.latitude,
                newLocation.longitude,
              );
            }

            console.log("내 위치로 이동 완료:", newLocation);
          } catch (error) {
            console.error("위치 가져오기 실패:", error);
            Alert.alert("오류", "현재 위치를 가져올 수 없습니다.");
          }
        }}
      >
        <MyLocationIcon style={styles.myLocationIcon} color="#716C69" />
      </TouchableOpacity>

      {/* 줌 버튼 - 오른쪽 끝에 별도 배치 */}
      <TouchableOpacity
        style={[
          styles.zoomButton,
          (isFilterActive || selectedLocation || selectedMarker) &&
            styles.hiddenElement,
        ]}
        onPress={() => {
          // 현재 위치를 기반으로 위치 선택 화면으로 이동
          router.push({
            pathname: "/location-picker",
            params: {
              initialLatitude: currentLocation.latitude,
              initialLongitude: currentLocation.longitude,
            },
          });
        }}
      >
        <Text style={styles.zoomIcon}>+</Text>
      </TouchableOpacity>

      {/* 하단 카드 */}
      <View
        style={[
          styles.bottomCard,
          (isFilterActive || selectedLocation || selectedMarker) &&
            styles.hiddenElement,
        ]}
      >
        <Text style={styles.locationName}>
          {selectedLocation ? selectedLocation.name : currentAddress}
        </Text>

        {/* 하단 필터 버튼들 */}
        <View style={styles.bottomFilterContainer}>
          <TouchableOpacity
            style={[
              styles.bottomFilterButton,
              selectedBottomFilters.includes("주변 맛집") &&
                styles.selectedFilterButton,
            ]}
            onPress={() => {
              const filter = "주변 맛집";
              setSelectedBottomFilters(
                (prev) =>
                  prev.includes(filter)
                    ? prev.filter((f) => f !== filter) // 이미 선택된 경우 제거
                    : [...prev, filter], // 선택되지 않은 경우 추가
              );
            }}
          >
            <RestaurantIcon
              style={styles.bottomFilterIcon}
              color={
                selectedBottomFilters.includes("주변 맛집")
                  ? "#FFFFFF"
                  : "#9D9896"
              }
            />
            <Text
              style={[
                styles.bottomFilterText,
                selectedBottomFilters.includes("주변 맛집") &&
                  styles.selectedFilterText,
              ]}
            >
              주변 맛집
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomFilterButton,
              selectedBottomFilters.includes("가볼만한 관광지") &&
                styles.selectedFilterButton,
            ]}
            onPress={() => {
              const filter = "가볼만한 관광지";
              setSelectedBottomFilters(
                (prev) =>
                  prev.includes(filter)
                    ? prev.filter((f) => f !== filter) // 이미 선택된 경우 제거
                    : [...prev, filter], // 선택되지 않은 경우 추가
              );
            }}
          >
            <TouristSpotIcon
              style={styles.bottomFilterIcon}
              color={
                selectedBottomFilters.includes("가볼만한 관광지")
                  ? "#FFFFFF"
                  : "#9D9896"
              }
            />
            <Text
              style={[
                styles.bottomFilterText,
                selectedBottomFilters.includes("가볼만한 관광지") &&
                  styles.selectedFilterText,
              ]}
            >
              가볼만한 관광지
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomFilterButton,
              selectedBottomFilters.includes("뜨는 축제") &&
                styles.selectedFilterButton,
            ]}
            onPress={() => {
              const filter = "뜨는 축제";
              setSelectedBottomFilters(
                (prev) =>
                  prev.includes(filter)
                    ? prev.filter((f) => f !== filter) // 이미 선택된 경우 제거
                    : [...prev, filter], // 선택되지 않은 경우 추가
              );
            }}
          >
            <HotPlaceIcon
              style={styles.bottomFilterIcon}
              color={
                selectedBottomFilters.includes("뜨는 축제")
                  ? "#FFFFFF"
                  : "#9D9896"
              }
            />
            <Text
              style={[
                styles.bottomFilterText,
                selectedBottomFilters.includes("뜨는 축제") &&
                  styles.selectedFilterText,
              ]}
            >
              뜨는 축제
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 선택된 마커 모달 */}
      <SelectedMarkerModal
        marker={selectedMarker}
        onClose={() => setActiveMarkerId(null)}
      />
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
  filterActiveSearchInput: {
    color: "#262423",
  },
  searchButton: {
    marginLeft: 10,
  },
  searchIcon: {
    width: 24,
    height: 24,
  },
  clearButton: {
    marginLeft: 10,
    padding: 5,
  },
  clearButtonText: {
    fontSize: 18,
    color: "#999999",
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
    width: 16,
    height: 16,
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
    position: "absolute",
    bottom: 125,
    right: 20,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
  bottomFilterIcon: {
    width: 16,
    height: 16,
  },
  mainActionButton: {
    backgroundColor: "rgba(38, 36, 35, 0.56)",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
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
    width: 20,
    height: 20,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  backIcon: {
    width: 16,
    height: 16,
  },
  hiddenFilterContainer: {
    display: "none",
  },
  hiddenElement: {
    display: "none",
  },
  selectedLocationSearchInput: {
    color: "#262423",
  },
  selectedMarkerSearchInput: {
    color: "#000000",
    fontFamily: "SUIT-700",
    fontWeight: "bold",
  },
});
export default Milestone;
