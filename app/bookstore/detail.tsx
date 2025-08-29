import PhoneIcon from "@/components/icons/PhoneIcon";
import StoreIntroIcon from "@/components/icons/StoreIntroIcon";
import WebsiteIcon from "@/components/icons/WebsiteIcon";
import {
  BookstorePlaceDetail,
  FestivalPlaceDetail,
  PlaceDetailResponse,
  RestaurantPlaceDetail,
  TouristSpotPlaceDetail,
} from "@/types/api";
import React from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DetailTabProps {
  placeDetail: PlaceDetailResponse["result"] | null;
}

export default function DetailTab({ placeDetail }: DetailTabProps) {
  const handleWebsitePress = () => {
    if (placeDetail?.websiteUrl) {
      // HTML 태그 제거
      const cleanUrl = placeDetail.websiteUrl.replace(/<[^>]*>/g, "");
      Linking.openURL(cleanUrl);
    }
  };

  const renderBookstoreDetail = (detail: BookstorePlaceDetail) => (
    <View style={styles.serviceList}>
      {detail.bookStay && <Text style={styles.serviceItem}>• 북스테이</Text>}
      {detail.bookChallengeStatus && (
        <Text style={styles.serviceItem}>• 북챌린지</Text>
      )}
      {detail.readingClub && <Text style={styles.serviceItem}>• 독서모임</Text>}
      {detail.lecture && <Text style={styles.serviceItem}>• 강연</Text>}
      {detail.parking && <Text style={styles.serviceItem}>• 주차</Text>}
      {detail.petFriendly && (
        <Text style={styles.serviceItem}>• 반려동물 동반</Text>
      )}
      {detail.cafe && <Text style={styles.serviceItem}>• 카페</Text>}
      {detail.snack && <Text style={styles.serviceItem}>• 간식</Text>}
    </View>
  );

  const renderTouristSpotDetail = (detail: TouristSpotPlaceDetail) => (
    <View style={styles.serviceList}>
      <Text style={styles.description}>{detail.overview}</Text>
      {detail.parkingAvailable && (
        <Text style={styles.serviceItem}>
          • 주차: {detail.parkingAvailable}
        </Text>
      )}
      {detail.petsAllowed && (
        <Text style={styles.serviceItem}>• 반려동물: {detail.petsAllowed}</Text>
      )}
      {detail.babyCarriageAllowed && (
        <Text style={styles.serviceItem}>
          • 유모차: {detail.babyCarriageAllowed}
        </Text>
      )}
      {detail.creditCardAccepted && (
        <Text style={styles.serviceItem}>
          • 신용카드: {detail.creditCardAccepted}
        </Text>
      )}
    </View>
  );

  const renderRestaurantDetail = (detail: RestaurantPlaceDetail) => (
    <View style={styles.serviceList}>
      {detail.firstmenu && (
        <Text style={styles.serviceItem}>• 대표메뉴: {detail.firstmenu}</Text>
      )}
      {detail.treatmenu && (
        <Text style={styles.serviceItem}>• 추천메뉴: {detail.treatmenu}</Text>
      )}
      {detail.kidsfacility && detail.kidsfacility !== "0" && (
        <Text style={styles.serviceItem}>• 키즈시설: 있음</Text>
      )}
      {detail.isTakeoutAvailable && (
        <Text style={styles.serviceItem}>
          • 포장: {detail.isTakeoutAvailable}
        </Text>
      )}
      {detail.hasParking && (
        <Text style={styles.serviceItem}>• 주차: {detail.hasParking}</Text>
      )}
      {detail.isReservable && (
        <Text style={styles.serviceItem}>• 예약: {detail.isReservable}</Text>
      )}
    </View>
  );

  const renderFestivalDetail = (detail: FestivalPlaceDetail) => (
    <View style={styles.serviceList}>
      <Text style={styles.description}>{detail.overview}</Text>
      {detail.startDate && detail.endDate && (
        <Text style={styles.serviceItem}>
          • 기간: {detail.startDate} ~ {detail.endDate}
        </Text>
      )}
      {detail.programs && (
        <Text style={styles.serviceItem}>
          • 프로그램: {detail.programs.replace(/<br>/g, "\n")}
        </Text>
      )}
    </View>
  );

  const renderPlaceDetail = () => {
    if (!placeDetail?.placeDetail) return null;

    switch (placeDetail.placeType) {
      case "BOOKSTORE":
        return renderBookstoreDetail(
          placeDetail.placeDetail as BookstorePlaceDetail,
        );
      case "TOURIST_SPOT":
        return renderTouristSpotDetail(
          placeDetail.placeDetail as TouristSpotPlaceDetail,
        );
      case "RESTAURANT":
        return renderRestaurantDetail(
          placeDetail.placeDetail as RestaurantPlaceDetail,
        );
      case "FESTIVAL":
        return renderFestivalDetail(
          placeDetail.placeDetail as FestivalPlaceDetail,
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.tabContent}>
      {placeDetail?.websiteUrl && (
        <View style={styles.tabTitleContainer}>
          <WebsiteIcon />
          <Text style={styles.tabTitle}>웹사이트</Text>
        </View>
      )}
      {placeDetail?.websiteUrl && (
        <TouchableOpacity onPress={handleWebsitePress}>
          <Text style={styles.websiteLink}>
            {placeDetail.websiteUrl.replace(/<[^>]*>/g, "")}
          </Text>
        </TouchableOpacity>
      )}
      {placeDetail?.tel && (
        <View style={styles.tabTitleContainer}>
          <PhoneIcon />
          <Text style={styles.tabTitle}>연락처</Text>
        </View>
      )}
      {placeDetail?.tel && (
        <Text style={styles.infoText}>{placeDetail.tel}</Text>
      )}
      <View style={styles.tabTitleContainer}>
        <StoreIntroIcon />
        <Text style={styles.tabTitle}>
          {placeDetail?.placeType === "BOOKSTORE" && "서비스 정보"}
          {placeDetail?.placeType === "TOURIST_SPOT" && "관광지 정보"}
          {placeDetail?.placeType === "RESTAURANT" && "음식점 정보"}
          {placeDetail?.placeType === "FESTIVAL" && "축제 정보"}
        </Text>
      </View>
      {renderPlaceDetail()}
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
    marginBottom: 12,
    gap: 7,
  },
  serviceList: {
    marginBottom: 40,
  },
  serviceItem: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
    lineHeight: 20,
    marginBottom: 8,
  },
});
