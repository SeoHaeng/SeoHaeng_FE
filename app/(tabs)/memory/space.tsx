import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LikedPlaces from "./likedPlaces";
import MyBookmark from "./myBookmark";
import SavedBookmark from "./savedBookmark";

export default function SpaceView() {
  const [activeSubTab, setActiveSubTab] = useState("찜한 장소");

  const renderSubTabContent = () => {
    switch (activeSubTab) {
      case "내 책갈피":
        return <MyBookmark />;
      case "저장 책갈피":
        return <SavedBookmark />;
      case "찜한 장소":
        return <LikedPlaces />;
      default:
        return <LikedPlaces />;
    }
  };

  return (
    <View style={styles.container}>
      {/* 서브 탭 */}
      <View style={styles.subTabContainer}>
        <TouchableOpacity
          style={[
            styles.subTab,
            activeSubTab === "내 책갈피" && styles.activeSubTab,
          ]}
          onPress={() => setActiveSubTab("내 책갈피")}
        >
          <Text
            style={[
              styles.subTabText,
              activeSubTab === "내 책갈피" && styles.activeSubTabText,
            ]}
          >
            내 책갈피
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.subTab,
            activeSubTab === "저장 책갈피" && styles.activeSubTab,
          ]}
          onPress={() => setActiveSubTab("저장 책갈피")}
        >
          <Text
            style={[
              styles.subTabText,
              activeSubTab === "저장 책갈피" && styles.activeSubTabText,
            ]}
          >
            저장 책갈피
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.subTab,
            activeSubTab === "찜한 장소" && styles.activeSubTab,
          ]}
          onPress={() => setActiveSubTab("찜한 장소")}
        >
          <Text
            style={[
              styles.subTabText,
              activeSubTab === "찜한 장소" && styles.activeSubTabText,
            ]}
          >
            찜한 장소
          </Text>
        </TouchableOpacity>

        {/* 드롭다운 메뉴 */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownText}>목록 보기</Text>
          <Image source={require("@/assets/images/downArrow.png")} />
        </View>
      </View>

      {/* 메인 콘텐츠 */}
      {renderSubTabContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  subTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  subTab: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    marginRight: 8,
  },
  activeSubTab: {
    backgroundColor: "#302E2D",
    borderWidth: 1,
    borderColor: "#302E2D",
  },
  subTabText: {
    fontSize: 13,
    color: "#333333",
    fontFamily: "SUIT-600",
  },
  activeSubTabText: {
    color: "#FFFFFF",
    fontFamily: "SUIT-600",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    gap: 3,
  },
  dropdownText: {
    fontSize: 14,
    color: "#716C69",
    fontFamily: "SUIT-500",
  },
  dropdownIcon: {
    fontSize: 12,
    color: "#666666",
    marginLeft: 4,
  },
});
