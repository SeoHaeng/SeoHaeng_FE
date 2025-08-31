// app/milestone.tsx
import KakaoMap from "@/components/KakaoMap";
import SelectedMarkerModal from "@/components/SelectedMarkerModal";
import BackIcon from "@/components/icons/BackIcon";
import BookCafeIcon from "@/components/icons/BookCafeIcon";
import BookStayIcon from "@/components/icons/BookStayIcon";
import HotPlaceIcon from "@/components/icons/HotPlaceIcon";
import IndependentBookstoreIcon from "@/components/icons/IndependentBookstoreIcon";
import MyLocationIcon from "@/components/icons/MyLocationIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import RestaurantIcon from "@/components/icons/RestaurantIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import SpaceBookmarkIcon from "@/components/icons/SpaceBookmarkIcon";
import TouristSpotIcon from "@/components/icons/TouristSpotIcon";
import {
  getBookcafeMarkersAPI,
  getBookstayMarkersAPI,
  getBookstoreMarkersAPI,
  getReadingSpotMarkersAPI,
} from "@/types/api";
import { useGlobalState } from "@/types/globalState";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
  const { setViewport, setUserLocation, userLocation } = useGlobalState();
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 37.5665, // 서울시청 기본값
    longitude: 126.978,
  });
  const [selectedFilter, setSelectedFilter] = useState("가볼만한 관광지");
  const [selectedBottomFilter, setSelectedBottomFilter] =
    useState("가볼만한 관광지");
  const [selectedBottomFilters, setSelectedBottomFilters] = useState<string[]>(
    [],
  ); // 다중 선택을 위한 배열 상태 추가
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
    placeId?: number;
  } | null>(null);
  const [currentAddress, setCurrentAddress] = useState("현재 위치");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [activeFilterText, setActiveFilterText] = useState("");
  const [isLocationSelected, setIsLocationSelected] = useState(false);
  const [filterType, setFilterType] = useState<string>("가볼만한 관광지"); // 기본 필터 타입 설정
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null); // 활성화된 마커 ID
  const [moveToLocation, setMoveToLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // 검색에서 선택된 장소로 이동하기 위한 별도 상태
  const [searchSelectedLocation, setSearchSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
    name?: string;
  } | null>(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false); // WebView 준비 상태 플래그
  const [isLoadingLocation, setIsLoadingLocation] = useState(false); // 위치 로딩 상태

  // 북카페, 북스테이, 독립서점, 공간책갈피 마커 데이터 상태
  const [independentBookstoreMarkers, setIndependentBookstoreMarkers] =
    useState<any[]>([]);
  const [bookStayMarkers, setBookStayMarkers] = useState<any[]>([]);
  const [bookCafeMarkers, setBookCafeMarkers] = useState<any[]>([]);
  const [readingSpotMarkers, setReadingSpotMarkers] = useState<any[]>([]);
  const [isLoadingMarkers, setIsLoadingMarkers] = useState(false);

  // 필터링된 마커 데이터 상태
  const [
    filteredIndependentBookstoreMarkers,
    setFilteredIndependentBookstoreMarkers,
  ] = useState<any[]>([]);
  const [filteredBookStayMarkers, setFilteredBookStayMarkers] = useState<any[]>(
    [],
  );
  const [filteredBookCafeMarkers, setFilteredBookCafeMarkers] = useState<any[]>(
    [],
  );
  const [filteredReadingSpotMarkers, setFilteredReadingSpotMarkers] = useState<
    any[]
  >([]);

  // 클릭된 마커 정보 상태
  const [clickedMarker, setClickedMarker] = useState<{
    name: string;
    type: string;
    address?: string;
    latitude: number;
    longitude: number;
    placeId?: number;
  } | null>(null);

  // 필터 타입에 따라 마커 필터링하는 함수
  const filterMarkersByType = (filterType: string) => {
    console.log("🔍 마커 필터링 시작:", filterType);

    switch (filterType) {
      case "독립서점":
        setFilteredIndependentBookstoreMarkers(independentBookstoreMarkers);
        setFilteredBookStayMarkers([]);
        setFilteredBookCafeMarkers([]);
        setFilteredReadingSpotMarkers([]);
        console.log(
          "🔍 독립서점 마커만 표시:",
          independentBookstoreMarkers.length,
          "개",
        );
        break;
      case "북스테이":
        setFilteredIndependentBookstoreMarkers([]);
        setFilteredBookStayMarkers(bookStayMarkers);
        setFilteredBookCafeMarkers([]);
        setFilteredReadingSpotMarkers([]);
        console.log("🔍 북스테이 마커만 표시:", bookStayMarkers.length, "개");
        break;
      case "북카페":
        setFilteredIndependentBookstoreMarkers([]);
        setFilteredBookStayMarkers([]);
        setFilteredBookCafeMarkers(bookCafeMarkers);
        setFilteredReadingSpotMarkers([]);
        console.log("🔍 북카페 마커만 표시:", bookCafeMarkers.length, "개");
        break;
      case "책갈피":
        setFilteredIndependentBookstoreMarkers([]);
        setFilteredBookStayMarkers([]);
        setFilteredBookCafeMarkers([]);
        setFilteredReadingSpotMarkers(readingSpotMarkers);
        console.log("🔍 책갈피 마커만 표시:", readingSpotMarkers.length, "개");
        break;
      default:
        // "가볼만한 관광지" 또는 기본값 - 모든 마커 표시
        setFilteredIndependentBookstoreMarkers(independentBookstoreMarkers);
        setFilteredBookStayMarkers(bookStayMarkers);
        setFilteredBookCafeMarkers(bookCafeMarkers);
        setFilteredReadingSpotMarkers(readingSpotMarkers);
        console.log("🔍 모든 마커 표시:", {
          독립서점: independentBookstoreMarkers.length,
          북스테이: bookStayMarkers.length,
          북카페: bookCafeMarkers.length,
          책갈피: readingSpotMarkers.length,
        });
        break;
    }
  };

  // 모든 마커를 표시하는 함수 (초기 로딩 시 사용)
  const showAllMarkers = () => {
    console.log("🌟 모든 마커 표시 시작");
    setFilteredIndependentBookstoreMarkers(independentBookstoreMarkers);
    setFilteredBookStayMarkers(bookStayMarkers);
    setFilteredBookCafeMarkers(bookCafeMarkers);
    setFilteredReadingSpotMarkers(readingSpotMarkers);
    console.log("🌟 모든 마커 표시 완료:", {
      독립서점: independentBookstoreMarkers.length,
      북스테이: bookStayMarkers.length,
      북카페: bookCafeMarkers.length,
      책갈피: readingSpotMarkers.length,
    });
  };

  // 북카페, 북스테이, 독립서점 마커 데이터 가져오기
  const fetchBookstoreMarkers = async () => {
    if (isLoadingMarkers) return;

    setIsLoadingMarkers(true);
    try {
      console.log("📚 북카페, 북스테이, 독립서점 마커 데이터 가져오기 시작");

      // 독립서점 마커 가져오기
      const independentBookstoreResponse = await getBookstoreMarkersAPI();
      //console.log("📚 독립서점 API 응답:", independentBookstoreResponse);

      const filteredIndependentMarkers = (
        independentBookstoreResponse || []
      ).filter((marker: any) => marker.latitude && marker.longitude);
      setIndependentBookstoreMarkers(filteredIndependentMarkers);
      //console.log("📚 독립서점 마커:", filteredIndependentMarkers.length, "개");
      //console.log("📚 독립서점 마커 데이터:", filteredIndependentMarkers);
      //console.log("📚 독립서점 첫 번째 마커:", filteredIndependentMarkers[0]);

      // 북스테이 마커 가져오기
      const bookStayResponse = await getBookstayMarkersAPI();
      //console.log("🏨 북스테이 API 응답:", bookStayResponse);
      //console.log("🏨 북스테이 API 응답 길이:", bookStayResponse?.length);

      const filteredBookStayMarkers = (bookStayResponse || []).filter(
        (marker: any) => marker.latitude && marker.longitude,
      );
      setBookStayMarkers(filteredBookStayMarkers);
      //console.log("🏨 북스테이 마커:", filteredBookStayMarkers.length, "개");
      //console.log("🏨 북스테이 마커 데이터:", filteredBookStayMarkers);
      //console.log("🏨 북스테이 첫 번째 마커:", filteredBookStayMarkers[0]);

      // 북카페 마커 가져오기
      const bookCafeResponse = await getBookcafeMarkersAPI();
      //console.log("☕ 북카페 API 응답:", bookCafeResponse);
      //console.log("☕ 북카페 API 응답 길이:", bookCafeResponse?.length);

      const filteredBookCafeMarkers = (bookCafeResponse || []).filter(
        (marker: any) => marker.latitude && marker.longitude,
      );
      setBookCafeMarkers(filteredBookCafeMarkers);
      //console.log("☕ 북카페 마커:", filteredBookCafeMarkers.length, "개");
      //console.log("☕ 북카페 마커 데이터:", filteredBookCafeMarkers);
      //console.log("☕ 북카페 첫 번째 마커:", filteredBookCafeMarkers[0]);

      // 공간책갈피 마커 가져오기
      const readingSpotResponse = await getReadingSpotMarkersAPI();
      //console.log("📚 공간책갈피 API 응답:", readingSpotResponse);
      //console.log("📚 공간책갈피 API 응답 길이:", readingSpotResponse?.length);

      const filteredReadingSpotMarkers = (readingSpotResponse || []).filter(
        (marker: any) => marker.latitude && marker.longitude,
      );
      setReadingSpotMarkers(filteredReadingSpotMarkers);
      console.log(
        "📚 공간책갈피 마커:",
        filteredReadingSpotMarkers.length,
        "개",
      );
      //console.log("📚 공간책갈피 마커 데이터:", filteredReadingSpotMarkers);
      //console.log("📚 공간책갈피 첫 번째 마커:", filteredReadingSpotMarkers[0]);

      //console.log("📚 모든 마커 데이터 가져오기 완료");
      console.log(
        "📚 총 마커 개수:",
        filteredIndependentMarkers.length +
          filteredBookStayMarkers.length +
          filteredBookCafeMarkers.length +
          filteredReadingSpotMarkers.length,
      );

      // 초기에는 모든 마커 표시
      showAllMarkers();
    } catch (error) {
      console.error("❌ 마커 데이터 가져오기 실패:", error);
    } finally {
      setIsLoadingMarkers(false);
    }
  };

  // 컴포넌트 마운트 시 현재 위치 가져오기
  useEffect(() => {
    const initializeCurrentLocation = async () => {
      try {
        console.log("📍 컴포넌트 마운트 - 현재 위치 초기화 시작");

        // 검색에서 선택된 장소가 있으면 현재 위치 초기화하지 않음
        if (params.selectedLocation) {
          console.log(
            "🔍 검색에서 선택된 장소가 있어서 현재 위치 초기화 건너뜀",
          );
          return;
        }

        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          // 빠른 위치 가져오기
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Lowest,
          });

          const newLocation = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          console.log("📍 현재 위치 가져오기 성공:", newLocation);
          setCurrentLocation(newLocation);
          setUserLocation(newLocation);

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
            console.log("📍 현재 주소:", district);
          }
        } else {
          console.log("⚠️ 위치 권한이 거부됨, 기본 위치(서울시청) 사용");
          setCurrentAddress("위치 권한 필요");
          // 기본 위치는 이미 currentLocation 초기값으로 설정되어 있음
        }
      } catch (error) {
        console.error("❌ 현재 위치 초기화 실패:", error);
        console.log("⚠️ 기본 위치(서울시청) 사용");
        setCurrentAddress("위치 확인 실패");
      }
    };

    initializeCurrentLocation();

    // 북카페, 북스테이, 독립서점 마커 데이터 가져오기
    fetchBookstoreMarkers();
  }, []);

  // 마커 데이터가 로드된 후 자동으로 모든 마커 표시
  useEffect(() => {
    // 모든 마커 데이터가 로드되었는지 확인
    if (
      independentBookstoreMarkers.length > 0 ||
      bookStayMarkers.length > 0 ||
      bookCafeMarkers.length > 0 ||
      readingSpotMarkers.length > 0
    ) {
      console.log("🔄 마커 데이터 로드 완료 - 모든 마커 표시 시작");
      showAllMarkers();
    }
  }, [
    independentBookstoreMarkers,
    bookStayMarkers,
    bookCafeMarkers,
    readingSpotMarkers,
  ]);

  // moveToLocation이 변경될 때 지도 이동 후 상태 리셋
  useEffect(() => {
    console.log("🔄 moveToLocation 상태 변경 감지:", moveToLocation);
    if (moveToLocation) {
      console.log("🗺️ 지도 이동 요청:", moveToLocation);
      // 자동 리셋 타이머 제거 - WebView에서 지도 이동 완료 후 수동으로 리셋
      // const timer = setTimeout(() => {
      //   setMoveToLocation(null);
      // }, 300); // 0.3초 후 리셋 (더 빠른 응답)
      // return () => clearTimeout(timer);
    }
  }, [moveToLocation]);

  // URL 파라미터에서 선택된 위치 정보 처리
  useEffect(() => {
    if (params.selectedLocation) {
      try {
        const location = JSON.parse(params.selectedLocation as string);
        console.log("🔍 검색에서 선택된 위치 정보:", location);

        // 좌표가 있는지 확인
        if (location.latitude && location.longitude) {
          console.log("📍 검색에서 선택된 좌표:", {
            latitude: location.latitude,
            longitude: location.longitude,
            name: location.name,
          });

          // selectedLocation 설정 (빨간색 마커용)
          const selectedLocationData = {
            latitude: location.latitude,
            longitude: location.longitude,
            name: location.name,
            placeId: location.placeId, // placeId 추가
          };
          console.log("🔍 selectedLocation 설정:", selectedLocationData);
          setSelectedLocation(selectedLocationData);

          // currentLocation을 검색된 장소로 업데이트 (지도 중심 이동용)
          // 내 위치 마커는 userLocation을 사용하므로 이동하지 않음
          const newLocation = {
            latitude: location.latitude,
            longitude: location.longitude,
          };
          setCurrentLocation(newLocation);

          // activeMarkerId가 있으면 마커 활성화
          if (params.activeMarkerId) {
            console.log("🎯 검색에서 선택된 마커 ID:", params.activeMarkerId);
            setActiveMarkerId(params.activeMarkerId as string);
          }

          // 지도 이동을 위해 searchSelectedLocation 상태 업데이트 (장소 이름 포함)
          setSearchSelectedLocation({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            name: location.name,
          });
          console.log("🔍 검색 선택 장소로 지도 이동 요청:", {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            name: location.name,
          });
        } else {
          console.log("⚠️ 선택된 위치에 좌표 정보가 없음:", location);
        }
      } catch (error) {
        console.error("❌ 선택된 위치 파싱 오류:", error);
      }
    }
  }, [params.selectedLocation, params.activeMarkerId]);

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
      // 지도 중심점만 이동 (파란색 마커는 내 위치에 유지)
      setSearchSelectedLocation(newLocation);
      setIsLocationSelected(true); // 위치가 선택되었음을 표시

      // 지도 이동을 위해 카카오맵 컴포넌트 props 업데이트
      console.log("📍 선택된 위치로 지도 이동 요청:", newLocation);
      // KakaoMap 컴포넌트에서 자동으로 처리됨
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

    console.log("🔍 selectedMarker 계산 시작:", {
      activeMarkerId,
      selectedLocation,
      clickedMarker,
    });

    // 빨간색 마커인 경우 selectedLocation 또는 clickedMarker 정보 사용
    if (activeMarkerId.startsWith("selected_location_")) {
      if (selectedLocation) {
        const result = {
          id: activeMarkerId,
          name: selectedLocation.name,
          lat: selectedLocation.latitude,
          lng: selectedLocation.longitude,
          placeId: selectedLocation.placeId,
        };
        console.log(
          "🔍 빨간색 마커 selectedMarker 계산 결과 (selectedLocation 사용):",
          result,
        );
        return result;
      } else if (clickedMarker && clickedMarker.type === "검색된장소") {
        // selectedLocation이 없으면 clickedMarker 정보 사용
        const result = {
          id: activeMarkerId,
          name: clickedMarker.name,
          lat: clickedMarker.latitude,
          lng: clickedMarker.longitude,
          placeId: clickedMarker.placeId,
        };
        console.log(
          "🔍 빨간색 마커 selectedMarker 계산 결과 (clickedMarker 사용):",
          result,
        );
        return result;
      }
      console.log(
        "🔍 빨간색 마커이지만 selectedLocation과 clickedMarker 모두 없음",
      );
      return null;
    }

    // 실제 API 데이터에서 해당 ID 찾기 (모든 마커 타입 포함)
    const allData = [
      ...independentBookstoreMarkers,
      ...bookCafeMarkers,
      ...bookStayMarkers,
      ...readingSpotMarkers,
    ];

    // placeId 또는 id로 매칭 시도
    const markerData = allData.find(
      (item) =>
        item.placeId?.toString() === activeMarkerId ||
        item.id?.toString() === activeMarkerId,
    );

    if (!markerData) {
      console.log("🔍 API 마커 데이터를 찾을 수 없음");
      return null;
    }

    const result = {
      id: markerData.placeId?.toString() || markerData.id?.toString() || "",
      name: markerData.name,
      lat: markerData.latitude,
      lng: markerData.longitude,
      placeId: markerData.placeId,
    };
    console.log("🔍 API 마커 selectedMarker 계산 결과:", result);
    return result;
  }, [
    activeMarkerId,
    selectedLocation,
    clickedMarker,
    independentBookstoreMarkers,
    bookCafeMarkers,
    bookStayMarkers,
    readingSpotMarkers,
  ]);

  // activeMarkerId 변경 시 로그 출력 및 인포박스 업데이트
  useEffect(() => {
    console.log("🔄 activeMarkerId 변경됨:", activeMarkerId);
    if (activeMarkerId) {
      console.log("📍 활성화된 마커 ID:", activeMarkerId);

      // 인포박스 상태 업데이트 요청
      console.log("📍 활성화된 마커 인포박스 업데이트 요청:", activeMarkerId);
      // KakaoMap 컴포넌트에서 자동으로 처리됨
    } else {
      console.log("❌ 마커 선택 해제됨");
    }
  }, [activeMarkerId]);

  const getCurrentLocation = async () => {
    try {
      console.log("내 위치 버튼 클릭 - 현재 위치 가져오기 시작");
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("권한 필요", "위치 정보에 접근하려면 권한이 필요합니다.");
        return;
      }

      console.log("📍 GPS 위치 가져오기 시작...");
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest, // 가장 빠른 응답을 위한 최저 정확도
        timeInterval: 50, // 0.05초마다 업데이트 (더 빠른 응답)
        distanceInterval: 1, // 1미터마다 업데이트
      });
      console.log("📍 GPS 위치 가져오기 완료:", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: new Date(location.timestamp).toLocaleTimeString(),
      });

      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      console.log("내 위치로 이동:", newLocation);
      setCurrentLocation(newLocation);
      setIsLocationSelected(false); // 내 위치로 이동했으므로 선택된 위치 플래그 해제
      setMoveToLocation(newLocation); // 내 위치로 이동했을 때 지도 이동 상태 업데이트
      setUserLocation(newLocation); // 전역 상태에 내 위치 저장

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
        userLocation={userLocation || currentLocation} // 내 위치 마커용 별도 좌표
        moveToLocation={moveToLocation}
        searchSelectedLocation={searchSelectedLocation}
        selectedLocation={selectedLocation}
        // 북카페, 북스테이, 독립서점, 공간책갈피 마커 데이터 전달 (필터링된 데이터)
        independentBookstoreMarkers={filteredIndependentBookstoreMarkers}
        bookStayMarkers={filteredBookStayMarkers}
        bookCafeMarkers={filteredBookCafeMarkers}
        readingSpotMarkers={filteredReadingSpotMarkers}
        filterType={filterType}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === "markerSelected") {
              handleMarkerSelected(data);
            } else if (data.type === "bookmarkClick") {
              // 책갈피 마커 클릭 시 bookmark 상세 페이지로 이동
              console.log("📚 책갈피 마커 클릭됨:", data.id, data.name);
              router.push({
                pathname: "/bookmark/[id]",
                params: {
                  id: data.id,
                  title: data.name,
                  address: `위도 ${data.lat.toFixed(4)}, 경도 ${data.lng.toFixed(4)}`,
                  from: "milestone",
                },
              });
            } else if (data.type === "markerClicked") {
              // 북스테이, 북카페, 독립서점 마커 클릭 시
              console.log("📍 마커 클릭됨:", data.markerType, data.data.name);
              console.log("📍 마커 클릭 데이터 전체:", data.data);

              // activeMarkerId 설정 (placeId 또는 id 직접 사용)
              const markerId =
                data.data.placeId?.toString() ||
                data.data.id?.toString() ||
                Date.now().toString();
              setActiveMarkerId(markerId);
              console.log("🎯 activeMarkerId 설정:", markerId);

              const clickedMarkerData = {
                name: data.data.name,
                type: data.markerType,
                address:
                  data.data.address ||
                  `위도 ${data.data.latitude.toFixed(4)}, 경도 ${data.data.longitude.toFixed(4)}`,
                latitude: data.data.latitude,
                longitude: data.data.longitude,
                placeId: data.data.placeId || data.data.id,
              };

              console.log("📍 clickedMarker 상태 설정:", clickedMarkerData);
              setClickedMarker(clickedMarkerData);

              // 일반 마커 클릭 시 selectedLocation 초기화 (검색된 장소 선택 해제)
              // 이렇게 하면 새로운 마커 선택 시 검색바가 올바르게 업데이트됨
              setSelectedLocation(null);
              setSearchSelectedLocation(null);
              console.log(
                "📍 마커 클릭됨 - selectedLocation 초기화 및 마커 정보 검색바에 표시:",
                {
                  latitude: data.data.latitude,
                  longitude: data.data.longitude,
                  name: data.data.name,
                },
              );
            } else if (data.type === "selectedLocationMarkerClicked") {
              // 빨간색 마커 클릭 시 (검색에서 선택된 장소)
              console.log("🔴 빨간색 마커 클릭됨:", data.name);

              // activeMarkerId 설정 (빨간색 마커용 고유 ID)
              const markerId = `selected_location_${data.placeId || Date.now()}`;
              setActiveMarkerId(markerId);
              console.log("🎯 빨간색 마커 activeMarkerId 설정:", markerId);

              // selectedLocation 정보를 사용하여 clickedMarker 설정
              if (selectedLocation) {
                const clickedMarkerData = {
                  name: selectedLocation.name,
                  type: "검색된장소",
                  address: `위도 ${selectedLocation.latitude.toFixed(4)}, 경도 ${selectedLocation.longitude.toFixed(4)}`,
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  placeId: selectedLocation.placeId, // selectedLocation의 placeId 사용
                };

                console.log(
                  "📍 빨간색 마커 clickedMarker 상태 설정 (selectedLocation 사용):",
                  clickedMarkerData,
                );
                setClickedMarker(clickedMarkerData);
              } else {
                // selectedLocation이 없는 경우 기본 정보 사용
                const clickedMarkerData = {
                  name: data.name,
                  type: "검색된장소",
                  address: `위도 ${data.latitude.toFixed(4)}, 경도 ${data.longitude.toFixed(4)}`,
                  latitude: data.latitude,
                  longitude: data.longitude,
                  placeId: data.placeId,
                };

                console.log(
                  "📍 빨간색 마커 clickedMarker 상태 설정 (기본 정보 사용):",
                  clickedMarkerData,
                );
                setClickedMarker(clickedMarkerData);
              }
            } else if (data.type === "readingSpotClicked") {
              // 공간책갈피 마커 클릭 시 바로 상세페이지로 이동
              console.log("📚 공간책갈피 마커 클릭됨:", data.data.name);

              router.push({
                pathname: "/bookmark/[id]",
                params: {
                  id: data.data.placeId.toString(),
                  from: "milestone",
                },
              });
            } else if (data.type === "mapClicked") {
              // 지도 클릭 시 activeMarkerId와 clickedMarker 초기화
              console.log("🗺️ 지도 클릭됨 - 마커 선택 해제");
              setActiveMarkerId(null);
              setClickedMarker(null);
              setSelectedLocation(null); // 선택된 장소 정보도 초기화
              setSearchSelectedLocation(null); // 검색 선택 장소도 초기화
            } else if (data.type === "testResponse") {
              // WebView 테스트 응답 메시지
              console.log("✅ WebView 테스트 응답 수신:", data.message);
            } else if (data.type === "webViewLog") {
              // WebView에서 보내는 로그 메시지
              console.log("🔍 WebView 로그:", data.message);
            } else if (data.type === "mapReady") {
              console.log("🗺️ 지도 준비됨 - WebView 준비 상태 설정");
              setIsWebViewReady(true);
            } else if (data.type === "searchSelectedLocationComplete") {
              // 검색 선택 장소로 지도 이동이 완료되었으므로 searchSelectedLocation 상태 리셋
              setSearchSelectedLocation(null);
              console.log("🔍 검색 선택 장소로 지도 이동 완료");
            } else if (data.type === "moveToLocationComplete") {
              // 지도 이동이 완료되었으므로 moveToLocation 상태 리셋
              setMoveToLocation(null);
            } else if (data.type === "viewportChanged") {
              // 뷰포트 변경 시 상세한 로그 출력
              /*  console.log("🔄 사용자 뷰포트 변경 감지:", {
                "북쪽 경계": data.north.toFixed(6),
                "남쪽 경계": data.south.toFixed(6),
                "동쪽 경계": data.east.toFixed(6),
                "서쪽 경계": data.west.toFixed(6),
                "중심 좌표": `(${data.centerLat.toFixed(6)}, ${data.centerLng.toFixed(6)})`,
                "줌 레벨": data.zoom,
                타임스탬프: new Date(data.timestamp).toLocaleTimeString(),
                "이벤트 소스": "드래그/이동/줌",
                "뷰포트 크기": `${((data.north - data.south) * 111000).toFixed(0)}m x ${((data.east - data.west) * 111000 * Math.cos((data.centerLat * Math.PI) / 180)).toFixed(0)}m`,
              }); */

              // 전역 상태에 뷰포트 정보 저장
              setViewport({
                north: data.north,
                south: data.south,
                east: data.east,
                west: data.west,
                center: {
                  lat: data.centerLat,
                  lng: data.centerLng,
                },
                zoom: data.zoom,
              });
            }
          } catch (error) {
            console.log("메시지 파싱 오류:", error);
          }
        }}
      />
      {/* 상단 검색바 */}
      <TouchableOpacity
        style={[
          styles.searchBar,
          (isFilterActive || selectedMarker) && styles.searchBarWithBack,
        ]}
        onPress={() => {
          if (!selectedMarker) {
            router.push({
              pathname: "/search",
              params: { from: "milestone" },
            });
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
                setFilterType("가볼만한 관광지"); // 필터 타입 초기화 (기본값으로 복원)
                showAllMarkers(); // 모든 마커 표시
              }
            }}
          >
            <BackIcon style={styles.backIcon} width={25} height={25} />
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
              : activeMarkerId && selectedMarker
                ? selectedMarker.name
                : selectedLocation
                  ? selectedLocation.name
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
              setActiveMarkerId(null);
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
          (isFilterActive ||
            selectedLocation ||
            selectedMarker ||
            activeMarkerId) &&
            styles.hiddenFilterContainer,
        ]}
      >
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => {
            setIsFilterActive(true);
            setActiveFilterText("북스테이");
            setFilterType("북스테이"); // 필터 타입 설정
            filterMarkersByType("북스테이"); // 마커 필터링 적용
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
            filterMarkersByType("독립서점"); // 마커 필터링 적용
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
            setFilterType("책갈피"); // 필터 타입 설정
            filterMarkersByType("책갈피"); // 마커 필터링 적용 (mockData의 type과 일치)
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
            filterMarkersByType("북카페"); // 마커 필터링 적용
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
          (isFilterActive || selectedLocation || activeMarkerId) &&
            styles.hiddenElement,
        ]}
        onPress={async () => {
          try {
            // 로딩 상태 시작
            setIsLoadingLocation(true);
            setCurrentAddress("위치 불러오는 중...");

            // 빠른 위치 가져오기
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
              timeInterval: 500,
            });

            const newLocation = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            };

            // 내 위치 상태 업데이트
            setCurrentLocation(newLocation);
            setIsLocationSelected(false);
            setUserLocation(newLocation);

            // 내 위치로 지도 이동
            setMoveToLocation(newLocation);

            // 로딩 상태 해제 및 성공 메시지 표시
            setIsLoadingLocation(false);
            setCurrentAddress("위치 확인 완료");

            // 주소 정보는 백그라운드에서 처리
            Location.reverseGeocodeAsync({
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
            })
              .then((addressResponse) => {
                if (addressResponse.length > 0) {
                  const address = addressResponse[0];
                  const district =
                    address.district || address.subregion || "알 수 없는 지역";
                  setCurrentAddress(district);
                }
              })
              .catch((error) => {
                console.log("주소 변환 실패:", error);
              });
          } catch (error) {
            console.error("위치 가져오기 실패:", error);
            setIsLoadingLocation(false);
            setCurrentAddress("위치 확인 실패");
            Alert.alert("오류", "현재 위치를 가져올 수 없습니다.");
          }
        }}
      >
        <MyLocationIcon style={styles.myLocationIcon} color="#716C69" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.zoomButton,
          (isFilterActive ||
            selectedLocation ||
            selectedMarker ||
            activeMarkerId) &&
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
        <PlusIcon />
      </TouchableOpacity>
      {/* InfoWindow는 카카오맵에서 자동으로 처리됨 */}

      {/* 선택된 마커 모달 - clickedMarker와 selectedLocation 모두 처리 */}
      <SelectedMarkerModal
        marker={
          clickedMarker
            ? {
                id: `${clickedMarker.type}_${Date.now()}`,
                name: clickedMarker.name,
                lat: clickedMarker.latitude,
                lng: clickedMarker.longitude,
                placeId: clickedMarker.placeId,
                // 빨간색 마커인 경우 selectedLocation의 정보를 우선 사용
                ...(clickedMarker.type === "검색된장소" && selectedLocation
                  ? {
                      name: selectedLocation.name,
                      lat: selectedLocation.latitude,
                      lng: selectedLocation.longitude,
                      placeId: selectedLocation.placeId,
                    }
                  : {}),
              }
            : selectedLocation
              ? {
                  id: `selected_${Date.now()}`,
                  name: selectedLocation.name,
                  lat: selectedLocation.latitude,
                  lng: selectedLocation.longitude,
                  placeId: selectedLocation.placeId,
                }
              : null
        }
        onClose={() => {
          setClickedMarker(null);
          setSelectedLocation(null);
          setActiveMarkerId(null);
        }}
      />

      {/* 하단 카드 */}
      <View
        style={[
          styles.bottomCard,
          (isFilterActive ||
            selectedLocation ||
            selectedMarker ||
            activeMarkerId) &&
            styles.hiddenElement,
        ]}
      >
        <Text
          style={[
            styles.locationName,
            isLoadingLocation && styles.loadingLocationText,
          ]}
        >
          {isLoadingLocation
            ? "위치 불러오는 중..."
            : selectedLocation
              ? selectedLocation.name
              : currentAddress}
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
      {/* 두 번째 모달 제거 - 첫 번째 모달에서 모든 경우를 처리 */}
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
    zIndex: 1,
  },
  searchBarWithBack: {
    left: 60, // 왼쪽 여백을 늘려서 뒤로가기 버튼 공간 확보
    right: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
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
    fontSize: 11,
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
  loadingLocationText: {
    color: "#9D9896",
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
    fontSize: 12,
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
    position: "absolute",
    left: -45,
    top: 0,
    width: 35,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
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
  debugButton: {
    position: "absolute",
    top: 135,
    left: 20,
    width: 100,
    height: 45,
    backgroundColor: "#EEE9E6",
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
  debugButtonText: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
});
export default Milestone;
