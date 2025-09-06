import CommonButton from "@/components/CommonButton";
import BackIcon from "@/components/icons/BackIcon";
import { useGlobalState } from "@/types/globalState";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 이미지들을 개별적으로 import
import 강릉 from "@/assets/images/gangwondo/강릉.jpg";
import 고성 from "@/assets/images/gangwondo/고성.jpg";
import 동해 from "@/assets/images/gangwondo/동해.jpg";
import 삼척 from "@/assets/images/gangwondo/삼척.jpg";
import 속초 from "@/assets/images/gangwondo/속초.jpg";
import 양구 from "@/assets/images/gangwondo/양구.jpg";
import 양양 from "@/assets/images/gangwondo/양양.jpg";
import 영월 from "@/assets/images/gangwondo/영월.jpg";
import 원주 from "@/assets/images/gangwondo/원주.jpg";
import 인제 from "@/assets/images/gangwondo/인제.jpg";
import 정선 from "@/assets/images/gangwondo/정선.jpg";
import 철원 from "@/assets/images/gangwondo/철원.jpg";
import 춘천 from "@/assets/images/gangwondo/춘천.jpg";
import 태백 from "@/assets/images/gangwondo/태백.jpg";
import 평창 from "@/assets/images/gangwondo/평창.jpg";
import 홍천 from "@/assets/images/gangwondo/홍천.jpg";
import 화천 from "@/assets/images/gangwondo/화천.jpg";
import 횡성 from "@/assets/images/gangwondo/횡성.jpg";

interface DestinationItem {
  id: string;
  name: string;
  imageUrl: any;
}

const destinations: DestinationItem[] = [
  {
    id: "1",
    name: "강릉",
    imageUrl: 강릉,
  },
  {
    id: "2",
    name: "속초",
    imageUrl: 속초,
  },
  {
    id: "3",
    name: "춘천",
    imageUrl: 춘천,
  },
  {
    id: "4",
    name: "원주",
    imageUrl: 원주,
  },
  {
    id: "5",
    name: "동해",
    imageUrl: 동해,
  },
  {
    id: "6",
    name: "태백",
    imageUrl: 태백,
  },
  {
    id: "7",
    name: "삼척",
    imageUrl: 삼척,
  },
  {
    id: "8",
    name: "홍천",
    imageUrl: 홍천,
  },
  {
    id: "9",
    name: "횡성",
    imageUrl: 횡성,
  },
  {
    id: "10",
    name: "영월",
    imageUrl: 영월,
  },
  {
    id: "11",
    name: "평창",
    imageUrl: 평창,
  },
  {
    id: "12",
    name: "정선",
    imageUrl: 정선,
  },
  {
    id: "13",
    name: "철원",
    imageUrl: 철원,
  },
  {
    id: "14",
    name: "화천",
    imageUrl: 화천,
  },
  {
    id: "15",
    name: "양구",
    imageUrl: 양구,
  },
  {
    id: "16",
    name: "인제",
    imageUrl: 인제,
  },
  {
    id: "17",
    name: "고성",
    imageUrl: 고성,
  },
  {
    id: "18",
    name: "양양",
    imageUrl: 양양,
  },
];

export default function Destination() {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    [],
  );
  const { travelScheduleList, setSelectedRegions } = useGlobalState();

  const toggleDestination = (id: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? prev.filter((dest) => dest !== id) : [...prev, id],
    );
  };

  const handleComplete = () => {
    // Navigate to itinerary page with selected destinations
    const selectedDestinationNames = selectedDestinations.map(
      (id) => destinations.find((d) => d.id === id)?.name || "",
    );

    // 전역 상태에 선택된 지역 저장
    setSelectedRegions(selectedDestinationNames);

    // 전역 상태에서 날짜 정보 가져오기
    if (!travelScheduleList || !Array.isArray(travelScheduleList)) {
      console.log(
        "⚠️ travelScheduleList가 undefined이거나 배열이 아닙니다:",
        travelScheduleList,
      );
      return;
    }

    const travelDates = travelScheduleList
      .filter((item) => item && item.day) // 유효한 날짜만 필터링
      .map((item) => item.day)
      .sort(); // 날짜 순으로 정렬

    let dateRange = "";
    if (travelDates.length > 0) {
      const startDate = travelDates[0];
      const endDate = travelDates[travelDates.length - 1];

      // YYYY-MM-DD 형식을 MM.DD 형식으로 변환
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
      };

      dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    console.log("🌍 선택된 지역:", selectedDestinationNames);
    console.log("📅 여행 날짜:", dateRange);
    console.log("📊 전역 스케줄 상태:", travelScheduleList);

    router.push({
      pathname: "/itinerary",
      params: {
        regions: selectedDestinationNames.join(","),
        dateRange: dateRange || "날짜 미정",
      },
    });
  };

  const renderDestination = ({ item }: { item: DestinationItem }) => {
    const isSelected = selectedDestinations.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.destinationItem,
          isSelected && styles.selectedDestination,
        ]}
        onPress={() => toggleDestination(item.id)}
      >
        <Image
          source={item.imageUrl}
          style={styles.destinationImage}
          resizeMode="cover"
        />
        <Text
          style={[
            styles.destinationName,
            isSelected && styles.selectedDestinationName,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/plan")}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerSubtitle}>
          {travelScheduleList.length > 0
            ? `${travelScheduleList[0]?.day?.slice(5, 7)}.${travelScheduleList[0]?.day?.slice(8, 10)} - ${travelScheduleList[travelScheduleList.length - 1]?.day?.slice(5, 7)}.${travelScheduleList[travelScheduleList.length - 1]?.day?.slice(8, 10)}`
            : "날짜 미정"}
        </Text>
        <Text style={styles.headerTitle}>어디로{"\n"}여행을 떠날까요?</Text>
      </View>

      <View style={styles.content}>
        <FlatList
          data={destinations}
          renderItem={renderDestination}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {selectedDestinations.length > 0 && (
        <View style={styles.selectedContainer}>
          <View style={styles.selectedTags}>
            {selectedDestinations.map((id) => {
              const destination = destinations.find((d) => d.id === id);
              return (
                <View key={id} style={styles.tag}>
                  <Text style={styles.tagText}>{destination?.name}</Text>
                  <TouchableOpacity onPress={() => toggleDestination(id)}>
                    <Feather name="x" size={18} color="#9D9896" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <CommonButton
        title={`총 ${selectedDestinations.length}곳 선택 완료`}
        onPress={handleComplete}
        disabled={selectedDestinations.length === 0}
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
    flexDirection: "column",
    gap: 15,
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#C5BFBB",
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "SUIT-700",
    color: "#262423",
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 5,
  },
  destinationItem: {
    width: "48%",
    height: 84,
    backgroundColor: "#F8F8F8",
    borderRadius: 5,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  selectedDestination: {
    backgroundColor: "#716C69",
  },
  destinationImage: {
    width: 58,
    height: 58,
    borderRadius: 30,
    marginRight: 25,
  },
  destinationName: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  selectedDestinationName: {
    color: "#FFFFFF",
  },
  selectedContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE9E6",
  },
  selectedTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C5BFBB",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 5,
    gap: 8,
  },
  tagText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
});
