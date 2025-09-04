import DeleteTravelConfirmModal from "@/components/DeleteTravelConfirmModal";
import BackIcon from "@/components/icons/BackIcon";
import TravelDetailMap, {
  TravelDetailMapRef,
} from "@/components/TravelDetailMap";
import {
  deleteTravelCourseAPI,
  getPlaceDetailAPI,
  getTravelCourseDetailAPI,
  getUserInfoAPI,
} from "@/types/api";
import Feather from "@expo/vector-icons/Feather";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface TravelCourseDetail {
  travelCourseId: number;
  memberId: number;
  courseTitle: string;
  startDate: string;
  endDate: string;
  travelRegions: string[];
  schedules: {
    day: number;
    date: string;
    schedules: {
      orderInday: number;
      placeId: number;
    }[];
  }[];
}

interface PlaceInfo {
  placeId: number;
  name: string;
  placeType: string;
  latitude: number;
  longitude: number;
}

export default function TravelDetail() {
  const params = useLocalSearchParams();
  const travelCourseId = params.id as string;

  const [travelDetail, setTravelDetail] = useState<TravelCourseDetail | null>(
    null,
  );
  const [placeInfos, setPlaceInfos] = useState<{ [key: number]: PlaceInfo }>(
    {},
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isDeleteConfirmModalVisible, setIsDeleteConfirmModalVisible] =
    useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const mapRef = useRef<TravelDetailMapRef>(null);

  // 현재 사용자 정보 조회
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getUserInfoAPI();
        if (response.isSuccess) {
          setCurrentUserId(response.result.userId);
        }
      } catch (error) {
        console.error("현재 사용자 정보 조회 실패:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // 여행 상세 정보 조회
  useEffect(() => {
    let isMounted = true;

    const fetchTravelDetail = async () => {
      if (!travelCourseId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await getTravelCourseDetailAPI(
          parseInt(travelCourseId),
        );

        if (response.isSuccess && isMounted) {
          setTravelDetail(response.result);

          // 모든 장소 정보 조회
          const allPlaceIds = response.result.schedules.flatMap((day) =>
            day.schedules.map((schedule) => schedule.placeId),
          );

          // 중복 제거
          const uniquePlaceIds = [...new Set(allPlaceIds)];

          // 각 장소별 상세 정보 조회
          for (const placeId of uniquePlaceIds) {
            if (!isMounted) break;

            try {
              const placeResponse = await getPlaceDetailAPI(placeId);
              if (placeResponse.isSuccess && isMounted) {
                setPlaceInfos((prev) => ({
                  ...prev,
                  [placeId]: placeResponse.result,
                }));
              }
            } catch (error) {
              console.error(`장소 ${placeId} 상세 조회 실패:`, error);
            }
          }
        } else if (isMounted) {
          setError(response.message || "여행 상세 정보를 불러올 수 없습니다.");
        }
      } catch (error) {
        if (isMounted) {
          console.error("여행 상세 정보 조회 실패:", error);
          setError("여행 상세 정보를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTravelDetail();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [travelCourseId]);

  // 날짜 형식 변환 함수
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
  };

  // 여행 기간 계산
  const getDateRange = () => {
    if (!travelDetail) return "";

    const startDate = formatDate(travelDetail.startDate);
    const endDate = formatDate(travelDetail.endDate);

    return `${startDate} - ${endDate}`;
  };

  // 여행 일수 계산
  const getDuration = () => {
    if (!travelDetail) return "";

    const start = new Date(travelDetail.startDate);
    const end = new Date(travelDetail.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    if (diffDays === 1) return "당일치기";
    if (diffDays === 2) return "1박 2일";
    if (diffDays === 3) return "2박 3일";
    if (diffDays === 4) return "3박 4일";
    if (diffDays === 5) return "4박 5일";
    if (diffDays === 6) return "5박 6일";
    if (diffDays === 7) return "6박 7일";

    return `${diffDays - 1}박 ${diffDays}일`;
  };

  // 장소 타입을 한국어로 변환
  const getKoreanPlaceType = (placeType: string): string => {
    switch (placeType.toUpperCase()) {
      case "BOOKSTORE":
        return "독립서점";
      case "FESTIVAL":
        return "축제";
      case "TOURIST_SPOT":
        return "관광명소";
      case "RESTAURANT":
        return "식당/카페";
      default:
        return placeType || "장소";
    }
  };

  // 장소 상세 페이지로 이동하는 핸들러
  const handleSpotPress = (placeId: number) => {
    router.push({
      pathname: "/bookstore/[id]" as any,
      params: {
        id: placeId.toString(),
        from: "travel",
        travelId: travelCourseId,
      },
    });
  };

  // 삭제 모달 표시/숨김 핸들러
  const handleThreeDotsPress = () => {
    setIsDeleteModalVisible(true);
  };

  // 다른 화면 터치 시 모달 닫기
  const handleScreenPress = () => {
    if (isDeleteModalVisible) {
      setIsDeleteModalVisible(false);
    }
  };

  // 삭제 확인 모달 표시 핸들러
  const handleDeleteConfirm = () => {
    setIsDeleteModalVisible(false);
    setIsDeleteConfirmModalVisible(true);
  };

  // 여행 일정 삭제 핸들러
  const handleDeleteTravel = async () => {
    try {
      console.log("🗑️ 여행 일정 삭제 시작:", travelCourseId);

      // 삭제 API 호출
      const result = await deleteTravelCourseAPI(parseInt(travelCourseId));

      if (result.isSuccess) {
        console.log("✅ 여행 일정 삭제 성공");
        // 삭제 후 목록 화면으로 이동
        router.push("/(tabs)/preference");
      } else {
        console.error("❌ 여행 일정 삭제 실패:", result.message);
        // 에러 처리 (필요시 alert 표시)
      }
    } catch (error) {
      console.error("❌ 여행 일정 삭제 중 오류:", error);
      // 에러 처리 (필요시 alert 표시)
    } finally {
      // 모달들 닫기
      setIsDeleteModalVisible(false);
      setIsDeleteConfirmModalVisible(false);
    }
  };

  // 삭제 확인 모달 닫기
  const handleCloseDeleteConfirmModal = () => {
    setIsDeleteConfirmModalVisible(false);
  };

  // 삭제 모달 닫기
  const handleCloseDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  // 일정 카드 렌더링 함수
  const renderDayCard = (daySchedule: any, dayIndex: number) => {
    return (
      <View
        key={`daycard-${daySchedule.date}-${dayIndex}`}
        style={styles.dayCard}
      >
        <ScrollView
          style={styles.spotsContainer}
          contentContainerStyle={styles.spotsContentContainer}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {daySchedule.schedules.map((schedule: any, spotIndex: number) => {
            const placeInfo = placeInfos[schedule.placeId];
            return (
              <TouchableOpacity
                key={`spot-${schedule.placeId}-${spotIndex}`}
                style={styles.spotItemContainer}
                onPress={() => handleSpotPress(schedule.placeId)}
                activeOpacity={0.7}
              >
                <View style={styles.spotItem}>
                  <View style={styles.spotHeader}>
                    <View style={styles.spotNumber}>
                      <Text style={styles.spotNumberText}>{spotIndex + 1}</Text>
                    </View>
                    <Text style={styles.spotName}>
                      {placeInfo
                        ? placeInfo.name.length > 6
                          ? `${placeInfo.name.slice(0, 6)}...`
                          : placeInfo.name
                        : `장소 ID: ${schedule.placeId}`}
                    </Text>
                    <View style={styles.spotTypeTag}>
                      <Text style={styles.spotTypeText}>
                        {placeInfo
                          ? getKoreanPlaceType(placeInfo.placeType)
                          : "장소"}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E60A34" />
          <Text style={styles.loadingText}>여행 정보를 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !travelDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>오류가 발생했습니다</Text>
          <Text style={styles.errorMessage}>
            {error || "여행 정보를 찾을 수 없습니다."}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>뒤로 가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.container}
        onPress={handleScreenPress}
        activeOpacity={1}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()}>
              <BackIcon />
            </TouchableOpacity>
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.dateRange}>{getDateRange()}</Text>
            {currentUserId &&
              travelDetail &&
              currentUserId === travelDetail.memberId && (
                <TouchableOpacity
                  onPress={handleThreeDotsPress}
                  style={styles.threeDotsButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="more-horizontal" size={20} color="black" />
                </TouchableOpacity>
              )}
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.tripTitle}>{travelDetail.courseTitle}</Text>
          </View>

          <View style={styles.regionsContainer}>
            {travelDetail.travelRegions.map((region, regionIndex) => (
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
            <View style={styles.mapDayContent}>
              <Text style={styles.mapDayNumber}>
                {(() => {
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
                  const dayIndex = selectedDay;
                  return dayIndex < koreanNumbers.length
                    ? `${koreanNumbers[dayIndex]}날`
                    : `${dayIndex + 1}번째 날`;
                })()}
              </Text>
              <Text style={styles.mapDayDate}>
                {travelDetail.schedules[selectedDay]
                  ? formatDate(travelDetail.schedules[selectedDay].date)
                  : formatDate(travelDetail.startDate)}
              </Text>
            </View>
          </View>
          <View style={styles.map}>
            <TravelDetailMap
              latitude={37.8228} // 강원도 춘천시
              longitude={127.7322}
              regions={travelDetail.travelRegions}
              selectedDaySpots={
                travelDetail.schedules[selectedDay]?.schedules.map(
                  (schedule, spotIndex) => {
                    const placeInfo = placeInfos[schedule.placeId];
                    return {
                      id: `spot_${schedule.placeId}_${spotIndex}`,
                      name: placeInfo
                        ? placeInfo.name
                        : `장소 ID: ${schedule.placeId}`,
                      placeId: schedule.placeId,
                      latitude: placeInfo?.latitude || 37.8228, // 실제 위도 사용
                      longitude: placeInfo?.longitude || 127.7322, // 실제 경도 사용
                      placeType: placeInfo ? placeInfo.placeType : "장소",
                    };
                  },
                ) || []
              }
              ref={mapRef}
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  console.log("🗺️ TravelDetailMap 메시지 수신:", data);

                  if (data.type === "mapReady") {
                    console.log("🗺️ TravelDetailMap 준비 완료:", data.message);
                  }
                } catch (error) {
                  console.log("TravelDetailMap 메시지 파싱 오류:", error);
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
            <View style={styles.timeline}>
              {travelDetail.schedules &&
                travelDetail.schedules.map((daySchedule, dayIndex) => (
                  <TouchableOpacity
                    key={`timeline-${daySchedule.date}-${dayIndex}`}
                    style={styles.timelineItem}
                    onPress={() => setSelectedDay(dayIndex)}
                  >
                    <View style={styles.timelineTextContainer}>
                      <Text style={styles.timelineDate}>
                        {daySchedule.day}일차
                      </Text>
                      <Text style={styles.timelineDateSmall}>
                        {formatDate(daySchedule.date)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.timelineDot,
                        dayIndex === selectedDay
                          ? styles.activeTimelineDot
                          : styles.inactiveTimelineDot,
                      ]}
                    />

                    {dayIndex < travelDetail.schedules.length - 1 && (
                      <View
                        style={[
                          styles.timelineConnector,
                          {
                            width:
                              (travelDetail.schedules.length - dayIndex) * 226 +
                              (travelDetail.schedules.length - dayIndex - 1) *
                                10,
                          },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                ))}
            </View>
          </ScrollView>

          {/* Day Cards */}
          {travelDetail.schedules && travelDetail.schedules.length > 0 ? (
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
                  newSelectedDay < travelDetail.schedules.length &&
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
              {travelDetail.schedules.map((daySchedule, dayIndex) => (
                <View key={`day-${daySchedule.date}-${dayIndex}`}>
                  {renderDayCard(daySchedule, dayIndex)}
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyDaysContainer}>
              <Text style={styles.emptyDaysText}>여행 일정이 없습니다</Text>
            </View>
          )}
        </View>

        {/* 삭제 드롭다운 */}
        {isDeleteModalVisible && (
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.deleteDropdownButton}
              onPress={handleDeleteConfirm}
            >
              <Text style={styles.deleteDropdownButtonText}>삭제</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 삭제 확인 모달 */}
        <DeleteTravelConfirmModal
          isVisible={isDeleteConfirmModalVisible}
          onConfirm={handleDeleteTravel}
          onCancel={handleCloseDeleteConfirmModal}
        />
      </TouchableOpacity>
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
  regionsContainer: {
    flexDirection: "row",
    gap: 10,
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
  mapDayContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mapDayNumber: {
    color: "#FFFFFF",
    fontSize: 11,
    fontFamily: "SUIT-700",
    fontWeight: "bold",
  },
  mapDayDate: {
    color: "#9D9896",
    fontSize: 11,
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapText: {
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
    minWidth: "100%",
    paddingLeft: 20,
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
    paddingRight: 100,
  },
  dayCard: {
    width: 226,
    height: 200,
    borderRadius: 8,
    marginLeft: 10,
    marginRight: 10,
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
    overflow: "visible",
  },
  spotItem: {
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    padding: 15,
  },
  spotHeader: {
    flexDirection: "row",
    alignItems: "center",
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
  spotName: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginTop: 2,
    flex: 1,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginTop: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#716C69",
    textAlign: "center",
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: "#262423",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SUIT-600",
  },
  // 삭제 모달 스타일
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  deleteModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    width: 200,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#FF4444",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginBottom: 10,
    width: "100%",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SUIT-600",
  },
  cancelButton: {
    backgroundColor: "#C5BFBB",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SUIT-600",
  },

  // ThreeDots 버튼 스타일
  threeDotsButton: {
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  // 드롭다운 스타일
  dropdownContainer: {
    position: "absolute",
    top: 120,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  deleteDropdownButton: {
    backgroundColor: "#F8F4F2",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  deleteDropdownButtonText: {
    color: "#262423",
    fontSize: 13,
    fontFamily: "SUIT-600",
  },
  deleteConfirmModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 20,
    width: 280,
    alignItems: "center",
  },
});
