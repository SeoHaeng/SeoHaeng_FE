import BusinessHoursIcon from "@/components/icons/BusinessHoursIcon";
import PhoneIcon from "@/components/icons/PhoneIcon";
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

interface FestivalDetailProps {
  placeDetail: any;
}

export default function FestivalDetail({ placeDetail }: FestivalDetailProps) {
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
            <Text style={styles.tabTitle} allowFontScaling={false}>
              영업 시간
            </Text>
          </View>
          <Text style={styles.description} allowFontScaling={false}>
            {placeDetail.usetime}
          </Text>
        </>
      )}

      {placeDetail?.tel && (
        <>
          <View style={styles.tabTitleContainer}>
            <PhoneIcon />
            <Text style={styles.tabTitle} allowFontScaling={false}>
              연락처
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (placeDetail.tel) {
                Linking.openURL(`tel:${placeDetail.tel}`);
              }
            }}
          >
            <Text style={styles.phoneLink} allowFontScaling={false}>
              {placeDetail.tel}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {placeDetail?.placeDetail?.startDate &&
        placeDetail?.placeDetail?.endDate && (
          <>
            <View style={styles.tabTitleContainer}>
              <BusinessHoursIcon />
              <Text style={styles.tabTitle} allowFontScaling={false}>
                축제 기간
              </Text>
            </View>
            <Text style={styles.description} allowFontScaling={false}>
              {placeDetail.placeDetail.startDate.replace(/-/g, ".")} ~{" "}
              {placeDetail.placeDetail.endDate.replace(/-/g, ".")}
            </Text>
          </>
        )}

      {placeDetail?.websiteUrl && (
        <>
          <View style={styles.tabTitleContainer}>
            <WebsiteIcon />
            <Text style={styles.tabTitle} allowFontScaling={false}>
              공식 웹사이트
            </Text>
          </View>
          <TouchableOpacity onPress={handleWebsitePress}>
            <Text style={styles.websiteLink} allowFontScaling={false}>
              {placeDetail.websiteUrl}
            </Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.tabTitleContainer}>
        <StoreIntroIcon />
        <Text style={styles.tabTitle} allowFontScaling={false}>
          축제 소개
        </Text>
      </View>
      <Text style={styles.description} allowFontScaling={false}>
        {placeDetail.placeDetail.overview}
      </Text>

      {placeDetail?.placeDetail?.programs && (
        <>
          <View style={styles.tabTitleContainer}>
            <StoreInfoIcon />
            <Text style={styles.tabTitle} allowFontScaling={false}>
              축제 프로그램
            </Text>
          </View>
          <Text style={styles.infoText} allowFontScaling={false}>
            {placeDetail.placeDetail.programs.replace(/<br\s*\/?>/gi, "\n")}
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
    fontSize: 14,
    fontFamily: "SUIT-700",
    color: "#262423",
  },
  description: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#262423",
    lineHeight: 20,
    marginBottom: 25,
  },
  infoText: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginBottom: 4,
    lineHeight: 20,
  },
  websiteLink: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#3871E0",
    textDecorationLine: "underline",
    marginBottom: 40,
  },
  phoneLink: {
    fontSize: 15,
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
