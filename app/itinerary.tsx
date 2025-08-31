import EditTripNameModal from "@/components/EditTripNameModal";
import BackIcon from "@/components/icons/BackIcon";
import ItineraryMap, { ItineraryMapRef } from "@/components/ItineraryMap";
import { createTravelCourseAPI, getPlaceDetailAPI } from "@/types/api";
import { useGlobalState } from "@/types/globalState";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ItinerarySpot {
  id: string;
  name: string;
  time: string;
  placeId?: number;
  latitude?: number;
  longitude?: number;
  placeType?: string;
}

interface DayPlan {
  date: string;
  dayNumber: string;
  spots: ItinerarySpot[];
}

export default function Itinerary() {
  const params = useLocalSearchParams();
  const { addTravelSchedule, removeTravelSchedule } = useGlobalState();

  const [selectedDay, setSelectedDay] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPublic, setIsPublic] = useState(false); // 공개/비공개 상태
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null); // 선택된 장소 ID
  const slideAnim = useRef(new Animated.Value(0)).current; // 슬라이드 애니메이션 값

  // 현재 위치를 메모이제이션하여 불필요한 재렌더링 방지
  const currentLocation = useMemo(
    () => ({
      latitude: 37.8228, // 강원도 춘천시
      longitude: 127.7322,
    }),
    [],
  );

  const webViewRef = useRef<ItineraryMapRef>(null);

  // 고유한 ID를 생성하는 함수
  const generateUniqueId = (placeId: number, day: string): string => {
    return `spot_${placeId}_${day}_${Math.random().toString(36).substr(2, 9)}`;
  };

  // placeType을 한국어로 변환하는 함수
  const getKoreanPlaceType = (placeType: string | undefined): string => {
    if (!placeType) return "장소";

    switch (placeType.toUpperCase()) {
      case "BOOKSTORE":
        return "독립서점";
      case "BOOKCAFE":
        return "북카페";
      case "BOOKSTAY":
        return "북스테이";
      case "FESTIVAL":
        return "축제";
      case "TOURIST_SPOT":
        return "관광명소";
      case "RESTAURANT":
        return "식당/카페";
      case "CAFE":
        return "카페";
      case "HOTEL":
        return "숙박";
      case "MUSEUM":
        return "박물관";
      case "PARK":
        return "공원";
      case "SHOPPING":
        return "쇼핑";
      case "CULTURE":
        return "문화시설";
      case "NATURE":
        return "자연경관";
      case "HISTORIC":
        return "역사문화";
      case "ENTERTAINMENT":
        return "엔터테인먼트";
      case "SPORTS":
        return "스포츠";
      case "TRANSPORT":
        return "교통";
      case "HEALTH":
        return "건강/의료";
      case "EDUCATION":
        return "교육";
      case "GOVERNMENT":
        return "행정기관";
      default:
        return placeType || "장소";
    }
  };

  // 전역 상태의 장소 정보를 실제 API로 가져와서 업데이트하는 함수
  const loadPlaceDetailsFromGlobalState = async () => {
    try {
      console.log("🚀 loadPlaceDetailsFromGlobalState 함수 시작");
      console.log("📊 현재 travelScheduleList:", travelScheduleList);

      // 전역 상태에서 실제 장소가 있는 항목들만 필터링
      const realPlaces = travelScheduleList.filter(
        (item) => item.placeId !== 0,
      );

      console.log("🎯 실제 장소가 있는 항목들:", realPlaces);

      if (realPlaces.length === 0) {
        console.log("⚠️ 실제 장소가 없음 - 함수 종료");
        return;
      }

      console.log(
        "🔍 전역 상태에서 장소 상세 정보 로드 시작:",
        realPlaces.length,
        "개",
      );

      // 각 장소의 상세 정보를 API로 가져오기
      for (const place of realPlaces) {
        try {
          const placeDetail = await getPlaceDetailAPI(place.placeId);

          if (placeDetail.isSuccess && placeDetail.result) {
            // tripData의 해당 날짜에 장소 정보 업데이트
            setTripData((prev) => {
              const newDays = [...prev.days];

              // 날짜를 MM.DD 형식으로 변환
              const formatDate = (dateStr: string) => {
                const date = new Date(dateStr);
                return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
              };

              const targetDate = formatDate(place.day);
              const dayIndex = newDays.findIndex(
                (day) => day.date === targetDate,
              );

              if (dayIndex !== -1) {
                // 해당 날짜에 장소가 이미 있는지 확인
                const existingSpotIndex = newDays[dayIndex].spots.findIndex(
                  (spot) => spot.placeId === place.placeId,
                );

                if (existingSpotIndex === -1) {
                  // 새로운 장소 추가
                  const newSpot = {
                    id: generateUniqueId(place.placeId, place.day),
                    name: placeDetail.result.name,
                    time: "시간 미정",
                    placeId: place.placeId,
                    latitude: placeDetail.result.latitude,
                    longitude: placeDetail.result.longitude,
                    placeType: placeDetail.result.placeType,
                  };

                  newDays[dayIndex] = {
                    ...newDays[dayIndex],
                    spots: [...newDays[dayIndex].spots, newSpot],
                  };

                  console.log("✅ 장소 상세 정보 로드 완료:", {
                    day: targetDate,
                    placeName: placeDetail.result.name,
                    placeId: place.placeId,
                    placeType: placeDetail.result.placeType,
                  });
                }
              }

              return { ...prev, days: newDays };
            });
          }
        } catch (error) {
          console.error(
            "❌ 장소 상세 정보 로드 실패 (placeId:",
            place.placeId,
            "):",
            error,
          );
        }
      }

      console.log("🎯 전역 상태 장소 상세 정보 로드 완료");
    } catch (error) {
      console.error("❌ 전역 상태 장소 정보 로드 중 오류:", error);
    }
  };

  const [tripData, setTripData] = useState<{
    title: string;
    dateRange: string;
    regions: string[];
    days: {
      date: string;
      dayNumber: string;
      spots: ItinerarySpot[];
    }[];
  }>({
    title: "여행",
    dateRange: "",
    regions: [],
    days: [], // 빈 배열로 초기화
  });

  // 전역 상태에서 여행 일정 데이터 가져오기
  const { travelScheduleList, selectedRegions } = useGlobalState();

  // 전역 상태의 데이터로 tripData 업데이트 (간단한 버전)
  useEffect(() => {
    if (travelScheduleList && travelScheduleList.length > 0) {
      console.log("🔄 전역 상태 업데이트 감지:", travelScheduleList);

      // 1. 실제 날짜만 추출 (YYYY-MM-DD 형태만)
      if (!travelScheduleList || !Array.isArray(travelScheduleList)) {
        console.log(
          "⚠️ travelScheduleList가 undefined이거나 배열이 아닙니다:",
          travelScheduleList,
        );
        return;
      }

      const allDates = travelScheduleList
        .filter(
          (item) =>
            item &&
            item.day &&
            typeof item.day === "string" &&
            item.day.includes("-"),
        ) // YYYY-MM-DD 형태만
        .map((item) => item.day)
        .filter((day, index, array) => array.indexOf(day) === index) // 중복 제거
        .sort(); // 날짜 순으로 정렬

      // 2. 날짜 범위 계산
      let dateRange = "";
      if (allDates.length > 0) {
        const startDate = new Date(allDates[0]);
        const endDate = new Date(allDates[allDates.length - 1]);

        const formatDate = (date: Date) => {
          return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
        };

        dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      }

      // 3. tripData 업데이트
      setTripData((prev) => {
        const newDays = allDates.map((dateKey: string, index: number) => {
          // 해당 날짜의 장소들 찾기
          const daySpots = travelScheduleList
            .filter((item) => item.day === dateKey && item.placeId !== 0)
            .map((item) => ({
              id: generateUniqueId(item.placeId, item.day),
              name: item.name || "이름 없음",
              time: "시간 미정",
              placeId: item.placeId,
              latitude: 0,
              longitude: 0,
              placeType: item.placeType || "장소",
            }));

          // 한국어 날짜 번호
          const koreanNumbers = [
            "첫째",
            "둘째",
            "셋째",
            "넷째",
            "다섯째",
            "여섯째",
            "일곱째",
            "여덟째",
            "아홉째",
            "열째",
          ];
          const dayNumber =
            index < koreanNumbers.length
              ? `${koreanNumbers[index]}날`
              : `${index + 1}번째 날`;

          // 날짜 표시 형식 결정
          let displayDate: string;

          if (dateKey.includes("-")) {
            // YYYY-MM-DD 형태인 경우 MM.DD로 변환
            const date = new Date(dateKey);
            displayDate = `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
          } else {
            // MM.DD 형태인 경우 그대로 사용
            displayDate = dateKey;
          }

          return {
            date: displayDate,
            dayNumber: dayNumber,
            spots: daySpots,
          };
        });

        return {
          ...prev,
          dateRange: dateRange,
          days: newDays,
        };
      });

      console.log("✅ 전역 상태에서 여행 일정 로드 완료:", {
        dateRange,
        totalDays: allDates.length,
        allDates,
        newDays: allDates.map((dateKey: string, index: number) => ({
          dateKey,
          index,
          spotsCount: travelScheduleList.filter(
            (item) => item.day === dateKey && item.placeId !== 0,
          ).length,
        })),
      });
    }
  }, [travelScheduleList]);

  // 전역 상태에서 지역 정보 가져오기 (destination에서 선택한 지역들)
  useEffect(() => {
    // 전역 상태에서 지역 정보가 있는지 확인
    if (selectedRegions && selectedRegions.length > 0) {
      setTripData((prev) => ({
        ...prev,
        regions: selectedRegions,
      }));
    } else if (params.regions) {
      // 전역 상태에 없으면 params에서 가져오기 (fallback)
      const regions = (params.regions as string).split(",");
      setTripData((prev) => ({
        ...prev,
        regions: regions,
      }));
    }
  }, [selectedRegions, params.regions, travelScheduleList]);

  // 선택된 장소 처리 - 간단한 버전
  useEffect(() => {
    if (params.selectedLocation && params.selectedDayIndex) {
      try {
        const selectedLocation = JSON.parse(params.selectedLocation as string);
        const dayIndex = parseInt(params.selectedDayIndex as string);

        console.log("📅 장소 추가:", selectedLocation.name, "날짜:", dayIndex);

        // 새로운 장소 생성
        const newSpot: ItinerarySpot = {
          id: Date.now().toString(),
          name: selectedLocation.name,
          time: "시간 미정",
          placeId: selectedLocation.placeId,
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          placeType: selectedLocation.placeType,
        };

        // tripData.days가 비어있지 않을 때만 로컬 상태 업데이트
        if (tripData.days.length > 0 && tripData.days[dayIndex]) {
          setTripData((prev) => {
            const newDays = [...prev.days];
            newDays[dayIndex] = {
              ...newDays[dayIndex],
              spots: [...newDays[dayIndex].spots, newSpot],
            };
            return { ...prev, days: newDays };
          });

          // 선택된 날짜 변경
          setSelectedDay(dayIndex);
        } else {
          console.log(
            "⚠️ tripData.days가 비어있거나 해당 인덱스가 없습니다. 전역 상태만 업데이트합니다.",
          );
        }

        // 🚫 중복 저장 방지 - search.tsx에서 이미 전역 상태에 저장했으므로 여기서는 저장하지 않음
        console.log(
          "✅ search.tsx에서 이미 전역 상태에 저장됨 - 중복 저장 방지",
        );

        console.log("✅ 장소 추가 완료");

        // 여행 전체 일정 로그 출력
        console.log("🗺️ === 여행 전체 일정 현황 ===");
        console.log("📊 전역 상태 (travelScheduleList):", travelScheduleList);
        console.log("📱 로컬 상태 (tripData):", {
          title: tripData.title,
          dateRange: tripData.dateRange,
          regions: tripData.regions,
          days: tripData.days.map((day, index) => ({
            dayNumber: day.dayNumber,
            date: day.date,
            spotsCount: day.spots.length,
            spots: day.spots.map((spot) => ({
              name: spot.name,
              placeId: spot.placeId,
              placeType: spot.placeType,
            })),
          })),
        });
        console.log("🎯 현재 선택된 날짜:", selectedDay);
        console.log("📍 새로 추가된 장소:", {
          name: selectedLocation.name,
          placeId: selectedLocation.placeId,
          placeType: selectedLocation.placeType,
          dayIndex: dayIndex,
          dayNumber:
            tripData.days[dayIndex]?.dayNumber || `Day ${dayIndex + 1}`,
        });
        console.log("🗺️ === 여행 일정 로그 끝 ===");
      } catch (error) {
        console.error("❌ 장소 추가 실패:", error);
      }
    }
  }, [params.selectedLocation, params.selectedDayIndex]);

  // 선택된 지역들을 메모이제이션하여 불필요한 재렌더링 방지
  const memoizedRegions = useMemo(() => tripData.regions, [tripData.regions]);

  const handleAddSpot = (dayIndex: number) => {
    // 장소 검색 화면으로 이동 (일정짜기에서 온 것을 표시)
    // 날짜도 함께 전달하여 복잡한 계산 방지
    const selectedDate = tripData.days[dayIndex]?.date;

    if (selectedDate) {
      router.push({
        pathname: "/search",
        params: {
          from: "itinerary",
          dayIndex: dayIndex.toString(),
          selectedDate: selectedDate, // ✅ 날짜 직접 전달
        },
      });
    } else {
      console.error("❌ 선택된 날짜를 찾을 수 없음:", dayIndex);
    }
  };

  // 장소 선택 핸들러
  const handleSpotSelect = (spotId: string) => {
    if (selectedSpotId === spotId) {
      // 같은 장소를 다시 클릭하면 선택 해제
      setSelectedSpotId(null);
      // 왼쪽으로 밀린 아이템을 원래 위치로 복원
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      // 새로운 장소 선택
      setSelectedSpotId(spotId);
      // 아이템을 왼쪽으로 밀어서 삭제 버튼 공간 확보
      Animated.timing(slideAnim, {
        toValue: -60, // 삭제 버튼 너비만큼 왼쪽으로 이동
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  // 장소 삭제 핸들러
  const handleSpotDelete = (spotId: string, dayIndex: number) => {
    console.log("🔍 삭제 시작:", { spotId, dayIndex });

    const spot = tripData.days[dayIndex]?.spots.find((s) => s.id === spotId);
    console.log("🎯 찾은 장소:", spot);

    if (spot && spot.placeId) {
      // 해당 날짜의 날짜 키 찾기
      const dayKey = tripData.days[dayIndex]?.date;
      console.log("📅 날짜 키:", dayKey);

      if (dayKey) {
        console.log("🗑️ 전역 상태에서 장소 제거 시작:", {
          dayKey,
          placeId: spot.placeId,
        });

        // 날짜 형식 변환: "09.23" → "2025-09-23"
        let formattedDayKey = dayKey;
        if (dayKey.includes(".") && !dayKey.includes("-")) {
          const currentYear = new Date().getFullYear();
          const [month, day] = dayKey.split(".");
          formattedDayKey = `${currentYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
          console.log("🔄 날짜 형식 변환:", { dayKey, formattedDayKey });
        }

        // 전역 상태에서 해당 장소 제거 (비동기 처리)
        try {
          removeTravelSchedule(formattedDayKey, spot.placeId);
          console.log("✅ 전역 상태에서 장소 제거 완료:", {
            formattedDayKey,
            placeId: spot.placeId,
          });
        } catch (error) {
          console.error("❌ 전역 상태에서 장소 제거 실패:", error);
        }

        console.log("🗑️ 로컬 상태에서 장소 제거 시작");

        // 로컬 상태에서도 해당 장소 제거 (즉시 화면 업데이트)
        setTripData((prev) => {
          console.log("📱 현재 tripData:", prev);

          // 깊은 복사로 완전히 새로운 객체 생성
          const newDays = prev.days.map((day, idx) => {
            if (idx === dayIndex) {
              const beforeCount = day.spots.length;
              const filteredSpots = day.spots.filter((s) => s.id !== spotId);
              const afterCount = filteredSpots.length;

              console.log("📊 장소 개수 변화:", {
                beforeCount,
                afterCount,
                removed: beforeCount - afterCount,
              });

              return {
                ...day,
                spots: filteredSpots,
              };
            }
            return day;
          });

          const result = {
            ...prev,
            days: newDays,
          };

          console.log("📱 업데이트된 tripData:", result);
          return result;
        });

        // 선택된 장소 초기화
        setSelectedSpotId(null);

        // 애니메이션을 원래 위치로 복원
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();

        console.log("✅ 장소 삭제 완료 (전역 + 로컬):", {
          spotId,
          spotName: spot.name,
          dayIndex,
          dayKey,
        });
      } else {
        console.error("❌ 날짜 키를 찾을 수 없음:", dayIndex);
      }
    } else {
      console.error("❌ 장소를 찾을 수 없음:", { spotId, dayIndex, spot });
    }
  };

  const handleEditTripName = () => {
    setIsModalVisible(true);
  };

  const handleSaveTripName = (newName: string) => {
    setTripData((prev) => ({
      ...prev,
      title: newName,
    }));
    setIsModalVisible(false);
  };

  const handleCancelEdit = () => {
    setIsModalVisible(false);
  };

  // 일정 생성하기 핸들러
  const handleCreateSchedule = async () => {
    console.log("🚀 일정 생성하기 버튼 클릭!");

    // 전역 상태 데이터 안전성 체크
    if (!travelScheduleList || !Array.isArray(travelScheduleList)) {
      console.log(
        "⚠️ travelScheduleList가 undefined이거나 배열이 아닙니다:",
        travelScheduleList,
      );
      return;
    }

    if (travelScheduleList.length === 0) {
      console.log("⚠️ 여행 일정이 없습니다.");
      return;
    }

    // 날짜 정보 추출
    const travelDates = travelScheduleList
      .filter((item) => item && item.day && item.placeId !== 0)
      .map((item) => item.day)
      .sort();

    if (travelDates.length === 0) {
      console.log("⚠️ 여행 일정이 없습니다.");
      return;
    }

    const startDate = travelDates[0];
    const endDate = travelDates[travelDates.length - 1];

    // 지역 ID 매핑 (destination.tsx와 동일한 매핑)
    const regionNameToId: { [key: string]: number } = {
      강릉: 1,
      속초: 2,
      춘천: 3,
      원주: 4,
      동해: 5,
      태백: 6,
      삼척: 7,
      홍천: 8,
      횡성: 9,
      영월: 10,
      평창: 11,
      정선: 12,
      철원: 13,
      화천: 14,
      양구: 15,
      인제: 16,
      고성: 17,
      양양: 18,
    };

    // 선택된 지역 안전성 체크
    if (!selectedRegions || !Array.isArray(selectedRegions)) {
      console.log(
        "⚠️ selectedRegions가 undefined이거나 배열이 아닙니다:",
        selectedRegions,
      );
      return;
    }

    if (selectedRegions.length === 0) {
      console.log("⚠️ 선택된 지역이 없습니다.");
      return;
    }

    // 선택된 지역 ID 변환
    const regionIdList = selectedRegions
      .map((regionName) => regionNameToId[regionName])
      .filter((id) => id !== undefined);

    // API 요청 데이터 구성
    const requestData = {
      startDate: startDate,
      endDate: endDate,
      travelCourseTitle: tripData.title || "나의 여행",
      regionIdList: regionIdList,
      travelCourseScheduleList: travelScheduleList
        .filter((item) => item.placeId !== 0)
        .map((item, index) => {
          // 같은 날짜 내에서의 순서 계산
          const sameDayItems = travelScheduleList
            .filter((i) => i.day === item.day && i.placeId !== 0)
            .findIndex((i) => i.placeId === item.placeId);

          return {
            day: item.day,
            orderInday: sameDayItems + 1, // 해당 날짜 내에서의 순서 (1부터 시작)
            placeId: item.placeId,
          };
        }),
    };

    console.log("📤 === API 요청 데이터 ===");
    console.log(JSON.stringify(requestData, null, 2));
    console.log("📊 === 상세 정보 ===");
    console.log("시작 날짜:", startDate);
    console.log("종료 날짜:", endDate);
    console.log("여행 제목:", requestData.travelCourseTitle);
    console.log("선택된 지역:", selectedRegions);
    console.log("지역 ID 리스트:", regionIdList);
    console.log("일정 개수:", requestData.travelCourseScheduleList.length);
    console.log("=== API 요청 데이터 끝 ===");

    // 🚀 실제 API 호출
    console.log("🌐 여행 일정 생성 API 호출 시작...");

    try {
      const result = await createTravelCourseAPI(requestData);

      if (result.isSuccess) {
        console.log("🎉 여행 일정이 성공적으로 생성되었습니다!");
        console.log("📊 생성된 여행 일정:", result.result);

        // 🎉 성공 alert 표시
        Alert.alert(
          "여행 일정 생성 완료!",
          "여행 일정이 성공적으로 생성되었습니다.",
          [
            {
              text: "확인",
              onPress: () => {
                // 🚀 취향길목 화면으로 이동
                router.push("/(tabs)/preference");
              },
            },
          ],
        );
      } else {
        throw new Error(result.message || "여행 일정 생성 실패");
      }
    } catch (error) {
      console.error("❌ 여행 일정 생성 실패:", error);
      // 에러 처리 (예: 에러 메시지 표시)
    }
  };

  const renderDayTimeline = () => {
    // days가 undefined이거나 비어있으면 아무것도 렌더링하지 않음
    if (!tripData.days || tripData.days.length === 0) {
      return (
        <View style={styles.timelineContainer}>
          <Text style={styles.emptyTimelineText}>
            여행 일정을 먼저 설정해주세요
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.timelineContainer}>
        <View style={styles.timeline}>
          {tripData.days &&
            tripData.days.map((day, dayIndex) => (
              <View
                key={`timeline-${day.date}-${dayIndex}`}
                style={styles.timelineItem}
              >
                <View style={styles.timelineTextContainer}>
                  <Text style={styles.timelineDate}>{day.dayNumber}</Text>
                  <Text style={styles.timelineDateSmall}>{day.date}</Text>
                </View>
                <View
                  style={[
                    styles.timelineDot,
                    dayIndex === selectedDay
                      ? styles.activeTimelineDot
                      : styles.inactiveTimelineDot,
                  ]}
                />

                {dayIndex < tripData.days.length - 1 && (
                  <View
                    style={[
                      styles.timelineConnector,
                      { width: (tripData.days.length - dayIndex - 1) * 350 },
                    ]}
                  />
                )}
              </View>
            ))}
        </View>
      </View>
    );
  };

  const renderDayCard = (day: DayPlan, dayIndex: number) => {
    const isSelected = dayIndex === selectedDay;

    return (
      <View key={`daycard-${day.date}-${dayIndex}`} style={styles.dayCard}>
        {day.spots.length === 0 ? (
          <TouchableOpacity
            style={styles.addSpotButton}
            onPress={() => handleAddSpot(dayIndex)}
          >
            <Text style={styles.addSpotButtonText}>+ 일정 추가</Text>
          </TouchableOpacity>
        ) : (
          <ScrollView
            style={styles.spotsContainer}
            contentContainerStyle={styles.spotsContentContainer}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {day.spots.map((spot, spotIndex) => (
              <Animated.View
                key={`spot-${spot.id}-${spotIndex}`}
                style={[
                  styles.spotItemContainer,
                  {
                    transform: [
                      {
                        translateX: selectedSpotId === spot.id ? slideAnim : 0,
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.spotItem,
                    selectedSpotId === spot.id && styles.selectedSpotItem,
                  ]}
                  onPress={() => handleSpotSelect(spot.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.spotHeader}>
                    <View style={styles.spotNumber}>
                      <Text style={styles.spotNumberText}>{spotIndex + 1}</Text>
                    </View>
                    <Text style={styles.spotName}>
                      {spot.name.length > 6
                        ? `${spot.name.slice(0, 6)}...`
                        : spot.name}
                    </Text>
                    <View style={styles.spotTypeTag}>
                      <Text style={styles.spotTypeText}>
                        {getKoreanPlaceType(spot.placeType || "")}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* 삭제 버튼 (선택된 경우에만 표시) */}
                {selectedSpotId === spot.id && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleSpotDelete(spot.id, dayIndex)}
                  >
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                )}
              </Animated.View>
            ))}
            <TouchableOpacity
              style={styles.addMoreSpotButton}
              onPress={() => handleAddSpot(dayIndex)}
            >
              <Text style={styles.addMoreSpotButtonText}>+ 일정 추가</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.push("/destination")}>
            <BackIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.dateRange}>{tripData.dateRange}</Text>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.tripTitle}>{tripData.title}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditTripName}
          >
            <Text style={styles.editButtonText}>수정</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.regionsContainer}>
          {tripData.regions.map((region, regionIndex) => (
            <View
              key={`region-${region}-${regionIndex}`}
              style={styles.regionTag}
            >
              <Text style={styles.regionText}>{region}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <View style={styles.mapDayTag}>
          {tripData.days[selectedDay] ? (
            <View style={styles.mapDayContent}>
              <Text style={styles.mapDayNumber}>
                {tripData.days[selectedDay].dayNumber}
              </Text>
              <Text style={styles.mapDayDate}>
                {tripData.days[selectedDay].date}
              </Text>
            </View>
          ) : (
            <Text style={styles.mapDayText}>일정 없음</Text>
          )}
        </View>
        <View style={styles.map}>
          <ItineraryMap
            latitude={currentLocation.latitude}
            longitude={currentLocation.longitude}
            regions={memoizedRegions}
            selectedDaySpots={tripData.days[selectedDay]?.spots || []}
            ref={webViewRef}
            onMessage={(event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                console.log("📱 ItineraryMap 메시지 수신:", data);

                if (data.type === "mapReady") {
                  console.log("🗺️ ItineraryMap 준비 완료:", data.message);
                }
              } catch (error) {
                console.log("ItineraryMap 메시지 파싱 오류:", error);
              }
            }}
          />
        </View>
      </View>

      {/* Day Timeline and Cards Container */}
      <View style={styles.timelineAndCardsContainer}>
        {/* Day Timeline */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timelineContainer}
          scrollEnabled={false}
          ref={(ref) => {
            if (ref) {
              // 타임라인 스크롤뷰 참조 저장
              (global as any).timelineScrollRef = ref;
            }
          }}
        >
          {renderDayTimeline()}
        </ScrollView>

        {/* Day Cards */}
        {tripData.days && tripData.days.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dayCardsContainer}
            onScroll={(event) => {
              const contentOffset = event.nativeEvent.contentOffset.x;
              const cardWidth = 246; // 카드 너비 + 마진
              const newSelectedDay = Math.round(contentOffset / cardWidth);
              if (
                newSelectedDay >= 0 &&
                newSelectedDay < tripData.days.length &&
                newSelectedDay !== selectedDay
              ) {
                setSelectedDay(newSelectedDay);
              }

              // 타임라인도 함께 스크롤
              if ((global as any).timelineScrollRef) {
                (global as any).timelineScrollRef.scrollTo({
                  x: contentOffset,
                  animated: false,
                });
              }
            }}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={246}
            snapToAlignment="start"
          >
            {tripData.days && tripData.days.length > 0
              ? tripData.days.map((day, dayIndex) => (
                  <View key={`day-${day.date}-${dayIndex}`}>
                    {renderDayCard(day, dayIndex)}
                  </View>
                ))
              : null}
          </ScrollView>
        ) : (
          <View style={styles.emptyDaysContainer}>
            <Text style={styles.emptyDaysText}>
              여행 일정을 먼저 설정해주세요
            </Text>
          </View>
        )}
      </View>

      {/* Edit Trip Name Modal */}
      <EditTripNameModal
        isVisible={isModalVisible}
        tripName={tripData.title}
        onSave={handleSaveTripName}
        onCancel={handleCancelEdit}
      />

      {/* 일정 생성하기 버튼 */}
      <View style={styles.createScheduleButtonContainer}>
        <TouchableOpacity
          style={[
            styles.createScheduleButton,
            // 날짜당 하나의 일정이 있어야 활성화
            (!tripData.days ||
              !tripData.days.every((day) => day.spots.length > 0)) &&
              styles.createScheduleButtonDisabled,
          ]}
          onPress={handleCreateSchedule}
          disabled={
            !tripData.days ||
            !tripData.days.every((day) => day.spots.length > 0)
          }
        >
          <Text
            style={[
              styles.createScheduleButtonText,
              !tripData.days.every((day) => day.spots.length > 0) &&
                styles.createScheduleButtonTextDisabled,
            ]}
          >
            일정 생성하기
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#EEE9E6",
    paddingHorizontal: 20,
    paddingTop: 35,
    paddingBottom: 25,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerContent: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  saveButton: {
    paddingVertical: 6,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  dateRange: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  tripTitle: {
    fontSize: 24,
    fontFamily: "Gangwon",
    color: "#262423",
  },
  editButton: {
    backgroundColor: "#DBD6D3",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  regionsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  privacyToggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  privacyToggleLabel: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: "transparent",
  },
  toggleButtonActive: {
    backgroundColor: "#262423",
  },
  toggleButtonText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  toggleButtonTextActive: {
    color: "#FFFFFF",
  },
  regionTag: {
    backgroundColor: "#C5BFBB",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  regionText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
  profileSection: {
    position: "absolute",
    right: 20,
    top: 120,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#C5BFBB",
  },
  addProfileButton: {
    position: "absolute",
    right: -5,
    top: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#9D9896",
    alignItems: "center",
    justifyContent: "center",
  },
  addProfileText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "SUIT-600",
  },
  mapContainer: {},
  mapDayTag: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "#262423",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 1,
  },
  mapDayText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "SUIT-600",
  },
  mapDayContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mapDayNumber: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "SUIT-700",
    fontWeight: "bold",
  },
  mapDayDate: {
    color: "#9D9896",
    fontSize: 13,
    fontFamily: "SUIT-500",
  },
  map: {
    height: 200,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    position: "relative",
    overflow: "hidden",
  },
  mapPlaceholder: {
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  mapText: {
    position: "absolute",
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
  timelineAndCardsContainer: {
    flex: 1,
  },
  timelineContainer: {
    paddingHorizontal: 8,
    flexDirection: "row",
    paddingRight: 100,
  },
  timeline: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  timelineItem: {
    position: "relative",
    width: 248,
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 6,
  },
  timelineTextContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 10,
    zIndex: 1,
  },
  activeTimelineDot: {
    backgroundColor: "#FF0000",
  },
  inactiveTimelineDot: {
    backgroundColor: "#000000",
  },
  timelineConnector: {
    position: "absolute",
    top: 30,
    left: 10,
    height: 1,
    backgroundColor: "#C5BFBB",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#C5BFBB",
  },
  timelineDate: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  timelineDateSmall: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  dayCardsContainer: {
    paddingHorizontal: 0,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 100, // 마지막 카드까지 스크롤할 수 있도록 여유 공간 추가
  },
  dayCard: {
    width: 226,
    height: 200,
    borderRadius: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  selectedDayCard: {
    backgroundColor: "#F0F0F0",
    borderWidth: 2,
    borderColor: "#716C69",
  },
  dayCardHeader: {
    marginBottom: 15,
  },
  dayCardTitle: {
    fontSize: 18,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  emptyDayContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyDayText: {
    fontSize: 18,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginBottom: 8,
  },
  emptyDaySubtext: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  addSpotButton: {
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#9D9896",
  },
  addSpotButtonText: {
    color: "#4D4947",
    fontSize: 16,
    fontFamily: "SUIT-600",
    textAlign: "center",
  },
  spotsContainer: {
    flex: 1,
  },
  spotsContentContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  spotItemContainer: {
    position: "relative",
    marginBottom: 10,
    overflow: "visible", // 삭제 버튼이 밖으로 나갈 수 있도록
  },
  spotItem: {
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DBD6D3",
  },
  spotTime: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  spotName: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginTop: 2,
  },
  spotLocation: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    marginTop: 2,
  },
  spotHeader: {
    flexDirection: "row",
    alignItems: "center",

    padding: 15,
  },
  spotNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4A4A4A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  spotNumberText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "SUIT-600",
  },
  spotTypeTag: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginLeft: 8,
  },
  spotTypeText: {
    fontSize: 10,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
  addMoreSpotButton: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#9D9896",
    marginTop: 10,
    alignSelf: "center",
  },
  addMoreSpotButtonText: {
    color: "#4D4947",
    fontSize: 14,
    fontFamily: "SUIT-500",
    textAlign: "center",
  },
  emptyTimelineText: {
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    textAlign: "center",
    paddingVertical: 20,
  },
  emptyDaysContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyDaysText: {
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    textAlign: "center",
  },
  selectedSpotItem: {
    backgroundColor: "#F0F0F0",
    // border 스타일은 기본과 동일하게 유지
  },
  deleteButton: {
    position: "absolute",
    right: -60, // 아이템 오른쪽 바깥에 위치
    top: 0,
    bottom: 0,
    width: 60,
    backgroundColor: "#FF4444",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "SUIT-600",
  },
  createScheduleButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEE9E6",
    backgroundColor: "#FFFFFF",
  },
  createScheduleButton: {
    backgroundColor: "#262423",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  createScheduleButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SUIT-600",
  },
  createScheduleButtonDisabled: {
    backgroundColor: "#C5BFBB",
  },
  createScheduleButtonTextDisabled: {
    color: "#9D9896",
  },
});
