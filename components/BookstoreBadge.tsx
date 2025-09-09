import HotPlaceIcon from "@/components/icons/HotPlaceIcon";
import IndependentBookstoreIcon from "@/components/icons/IndependentBookstoreIcon";
import RestaurantIcon from "@/components/icons/RestaurantIcon";
import TouristSpotIcon from "@/components/icons/TouristSpotIcon";
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
  // placeType에 따라 아이콘 결정
  const getIcon = () => {
    switch (placeType) {
      case "TOURIST_SPOT":
        return <TouristSpotIcon width={12} height={12} />;
      case "RESTAURANT":
        return <RestaurantIcon width={12} height={12} />;
      case "BOOKSTORE":
        return <IndependentBookstoreIcon width={12} height={12} />;
      case "FESTIVAL":
        return <HotPlaceIcon width={12} height={12} />;
      default:
        return <IndependentBookstoreIcon width={12} height={12} />;
    }
  };

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
    }
  };

  return (
    <View style={styles.badgeContainer}>
      {getIcon()}
      <Text style={styles.badgeText} allowFontScaling={false}>
        {getBadgeText()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBD6D3",
    borderRadius: 7,
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginLeft: 3,
  },
});
