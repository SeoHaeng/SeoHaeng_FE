import BackIcon from "@/components/icons/BackIcon";
import CalendarIcon from "@/components/icons/CalendarIcon";
import TravelCard from "@/components/TravelCard";
import {
  Festival,
  getFestivalsAPI,
  getMyTravelCoursesAPI,
  TravelCourse,
} from "@/types/api";
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
}

const FestivalCard: React.FC<FestivalCardProps> = ({ image, title, dates }) => (
  <TouchableOpacity style={styles.festivalCard}>
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
        <View style={styles.festivalCardLocationContainer}>
          <Text style={styles.festivalCardLocation}>평창</Text>
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

        {/* 여행 추천 섹션 */}
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
                  onPress={() => router.push("/plan")}
                >
                  <CalendarIcon />
                  <Text style={styles.planButtonText}>일정 짜기</Text>
                </TouchableOpacity>
              </View>
              {/* 두 번째 row: 부제목과 전체보기 */}
              <View style={styles.secondRow}>
                <Text style={styles.sectionSubtitle}>
                  마지막 강원도 여행이{" "}
                  <Text style={styles.highlightText}>37일</Text> 전이에요.
                </Text>
                <TouchableOpacity>
                  <Text style={styles.viewAllText}>전체 보기 {">"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScrollView}
            contentContainerStyle={styles.cardsContainer}
          >
            {travelRecommendations.map((item) => {
              const startDate = new Date(item.startDate);
              const endDate = new Date(item.endDate);
              const formattedStartDate = startDate.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });
              const formattedEndDate = endDate.toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });

              return (
                <TravelCard
                  key={item.id}
                  image={
                    item.imageUrl
                      ? { uri: item.imageUrl }
                      : require("@/assets/images/마루 목업.png")
                  }
                  title={item.title}
                  dates={`${formattedStartDate} - ${formattedEndDate}`}
                  duration={`${item.duration}박 ${item.duration + 1}일`}
                  tags={item.regions}
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
            {festivals.map((item) => (
              <FestivalCard
                key={item.placeId}
                image={{ uri: item.imageUrl }}
                title={item.festivalName}
                dates={`${item.startDate.slice(5, 7)}.${item.startDate.slice(8, 10)}-${item.endDate.slice(5, 7)}.${item.endDate.slice(8, 10)}`}
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
    fontSize: 20,
    fontFamily: "SUIT-700",
    color: "#000000",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 30,
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 10,
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
  viewAllContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
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
  moreText: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "SUIT-500",
    textDecorationLine: "underline",
  },
  cardsScrollView: {
    paddingLeft: 20,
  },
  cardsContainer: {
    paddingRight: 20,
  },
  travelCard: {
    width: 300,
    height: 295,
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  travelCardImage: {
    width: "100%",
    height: 171,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    resizeMode: "cover",
  },
  travelCardContent: {
    padding: 20,
  },
  travelCardTitle: {
    fontSize: 20,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 5,
  },
  travelCardDates: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  travelCardDuration: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#4D4947",
  },
  travelCardDateContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 13,
  },
  travelCardMenuIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  travelCardTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  travelCardTag: {
    backgroundColor: "#C5BFBB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  travelCardTagText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#EEE9E6",
  },
  travelCardIcon: {
    position: "absolute",
    bottom: 15,
    right: 15,
    width: 30,
    height: 30,
    backgroundColor: "#4D4947",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  travelCardIconText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "SUIT-600",
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
  festivalCardLocationContainer: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.4)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  festivalCardLocation: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#FFFFFF",
  },
  festivalCardContent: {
    gap: 5,
  },
});
