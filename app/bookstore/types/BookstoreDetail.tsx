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

interface BookstoreDetailProps {
  placeDetail: any;
}

export default function BookstoreDetail({ placeDetail }: BookstoreDetailProps) {
  const handleWebsitePress = () => {
    if (placeDetail?.websiteUrl) {
      Linking.openURL(placeDetail.websiteUrl);
    }
  };

  return (
    <View style={styles.tabContent}>
      <View style={styles.tabTitleContainer}>
        <BusinessHoursIcon />
        <Text style={styles.tabTitle}>영업 시간</Text>
      </View>
      <Text style={styles.description}>{placeDetail?.usetime}</Text>

      <View style={styles.tabTitleContainer}>
        <WebsiteIcon />
        <Text style={styles.tabTitle}>웹사이트</Text>
      </View>
      {placeDetail?.websiteUrl ? (
        <TouchableOpacity onPress={handleWebsitePress}>
          <Text style={styles.websiteLink}>{placeDetail.websiteUrl}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.description}>웹사이트 정보가 없습니다.</Text>
      )}

      <View style={styles.tabTitleContainer}>
        <StoreIntroIcon />
        <Text style={styles.tabTitle}>매장 소개</Text>
      </View>
      <Text style={styles.description}>
        {placeDetail?.placeDetail?.bookStay
          ? "북스테이 운영"
          : "북스테이 미운영"}
        {placeDetail?.placeDetail?.readingClub ? ", 독서모임 운영" : ""}
        {placeDetail?.placeDetail?.lecture ? ", 강연 프로그램 운영" : ""}
        {placeDetail?.placeDetail?.indiePublication
          ? ", 인디 퍼블리싱 지원"
          : ""}
        {placeDetail?.placeDetail?.usedBooks ? ", 중고책 판매" : ""}
        {placeDetail?.placeDetail?.cafe ? ", 카페 운영" : ""}
        {placeDetail?.placeDetail?.parking ? ", 주차 가능" : ""}
        {placeDetail?.placeDetail?.petFriendly ? ", 반려동물 동반 가능" : ""}
      </Text>

      <View style={styles.tabTitleContainer}>
        <StoreInfoIcon />
        <Text style={styles.tabTitle}>매장 정보</Text>
      </View>
      <Text style={styles.infoText}>
        {placeDetail?.tel || "연락처 정보가 없습니다."}
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
