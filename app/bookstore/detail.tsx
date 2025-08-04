import BusinessHoursIcon from "@/components/icons/BusinessHoursIcon";
import StoreInfoIcon from "@/components/icons/StoreInfoIcon";
import StoreIntroIcon from "@/components/icons/StoreIntroIcon";
import WebsiteIcon from "@/components/icons/WebsiteIcon";
import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function DetailTab() {
  const handleWebsitePress = () => {
    Linking.openURL("https://www.instagram.com/eastcine_bookshop");
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabTitleContainer}>
        <BusinessHoursIcon />
        <Text style={styles.tabTitle}>영업 시간</Text>
      </View>
      <Text style={styles.description}>13:00 - 22:00</Text>
      <View style={styles.tabTitleContainer}>
        <WebsiteIcon />
        <Text style={styles.tabTitle}>웹사이트</Text>
      </View>
      <TouchableOpacity onPress={handleWebsitePress}>
        <Text style={styles.websiteLink}>
          https://www.instagram.com/eastcine_bookshop
        </Text>
      </TouchableOpacity>
      <View style={styles.tabTitleContainer}>
        <StoreIntroIcon />
        <Text style={styles.tabTitle}>매장 소개</Text>
      </View>
      <Text style={styles.description}>
        이스트씨네는 강릉에 위치한 독립서점입니다. 영화와 책을 사랑하는 사람들이
        모이는 공간으로, 다양한 독립영화와 독서 문화를 즐길 수 있습니다.
      </Text>
      <View style={styles.tabTitleContainer}>
        <StoreInfoIcon />
        <Text style={styles.tabTitle}>매장 정보</Text>
      </View>
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
  },
  description: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
    lineHeight: 20,
    marginBottom: 40,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginBottom: 4,
  },
  websiteLink: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#3871E0",
    textDecorationLine: "underline",
    marginBottom: 40,
  },
  tabTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
    gap: 7,
  },
});
