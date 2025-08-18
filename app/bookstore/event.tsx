import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function EventTab() {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>북챌린지 이벤트</Text>
      <Text style={styles.description}>
        3월 16일부터 이스트 씨네에서도 북 챌린지 이벤트를 진행합니다! 이유는
        없습니다. 다들 하길래 저희도 하는겁니다 ㅎㅎ 많은 참여 부탁드려요~!!
      </Text>
      <Text style={styles.tabTitle}>챌린지 리워드</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.rewardContainer}
        contentContainerStyle={styles.rewardContentContainer}
      >
        <View style={styles.rewardItem} />
        <View style={styles.rewardItem} />
        <View style={styles.rewardItem} />
        <View style={styles.rewardItem} />
        <View style={styles.rewardItem} />
      </ScrollView>
      <Text style={styles.description}>
        챌린지에 참여하는 모든 분들께 이스트씨네의 책갈피를 드립니다
      </Text>
      <Text style={styles.tabTitle}>사장님 한 마디</Text>
      <Text style={styles.description}>
        3월 16일부터 이스트 씨네에서도 북 챌린지 이벤트를 진행합니다! 이유는
        없습니다. 다들 하길래 저희도 하는겁니다 ㅎㅎ 많은 참여 부탁드려요~!!
      </Text>
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
  rewardContainer: {
    marginBottom: 15,
  },
  rewardContentContainer: {
    gap: 10,
  },
  rewardItem: {
    width: 145,
    height: 145,
    backgroundColor: "#F5F3F2",
    borderRadius: 8,
  },
});
