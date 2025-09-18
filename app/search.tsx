import BackIcon from "@/components/icons/BackIcon";
import PlaceIcon from "@/components/icons/PlaceIcon";
import {
  getLikedPlacesAPI,
  getPlaceDetailAPI,
  PlaceSearchResponse,
  searchPlacesAPI,
} from "@/types/api";
import { useGlobalState } from "@/types/globalState";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [likedPlaces, setLikedPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLikedPlaces, setIsLoadingLikedPlaces] = useState(false);

  // 찜한 장소 가져오기
  const fetchLikedPlaces = useCallback(async () => {
    setIsLoadingLikedPlaces(true);
    try {
      // 전역 상태의 사용자 위치가 있으면 사용, 없으면 기본값 사용
      const currentLocation = userLocation || {
        latitude: 37.5665,
        longitude: 126.978,
      };

      const response = await getLikedPlacesAPI(
        currentLocation.latitude,
        currentLocation.longitude,
      );

      if (response.isSuccess && response.result) {
        setLikedPlaces(response.result);
        console.log("❤️ 찜한 장소 로드 완료:", response.result.length, "개");
      } else {
        console.log("❤️ 찜한 장소 없음:", response.message);
        setLikedPlaces([]);
      }
    } catch (error) {
      console.error("❌ 찜한 장소 로드 실패:", error);
      setLikedPlaces([]);
    } finally {
      setIsLoadingLikedPlaces(false);
    }
  }, [userLocation]);

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

  // 일정짜기에서 온 경우에만 찜한 장소 로드
  useEffect(() => {
    if (fromScreen === "itinerary") {
      fetchLikedPlaces();
    }
  }, [fetchLikedPlaces, fromScreen]);

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

  const handleSelectLikedPlace = async (place: any) => {
    console.log("Selected liked place:", place);

    if (fromScreen === "itinerary") {
      // 일정짜기에서 온 경우 - 일정에 추가
      console.log("📅 일정짜기에서 찜한 장소 선택됨 - 날짜:", dayIndex);

      const locationWithCoordinates = {
        placeId: place.placeId,
        name: place.name,
        placeType: place.placeType,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
      };

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

        console.log("✅ 전역 상태에 찜한 장소 추가 (전달받은 날짜):", {
          dayIndex: dayIndex,
          selectedDate: selectedDate,
          placeName: locationWithCoordinates.name,
          placeType: locationWithCoordinates.placeType,
        });
      } else {
        console.error("❌ 전달받은 날짜가 없음");
      }

      // 일정짜기 화면으로 돌아가면서 선택된 장소 정보 전달
      router.push({
        pathname: "/itinerary",
        params: {
          selectedLocation: JSON.stringify(locationWithCoordinates),
          selectedDayIndex: dayIndex,
        },
      });
    } else {
      // 이정표에서 온 경우
      console.log("🗺️ 이정표에서 찜한 장소 선택됨");

      const locationWithCoordinates = {
        placeId: place.placeId,
        name: place.name,
        placeType: place.placeType,
        address: place.address,
        latitude: place.latitude,
        longitude: place.longitude,
      };

      // 전역 activeMarkerId 설정 (빨간색 마커용 고유 ID)
      const markerId = `selected_location_${place.placeId}`;
      setActiveMarkerId(markerId);
      console.log("🎯 찜한 장소 선택된 마커 activeMarkerId 설정:", markerId);

      // 전역 selectedLocation 설정
      setSelectedLocation(locationWithCoordinates);
      console.log("📍 전역 selectedLocation 설정:", locationWithCoordinates);

      // 전역 clickedMarker 설정
      const clickedMarkerData = {
        name: locationWithCoordinates.name,
        type: "찜한장소",
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
    }
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);

    if (text.trim().length > 0) {
      setIsLoading(true);
      try {
        // 강원도 뷰포트로 고정
        const results = await searchPlacesAPI(
          text.trim(),
          37.0, // minLat - 강원도 남쪽 경계
          127.42, // minLng - 강원도 서쪽 경계
          38.62, // maxLat - 강원도 북쪽 경계
          129.56, // maxLng - 강원도 동쪽 경계
        );
        setSearchResults(results);
        console.log("🏔️ 강원도 뷰포트 기반 검색");
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
    <SafeAreaView style={styles.container} edges={["top"]}>
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
          allowFontScaling={false}
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
          /* 찜한 장소 또는 검색 안내 메시지 */
          <View style={styles.guideSection}>
            {isLoadingLikedPlaces ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText} allowFontScaling={false}>
                  찜한 장소를 불러오는 중...
                </Text>
              </View>
            ) : likedPlaces.length > 0 ? (
              <View style={styles.likedPlacesSection}>
                <Text style={styles.sectionTitle} allowFontScaling={false}>
                  찜한 장소
                </Text>
                {likedPlaces.map((place, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.likedPlaceItem}
                    onPress={() => handleSelectLikedPlace(place)}
                  >
                    <View style={styles.likedPlaceContent}>
                      <Image
                        source={{ uri: place.imageUrl }}
                        style={styles.likedPlaceImage}
                      />
                      <View style={styles.likedPlaceTextContainer}>
                        <View style={styles.nameAndTagContainer}>
                          <Text
                            style={styles.likedPlaceName}
                            allowFontScaling={false}
                          >
                            {place.name}
                          </Text>
                          <View style={styles.tagContainer}>
                            <Text
                              style={styles.tagText}
                              allowFontScaling={false}
                            >
                              {place.placeType === "TOURIST_SPOT"
                                ? "관광지"
                                : place.placeType === "RESTAURANT"
                                  ? "음식점"
                                  : place.placeType === "FESTIVAL"
                                    ? "축제"
                                    : place.placeType === "BOOKSTORE"
                                      ? "서점"
                                      : "장소"}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.addressContainer}>
                          <PlaceIcon style={styles.addressIcon} />
                          <Text
                            style={styles.addressText}
                            allowFontScaling={false}
                          >
                            {place.address}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View>
                <Text style={styles.guideTitle} allowFontScaling={false}>
                  장소를 검색해보세요
                </Text>
                <Text style={styles.guideText} allowFontScaling={false}>
                  찾고 싶은 장소의 이름이나 키워드를 입력하면{"\n"}
                  해당 지역의 장소를 찾을 수 있습니다.
                </Text>
              </View>
            )}
          </View>
        ) : (
          /* 검색 결과 */
          <View style={styles.suggestionsSection}>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText} allowFontScaling={false}>
                  검색 중...
                </Text>
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
                        <Text
                          style={styles.suggestionText}
                          allowFontScaling={false}
                        >
                          {item.name}
                        </Text>
                        <View style={styles.tagContainer}>
                          <Text style={styles.tagText} allowFontScaling={false}>
                            {item.placeType === "TOURIST_SPOT"
                              ? "관광지"
                              : item.placeType === "RESTAURANT"
                                ? "음식점"
                                : item.placeType === "FESTIVAL"
                                  ? "축제"
                                  : item.placeType === "BOOKSTORE"
                                    ? "서점"
                                    : "장소"}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.addressContainer}>
                        <PlaceIcon style={styles.addressIcon} />
                        <Text
                          style={styles.addressText}
                          allowFontScaling={false}
                        >
                          {item.address}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText} allowFontScaling={false}>
                  검색 결과가 없습니다.
                </Text>
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
    backgroundColor: "#F8F4F2",
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
    fontSize: 17,
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
    marginTop: 0,
    alignItems: "center",
    paddingHorizontal: 0,
  },
  guideTitle: {
    fontSize: 19,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginBottom: 12,
    marginTop: 50,
    textAlign: "center",
  },
  guideText: {
    fontSize: 13,
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
    fontSize: 16,
    fontFamily: "SUIT-400",
    color: "#262423",
  },
  tagContainer: {
    backgroundColor: "#DBD6D3",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  nameAndTagContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 4,
  },
  addressIcon: {
    width: 12,
    height: 12,
    marginRight: 6,
    tintColor: "#999999",
  },
  addressText: {
    fontSize: 13,
    fontFamily: "SUIT-400",
    color: "#262423",
  },
  fromScreenIndicator: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  fromScreenText: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#999999",
  },
  noResultsContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 15,
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
    fontSize: 13,
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
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#1976D2",
  },
  // 찜한 장소 관련 스타일
  likedPlacesSection: {
    width: "100%",
    paddingBottom: 50,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginBottom: 8,
    textAlign: "left",
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: "SUIT-400",
    color: "#9D9896",
    marginBottom: 20,
    textAlign: "left",
  },
  likedPlaceItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  likedPlaceContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  likedPlaceIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  likedPlaceTextContainer: {
    flex: 1,
    gap: 4,
  },
  likedPlaceName: {
    maxWidth: "75%",
    fontSize: 17,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
  searchGuideContainer: {
    marginTop: 30,
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  likedPlaceImage: {
    width: 52,
    height: 52,
    borderRadius: 5,
    marginRight: 12,
  },
});

export default SearchScreen;
