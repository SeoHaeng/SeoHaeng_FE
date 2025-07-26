import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView from "./mapView";
import StampBoard from "./stampBoard";

export default function StampView() {
  const [activeView, setActiveView] = useState("도장판");

  // 스탬프 데이터 (예시)
  const stamps = [
    { id: 1, city: "춘천시", date: "25.06.12", collected: true, image: null },
    { id: 2, city: "동해시", date: "25.06.12", collected: true, image: null },
    { id: 3, city: "강릉시", date: "", collected: false, image: null },
    { id: 4, city: "속초시", date: "", collected: false, image: null },
    { id: 5, city: "삼척시", date: "", collected: false, image: null },
    { id: 6, city: "원주시", date: "", collected: false, image: null },
    { id: 7, city: "태백시", date: "", collected: false, image: null },
    { id: 8, city: "정선군", date: "", collected: false, image: null },
    { id: 9, city: "철원군", date: "", collected: false, image: null },
    { id: 10, city: "화천군", date: "", collected: false, image: null },
    { id: 11, city: "양구군", date: "", collected: false, image: null },
    { id: 12, city: "인제군", date: "", collected: false, image: null },
    { id: 13, city: "고성군", date: "", collected: false, image: null },
    { id: 14, city: "양양군", date: "", collected: false, image: null },
    { id: 15, city: "횡성군", date: "", collected: false, image: null },
    { id: 16, city: "영월군", date: "", collected: false, image: null },
    { id: 17, city: "평창군", date: "", collected: false, image: null },
    { id: 18, city: "홍천군", date: "", collected: false, image: null },
  ];

  const collectedCount = stamps.filter((stamp) => stamp.collected).length;
  const totalCount = stamps.length;

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* 진행률 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressLabel}>지금까지 모은 발자국</Text>
          <View style={styles.progressCountContainer}>
            <Text style={styles.progressCountNumber}>{collectedCount}개</Text>
            <Text style={styles.progressCountText}> / {totalCount}개</Text>
          </View>
        </View>

        {/* 토글 버튼 */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeView === "도장판" && styles.activeToggleButton,
            ]}
            onPress={() => setActiveView("도장판")}
          >
            <Text
              style={[
                styles.toggleText,
                activeView === "도장판" && styles.activeToggleText,
              ]}
            >
              도장판
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              activeView === "지도" && styles.activeToggleButton,
            ]}
            onPress={() => setActiveView("지도")}
          >
            <Text
              style={[
                styles.toggleText,
                activeView === "지도" && styles.activeToggleText,
              ]}
            >
              지도
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 안내 텍스트 */}
      <Text style={styles.instructionText}>
        강원도 18개 시/군에 도서여행을 떠나고{"\n"}내 발자국을 남겨봐요.
      </Text>

      {/* 조건부 렌더링 */}
      {activeView === "도장판" ? <StampBoard stamps={stamps} /> : <MapView />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  progressTextContainer: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 14,
    color: "#716C69",
    marginBottom: 5,
  },
  progressCountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  progressCountNumber: {
    fontSize: 28,
    fontFamily: "SUIT-700",
    color: "#262423",
  },
  progressCountText: {
    fontSize: 20,
    fontFamily: "SUIT-700",
    color: "#9D9896",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#DBD6D3",
    borderRadius: 20,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 18,
  },
  activeToggleButton: {
    backgroundColor: "#EEE9E6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontFamily: "SUIT-700",
    color: "#9D9896",
  },
  activeToggleText: {
    color: "#262423",
    fontFamily: "SUIT-700",
  },
  instructionText: {
    fontSize: 14,
    color: "#716C69",
    lineHeight: 20,
    marginBottom: 25,
    fontFamily: "SUIT-500",
  },
});
