import { getStampsAPI } from "@/types/api";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import StampBoard from "./stampBoard";

export default function StampView() {
  const [stamps, setStamps] = useState<
    {
      id: number;
      city: string;
      date: string;
      collected: boolean;
      image: string | null;
    }[]
  >([]);
  const [totalStampCount, setTotalStampCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 스탬프 데이터 변환 함수
  const transformStampData = (stampList: any, regionImageList: any) => {
    const cityMap = {
      chuncheon: "춘천시",
      wonju: "원주시",
      gangneung: "강릉시",
      donghae: "동해시",
      taebaek: "태백시",
      sokcho: "속초시",
      samcheok: "삼척시",
      hongcheon: "홍천군",
      hoengseong: "횡성군",
      yeongwol: "영월군",
      pyeongchang: "평창군",
      jeongseon: "정선군",
      cheorwon: "철원군",
      hwacheon: "화천군",
      yanggu: "양구군",
      inje: "인제군",
      goseong: "고성군",
      yangyang: "양양군",
    };

    return Object.entries(cityMap).map(([key, cityName], index) => {
      const visitDate = stampList[key];
      const regionImage = regionImageList[key];

      return {
        id: index + 1,
        city: cityName,
        date: visitDate ? visitDate.replace(/-/g, ".").slice(2) : "", // "2025-08-25" -> "25.08.25"
        collected: !!visitDate,
        image: regionImage,
      };
    });
  };

  // 스탬프 데이터 조회
  useEffect(() => {
    const fetchStamps = async () => {
      try {
        setIsLoading(true);
        const response = await getStampsAPI();
        if (response.isSuccess) {
          const transformedStamps = transformStampData(
            response.result.stampList,
            response.result.regionImageList,
          );
          setStamps(transformedStamps);
          setTotalStampCount(response.result.totalStampCount);
        }
      } catch (error) {
        console.error("스탬프 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStamps();
  }, []);

  const collectedCount = stamps.filter((stamp) => stamp.collected).length;
  const totalCount = stamps.length;

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E60A34" />
        <Text style={styles.loadingText}>스탬프 데이터를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* 진행률 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressLabel} allowFontScaling={false}>
            지금까지 모은 발자국
          </Text>
          <View style={styles.progressCountContainer}>
            <Text style={styles.progressCountNumber} allowFontScaling={false}>
              {collectedCount}개
            </Text>
            <Text style={styles.progressCountText} allowFontScaling={false}>
              {" "}
              / {totalCount}개
            </Text>
          </View>
        </View>
      </View>

      {/* 안내 텍스트 */}
      <Text style={styles.instructionText} allowFontScaling={false}>
        강원도 18개 시/군에 도서여행을 떠나고{"\n"}내 발자국을 남겨봐요.
      </Text>

      {/* 도장판 */}
      <StampBoard stamps={stamps} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 17,
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  progressTextContainer: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 15,
    color: "#716C69",
    marginBottom: 5,
  },
  progressCountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  progressCountNumber: {
    fontSize: 29,
    fontFamily: "SUIT-700",
    color: "#262423",
  },
  progressCountText: {
    fontSize: 21,
    fontFamily: "SUIT-700",
    color: "#9D9896",
  },

  instructionText: {
    fontSize: 15,
    color: "#716C69",
    lineHeight: 20,
    marginBottom: 25,
    fontFamily: "SUIT-500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 17,
  },
  loadingText: {
    fontSize: 17,
    color: "#716C69",
    marginTop: 16,
    fontFamily: "SUIT-500",
  },
});
