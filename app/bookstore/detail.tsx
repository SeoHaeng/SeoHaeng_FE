import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function DetailTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>서점 정보</Text>
      <Text style={styles.description}>
        이스트씨네는 강릉에 위치한 독립서점입니다. 영화와 책을 사랑하는 사람들이
        모이는 공간으로, 다양한 독립영화와 독서 문화를 즐길 수 있습니다.
      </Text>
      <Text style={styles.tabTitle}>영업시간</Text>
      <Text style={styles.description}>
        평일: 10:00 - 22:00{"\n"}주말: 10:00 - 22:00
      </Text>
      <Text style={styles.tabTitle}>연락처</Text>
      <Text style={styles.infoText}>033-123-4567</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    minHeight: 400,
  },
  tabTitle: {
    fontSize: 13,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
    lineHeight: 20,
    marginBottom: 50,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginBottom: 4,
  },
});
