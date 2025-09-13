// app/milestone.tsx
import BackIcon from "@/components/icons/BackIcon";
import BookCafeIcon from "@/components/icons/BookCafeIcon";
import BookStayIcon from "@/components/icons/BookStayIcon";
import HotPlaceIcon from "@/components/icons/HotPlaceIcon";
import IndependentBookstoreIcon from "@/components/icons/IndependentBookstoreIcon";
import MyLocationIcon from "@/components/icons/MyLocationIcon";
import RestaurantIcon from "@/components/icons/RestaurantIcon";
import SpaceBookmarkIcon from "@/components/icons/SpaceBookmarkIcon";
import TouristSpotIcon from "@/components/icons/TouristSpotIcon";
import KakaoMap from "@/components/KakaoMap";
import SelectedMarkerModal from "@/components/SelectedMarkerModal";
import {
  getBookcafeMarkersAPI,
  getBookstayMarkersAPI,
  getBookstoreMarkersAPI,
  getFestivalMarkersAPI,
  getReadingSpotMarkersAPI,
  getRestaurantMarkersAPI,
  getTouristSpotMarkersAPI,
} from "@/types/api";
import { useGlobalState } from "@/types/globalState";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  const {
    setViewport,
    setUserLocation,
    userLocation,
    viewport,
    activeMarkerId,
    setActiveMarkerId,
    selectedLocation: globalSelectedLocation,
    clickedMarker: globalClickedMarker,
    setSelectedLocation: setGlobalSelectedLocation,
    setClickedMarker: setGlobalClickedMarker,
  } = useGlobalState();
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  }>({
    latitude: 37.5665, // 서울시청 기본값
    longitude: 126.978,
  });

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

  const [filterType, setFilterType] = useState<string>("관광지"); // 기본 필터 타입 설정
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

  const [isLoadingLocation, setIsLoadingLocation] = useState(false); // 위치 로딩 상태
  const isInitialLoad = useRef(true); // 초기 로딩 여부 추적
  const viewportTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null); // 뷰포트 디바운싱 타이머

  // 북카페, 북스테이, 독립서점, 공간책갈피 마커 데이터 상태
  const [independentBookstoreMarkers, setIndependentBookstoreMarkers] =
    useState<any[]>([]);
  const [bookStayMarkers, setBookStayMarkers] = useState<any[]>([]);
  const [bookCafeMarkers, setBookCafeMarkers] = useState<any[]>([]);
  const [readingSpotMarkers, setReadingSpotMarkers] = useState<any[]>([]);
  const [touristSpotMarkers, setTouristSpotMarkers] = useState<any[]>([]);
  const [restaurantMarkers, setRestaurantMarkers] = useState<any[]>([]);
  const [festivalMarkers, setFestivalMarkers] = useState<any[]>([]);
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
  const [filteredTouristSpotMarkers, setFilteredTouristSpotMarkers] = useState<
    any[]
  >([]);
  const [filteredRestaurantMarkers, setFilteredRestaurantMarkers] = useState<
    any[]
  >([]);
  const [filteredFestivalMarkers, setFilteredFestivalMarkers] = useState<any[]>(
    [],
  );

  // 클릭된 마커 정보 상태 - 전역 상태 사용
  // const [clickedMarker, setClickedMarker] = useState<{
  //   name: string;
  //   type: string;
  //   address?: string;
  //   latitude: number;
  //   longitude: number;
  //   placeId?: number;
  // } | null>(null);

  // 필터 타입에 따라 마커 필터링하는 함수 (상단 필터용)
  const filterMarkersByType = useCallback(
    (filterType: string) => {
      console.log("🔍 상단 마커 필터링 시작:", filterType);

      switch (filterType) {
        case "독립서점":
          setFilteredIndependentBookstoreMarkers(independentBookstoreMarkers);
          setFilteredBookStayMarkers([]);
          setFilteredBookCafeMarkers([]);
          setFilteredReadingSpotMarkers([]);
          // 하단 필터 마커들도 숨김
          setFilteredTouristSpotMarkers([]);
          setFilteredRestaurantMarkers([]);
          setFilteredFestivalMarkers([]);
          console.log(
            "🔍 독립서점 마커만 표시:",
            independentBookstoreMarkers.length,
            "개",
          );
          console.log(
            "🔍 독립서점 마커 상세:",
            independentBookstoreMarkers.map((m) => ({
              name: m.name,
              lat: m.latitude,
              lng: m.longitude,
            })),
          );
          break;
        case "북스테이":
          setFilteredIndependentBookstoreMarkers([]);
          setFilteredBookStayMarkers(bookStayMarkers);
          setFilteredBookCafeMarkers([]);
          setFilteredReadingSpotMarkers([]);
          // 하단 필터 마커들도 숨김
          setFilteredTouristSpotMarkers([]);
          setFilteredRestaurantMarkers([]);
          setFilteredFestivalMarkers([]);
          console.log("🔍 북스테이 마커만 표시:", bookStayMarkers.length, "개");
          console.log(
            "🔍 북스테이 마커 상세:",
            bookStayMarkers.map((m) => ({
              name: m.name,
              lat: m.latitude,
              lng: m.longitude,
            })),
          );
          break;
        case "북카페":
          setFilteredIndependentBookstoreMarkers([]);
          setFilteredBookStayMarkers([]);
          setFilteredBookCafeMarkers(bookCafeMarkers);
          setFilteredReadingSpotMarkers([]);
          // 하단 필터 마커들도 숨김
          setFilteredTouristSpotMarkers([]);
          setFilteredRestaurantMarkers([]);
          setFilteredFestivalMarkers([]);
          console.log("🔍 북카페 마커만 표시:", bookCafeMarkers.length, "개");
          console.log(
            "🔍 북카페 마커 상세:",
            bookCafeMarkers.map((m) => ({
              name: m.name,
              lat: m.latitude,
              lng: m.longitude,
            })),
          );
          break;
        case "책갈피":
          setFilteredIndependentBookstoreMarkers([]);
          setFilteredBookStayMarkers([]);
          setFilteredBookCafeMarkers([]);
          setFilteredReadingSpotMarkers(readingSpotMarkers);
          // 하단 필터 마커들도 숨김
          setFilteredTouristSpotMarkers([]);
          setFilteredRestaurantMarkers([]);
          setFilteredFestivalMarkers([]);
          console.log(
            "🔍 책갈피 마커만 표시:",
            readingSpotMarkers.length,
            "개",
          );
          console.log(
            "🔍 책갈피 마커 상세:",
            readingSpotMarkers.map((m) => ({
              name: m.name,
              lat: m.latitude,
              lng: m.longitude,
            })),
          );
          break;
        default:
          // 기본값 - 상단 필터 마커들만 표시, 하단 필터는 별도 관리
          setFilteredIndependentBookstoreMarkers(independentBookstoreMarkers);
          setFilteredBookStayMarkers(bookStayMarkers);
          setFilteredBookCafeMarkers(bookCafeMarkers);
          setFilteredReadingSpotMarkers(readingSpotMarkers);
          // 하단 필터 마커들은 하단 필터 상태에 따라 결정
          setFilteredTouristSpotMarkers(
            selectedBottomFilters.includes("관광지") ? touristSpotMarkers : [],
          );
          setFilteredRestaurantMarkers(
            selectedBottomFilters.includes("음식점") ? restaurantMarkers : [],
          );
          setFilteredFestivalMarkers(
            selectedBottomFilters.includes("축제") ? festivalMarkers : [],
          );
          console.log("🔍 상단 마커 표시:", {
            독립서점: independentBookstoreMarkers.length,
            북스테이: bookStayMarkers.length,
            북카페: bookCafeMarkers.length,
            책갈피: readingSpotMarkers.length,
          });
          break;
      }
    },
    [
      independentBookstoreMarkers,
      bookStayMarkers,
      bookCafeMarkers,
      readingSpotMarkers,
      touristSpotMarkers,
      restaurantMarkers,
      festivalMarkers,
      selectedBottomFilters,
    ],
  );

  // 모든 마커를 표시하는 함수 (초기 로딩 시 사용 - 관광지/맛집/축제는 하단 필터 활성화 시에만)
  const showAllMarkers = useCallback(() => {
    console.log("🌟 모든 마커 표시 시작");
    setFilteredIndependentBookstoreMarkers(independentBookstoreMarkers);
    setFilteredBookStayMarkers(bookStayMarkers);
    setFilteredBookCafeMarkers(bookCafeMarkers);
    setFilteredReadingSpotMarkers(readingSpotMarkers);
    // 하단 필터 마커들은 하단 필터 상태에 따라 결정
    setFilteredTouristSpotMarkers(
      selectedBottomFilters.includes("관광지") ? touristSpotMarkers : [],
    );
    setFilteredRestaurantMarkers(
      selectedBottomFilters.includes("음식점") ? restaurantMarkers : [],
    );
    setFilteredFestivalMarkers(
      selectedBottomFilters.includes("축제") ? festivalMarkers : [],
    );
    console.log("🌟 모든 마커 표시 완료:", {
      독립서점: independentBookstoreMarkers.length,
      북스테이: bookStayMarkers.length,
      북카페: bookCafeMarkers.length,
      책갈피: readingSpotMarkers.length,
      관광지: selectedBottomFilters.includes("관광지")
        ? touristSpotMarkers.length
        : 0,
      맛집: selectedBottomFilters.includes("음식점")
        ? restaurantMarkers.length
        : 0,
      축제: selectedBottomFilters.includes("축제") ? festivalMarkers.length : 0,
    });

    // 필터링된 마커 상세 정보 로그 출력
    console.log(
      "🌟 필터링된 독립서점 마커:",
      independentBookstoreMarkers.map((m) => ({
        name: m.name,
        lat: m.latitude,
        lng: m.longitude,
      })),
    );
    console.log(
      "🌟 필터링된 북스테이 마커:",
      bookStayMarkers.map((m) => ({
        name: m.name,
        lat: m.latitude,
        lng: m.longitude,
      })),
    );
    console.log(
      "🌟 필터링된 북카페 마커:",
      bookCafeMarkers.map((m) => ({
        name: m.name,
        lat: m.latitude,
        lng: m.longitude,
      })),
    );
    console.log(
      "🌟 필터링된 공간책갈피 마커:",
      readingSpotMarkers.map((m) => ({
        name: m.name,
        lat: m.latitude,
        lng: m.longitude,
      })),
    );
    console.log(
      "🌟 필터링된 관광지 마커:",
      selectedBottomFilters.includes("관광지")
        ? touristSpotMarkers.map((m) => ({
            name: m.name,
            lat: m.latitude,
            lng: m.longitude,
          }))
        : [],
    );
    console.log(
      "🌟 필터링된 맛집 마커:",
      selectedBottomFilters.includes("음식점")
        ? restaurantMarkers.map((m) => ({
            name: m.name,
            lat: m.latitude,
            lng: m.longitude,
          }))
        : [],
    );
    console.log(
      "🌟 필터링된 축제 마커:",
      selectedBottomFilters.includes("축제")
        ? festivalMarkers.map((m) => ({
            name: m.name,
            lat: m.latitude,
            lng: m.longitude,
          }))
        : [],
    );
  }, [
    independentBookstoreMarkers,
    bookStayMarkers,
    bookCafeMarkers,
    readingSpotMarkers,
    touristSpotMarkers,
    restaurantMarkers,
    festivalMarkers,
    selectedBottomFilters,
  ]);

  // 하단 필터에 따른 마커 표시 업데이트 함수
  const updateBottomFilterMarkers = useCallback(
    async (activeFilters: string[]) => {
      console.log("🔍 하단 필터 업데이트:", activeFilters);

      // 활성화된 필터에 해당하는 마커 데이터가 없으면 즉시 로드
      const needsTouristData =
        activeFilters.includes("관광지") && touristSpotMarkers.length === 0;
      const needsRestaurantData =
        activeFilters.includes("음식점") && restaurantMarkers.length === 0;
      const needsFestivalData =
        activeFilters.includes("축제") && festivalMarkers.length === 0;

      if (needsTouristData || needsRestaurantData || needsFestivalData) {
        console.log("🔍 하단 필터 마커 데이터 즉시 로드 시작");

        if (!viewport) {
          console.log("⚠️ 뷰포트 정보가 없어서 마커 로드 건너뜀");
          return;
        }

        const { south, west, north, east } = viewport;
        console.log("🔍 하단 필터 API 전송 좌표:", {
          minLat: south,
          minLng: west,
          maxLat: north,
          maxLng: east,
        });
        const apiCalls = [];
        const apiNames = [];

        if (needsTouristData) {
          apiCalls.push(getTouristSpotMarkersAPI(south, west, north, east));
          apiNames.push("관광지");
        }
        if (needsRestaurantData) {
          apiCalls.push(getRestaurantMarkersAPI(south, west, north, east));
          apiNames.push("맛집");
        }
        if (needsFestivalData) {
          apiCalls.push(getFestivalMarkersAPI(south, west, north, east));
          apiNames.push("축제");
        }

        try {
          const responses = await Promise.all(apiCalls);
          let responseIndex = 0;

          if (needsTouristData) {
            const tourRes = responses[responseIndex++];
            const nextTour = (tourRes || []).filter(
              (m: any) => m.latitude && m.longitude,
            );
            setTouristSpotMarkers(nextTour);
            console.log("🏛️ 관광지 마커 (즉시 로드):", nextTour.length, "개");
          }
          if (needsRestaurantData) {
            const restRes = responses[responseIndex++];
            const nextRest = (restRes || []).filter(
              (m: any) => m.latitude && m.longitude,
            );
            setRestaurantMarkers(nextRest);
            console.log("🍽️ 맛집 마커 (즉시 로드):", nextRest.length, "개");
          }
          if (needsFestivalData) {
            const festRes = responses[responseIndex++];
            const nextFest = (festRes || []).filter(
              (m: any) => m.latitude && m.longitude,
            );
            setFestivalMarkers(nextFest);
            console.log("🎉 축제 마커 (즉시 로드):", nextFest.length, "개");
          }
        } catch (error) {
          console.error("❌ 하단 필터 마커 즉시 로드 실패", error);
        }
      }

      // 하단 필터에 따라 관광지/맛집/축제 마커 표시/숨김
      setFilteredTouristSpotMarkers(
        activeFilters.includes("관광지") ? touristSpotMarkers : [],
      );
      setFilteredRestaurantMarkers(
        activeFilters.includes("음식점") ? restaurantMarkers : [],
      );
      setFilteredFestivalMarkers(
        activeFilters.includes("축제") ? festivalMarkers : [],
      );

      console.log("🔍 하단 필터 적용 완료:", {
        관광지: activeFilters.includes("관광지")
          ? touristSpotMarkers.length
          : 0,
        맛집: activeFilters.includes("음식점") ? restaurantMarkers.length : 0,
        축제: activeFilters.includes("축제") ? festivalMarkers.length : 0,
      });
    },
    [touristSpotMarkers, restaurantMarkers, festivalMarkers, viewport],
  );

  // 하단 필터 마커 데이터가 로드된 후 필터 재적용
  useEffect(() => {
    if (isInitialLoad.current) return; // 초기 로딩 중이면 건너뛰기

    // 하단 필터가 활성화된 경우에만 필터 재적용
    if (selectedBottomFilters.length > 0) {
      console.log("🔄 하단 필터 마커 데이터 로드 후 필터 재적용");
      setFilteredTouristSpotMarkers(
        selectedBottomFilters.includes("관광지") ? touristSpotMarkers : [],
      );
      setFilteredRestaurantMarkers(
        selectedBottomFilters.includes("음식점") ? restaurantMarkers : [],
      );
      setFilteredFestivalMarkers(
        selectedBottomFilters.includes("축제") ? festivalMarkers : [],
      );
    }
  }, [
    touristSpotMarkers,
    restaurantMarkers,
    festivalMarkers,
    selectedBottomFilters,
  ]);

  // 뷰포트 변경 시 모든 마커 뷰포트 기반 재조회 (디바운싱 적용)
  useEffect(() => {
    if (!viewport || isInitialLoad.current) return; // 초기 로딩 중이면 건너뛰기

    // 기존 타이머가 있으면 취소
    if (viewportTimerRef.current) {
      clearTimeout(viewportTimerRef.current);
    }

    // 1.5초 후에 API 호출하도록 디바운싱 적용
    viewportTimerRef.current = setTimeout(() => {
      const { south, west, north, east } = viewport;

      const fetchViewportMarkers = async () => {
        try {
          console.log("🗺️ 뷰포트 변경 감지 → 마커 재조회 시작", {
            south,
            west,
            north,
            east,
            activeBottomFilters: selectedBottomFilters,
          });
          console.log("🗺️ API 전송 좌표:", {
            minLat: south,
            minLng: west,
            maxLat: north,
            maxLng: east,
          });

          const apiCalls = [];
          const apiNames = [];

          // 상단 필터 마커들 (북스테이, 독립서점, 북카페, 책갈피) 뷰포트 기반 재조회
          apiCalls.push(getBookstayMarkersAPI(south, west, north, east));
          apiNames.push("북스테이");
          apiCalls.push(getBookstoreMarkersAPI(south, west, north, east));
          apiNames.push("독립서점");
          apiCalls.push(getBookcafeMarkersAPI(south, west, north, east));
          apiNames.push("북카페");
          apiCalls.push(getReadingSpotMarkersAPI(south, west, north, east));
          apiNames.push("책갈피");

          // 하단 필터가 활성화된 경우에만 해당 API 호출
          if (selectedBottomFilters.includes("관광지")) {
            apiCalls.push(getTouristSpotMarkersAPI(south, west, north, east));
            apiNames.push("관광지");
          }
          if (selectedBottomFilters.includes("음식점")) {
            apiCalls.push(getRestaurantMarkersAPI(south, west, north, east));
            apiNames.push("맛집");
          }
          if (selectedBottomFilters.includes("축제")) {
            apiCalls.push(getFestivalMarkersAPI(south, west, north, east));
            apiNames.push("축제");
          }

          // 모든 API 병렬 호출
          const responses = await Promise.all(apiCalls);

          console.log(
            "📊 뷰포트 기반 API 응답:",
            apiNames.map((name, index) => ({
              [name]: responses[index],
            })),
          );

          let responseIndex = 0;

          // 상단 필터 마커들 처리
          const bookStayRes = responses[responseIndex++];
          const nextBookStay = (bookStayRes || []).filter(
            (m: any) => m.latitude && m.longitude,
          );
          setBookStayMarkers(nextBookStay);
          console.log("🏨 북스테이 마커 (뷰포트):", nextBookStay.length, "개");

          const bookstoreRes = responses[responseIndex++];
          const nextBookstore = (bookstoreRes || []).filter(
            (m: any) => m.latitude && m.longitude,
          );
          setIndependentBookstoreMarkers(nextBookstore);
          console.log("📚 독립서점 마커 (뷰포트):", nextBookstore.length, "개");

          const bookCafeRes = responses[responseIndex++];
          const nextBookCafe = (bookCafeRes || []).filter(
            (m: any) => m.latitude && m.longitude,
          );
          setBookCafeMarkers(nextBookCafe);
          console.log("☕ 북카페 마커 (뷰포트):", nextBookCafe.length, "개");

          const readingSpotRes = responses[responseIndex++];
          const nextReadingSpot = (readingSpotRes || []).filter(
            (m: any) => m.latitude && m.longitude,
          );
          setReadingSpotMarkers(nextReadingSpot);
          console.log(
            "📖 공간책갈피 마커 (뷰포트):",
            nextReadingSpot.length,
            "개",
          );

          // 하단 필터 마커들 처리
          if (selectedBottomFilters.includes("관광지")) {
            const tourRes = responses[responseIndex++];
            const nextTour = (tourRes || []).filter(
              (m: any) => m.latitude && m.longitude,
            );
            setTouristSpotMarkers(nextTour);
            console.log("🏛️ 관광지 마커 (뷰포트):", nextTour.length, "개");
          }
          if (selectedBottomFilters.includes("음식점")) {
            const restRes = responses[responseIndex++];
            const nextRest = (restRes || []).filter(
              (m: any) => m.latitude && m.longitude,
            );
            setRestaurantMarkers(nextRest);
            console.log("🍽️ 맛집 마커 (뷰포트):", nextRest.length, "개");
          }
          if (selectedBottomFilters.includes("축제")) {
            const festRes = responses[responseIndex++];
            const nextFest = (festRes || []).filter(
              (m: any) => m.latitude && m.longitude,
            );
            setFestivalMarkers(nextFest);
            console.log("🎉 축제 마커 (뷰포트):", nextFest.length, "개");
          }

          // 현재 필터 재적용
          if (isFilterActive) {
            // 필터가 활성화된 경우 해당 타입만 표시
            switch (filterType) {
              case "독립서점":
                setFilteredIndependentBookstoreMarkers(
                  independentBookstoreMarkers,
                );
                setFilteredBookStayMarkers([]);
                setFilteredBookCafeMarkers([]);
                setFilteredReadingSpotMarkers([]);
                setFilteredTouristSpotMarkers([]);
                setFilteredRestaurantMarkers([]);
                setFilteredFestivalMarkers([]);
                break;
              case "북스테이":
                setFilteredIndependentBookstoreMarkers([]);
                setFilteredBookStayMarkers(bookStayMarkers);
                setFilteredBookCafeMarkers([]);
                setFilteredReadingSpotMarkers([]);
                setFilteredTouristSpotMarkers([]);
                setFilteredRestaurantMarkers([]);
                setFilteredFestivalMarkers([]);
                break;
              case "북카페":
                setFilteredIndependentBookstoreMarkers([]);
                setFilteredBookStayMarkers([]);
                setFilteredBookCafeMarkers(bookCafeMarkers);
                setFilteredReadingSpotMarkers([]);
                setFilteredTouristSpotMarkers([]);
                setFilteredRestaurantMarkers([]);
                setFilteredFestivalMarkers([]);
                break;
              case "책갈피":
                setFilteredIndependentBookstoreMarkers([]);
                setFilteredBookStayMarkers([]);
                setFilteredBookCafeMarkers([]);
                setFilteredReadingSpotMarkers(readingSpotMarkers);
                setFilteredTouristSpotMarkers([]);
                setFilteredRestaurantMarkers([]);
                setFilteredFestivalMarkers([]);
                break;
              default:
                setFilteredIndependentBookstoreMarkers(
                  independentBookstoreMarkers,
                );
                setFilteredBookStayMarkers(bookStayMarkers);
                setFilteredBookCafeMarkers(bookCafeMarkers);
                setFilteredReadingSpotMarkers(readingSpotMarkers);
                setFilteredTouristSpotMarkers(
                  selectedBottomFilters.includes("관광지")
                    ? touristSpotMarkers
                    : [],
                );
                setFilteredRestaurantMarkers(
                  selectedBottomFilters.includes("음식점")
                    ? restaurantMarkers
                    : [],
                );
                setFilteredFestivalMarkers(
                  selectedBottomFilters.includes("축제") ? festivalMarkers : [],
                );
                break;
            }
          } else {
            // 필터가 비활성화된 경우 모든 마커 표시
            setFilteredIndependentBookstoreMarkers(independentBookstoreMarkers);
            setFilteredBookStayMarkers(bookStayMarkers);
            setFilteredBookCafeMarkers(bookCafeMarkers);
            setFilteredReadingSpotMarkers(readingSpotMarkers);
            setFilteredTouristSpotMarkers(
              selectedBottomFilters.includes("관광지")
                ? touristSpotMarkers
                : [],
            );
            setFilteredRestaurantMarkers(
              selectedBottomFilters.includes("음식점") ? restaurantMarkers : [],
            );
            setFilteredFestivalMarkers(
              selectedBottomFilters.includes("축제") ? festivalMarkers : [],
            );
          }
        } catch (error) {
          console.error("❌ 뷰포트 기반 마커 조회 실패", error);
        }
      };

      fetchViewportMarkers();
    }, 1000); // 1초 디바운싱

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      if (viewportTimerRef.current) {
        clearTimeout(viewportTimerRef.current);
      }
    };
  }, [viewport, selectedBottomFilters, filterType, isFilterActive]);

  // 북카페, 북스테이, 독립서점 마커 데이터 가져오기
  const fetchBookstoreMarkers = async () => {
    if (isLoadingMarkers) return;

    setIsLoadingMarkers(true);
    try {
      console.log("📚 북카페, 북스테이, 독립서점 마커 데이터 가져오기 시작");

      // 초기 로딩용 좌표 (전체 한국)
      const initialCoords = {
        minLat: 33.0,
        minLng: 124.5,
        maxLat: 38.6,
        maxLng: 132.0,
      };
      console.log("📚 초기 로딩 API 전송 좌표:", initialCoords);

      // 독립서점 마커 가져오기 (뷰포트 기반으로 변경)
      const independentBookstoreResponse = await getBookstoreMarkersAPI(
        initialCoords.minLat,
        initialCoords.minLng,
        initialCoords.maxLat,
        initialCoords.maxLng,
      );
      //console.log("📚 독립서점 API 응답:", independentBookstoreResponse);

      const filteredIndependentMarkers = (
        independentBookstoreResponse || []
      ).filter((marker: any) => marker.latitude && marker.longitude);
      setIndependentBookstoreMarkers(filteredIndependentMarkers);
      //console.log("📚 독립서점 마커:", filteredIndependentMarkers.length, "개");
      //console.log("📚 독립서점 마커 데이터:", filteredIndependentMarkers);
      //console.log("📚 독립서점 첫 번째 마커:", filteredIndependentMarkers[0]);

      // 북스테이 마커 가져오기 (뷰포트 기반으로 변경)
      const bookStayResponse = await getBookstayMarkersAPI(
        initialCoords.minLat,
        initialCoords.minLng,
        initialCoords.maxLat,
        initialCoords.maxLng,
      );
      //console.log("🏨 북스테이 API 응답:", bookStayResponse);
      //console.log("🏨 북스테이 API 응답 길이:", bookStayResponse?.length);

      const filteredBookStayMarkers = (bookStayResponse || []).filter(
        (marker: any) => marker.latitude && marker.longitude,
      );
      setBookStayMarkers(filteredBookStayMarkers);
      //console.log("🏨 북스테이 마커:", filteredBookStayMarkers.length, "개");
      //console.log("🏨 북스테이 마커 데이터:", filteredBookStayMarkers);
      //console.log("🏨 북스테이 첫 번째 마커:", filteredBookStayMarkers[0]);

      // 북카페 마커 가져오기 (뷰포트 기반으로 변경)
      const bookCafeResponse = await getBookcafeMarkersAPI(
        initialCoords.minLat,
        initialCoords.minLng,
        initialCoords.maxLat,
        initialCoords.maxLng,
      );
      //console.log("☕ 북카페 API 응답:", bookCafeResponse);
      //console.log("☕ 북카페 API 응답 길이:", bookCafeResponse?.length);

      const filteredBookCafeMarkers = (bookCafeResponse || []).filter(
        (marker: any) => marker.latitude && marker.longitude,
      );
      setBookCafeMarkers(filteredBookCafeMarkers);
      //console.log("☕ 북카페 마커:", filteredBookCafeMarkers.length, "개");
      //console.log("☕ 북카페 마커 데이터:", filteredBookCafeMarkers);
      //console.log("☕ 북카페 첫 번째 마커:", filteredBookCafeMarkers[0]);

      // 공간책갈피 마커 가져오기 (뷰포트 기반으로 변경)
      const readingSpotResponse = await getReadingSpotMarkersAPI(
        initialCoords.minLat,
        initialCoords.minLng,
        initialCoords.maxLat,
        initialCoords.maxLng,
      );
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

      // 관광지/맛집/축제 마커는 하단 필터가 활성화될 때만 로드하므로 초기 로딩에서는 건너뜀
      console.log("📚 관광지/맛집/축제 마커는 하단 필터 활성화 시에만 로드됨");

      //console.log("📚 모든 마커 데이터 가져오기 완료");
      console.log(
        "📚 총 마커 개수 (초기 로딩):",
        filteredIndependentMarkers.length +
          filteredBookStayMarkers.length +
          filteredBookCafeMarkers.length +
          filteredReadingSpotMarkers.length,
      );

      // 각 마커 타입별 상세 정보 로그 출력
      console.log(
        "📚 독립서점 마커 상세:",
        filteredIndependentMarkers.map((m) => ({
          name: m.name,
          lat: m.latitude,
          lng: m.longitude,
        })),
      );
      console.log(
        "🏨 북스테이 마커 상세:",
        filteredBookStayMarkers.map((m) => ({
          name: m.name,
          lat: m.latitude,
          lng: m.longitude,
        })),
      );
      console.log(
        "☕ 북카페 마커 상세:",
        filteredBookCafeMarkers.map((m) => ({
          name: m.name,
          lat: m.latitude,
          lng: m.longitude,
        })),
      );
      console.log(
        "📖 공간책갈피 마커 상세:",
        filteredReadingSpotMarkers.map((m) => ({
          name: m.name,
          lat: m.latitude,
          lng: m.longitude,
        })),
      );

      // 마커 데이터 로드 완료 - useEffect에서 자동으로 표시됨
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

        // 전역 뷰포트 중심이 있으면 그 위치로 복원하고 GPS 초기화는 건너뜀
        if (viewport && viewport.center) {
          const center = {
            latitude: viewport.center.lat,
            longitude: viewport.center.lng,
          };
          console.log("🧭 전역 뷰포트 중심 복원:", center);
          setCurrentLocation(center);

          // 뷰포트가 설정된 경우 즉시 마커 조회
          console.log("🗺️ 뷰포트 기반 마커 즉시 조회 시작");
          const { south, west, north, east } = viewport;

          try {
            const apiCalls = [];
            const apiNames = [];

            // 상단 필터 마커들 (북스테이, 독립서점, 북카페, 책갈피) 뷰포트 기반 조회
            apiCalls.push(getBookstayMarkersAPI(south, west, north, east));
            apiNames.push("북스테이");
            apiCalls.push(getBookstoreMarkersAPI(south, west, north, east));
            apiNames.push("독립서점");
            apiCalls.push(getBookcafeMarkersAPI(south, west, north, east));
            apiNames.push("북카페");
            apiCalls.push(getReadingSpotMarkersAPI(south, west, north, east));
            apiNames.push("책갈피");

            const responses = await Promise.all(apiCalls);
            let responseIndex = 0;

            // 상단 필터 마커들 처리
            const bookStayRes = responses[responseIndex++];
            const nextBookStay = (bookStayRes || []).filter(
              (m: any) => m.latitude && m.longitude,
            );
            setBookStayMarkers(nextBookStay);
            console.log(
              "🏨 북스테이 마커 (즉시 조회):",
              nextBookStay.length,
              "개",
            );

            const bookstoreRes = responses[responseIndex++];
            const nextBookstore = (bookstoreRes || []).filter(
              (m: any) => m.latitude && m.longitude,
            );
            setIndependentBookstoreMarkers(nextBookstore);
            console.log(
              "📚 독립서점 마커 (즉시 조회):",
              nextBookstore.length,
              "개",
            );

            const bookCafeRes = responses[responseIndex++];
            const nextBookCafe = (bookCafeRes || []).filter(
              (m: any) => m.latitude && m.longitude,
            );
            setBookCafeMarkers(nextBookCafe);
            console.log(
              "☕ 북카페 마커 (즉시 조회):",
              nextBookCafe.length,
              "개",
            );

            const readingSpotRes = responses[responseIndex++];
            const nextReadingSpot = (readingSpotRes || []).filter(
              (m: any) => m.latitude && m.longitude,
            );
            setReadingSpotMarkers(nextReadingSpot);
            console.log(
              "📖 공간책갈피 마커 (즉시 조회):",
              nextReadingSpot.length,
              "개",
            );

            console.log("🗺️ 뷰포트 기반 마커 즉시 조회 완료");
          } catch (error) {
            console.error("❌ 뷰포트 기반 마커 즉시 조회 실패:", error);
          }

          // 전역 activeMarkerId가 있으면 복원
          if (activeMarkerId) {
            console.log("🎯 전역 activeMarkerId 복원:", activeMarkerId);
            // 전역 activeMarkerId는 이미 설정되어 있으므로 KakaoMap에서 자동으로 처리됨

            // activeMarkerId가 있으면 해당 마커 정보를 clickedMarker로 복원
            // 이는 마커 데이터가 로드된 후에 처리되어야 함
          }
          return;
        }

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

    // 전역 뷰포트가 없는 경우에만 초기 마커 데이터 가져오기
    if (!viewport || !viewport.center) {
      // 북카페, 북스테이, 독립서점 마커 데이터 가져오기
      fetchBookstoreMarkers();
    }
  }, []);

  // 마커 데이터가 로드된 후 자동으로 모든 마커 표시
  useEffect(() => {
    // 초기 로딩이 아니면 건너뛰기
    if (!isInitialLoad.current) return;

    // 모든 마커 데이터가 로드되었는지 확인
    if (
      independentBookstoreMarkers.length > 0 ||
      bookStayMarkers.length > 0 ||
      bookCafeMarkers.length > 0 ||
      readingSpotMarkers.length > 0 ||
      touristSpotMarkers.length > 0 ||
      restaurantMarkers.length > 0 ||
      festivalMarkers.length > 0
    ) {
      console.log("🔄 마커 데이터 로드 완료 - 마커 표시 시작");
      isInitialLoad.current = false; // 초기 로딩 완료 표시
      // 필터가 활성화된 경우 필터링 적용, 아니면 모든 마커 표시
      if (isFilterActive) {
        // 필터가 활성화된 경우 해당 타입만 표시
        switch (filterType) {
          case "독립서점":
            setFilteredIndependentBookstoreMarkers(independentBookstoreMarkers);
            setFilteredBookStayMarkers([]);
            setFilteredBookCafeMarkers([]);
            setFilteredReadingSpotMarkers([]);
            setFilteredTouristSpotMarkers([]);
            setFilteredRestaurantMarkers([]);
            setFilteredFestivalMarkers([]);
            break;
          case "북스테이":
            setFilteredIndependentBookstoreMarkers([]);
            setFilteredBookStayMarkers(bookStayMarkers);
            setFilteredBookCafeMarkers([]);
            setFilteredReadingSpotMarkers([]);
            setFilteredTouristSpotMarkers([]);
            setFilteredRestaurantMarkers([]);
            setFilteredFestivalMarkers([]);
            break;
          case "북카페":
            setFilteredIndependentBookstoreMarkers([]);
            setFilteredBookStayMarkers([]);
            setFilteredBookCafeMarkers(bookCafeMarkers);
            setFilteredReadingSpotMarkers([]);
            setFilteredTouristSpotMarkers([]);
            setFilteredRestaurantMarkers([]);
            setFilteredFestivalMarkers([]);
            break;
          case "책갈피":
            setFilteredIndependentBookstoreMarkers([]);
            setFilteredBookStayMarkers([]);
            setFilteredBookCafeMarkers([]);
            setFilteredReadingSpotMarkers(readingSpotMarkers);
            setFilteredTouristSpotMarkers([]);
            setFilteredRestaurantMarkers([]);
            setFilteredFestivalMarkers([]);
            break;
          default:
            setFilteredIndependentBookstoreMarkers(independentBookstoreMarkers);
            setFilteredBookStayMarkers(bookStayMarkers);
            setFilteredBookCafeMarkers(bookCafeMarkers);
            setFilteredReadingSpotMarkers(readingSpotMarkers);
            setFilteredTouristSpotMarkers(
              selectedBottomFilters.includes("관광지")
                ? touristSpotMarkers
                : [],
            );
            setFilteredRestaurantMarkers(
              selectedBottomFilters.includes("음식점") ? restaurantMarkers : [],
            );
            setFilteredFestivalMarkers(
              selectedBottomFilters.includes("축제") ? festivalMarkers : [],
            );
            break;
        }
      } else {
        // 필터가 비활성화된 경우 모든 마커 표시
        setFilteredIndependentBookstoreMarkers(independentBookstoreMarkers);
        setFilteredBookStayMarkers(bookStayMarkers);
        setFilteredBookCafeMarkers(bookCafeMarkers);
        setFilteredReadingSpotMarkers(readingSpotMarkers);
        setFilteredTouristSpotMarkers(
          selectedBottomFilters.includes("관광지") ? touristSpotMarkers : [],
        );
        setFilteredRestaurantMarkers(
          selectedBottomFilters.includes("음식점") ? restaurantMarkers : [],
        );
        setFilteredFestivalMarkers(
          selectedBottomFilters.includes("축제") ? festivalMarkers : [],
        );
      }

      // activeMarkerId가 있으면 해당 마커 정보를 clickedMarker로 복원
      if (activeMarkerId) {
        console.log(
          "🎯 마커 데이터 로드 후 activeMarkerId 복원 시도:",
          activeMarkerId,
        );

        // selected_location_ 접두사가 있는 경우 빨간색 마커 처리
        if (activeMarkerId.startsWith("selected_location_")) {
          console.log("🎯 빨간색 마커 복원 - selectedLocation 정보 사용");
          // selectedLocation 정보는 이미 있으므로 별도 처리 불필요
        } else {
          // 일반 마커의 경우 모든 마커 데이터에서 찾기
          const allMarkers = [
            ...independentBookstoreMarkers,
            ...bookStayMarkers,
            ...bookCafeMarkers,
            ...readingSpotMarkers,
            ...touristSpotMarkers,
            ...restaurantMarkers,
            ...festivalMarkers,
          ];

          const targetMarker = allMarkers.find(
            (marker) =>
              marker.placeId?.toString() === activeMarkerId ||
              marker.id?.toString() === activeMarkerId,
          );

          if (targetMarker) {
            console.log("🎯 마커 정보 복원 성공:", targetMarker.name);

            // 마커 타입 결정
            let markerType = "기타";
            if (
              independentBookstoreMarkers.some(
                (m) => m.placeId === targetMarker.placeId,
              )
            )
              markerType = "독립서점";
            else if (
              bookStayMarkers.some((m) => m.placeId === targetMarker.placeId)
            )
              markerType = "북스테이";
            else if (
              bookCafeMarkers.some((m) => m.placeId === targetMarker.placeId)
            )
              markerType = "북카페";
            else if (
              touristSpotMarkers.some((m) => m.placeId === targetMarker.placeId)
            )
              markerType = "관광지";
            else if (
              restaurantMarkers.some((m) => m.placeId === targetMarker.placeId)
            )
              markerType = "맛집";
            else if (
              festivalMarkers.some((m) => m.placeId === targetMarker.placeId)
            )
              markerType = "축제";

            const clickedMarkerData = {
              name: targetMarker.name,
              type: markerType,
              address:
                targetMarker.address ||
                `위도 ${targetMarker.latitude.toFixed(4)}, 경도 ${targetMarker.longitude.toFixed(4)}`,
              latitude: targetMarker.latitude,
              longitude: targetMarker.longitude,
              placeId: targetMarker.placeId,
            };

            setGlobalClickedMarker(clickedMarkerData);
            console.log("🎯 clickedMarker 복원 완료:", clickedMarkerData);
          } else {
            console.log("🎯 마커 정보를 찾을 수 없음:", activeMarkerId);
          }
        }
      }
    }
  }, [
    independentBookstoreMarkers,
    bookStayMarkers,
    bookCafeMarkers,
    readingSpotMarkers,
    touristSpotMarkers,
    restaurantMarkers,
    festivalMarkers,
    activeMarkerId,
    isFilterActive,
    filterType,
    selectedBottomFilters,
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
    console.log("🔍 URL 파라미터 확인:", {
      selectedLocation: params.selectedLocation,
      activeMarkerId: params.activeMarkerId,
    });

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

            // 검색에서 선택된 마커의 경우 selectedLocation 정보를 사용하여 clickedMarker 설정
            const clickedMarkerData = {
              name: location.name,
              type: "검색된장소",
              address: `위도 ${location.latitude.toFixed(4)}, 경도 ${location.longitude.toFixed(4)}`,
              latitude: location.latitude,
              longitude: location.longitude,
              placeId: location.placeId,
            };

            setGlobalClickedMarker(clickedMarkerData);
            console.log(
              "🎯 검색에서 선택된 마커 clickedMarker 설정:",
              clickedMarkerData,
            );
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
      selectedLocation: globalSelectedLocation,
      clickedMarker: globalClickedMarker,
    });

    // 빨간색 마커인 경우 selectedLocation 또는 clickedMarker 정보 사용
    if (activeMarkerId.startsWith("selected_location_")) {
      if (globalSelectedLocation) {
        const result = {
          id: activeMarkerId,
          name: globalSelectedLocation.name,
          lat: globalSelectedLocation.latitude,
          lng: globalSelectedLocation.longitude,
          placeId: globalSelectedLocation.placeId,
        };
        console.log(
          "🔍 빨간색 마커 selectedMarker 계산 결과 (selectedLocation 사용):",
          result,
        );
        return result;
      } else if (
        globalClickedMarker &&
        globalClickedMarker.type === "검색된장소"
      ) {
        // selectedLocation이 없으면 clickedMarker 정보 사용
        const result = {
          id: activeMarkerId,
          name: globalClickedMarker.name,
          lat: globalClickedMarker.latitude,
          lng: globalClickedMarker.longitude,
          placeId: globalClickedMarker.placeId,
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
      ...touristSpotMarkers,
      ...restaurantMarkers,
      ...festivalMarkers,
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
    globalSelectedLocation,
    globalClickedMarker,
    independentBookstoreMarkers,
    bookCafeMarkers,
    bookStayMarkers,
    readingSpotMarkers,
    touristSpotMarkers,
    restaurantMarkers,
    festivalMarkers,
  ]);

  // activeMarkerId 변경 시 로그 출력 및 인포박스 업데이트
  useEffect(() => {
    console.log("🔄 activeMarkerId 변경됨:", activeMarkerId);
    if (activeMarkerId) {
      console.log("📍 활성화된 마커 ID:", activeMarkerId);
      console.log("📍 활성화된 마커 ID 타입:", typeof activeMarkerId);

      // 인포박스 상태 업데이트 요청
      console.log("📍 활성화된 마커 인포박스 업데이트 요청:", activeMarkerId);
      // KakaoMap 컴포넌트에서 자동으로 처리됨
    } else {
      console.log("❌ 마커 선택 해제됨");
    }
  }, [activeMarkerId]);

  return (
    <View style={styles.container}>
      {/* 카카오맵 컴포넌트 */}
      <KakaoMap
        latitude={currentLocation.latitude}
        longitude={currentLocation.longitude}
        userLocation={userLocation || currentLocation} // 내 위치 마커용 별도 좌표
        moveToLocation={moveToLocation}
        searchSelectedLocation={searchSelectedLocation}
        selectedLocation={globalSelectedLocation}
        // 북카페, 북스테이, 독립서점, 공간책갈피 마커 데이터 전달 (필터링된 데이터)
        independentBookstoreMarkers={filteredIndependentBookstoreMarkers}
        bookStayMarkers={filteredBookStayMarkers}
        bookCafeMarkers={filteredBookCafeMarkers}
        readingSpotMarkers={filteredReadingSpotMarkers}
        touristSpotMarkers={filteredTouristSpotMarkers}
        restaurantMarkers={filteredRestaurantMarkers}
        festivalMarkers={filteredFestivalMarkers}
        filterType={filterType}
        activeMarkerId={activeMarkerId} // 전역 activeMarkerId 전달
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
              setGlobalClickedMarker(clickedMarkerData);

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
              if (globalSelectedLocation) {
                const clickedMarkerData = {
                  name: globalSelectedLocation.name,
                  type: "검색된장소",
                  address: `위도 ${globalSelectedLocation.latitude.toFixed(4)}, 경도 ${globalSelectedLocation.longitude.toFixed(4)}`,
                  latitude: globalSelectedLocation.latitude,
                  longitude: globalSelectedLocation.longitude,
                  placeId: globalSelectedLocation.placeId, // selectedLocation의 placeId 사용
                };

                console.log(
                  "📍 빨간색 마커 clickedMarker 상태 설정 (selectedLocation 사용):",
                  clickedMarkerData,
                );
                setGlobalClickedMarker(clickedMarkerData);
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
                setGlobalClickedMarker(clickedMarkerData);
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
              setGlobalClickedMarker(null);
              setGlobalSelectedLocation(null); // 전역 선택된 장소 정보도 초기화
              setSelectedLocation(null); // 로컬 선택된 장소 정보도 초기화
              setSearchSelectedLocation(null); // 검색 선택 장소도 초기화
            } else if (data.type === "testResponse") {
              // WebView 테스트 응답 메시지
              console.log("✅ WebView 테스트 응답 수신:", data.message);
            } else if (data.type === "webViewLog") {
              // WebView에서 보내는 로그 메시지
              console.log("🔍 WebView 로그:", data.message);
            } else if (data.type === "mapReady") {
              console.log("🗺️ 지도 준비됨");
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
                setFilterType("관광지"); // 필터 타입 초기화 (기본값으로 복원)
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
          allowFontScaling={false}
        />
        {selectedLocation ? (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSelectedLocation(null);
              setActiveMarkerId(null);
            }}
          >
            <Feather name="x" size={20} color="#999999" />
          </TouchableOpacity>
        ) : (
          <View style={styles.searchButton}>
            <AntDesign name="search1" size={24} color="#999999" />
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
          <Text style={styles.filterText} allowFontScaling={false}>
            북스테이
          </Text>
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
          <Text style={styles.filterText} allowFontScaling={false}>
            독립서점
          </Text>
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
          <Text style={styles.filterText} allowFontScaling={false}>
            공간책갈피
          </Text>
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
          <Text style={styles.filterText} allowFontScaling={false}>
            북카페
          </Text>
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
        <Entypo name="plus" size={33} color="black" />
      </TouchableOpacity>
      {/* InfoWindow는 카카오맵에서 자동으로 처리됨 */}

      {/* 선택된 마커 모달 - clickedMarker와 selectedLocation 모두 처리 */}
      <SelectedMarkerModal
        marker={
          globalClickedMarker
            ? {
                id: `${globalClickedMarker.type}_${Date.now()}`,
                name: globalClickedMarker.name,
                lat: globalClickedMarker.latitude,
                lng: globalClickedMarker.longitude,
                placeId: globalClickedMarker.placeId,
                // 빨간색 마커인 경우 selectedLocation의 정보를 우선 사용
                ...(globalClickedMarker.type === "검색된장소" &&
                globalSelectedLocation
                  ? {
                      name: globalSelectedLocation.name,
                      lat: globalSelectedLocation.latitude,
                      lng: globalSelectedLocation.longitude,
                      placeId: globalSelectedLocation.placeId,
                    }
                  : {}),
              }
            : globalSelectedLocation
              ? {
                  id: `selected_${Date.now()}`,
                  name: globalSelectedLocation.name,
                  lat: globalSelectedLocation.latitude,
                  lng: globalSelectedLocation.longitude,
                  placeId: globalSelectedLocation.placeId,
                }
              : null
        }
        onClose={() => {
          setGlobalClickedMarker(null);
          setGlobalSelectedLocation(null);
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
          allowFontScaling={false}
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
              selectedBottomFilters.includes("음식점") &&
                styles.selectedFilterButton,
            ]}
            onPress={() => {
              const filter = "음식점";
              const newFilters = selectedBottomFilters.includes(filter)
                ? selectedBottomFilters.filter((f) => f !== filter) // 이미 선택된 경우 제거
                : [...selectedBottomFilters, filter]; // 선택되지 않은 경우 추가

              setSelectedBottomFilters(newFilters);

              // 필터 변경 시 마커 표시 업데이트
              updateBottomFilterMarkers(newFilters);
            }}
          >
            <RestaurantIcon
              style={styles.bottomFilterIcon}
              color={
                selectedBottomFilters.includes("음식점") ? "#FFFFFF" : "#9D9896"
              }
            />
            <Text
              style={[
                styles.bottomFilterText,
                selectedBottomFilters.includes("음식점") &&
                  styles.selectedFilterText,
              ]}
              allowFontScaling={false}
            >
              음식점
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomFilterButton,
              selectedBottomFilters.includes("관광지") &&
                styles.selectedFilterButton,
            ]}
            onPress={() => {
              const filter = "관광지";
              const newFilters = selectedBottomFilters.includes(filter)
                ? selectedBottomFilters.filter((f) => f !== filter) // 이미 선택된 경우 제거
                : [...selectedBottomFilters, filter]; // 선택되지 않은 경우 추가

              setSelectedBottomFilters(newFilters);

              // 필터 변경 시 마커 표시 업데이트
              updateBottomFilterMarkers(newFilters);
            }}
          >
            <TouristSpotIcon
              style={styles.bottomFilterIcon}
              color={
                selectedBottomFilters.includes("관광지") ? "#FFFFFF" : "#9D9896"
              }
            />
            <Text
              style={[
                styles.bottomFilterText,
                selectedBottomFilters.includes("관광지") &&
                  styles.selectedFilterText,
              ]}
              allowFontScaling={false}
            >
              관광지
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.bottomFilterButton,
              selectedBottomFilters.includes("축제") &&
                styles.selectedFilterButton,
            ]}
            onPress={() => {
              const filter = "축제";
              const newFilters = selectedBottomFilters.includes(filter)
                ? selectedBottomFilters.filter((f) => f !== filter) // 이미 선택된 경우 제거
                : [...selectedBottomFilters, filter]; // 선택되지 않은 경우 추가

              setSelectedBottomFilters(newFilters);

              // 필터 변경 시 마커 표시 업데이트
              updateBottomFilterMarkers(newFilters);
            }}
          >
            <HotPlaceIcon
              style={styles.bottomFilterIcon}
              color={
                selectedBottomFilters.includes("축제") ? "#FFFFFF" : "#9D9896"
              }
            />
            <Text
              style={[
                styles.bottomFilterText,
                selectedBottomFilters.includes("축제") &&
                  styles.selectedFilterText,
              ]}
              allowFontScaling={false}
            >
              축제
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
    backgroundColor: "#F8F4F2",
  },
  searchBar: {
    position: "absolute",
    top: 50,
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
    fontSize: 15,
    fontFamily: "SUIT-600",
    color: "#C5BFBB",
  },
  filterActiveSearchInput: {
    color: "#262423",
  },
  searchButton: {
    marginLeft: 10,
  },

  clearButton: {
    marginLeft: 10,
    padding: 5,
  },

  filterContainer: {
    position: "absolute",
    top: 110,
    left: 20,
    right: 20,
    flexDirection: "row",
    gap: 5,
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
    fontSize: 12,
    fontFamily: "SUIT-600",
    color: "#716C69",
  },
  myLocationButton: {
    position: "absolute",
    top: 155,
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
    fontSize: 29,
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
    fontSize: 19,
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
    fontSize: 15,
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
    fontSize: 15,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
});
export default Milestone;
