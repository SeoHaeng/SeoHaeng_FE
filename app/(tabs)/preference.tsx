import BackIcon from "@/components/icons/BackIcon";
import TravelCard from "@/components/TravelCard";
import {
  Festival,
  getFestivalsAPI,
  getLastVisitAPI,
  getMyTravelCoursesAPI,
  getOtherUserTravelCoursesAPI,
  OtherUserTravelCourse,
  TravelCourse,
} from "@/types/api";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface FestivalCardProps {
  image: any;
  title: string;
  dates: string;
  onPress: () => void;
}

const FestivalCard: React.FC<FestivalCardProps> = ({
  image,
  title,
  dates,
  onPress,
}) => (
  <TouchableOpacity style={styles.festivalCard} onPress={onPress}>
    <View style={styles.festivalCardImageContainer}>
      <Image source={image} style={styles.festivalCardImage} />
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.3)", "transparent"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.festivalCardGradient}
      />
      <View style={styles.festivalCardOverlay}>
        <View style={styles.festivalCardContent}>
          <View style={styles.festivalCardHeader}>
            <Text style={styles.festivalCardTitle}>{title}</Text>
            <BackIcon
              color="#FFFFFF"
              width={5}
              style={{ transform: [{ rotate: "180deg" }] }}
            />
          </View>
          <Text style={styles.festivalCardDates}>{dates}</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

