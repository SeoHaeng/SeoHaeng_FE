import BabyIcon from "@/components/icons/BabyIcon";
import BusinessHoursIcon from "@/components/icons/BusinessHoursIcon";
import CreditIcon from "@/components/icons/CreditIcon";
import ParkingIcon from "@/components/icons/ParkingIcon";
import PetIcon from "@/components/icons/PetIcon";
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
    if (placeDetail?.websiteUrl) {
      Linking.openURL(placeDetail.websiteUrl);
    }
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
            <StoreInfoIcon />
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

      {placeDetail?.websiteUrl && (
        <>
          <View style={styles.tabTitleContainer}>
            <WebsiteIcon />
            <Text style={styles.tabTitle}>공식 웹사이트</Text>
          </View>
          <TouchableOpacity onPress={handleWebsitePress}>
            <Text style={styles.websiteLink}>{placeDetail.websiteUrl}</Text>
          </TouchableOpacity>
        </>
      )}

      {placeDetail?.placeDetail?.overview && (
        <>
          <View style={styles.tabTitleContainer}>
            <StoreIntroIcon />
            <Text style={styles.tabTitle}>관광지 소개</Text>
          </View>
          <Text style={styles.description}>
            {placeDetail.placeDetail.overview}
          </Text>
        </>
      )}

      {/* 주차 정보 */}
      {placeDetail?.placeDetail?.parkingAvailable && (
        <>
          <View style={styles.tabTitleContainer}>
            <ParkingIcon />
            <Text style={styles.tabTitle}>주차</Text>
          </View>
          <Text style={styles.infoText}>
            {placeDetail.placeDetail.parkingAvailable}
          </Text>
        </>
      )}

      {/* 반려동물 동반 */}
      {placeDetail?.placeDetail?.petsAllowed && (
        <>
          <View style={styles.tabTitleContainer}>
            <PetIcon />
            <Text style={styles.tabTitle}>반려동물 동반</Text>
          </View>
          <Text style={styles.infoText}>
            {placeDetail.placeDetail.petsAllowed}
          </Text>
        </>
      )}

      {/* 유모차 이용 */}
      {placeDetail?.placeDetail?.babyCarriageAllowed && (
        <>
          <View style={styles.tabTitleContainer}>
            <BabyIcon />
            <Text style={styles.tabTitle}>유모차 이용</Text>
          </View>
          <Text style={styles.infoText}>
            {placeDetail.placeDetail.babyCarriageAllowed}
          </Text>
        </>
      )}

      {/* 신용카드 결제 */}
      {placeDetail?.placeDetail?.creditCardAccepted && (
        <>
          <View style={styles.tabTitleContainer}>
            <CreditIcon />
            <Text style={styles.tabTitle}>신용카드 결제</Text>
          </View>
          <Text style={styles.infoText}>
            {placeDetail.placeDetail.creditCardAccepted}
          </Text>
        </>
      )}
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
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginBottom: 40,
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
