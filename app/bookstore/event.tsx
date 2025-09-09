import { BookChallengeEvent } from "@/types/api";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

interface EventTabProps {
  bookChallengeEvent: BookChallengeEvent | null;
}

export default function EventTab({ bookChallengeEvent }: EventTabProps) {
  if (!bookChallengeEvent) {
    return (
      <View style={styles.tabContent}>
        <Text style={styles.noEventText}>
          진행 중인 북챌린지 이벤트가 없습니다.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle}>북챌린지 이벤트</Text>
      <Text style={styles.description}>
        {bookChallengeEvent.eventDescription}
      </Text>

      <Text style={styles.tabTitle}>챌린지 리워드</Text>
      {bookChallengeEvent.rewardImageUrls &&
      bookChallengeEvent.rewardImageUrls.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.rewardContainer}
          contentContainerStyle={styles.rewardContentContainer}
        >
          {bookChallengeEvent.rewardImageUrls.map((imageUrl, index) => (
            <View key={index} style={styles.rewardItem}>
              <Image
                source={{ uri: imageUrl }}
                style={styles.rewardImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>리워드 이미지가 없습니다.</Text>
        </View>
      )}
      <Text style={styles.description}>
        {bookChallengeEvent.rewardDescription}
      </Text>

      <Text style={styles.tabTitle}>사장님 한 마디</Text>
      <Text style={styles.description}>{bookChallengeEvent.ownerMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    minHeight: 400,
  },
  tabTitle: {
    fontSize: 14,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
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
    overflow: "hidden",
  },
  rewardImage: {
    width: "100%",
    height: "100%",
  },
  noEventText: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    textAlign: "center",
    marginTop: 50,
  },
  noImageContainer: {
    width: 145,
    height: 145,
    backgroundColor: "#F5F3F2",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  noImageText: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    textAlign: "center",
  },
});
