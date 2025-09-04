import BookChallengeIcon from "@/components/icons/BookChallengeIcon";
import BookMoimIcon from "@/components/icons/BookMoimIcon";
import BookStayIcon from "@/components/icons/BookStayIcon";
import BusinessHoursIcon from "@/components/icons/BusinessHoursIcon";
import ParkingIcon from "@/components/icons/ParkingIcon";
import PetIcon from "@/components/icons/PetIcon";
import PhoneIcon from "@/components/icons/PhoneIcon";
import SpaceShareIcon from "@/components/icons/SpaceShareIcon";
import StoreIntroIcon from "@/components/icons/StoreIntroIcon";
import WebsiteIcon from "@/components/icons/WebsiteIcon";
import React from "react";
import {
  Linking,
  ScrollView,
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
      <Text style={styles.description}>{placeDetail.placeDetail.overview}</Text>

      {/* 서비스 상태 카드 섹션 */}
      <View style={styles.tabTitleContainer}>
        <BookStayIcon />
        <Text style={styles.tabTitle}>매장 정보</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.serviceCardsContainer}>
          {placeDetail.placeDetail.bookChallengeStatus && (
            <View style={styles.serviceCard}>
              <BookChallengeIcon />

              <Text style={styles.serviceText}>북챌린지</Text>
            </View>
          )}

          {placeDetail.placeDetail.readingClub && (
            <View style={styles.serviceCard}>
              <BookMoimIcon />

              <Text style={styles.serviceText}>독서모임</Text>
            </View>
          )}

          {placeDetail.placeDetail.petFriendly && (
            <View style={styles.serviceCard}>
              <PetIcon />

              <Text style={styles.serviceText}>반려동물</Text>
            </View>
          )}

          {placeDetail.placeDetail.parking && (
            <View style={styles.serviceCard}>
              <ParkingIcon />

              <Text style={styles.serviceText}>주차</Text>
            </View>
          )}

          {placeDetail.placeDetail.spaceRental && (
            <View style={styles.serviceCard}>
              <SpaceShareIcon />

              <Text style={styles.serviceText}>공간대여</Text>
            </View>
          )}

          {placeDetail.placeDetail.reservation && (
            <View style={styles.serviceCard}>
              <PhoneIcon />
              <Text style={styles.serviceText}>예약</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
    marginBottom: 10,
    gap: 7,
  },
  serviceCardsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  serviceCard: {
    width: 80,
    height: 80,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 15,
    paddingVertical: 16,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceIcon: {
    width: 20,
    height: 20,
  },
  serviceText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#262423",
    textAlign: "center",
  },
});
