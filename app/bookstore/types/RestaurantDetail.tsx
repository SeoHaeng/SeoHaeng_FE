import BusinessHoursIcon from "@/components/icons/BusinessHoursIcon";
import PhoneIcon from "@/components/icons/PhoneIcon";
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

interface RestaurantDetailProps {
  placeDetail: any;
}

export default function RestaurantDetail({
  placeDetail,
}: RestaurantDetailProps) {
  const handleWebsitePress = () => {
    // 음식점 웹사이트 URL로 변경
    Linking.openURL("https://www.example.com");
  };

  return (
    <View style={styles.tabContent}>
      {placeDetail?.usetime && (
        <>
          <View style={styles.tabTitleContainer}>
            <BusinessHoursIcon />
            <Text style={styles.tabTitle}>영업 시간</Text>
          </View>
          <Text style={styles.description}>{placeDetail.usetime}</Text>
        </>
      )}

      {placeDetail?.tel && (
        <>
          <View style={styles.tabTitleContainer}>
            <PhoneIcon />
            <Text style={styles.tabTitle}>연락처</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (placeDetail.tel) {
                Linking.openURL(`tel:${placeDetail.tel}`);
              }
            }}
          >
            <Text style={styles.phoneLink}>{placeDetail.tel}</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.tabTitleContainer}>
        <WebsiteIcon />
        <Text style={styles.tabTitle}>공식 웹사이트</Text>
      </View>
      <TouchableOpacity onPress={handleWebsitePress}>
        <Text style={styles.websiteLink}>https://www.example.com</Text>
      </TouchableOpacity>

      <View style={styles.tabTitleContainer}>
        <StoreIntroIcon />
        <Text style={styles.tabTitle}>음식점 소개</Text>
      </View>
      <Text style={styles.description}>
        신선한 재료와 정성스러운 손맛으로 만드는 맛있는 요리를 제공하는
        음식점입니다. 가족과 친구들과 함께 즐길 수 있는 따뜻한 분위기를
        자랑합니다.
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
  },
  description: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
    lineHeight: 20,
    marginBottom: 25,
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
  phoneLink: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#3871E0",
    textDecorationLine: "underline",
    marginBottom: 40,
  },
  tabTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 7,
  },
});
