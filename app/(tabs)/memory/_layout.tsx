import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import StampView from "./stamp";

export default function MemoryLayout() {
  const [activeTab, setActiveTab] = useState("스탬프");

  return (
    <View style={styles.container}>
      {/* 상단 탭 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "내 공간" && styles.activeTab]}
          onPress={() => setActiveTab("내 공간")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "내 공간" && styles.activeTabText,
            ]}
          >
            내 공간
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "스탬프" && styles.activeTab]}
          onPress={() => setActiveTab("스탬프")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "스탬프" && styles.activeTabText,
            ]}
          >
            스탬프
          </Text>
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠 */}
      {activeTab === "스탬프" ? (
        <StampView />
      ) : (
        <View style={styles.spaceContainer}>
          <Text style={styles.spaceText}>내 공간</Text>
          <Text style={styles.spaceSubtext}>준비 중...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  tab: {
    marginRight: 30,
    paddingBottom: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  spaceContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  spaceText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  spaceSubtext: {
    fontSize: 16,
    color: "#666",
  },
});
