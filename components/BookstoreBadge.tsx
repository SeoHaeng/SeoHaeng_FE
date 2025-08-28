import IndependentBookstoreIcon from "@/components/icons/IndependentBookstoreIcon";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BookstoreBadgeProps {
  placeType?: string;
  text?: string;
}

export default function BookstoreBadge({
  placeType,
  text,
}: BookstoreBadgeProps) {
  // placeType에 따라 badgeText 결정
  const getBadgeText = () => {
    if (text) return text; // text prop이 있으면 우선 사용

    switch (placeType) {
      case "TOURIST_SPOT":
        return "관광지";
      case "RESTAURANT":
        return "음식점";
      case "BOOKSTORE":
        return "독립서점";
      case "FESTIVAL":
        return "축제";
      case "BOOK_CAFE":
        return "북카페";
      case "SPACE_BOOKMARK":
        return "독서공간";
      case "BOOK_STAY":
        return "북스테이";
      default:
        return "독립서점";
    }
  };

  return (
    <View style={styles.badgeContainer}>
      <IndependentBookstoreIcon width={10} height={10} />
      <Text style={styles.badgeText}>{getBadgeText()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBD6D3",
    borderRadius: 5,
    paddingHorizontal: 3,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginLeft: 3,
  },
});
