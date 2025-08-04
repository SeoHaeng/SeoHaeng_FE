import CommonButton from "@/components/CommonButton";
import CommonHeader from "@/components/CommonHeader";
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
    // Navigate to next screen or complete the flow
    router.back();
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
      <CommonHeader
        title="어디로 여행을 떠날까요?"
        subtitle="2025.06.13 - 06.16"
      />

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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 15,
  },
  destinationItem: {
    width: "48%",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  selectedDestination: {
    backgroundColor: "#E0E0E0",
  },
  destinationImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  destinationName: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  selectedDestinationName: {
    color: "#302E2D",
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
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
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
