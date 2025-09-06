import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SpaceView from "./space";
import StampView from "./stamp";

export default function MemoryLayout() {
  const [activeTab, setActiveTab] = useState("내 공간");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 상단 탭 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.tab}
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
          {activeTab === "내 공간" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
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
          {activeTab === "스탬프" && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠 */}
      {activeTab === "스탬프" ? <StampView /> : <SpaceView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  tab: {
    position: "relative",
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 17,
    color: "#716C69",
    fontFamily: "SUIT-700",
  },
  activeTabText: {
    color: "#000000",
    fontFamily: "SUIT-700",
  },
  activeIndicator: {
    marginTop: 5,
    height: 2,
    width: "50%",
    backgroundColor: "#000000",
    alignSelf: "center",
    borderRadius: 5,
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
