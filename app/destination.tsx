import CommonButton from "@/components/CommonButton";
import BackIcon from "@/components/icons/BackIcon";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Destination {
  id: string;
  name: string;
}

const destinations: Destination[] = [
  { id: "1", name: "강릉" },
  { id: "2", name: "양구" },
  { id: "3", name: "태백" },
  { id: "4", name: "평창" },
  { id: "5", name: "횡성" },
  { id: "6", name: "원주" },
  { id: "7", name: "춘천" },
  { id: "8", name: "양양" },
  { id: "9", name: "속초" },
  { id: "10", name: "영월" },
  { id: "11", name: "정선" },
  { id: "12", name: "철원" },
  { id: "13", name: "화천" },
  { id: "14", name: "인제" },
  { id: "15", name: "고성" },
  { id: "16", name: "동해" },
  { id: "17", name: "삼척" },
];

export default function Destination() {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    [],
  );

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

    router.push({
      pathname: "/itinerary",
      params: {
        regions: selectedDestinationNames.join(","),
        dateRange: "2025.06.13 - 06.16", // 실제로는 선택된 날짜를 사용해야 함
      },
    });
  };

  const renderDestination = ({ item }: { item: Destination }) => {
    const isSelected = selectedDestinations.includes(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.destinationItem,
          isSelected && styles.selectedDestination,
        ]}
        onPress={() => toggleDestination(item.id)}
      >
        <View style={styles.destinationImage} />
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
        <Text style={styles.headerSubtitle}>2025.06.13 - 06.16</Text>
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
                    <Text style={styles.tagRemove}>X</Text>
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
    borderWidth: 1,
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
  tagRemove: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#9D9896",
  },
});