export default function Preference() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [isLoadingFestivals, setIsLoadingFestivals] = useState(false);
  const [travelRecommendations, setTravelRecommendations] = useState<
    TravelCourse[]
  >([]);
  const [isLoadingTravelCourses, setIsLoadingTravelCourses] = useState(false);
  const [otherUserTravels, setOtherUserTravels] = useState<
    OtherUserTravelCourse[]
  >([]);
  const [isLoadingOtherUserTravels, setIsLoadingOtherUserTravels] =
    useState(false);
  const [lastVisitDaysAgo, setLastVisitDaysAgo] = useState<number | null>(null);

  // 강원도 축제 조회
  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        setIsLoadingFestivals(true);
        const response = await getFestivalsAPI();
        if (response.isSuccess) {
          setFestivals(response.result);
        }
      } catch (error) {
        console.error("강원도 축제 조회 실패:", error);
      } finally {
        setIsLoadingFestivals(false);
      }
    };

    fetchFestivals();
  }, []);

  // 나의 여행 일정 조회
  useEffect(() => {
    const fetchTravelCourses = async () => {
      try {
        setIsLoadingTravelCourses(true);
        const response = await getMyTravelCoursesAPI();
        if (response.isSuccess) {
          setTravelRecommendations(response.result);
        }
      } catch (error) {
        console.error("나의 여행 일정 조회 실패:", error);
      } finally {
        setIsLoadingTravelCourses(false);
      }
    };

    fetchTravelCourses();
  }, []);

  // 다른 유저의 서행 조회
  useEffect(() => {
    const fetchOtherUserTravelCourses = async () => {
      try {
        setIsLoadingOtherUserTravels(true);
        const response = await getOtherUserTravelCoursesAPI(1, 10);
        if (response.isSuccess) {
          setOtherUserTravels(response.result);
        }
      } catch (error) {
        console.error("다른 유저 서행 조회 실패:", error);
      } finally {
        setIsLoadingOtherUserTravels(false);
      }
    };

    fetchOtherUserTravelCourses();
  }, []);

  // 마지막 강원도 방문 날짜 조회
  useEffect(() => {
    const fetchLastVisit = async () => {
      try {
        const response = await getLastVisitAPI();
        if (response.isSuccess) {
          setLastVisitDaysAgo(response.result.daysAgo);
        }
      } catch (error) {
        console.error("마지막 방문 날짜 조회 실패:", error);
      }
    };

    fetchLastVisit();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>취향 길목</Text>
        </View>

        {/* 나의 여행 섹션 */}
        <View style={styles.firstSection}>
          <View style={styles.firstSectionHeader}>
            <View style={styles.sectionTitleContainer}>
              {/* 첫 번째 row: 제목과 일정짜기 버튼 */}
              <View style={styles.firstRow}>
                <Text style={styles.sectionTitle}>
                  이번엔{"\n"}어디로 갈까요?
                </Text>
                <TouchableOpacity
                  style={styles.planButton}
                  onPress={() =>
                    router.push({
                      pathname: "/plan",
                      params: { from: "preference" },
                    })
                  }
                >
                  <Feather name="calendar" size={20} color="white" />
                  <Text style={styles.planButtonText}>일정 짜기</Text>
                </TouchableOpacity>
              </View>
              {/* 두 번째 row: 부제목과 전체보기 */}
              {lastVisitDaysAgo !== null && (
                <View style={styles.secondRow}>
                  <Text style={styles.sectionSubtitle}>
                    마지막 강원도 여행이{" "}
                    <Text style={styles.highlightText}>
                      {lastVisitDaysAgo}일
                    </Text>{" "}
                    전이에요.
                  </Text>
                  <TouchableOpacity>
                    <Text style={styles.viewAllText}>전체 보기 {">"}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScrollView}
            contentContainerStyle={styles.cardsContainer}
          >
            {travelRecommendations &&
              Array.isArray(travelRecommendations) &&
              travelRecommendations.map((item) => {
                const startDate = new Date(item.startDate);
                const endDate = new Date(item.endDate);
                const formattedStartDate = startDate.toLocaleDateString(
                  "ko-KR",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  },
                );
                const formattedEndDate = `${String(endDate.getMonth() + 1).padStart(2, "0")}.${String(endDate.getDate()).padStart(2, "0")}`;

                return (
                  <TravelCard
                    key={item.travelCourseId}
                    image={
                      item.imageUrl
                        ? { uri: item.imageUrl }
                        : require("@/assets/images/마루 목업.png")
                    }
                    title={item.title}
                    dates={`${formattedStartDate} - ${formattedEndDate}`}
                    duration={item.duration || ""}
                    tags={item.travelRegions || []}
                    onPress={() => {
                      router.push({
                        pathname: "/travel/[id]",
                        params: { id: item.travelCourseId.toString() },
                      });
                    }}
                  />
                );
              })}
          </ScrollView>
        </View>

        {/* 다른 유저의 서행 섹션 */}
        <View style={styles.firstSection}>
          <View style={styles.firstSectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.firstRow}>
                <Text style={styles.headerTitle}>다른 유저의 서행</Text>
              </View>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScrollView}
            contentContainerStyle={styles.cardsContainer}
          >
            {otherUserTravels &&
              Array.isArray(otherUserTravels) &&
              otherUserTravels.map((item) => {
                const startDate = new Date(item.startDate);
                const endDate = new Date(item.endDate);
                const formattedStartDate = startDate.toLocaleDateString(
                  "ko-KR",
                  {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  },
                );
                const formattedEndDate = `${String(endDate.getMonth() + 1).padStart(2, "0")}.${String(endDate.getDate()).padStart(2, "0")}`;

                return (
                  <TravelCard
                    key={item.travelCourseId}
                    image={
                      item.imageUrl
                        ? { uri: item.imageUrl }
                        : require("@/assets/images/마루 목업.png")
                    }
                    title={item.title}
                    dates={`${formattedStartDate} - ${formattedEndDate}`}
                    duration={item.duration || ""}
                    tags={item.travelRegions || []}
                    onPress={() => {
                      router.push({
                        pathname: "/travel/[id]",
                        params: { id: item.travelCourseId.toString() },
                      });
                    }}
                  />
                );
              })}
          </ScrollView>
        </View>

        {/* 축제 섹션 */}
        <View style={styles.secondSection}>
          <View style={styles.secondSectionHeader}>
            <Text style={styles.headerTitle}>강원도의 축제</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScrollView}
            contentContainerStyle={styles.cardsContainer}
          >
            {festivals &&
              Array.isArray(festivals) &&
              festivals.map((item) => (
                <FestivalCard
                  key={item.placeId}
                  image={{ uri: item.imageUrl }}
                  title={item.festivalName}
                  dates={`${item.startDate.slice(5, 7)}.${item.startDate.slice(8, 10)}-${item.endDate.slice(5, 7)}.${item.endDate.slice(8, 10)}`}
                  onPress={() => {
                    // 축제 상세 페이지로 이동
                    router.push({
                      pathname: `/bookstore/[id]`,
                      params: {
                        id: item.placeId.toString(),
                        from: "preference",
                      },
                    });
                  }}
                />
              ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "SUIT-700",
    color: "#000000",
    fontWeight: "bold",
  },
  firstSection: {
    marginBottom: 30,
    borderBottomWidth: 7,
    borderBottomColor: "#EEE9E6",
    paddingBottom: 30,
  },
  secondSection: {
    marginBottom: 30,
  },
  firstSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  secondSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  firstRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 15,
  },
  secondRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "SUIT-700",
    color: "#262423",
    lineHeight: 33,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  highlightText: {
    color: "#08A758",
    fontFamily: "SUIT-700",
  },
  planButton: {
    backgroundColor: "#302E2D",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  planButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "SUIT-600",
  },
  viewAllText: {
    fontSize: 13,
    color: "#716C69",
    fontFamily: "SUIT-500",
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: "#716C69",
    lineHeight: 20,
  },
  cardsScrollView: {
    paddingLeft: 20,
  },
  cardsContainer: {
    paddingRight: 20,
  },
  festivalCard: {
    width: 128,
    height: 171,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  festivalCardImageContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 5,
    overflow: "hidden",
  },
  festivalCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  festivalCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  festivalCardOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 13,
    justifyContent: "space-between",
  },
  festivalCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  festivalCardTitle: {
    fontSize: 15,
    fontFamily: "SUIT-700",
    color: "#FFFFFF",
  },
  festivalCardDates: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#FFFFFF",
  },
  festivalCardContent: {
    gap: 5,
  },
});
