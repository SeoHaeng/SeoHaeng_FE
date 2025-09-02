import BackIcon from "@/components/icons/BackIcon";
import PlaceIcon from "@/components/icons/PlaceIcon";
import {
  getPlaceDetailAPI,
  PlaceSearchResponse,
  searchPlacesAPI,
} from "@/types/api";
import { useGlobalState } from "@/types/globalState";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const SearchScreen = () => {
  const params = useLocalSearchParams();
  const {
    viewport,
    userLocation,
    addTravelSchedule,
    setActiveMarkerId,
    setSelectedLocation,
    setClickedMarker,
  } = useGlobalState();
  const [searchText, setSearchText] = useState("");
  const [fromScreen, setFromScreen] = useState<string>("");
  const [dayIndex, setDayIndex] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PlaceSearchResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 파라미터에서 화면 정보 가져오기
  useEffect(() => {
    if (params.from) {
      setFromScreen(params.from as string);
      console.log("🔍 검색 화면 진입 - 출발 화면:", params.from);
    }
    if (params.dayIndex) {
      setDayIndex(params.dayIndex as string);
      console.log("📅 선택된 날짜 인덱스:", params.dayIndex);
    }
  }, [params.from, params.dayIndex]);

  const handleBack = () => {
    if (fromScreen === "itinerary") {
      // 일정짜기에서 온 경우 - itinerary 화면으로 이동
      router.push("/itinerary");
    } else if (fromScreen === "milestone") {
      // 이정표에서 온 경우 - milestone 화면으로 이동
      router.push("/(tabs)/milestone");
    } else {
      // 기본 뒤로가기
      router.back();
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearchResults([]);
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);

    if (text.trim().length > 0) {
      setIsLoading(true);
      try {
        // 전역 상태의 뷰포트 정보가 있으면 사용, 없으면 기본값 사용
        console.log("🔍 검색 시 전역 상태 확인:", { viewport, userLocation });

        if (viewport) {
          const results = await searchPlacesAPI(
            text.trim(),
            viewport.south, // minLat
            viewport.west, // minLng
            viewport.north, // maxLat
            viewport.east, // maxLng
          );
          setSearchResults(results);
          console.log("🌍 뷰포트 기반 검색:", viewport);
        } else {
          // 뷰포트 정보가 없으면 기본값 사용 (강릉 지역)
          const results = await searchPlacesAPI(
            text.trim(),
            37.0, // minLat
            127.42, // minLng
            38.62, // maxLat
            129.56, // maxLng
          );
          setSearchResults(results);
          console.log("📍 기본 좌표 기반 검색 - 뷰포트 정보 없음");
        }
      } catch (error) {
        console.error("검색 API 에러:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectLocation = async (location: PlaceSearchResponse) => {
    console.log("Selected location:", location);

    if (fromScreen === "itinerary") {
      // 일정짜기에서 온 경우 - 일정에 추가
      console.log("📅 일정짜기에서 장소 선택됨 - 날짜:", dayIndex);

      try {
        // 장소 상세 조회 API로 좌표 정보 가져오기
        const placeDetail = await getPlaceDetailAPI(location.placeId);

        if (placeDetail.isSuccess && placeDetail.result) {
          const locationWithCoordinates = {
            placeId: placeDetail.result.placeId,
            name: placeDetail.result.name,
            placeType: placeDetail.result.placeType,
            address: placeDetail.result.address,
            latitude: placeDetail.result.latitude,
            longitude: placeDetail.result.longitude,
          };

          console.log("📍 장소 상세 조회로 좌표 가져옴:", {
            latitude: placeDetail.result.latitude,
            longitude: placeDetail.result.longitude,
          });

          // 전역 상태에 장소 정보 저장 (날짜를 YYYY-MM-DD 형태로 변환)
          const selectedDate = params.selectedDate as string;

          if (selectedDate) {
            // "10.06" 형태를 "2025-10-06" 형태로 변환
            let formattedDate = selectedDate;

            if (selectedDate.includes(".") && !selectedDate.includes("-")) {
              // "10.06" 형태인 경우 "2025-10-06"으로 변환
              const currentYear = new Date().getFullYear();
              const [month, day] = selectedDate.split(".");
              formattedDate = `${currentYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            }

            addTravelSchedule({
              day: formattedDate, // ✅ YYYY-MM-DD 형태 (예: "2025-10-06")
              placeId: locationWithCoordinates.placeId,
              name: locationWithCoordinates.name,
              placeType: locationWithCoordinates.placeType,
              latitude: locationWithCoordinates.latitude,
              longitude: locationWithCoordinates.longitude,
            });

            console.log("✅ 전역 상태에 장소 추가 (전달받은 날짜):", {
              dayIndex: dayIndex,
              selectedDate: selectedDate,
              placeName: locationWithCoordinates.name,
              placeType: locationWithCoordinates.placeType,
            });
          } else {
            console.error("❌ 전달받은 날짜가 없음");
          }

          console.log("✅ 전역 상태에 장소 추가:", {
            dayIndex: dayIndex,
            placeName: locationWithCoordinates.name,
            placeType: locationWithCoordinates.placeType,
          });

          // 일정짜기 화면으로 돌아가면서 선택된 장소 정보 전달
          router.push({
            pathname: "/itinerary",
            params: {
              selectedLocation: JSON.stringify(locationWithCoordinates),
              selectedDayIndex: dayIndex,
            },
          });
        } else {
          console.error("❌ 장소 상세 조회 실패:", placeDetail.message);
          // 실패 시 일정짜기 화면으로 돌아가기
          router.back();
        }
      } catch (error) {
        console.error("❌ 장소 상세 조회 API 에러:", error);
        // 에러 시 일정짜기 화면으로 돌아가기
        router.back();
      }
    } else {
      // 이정표에서 온 경우 - 장소 상세 조회로 좌표 가져오기
      console.log("🗺️ 이정표에서 장소 선택됨");

      try {
        // 장소 상세 조회 API로 좌표 정보 가져오기
        const placeDetail = await getPlaceDetailAPI(location.placeId);

        if (placeDetail.isSuccess && placeDetail.result) {
          const locationWithCoordinates = {
            placeId: placeDetail.result.placeId,
            name: placeDetail.result.name,
            placeType: placeDetail.result.placeType,
            address: placeDetail.result.address,
            latitude: placeDetail.result.latitude,
            longitude: placeDetail.result.longitude,
          };

          console.log("📍 장소 상세 조회로 좌표 가져옴:", {
            latitude: placeDetail.result.latitude,
            longitude: placeDetail.result.longitude,
          });

          // 전역 activeMarkerId 설정 (빨간색 마커용 고유 ID)
          const markerId = `selected_location_${location.placeId}`;
          setActiveMarkerId(markerId);
          console.log("🎯 검색에서 선택된 마커 activeMarkerId 설정:", markerId);

          // 전역 selectedLocation 설정
          setSelectedLocation(locationWithCoordinates);
          console.log(
            "📍 전역 selectedLocation 설정:",
            locationWithCoordinates,
          );

          // 전역 clickedMarker 설정
          const clickedMarkerData = {
            name: locationWithCoordinates.name,
            type: "검색된장소",
            address: `위도 ${locationWithCoordinates.latitude.toFixed(4)}, 경도 ${locationWithCoordinates.longitude.toFixed(4)}`,
            latitude: locationWithCoordinates.latitude,
            longitude: locationWithCoordinates.longitude,
            placeId: locationWithCoordinates.placeId,
          };
          setClickedMarker(clickedMarkerData);
          console.log("🎯 전역 clickedMarker 설정:", clickedMarkerData);

          // 이정표 화면으로 이동
          router.push({
            pathname: "/(tabs)/milestone",
            params: {
              selectedLocation: JSON.stringify(locationWithCoordinates),
              activeMarkerId: markerId, // 전역에서 설정한 ID 전달
            },
          });
        } else {
          console.error("❌ 장소 상세 조회 실패:", placeDetail.message);
          // 실패 시 기본값으로 이동
          router.push("/(tabs)/milestone");
        }
      } catch (error) {
        console.error("❌ 장소 상세 조회 API 에러:", error);
        // 에러 시 기본값으로 이동
        router.push("/(tabs)/milestone");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 검색바 */}
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <BackIcon style={styles.backIcon} />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="공간을 검색해보세요"
          placeholderTextColor="#999999"
          value={searchText}
          onChangeText={handleSearch}
          autoFocus
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Feather name="x" size={20} color="#999999" />
          </TouchableOpacity>
        )}
        {searchText.length === 0 && (
          <TouchableOpacity style={styles.searchButton}>
            <EvilIcons name="search" size={35} color="#9D9896" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {searchText.length === 0 ? (
          /* 검색 안내 메시지 */
          <View style={styles.guideSection}>
            <Text style={styles.guideTitle}>장소를 검색해보세요</Text>
            <Text style={styles.guideText}>
              찾고 싶은 장소의 이름이나 키워드를 입력하면{"\n"}
              해당 지역의 장소를 찾을 수 있습니다.
            </Text>
          </View>
        ) : (
          /* 검색 결과 */
          <View style={styles.suggestionsSection}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>검색 중...</Text>
              </View>
            ) : searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => handleSelectLocation(item)}
                >
                  <View style={styles.suggestionContent}>
                    <AntDesign name="search1" size={16} color="#666666" />
                    <View style={styles.suggestionTextContainer}>
                      <View style={styles.nameAndTagContainer}>
                        <Text style={styles.suggestionText}>{item.name}</Text>
                        <View style={styles.tagContainer}>
                          <Text style={styles.tagText}>
                            {item.placeType === "TOURIST_SPOT"
                              ? "관광지"
                              : item.placeType === "RESTAURANT"
                                ? "음식점"
                                : item.placeType === "FESTIVAL"
                                  ? "축제"
                                  : item.placeType}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.addressContainer}>
                        <PlaceIcon style={styles.addressIcon} />
                        <Text style={styles.addressText}>{item.address}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>검색 결과가 없습니다.</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingLeft: 5,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    marginRight: 15,
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "SUIT-400",
    color: "#262423",
    paddingVertical: 10,
  },
  searchButton: {
    marginLeft: 10,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  guideSection: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  guideTitle: {
    fontSize: 18,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginBottom: 12,
    textAlign: "center",
  },
  guideText: {
    fontSize: 12,
    fontFamily: "SUIT-400",
    color: "#9D9896",
    textAlign: "center",
    lineHeight: 20,
  },

  suggestionsSection: {
    marginTop: 10,
  },
  suggestionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  suggestionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionIcon: {
    width: 16,
    height: 16,
    marginRight: 18,
    tintColor: "#666666",
  },
  suggestionTextContainer: {
    flex: 1,
    gap: 4,
    marginLeft: 18,
  },
  suggestionText: {
    maxWidth: "75%",
    fontSize: 15,
    fontFamily: "SUIT-400",
    color: "#262423",
  },
  tagContainer: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginLeft: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#666666",
  },

  nameAndTagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  addressIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
    tintColor: "#999999",
  },
  addressText: {
    fontSize: 12,
    fontFamily: "SUIT-400",
    color: "#999999",
  },
  fromScreenIndicator: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  fromScreenText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#999999",
  },
  noResultsContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#999999",
  },
  viewportInfo: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    alignItems: "center",
  },
  viewportText: {
    fontSize: 12,
    fontFamily: "SUIT-400",
    color: "#666666",
    marginBottom: 4,
  },
  userLocationInfo: {
    marginTop: 10,
    padding: 12,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    alignItems: "center",
  },
  userLocationText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#1976D2",
  },
});

export default SearchScreen;
