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

interface TouristSpotDetailProps {
  placeDetail: any;
}

export default function TouristSpotDetail({
  placeDetail,
}: TouristSpotDetailProps) {
  const handleWebsitePress = () => {
    // 관광지 웹사이트 URL로 변경
    Linking.openURL("https://www.example.com");
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabTitleContainer}>
        <BusinessHoursIcon />
        <Text style={styles.tabTitle}>운영 시간</Text>
      </View>
      <Text style={styles.description}>09:00 - 18:00</Text>

      <View style={styles.tabTitleContainer}>
        <WebsiteIcon />
        <Text style={styles.tabTitle}>공식 웹사이트</Text>
      </View>
      <TouchableOpacity onPress={handleWebsitePress}>
        <Text style={styles.websiteLink}>https://www.example.com</Text>
      </TouchableOpacity>

      <View style={styles.tabTitleContainer}>
        <StoreIntroIcon />
        <Text style={styles.tabTitle}>관광지 소개</Text>
      </View>
      <Text style={styles.description}>
        아름다운 자연과 문화를 체험할 수 있는 관광지입니다. 다양한 볼거리와
        즐길거리를 제공하며, 방문객들에게 잊을 수 없는 추억을 선사합니다.
      </Text>

      <View style={styles.tabTitleContainer}>
        <StoreInfoIcon />
        <Text style={styles.tabTitle}>관광지 정보</Text>
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
