import EditTripNameModal from "@/components/EditTripNameModal";
import BackIcon from "@/components/icons/BackIcon";
import KakaoMap, { KakaoMapRef } from "@/components/KakaoMap";
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

  // 현재 위치를 메모이제이션하여 불필요한 재렌더링 방지
  const currentLocation = useMemo(
    () => ({
      latitude: 37.8228, // 강원도 춘천시
      longitude: 127.7322,
    }),
    [],
  );

  const webViewRef = useRef<KakaoMapRef>(null);

  const [tripData, setTripData] = useState({
    title: "강원도 여름 여행",
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
    // 여행 스팟 추가 로직
    console.log(`Add spot to day ${dayIndex}`);
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
              <View
                style={[
                  styles.timelineDot,
                  index === selectedDay
                    ? styles.activeTimelineDot
                    : styles.inactiveTimelineDot,
                ]}
              />
              <Text style={styles.timelineDate}>{day.dayNumber}</Text>
              <Text style={styles.timelineDateSmall}>{day.date}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderDayCard = (day: DayPlan, dayIndex: number) => {
    const isSelected = dayIndex === selectedDay;

    return (
      <View
        key={dayIndex}
        style={[styles.dayCard, isSelected && styles.selectedDayCard]}
      >
        <View style={styles.dayCardHeader}>
          <Text style={styles.dayCardTitle}>
            {day.dayNumber} {day.date}
          </Text>
        </View>

        {day.spots.length === 0 ? (
          <View style={styles.emptyDayContent}>
            <Text style={styles.emptyDayText}>아직 일정이 없어요</Text>
            <Text style={styles.emptyDaySubtext}>
              여행 스팟을 추가해 일정을 세워봐요
            </Text>
            <TouchableOpacity
              style={styles.addSpotButton}
              onPress={() => handleAddSpot(dayIndex)}
            >
              <Text style={styles.addSpotButtonText}>여행 스팟 추가</Text>
            </TouchableOpacity>
          </View>
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
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>임시저장</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.dateRange}>{tripData.dateRange}</Text>

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

        <View style={styles.profileSection}>
          <View style={styles.profileImage} />
          <TouchableOpacity style={styles.addProfileButton}>
            <Text style={styles.addProfileText}>+</Text>
          </TouchableOpacity>
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
          <KakaoMap
            latitude={currentLocation.latitude}
            longitude={currentLocation.longitude}
            regions={selectedRegions}
            ref={webViewRef}
          />
        </View>
      </View>

      {/* Day Timeline */}
      {renderDayTimeline()}

      {/* Day Cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dayCardsContainer}
      >
        {tripData.days.map((day, index) => renderDayCard(day, index))}
      </ScrollView>

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
  saveButton: {
    backgroundColor: "#C5BFBB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
  dateRange: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginBottom: 10,
  },
  titleSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  tripTitle: {
    fontSize: 24,
    fontFamily: "SUIT-700",
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
  regionTag: {
    backgroundColor: "#C5BFBB",
    paddingHorizontal: 12,
    paddingVertical: 6,
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
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
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
  timelineContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  timeline: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  timelineItem: {
    alignItems: "center",
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  activeTimelineDot: {
    backgroundColor: "#FF0000",
  },
  inactiveTimelineDot: {
    backgroundColor: "#000000",
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  dayCard: {
    width: 280,
    height: 200,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginRight: 15,
    padding: 20,
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
  },
  addSpotButton: {
    backgroundColor: "#716C69",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addSpotButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "SUIT-600",
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
