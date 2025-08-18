import EditTripNameModal from "@/components/EditTripNameModal";
import BackIcon from "@/components/icons/BackIcon";
import ItineraryMap, { ItineraryMapRef } from "@/components/ItineraryMap";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
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
  location: string;
}

interface DayPlan {
  date: string;
  dayNumber: string;
  spots: ItinerarySpot[];
}

export default function Itinerary() {
  const params = useLocalSearchParams();
  const [selectedDay, setSelectedDay] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPublic, setIsPublic] = useState(false); // 공개/비공개 상태

  // 현재 위치를 메모이제이션하여 불필요한 재렌더링 방지
  const currentLocation = useMemo(
    () => ({
      latitude: 37.8228, // 강원도 춘천시
      longitude: 127.7322,
    }),
    [],
  );

  const webViewRef = useRef<ItineraryMapRef>(null);

  const [tripData, setTripData] = useState({
    title: "강원도 여행",
    dateRange: "2025.06.13 - 06.16",
    regions: ["강릉", "동해"],
    days: [
      {
        date: "06.13",
        dayNumber: "첫째날",
        spots: [],
      },
      {
        date: "06.14",
        dayNumber: "둘째날",
        spots: [],
      },
      {
        date: "06.15",
        dayNumber: "셋째날",
        spots: [],
      },
      {
        date: "06.16",
        dayNumber: "넷째날",
        spots: [],
      },
    ],
  });

  // 전달받은 파라미터로 tripData 업데이트
  useEffect(() => {
    if (params.regions) {
      const regions = (params.regions as string).split(",");
      setTripData((prev) => ({
        ...prev,
        regions: regions,
        dateRange: (params.dateRange as string) || prev.dateRange,
      }));
    }
  }, [params.regions, params.dateRange]);

  // 선택된 지역들을 메모이제이션하여 불필요한 재렌더링 방지
  const selectedRegions = useMemo(() => tripData.regions, [tripData.regions]);

  const handleAddSpot = (dayIndex: number) => {
    // 장소 검색 화면으로 이동 (일정짜기에서 온 것을 표시)
    router.push({
      pathname: "/search",
      params: { from: "itinerary", dayIndex: dayIndex.toString() },
    });
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

  const renderDayTimeline = () => {
    return (
      <View style={styles.timelineContainer}>
        <View style={styles.timeline}>
          {tripData.days.map((day, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineTextContainer}>
                <Text style={styles.timelineDate}>{day.dayNumber}</Text>
                <Text style={styles.timelineDateSmall}>{day.date}</Text>
              </View>
              <View
                style={[
                  styles.timelineDot,
                  index === selectedDay
                    ? styles.activeTimelineDot
                    : styles.inactiveTimelineDot,
                ]}
              />

              {index < tripData.days.length - 1 && (
                <View
                  style={[
                    styles.timelineConnector,
                    { width: (tripData.days.length - index - 1) * 330 - 40 },
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
      <View key={dayIndex} style={styles.dayCard}>
        {day.spots.length === 0 ? (
          <TouchableOpacity
            style={styles.addSpotButton}
            onPress={() => handleAddSpot(dayIndex)}
          >
            <Text style={styles.addSpotButtonText}>+ 일정 추가</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.spotsContainer}>
            {day.spots.map((spot) => (
              <View key={spot.id} style={styles.spotItem}>
                <Text style={styles.spotTime}>{spot.time}</Text>
                <Text style={styles.spotName}>{spot.name}</Text>
                <Text style={styles.spotLocation}>{spot.location}</Text>
              </View>
            ))}
          </View>
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
          {/* 공개/비공개 토글 */}

          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !isPublic && styles.toggleButtonActive,
              ]}
              onPress={() => setIsPublic(false)}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  !isPublic && styles.toggleButtonTextActive,
                ]}
              >
                비공개
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isPublic && styles.toggleButtonActive,
              ]}
              onPress={() => setIsPublic(true)}
            >
              <Text
                style={[
                  styles.toggleButtonText,
                  isPublic && styles.toggleButtonTextActive,
                ]}
              >
                공개
              </Text>
            </TouchableOpacity>
          </View>
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
          {tripData.regions.map((region, index) => (
            <View key={index} style={styles.regionTag}>
              <Text style={styles.regionText}>{region}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <View style={styles.mapDayTag}>
          <Text style={styles.mapDayText}>
            {tripData.days[selectedDay].dayNumber}{" "}
            {tripData.days[selectedDay].date}
          </Text>
        </View>
        <View style={styles.map}>
          <ItineraryMap
            latitude={currentLocation.latitude}
            longitude={currentLocation.longitude}
            regions={selectedRegions}
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
          {tripData.days.map((day, index) => renderDayCard(day, index))}
        </ScrollView>
      </View>

      {/* Edit Trip Name Modal */}
      <EditTripNameModal
        isVisible={isModalVisible}
        tripName={tripData.title}
        onSave={handleSaveTripName}
        onCancel={handleCancelEdit}
      />
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
  spotItem: {
    marginBottom: 10,
  },
  spotTime: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  spotName: {
    fontSize: 16,
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
});
