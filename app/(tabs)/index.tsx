import BookmarkTemplate from "@/components/icons/bookmarkTemplate/BookmarkTemplate";
import HamburgerIcon from "@/components/icons/HamburgerIcon";
import NotificationIcon from "@/components/icons/NotificationIcon";
import ScrapIcon from "@/components/icons/ScrapIcon";
import SideMenu from "@/components/SideMenu";
import TravelCard from "@/components/TravelCard";
import {
  getLastVisitAPI,
  getMyTravelCoursesAPI,
  getReadingSpotsAPI,
  getTodayRecommendationsAPI,
  ReadingSpot,
  TodayRecommendation,
  TravelCourse,
} from "@/types/api";
import { getUserInfo } from "@/types/globalState";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandlerGestureEvent,
  State,
} from "react-native-gesture-handler";

export default function Index() {
  const router = useRouter();
  const [sideMenuVisible, setSideMenuVisible] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [scrapedItems, setScrapedItems] = useState<Set<number>>(new Set());
  const [userInfo, setLocalUserInfo] = useState(getUserInfo());
  const [myTravelCourses, setMyTravelCourses] = useState<TravelCourse[]>([]);
  const [isLoadingTravelCourses, setIsLoadingTravelCourses] = useState(false);
  const [todayRecommendations, setTodayRecommendations] = useState<
    TodayRecommendation[]
  >([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [lastVisitDays, setLastVisitDays] = useState<number | null>(null);
  const [isLoadingLastVisit, setIsLoadingLastVisit] = useState(false);

  // 사용자 정보 업데이트를 위한 주기적 체크
  useEffect(() => {
    console.log("홈화면 진입 시 userInfo:", userInfo);
    console.log("getUserInfo() 직접 호출 결과:", getUserInfo());

    const interval = setInterval(() => {
      const currentUserInfo = getUserInfo();
      console.log("주기적 체크 - currentUserInfo:", currentUserInfo);
      if (currentUserInfo !== userInfo) {
        console.log("사용자 정보 변경 감지:", currentUserInfo);
        setLocalUserInfo(currentUserInfo);
      }
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [userInfo]);

  // 나의 여행 일정 조회
  useEffect(() => {
    const fetchMyTravelCourses = async () => {
      try {
        setIsLoadingTravelCourses(true);
        const response = await getMyTravelCoursesAPI();
        if (response.isSuccess) {
          setMyTravelCourses(response.result);
        }
      } catch (error) {
        console.error("나의 여행 일정 조회 실패:", error);
      } finally {
        setIsLoadingTravelCourses(false);
      }
    };

    fetchMyTravelCourses();
  }, []);

  // 오늘의 추천 강원도 조회
  useEffect(() => {
    const fetchTodayRecommendations = async () => {
      try {
        setIsLoadingRecommendations(true);
        const response = await getTodayRecommendationsAPI();
        if (response.isSuccess) {
          setTodayRecommendations(response.result);
        }
      } catch (error) {
        console.error("오늘의 추천 강원도 조회 실패:", error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchTodayRecommendations();
  }, []);

  // 마지막 강원도 방문 날짜 조회
  useEffect(() => {
    const fetchLastVisit = async () => {
      try {
        setIsLoadingLastVisit(true);
        const response = await getLastVisitAPI();
        if (response.isSuccess) {
          setLastVisitDays(response.result.daysAgo);
        }
      } catch (error) {
        console.error("마지막 방문 날짜 조회 실패:", error);
      } finally {
        setIsLoadingLastVisit(false);
      }
    };

    fetchLastVisit();
  }, []);

  // 최신 공간 책갈피 조회 (5개, 최신순)
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setIsLoadingBookmarks(true);
        const response = await getReadingSpotsAPI(1, 5, "latest");
        if (response.isSuccess) {
          setBookmarkData(response.result);

          // API 응답에서 scraped 상태를 scrapedItems에 반영
          const scrapedIds = new Set<number>();
          response.result.readingSpotList.forEach((spot) => {
            if (spot.scraped) {
              scrapedIds.add(spot.readingSpotId);
            }
          });
          setScrapedItems(scrapedIds);
        }
      } catch (error) {
        console.error("책갈피 조회 실패:", error);
      } finally {
        setIsLoadingBookmarks(false);
      }
    };

    fetchBookmarks();
  }, []);

  // 책갈피 데이터 상태
  const [bookmarkData, setBookmarkData] = useState<{
    listSize: number;
    totalPage: number;
    totalElements: number;
    isFirst: boolean;
    isLast: boolean;
    readingSpotList: ReadingSpot[];
  }>({
    listSize: 0,
    totalPage: 0,
    totalElements: 0,
    isFirst: true,
    isLast: true,
    readingSpotList: [],
  });
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(false);

  const openSideMenu = () => setSideMenuVisible(true);
  const closeSideMenu = () => setSideMenuVisible(false);

  // 스크랩 처리 함수
  const handleScrapPress = (readingSpotId: number) => {
    console.log("스크랩 버튼 클릭:", readingSpotId);
    setScrapedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(readingSpotId)) {
        newSet.delete(readingSpotId);
      } else {
        newSet.add(readingSpotId);
      }
      return newSet;
    });
    // TODO: 스크랩 API 호출 로직 구현
  };

  // 카드 애니메이션 값들
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  // 공간 책갈피 카드 데이터
  const spaceCards = [
    {
      id: 1,
      title: "강릉 독립서점",
      description: "책과 커피가 있는 아늑한 공간",
      image: require("@/assets/images/독립서점.png"),
    },
    {
      id: 2,
      title: "춘천 책방",
      description: "지역 작가들의 작품을 만날 수 있는 곳",
      image: require("@/assets/images/서점.png"),
    },
    {
      id: 3,
      title: "양양 북카페",
      description: "바다를 보며 책을 읽는 특별한 경험",
      image: require("@/assets/images/마루 목업.png"),
    },
    {
      id: 4,
      title: "속초 문고",
      description: "고전부터 신간까지 다양한 도서",
      image: require("@/assets/images/북챌린지 사진.png"),
    },
  ];

  // 스와이프 제스처 핸들러
  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
    { useNativeDriver: false },
  );

  const onHandlerStateChange = (event: PanGestureHandlerGestureEvent) => {
    if (event.nativeEvent.state === State.END) {
      const { translationX, translationY } = event.nativeEvent;

      // 스와이프 방향에 따른 처리 (더 민감하게)
      if (translationX > 50) {
        // 오른쪽으로 스와이프 - 저장
        handleSave();
      } else if (translationX < -50) {
        // 왼쪽으로 스와이프 - 넘김
        handleSkip();
      } else {
        // 원래 위치로 복귀
        resetCardPosition();
      }
    }
  };

  const handleSave = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 400,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(rotate, {
        toValue: 15,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => {
      nextCard();
    });
  };

  const handleSkip = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -400,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(translateY, {
        toValue: -50,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(rotate, {
        toValue: -15,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => {
      nextCard();
    });
  };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % spaceCards.length);
    resetCardPosition();
  };

  const resetCardPosition = () => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(rotate, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // 여행 일정 데이터를 API 응답에 맞게 변환하는 함수
  const formatTravelData = (course: TravelCourse) => {
    const startDate = new Date(course.startDate);
    const endDate = new Date(course.endDate);
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

    return {
      id: course.id,
      image: course.imageUrl
        ? { uri: course.imageUrl }
        : require("@/assets/images/마루 목업.png"),
      title: course.title,
      dates: `${formattedStartDate} - ${formattedEndDate}`,
      duration: `${course.duration}박 ${course.duration + 1}일`,
      tags: course.regions,
    };
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>서행</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <NotificationIcon width={23} height={23} color="#9D9896" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={openSideMenu}>
              <HamburgerIcon width={20} height={17} color="#9D9896" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 개인화된 북트립 섹션 - 어두운 배경 */}
        <View style={styles.topSection}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              <Text style={styles.userNameText}>
                {userInfo?.nickName && userInfo.nickName.length > 18
                  ? `${userInfo.nickName.slice(0, 18)}...`
                  : userInfo?.nickName}
                님의
              </Text>
              {"\n"}다음 강원 북트립은?
            </Text>
            {lastVisitDays !== null && (
              <View style={styles.planButton}>
                <Text style={styles.planButtonText}>D+{lastVisitDays}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.middleSection}>
          <TouchableOpacity
            onPress={() => {
              // 스탬프 투어 링크로 이동
              Linking.openURL(
                "https://playar.syrup.co.kr/stamp/main.html?eventId=S000047",
              );
            }}
          >
            <Image
              source={require("@/assets/images/stamp_tour.png")}
              style={{
                width: "100%",
                resizeMode: "contain",
                alignSelf: "center",
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>나의 서행</Text>
            <TouchableOpacity>
              <Text style={styles.moreButton}>더보기 &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* 여행 일정이 있는 경우 */}
          {myTravelCourses.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.cardsScrollView}
              contentContainerStyle={styles.cardsContainer}
            >
              {myTravelCourses.map((course) => (
                <TravelCard key={course.id} {...formatTravelData(course)} />
              ))}
            </ScrollView>
          ) : (
            /* 여행 일정이 없는 경우 빈 상태 화면 */
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateTitle}>
                아직 생성된 일정이 없어요.
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                나의 독서 여행 일정을 생성해보세요.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/plan",
                    params: { from: "home" },
                  })
                }
              >
                <Text style={styles.createScheduleButtonText}>
                  여행 일정 생성하기 &gt;
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 오늘의 추천 섹션 - 하얀 배경 */}
        <View style={styles.recommendationSection}>
          <Text style={styles.recommendationTitle}>
            오늘의 &apos;추천, 강원도!&apos;
          </Text>

          {/* 추천 카드 */}
          <View style={styles.recommendationCard}>
            {/* 나머지 추천 장소 리스트 */}
            <View style={styles.recommendationList}>
              {todayRecommendations.map((item, index) => (
                <TouchableOpacity
                  key={item.placeId}
                  style={styles.recommendationItem}
                >
                  <View style={styles.recommendationImageContainer}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.recommendationImage}
                      resizeMode="cover"
                    />
                  </View>
                  <View style={styles.recommendationItemContent}>
                    <Text style={styles.recommendationItemTitle}>
                      {item.name}
                    </Text>
                    <Text
                      style={styles.recommendationItemDescription}
                      numberOfLines={2}
                    >
                      {item.overview}
                    </Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrowIcon}>&gt;</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* 로딩 중이거나 데이터가 없는 경우 */}
            {isLoadingRecommendations && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#302E2D" />
                <Text style={styles.loadingText}>
                  추천 장소를 불러오는 중...
                </Text>
              </View>
            )}

            {!isLoadingRecommendations && todayRecommendations.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  오늘의 추천 장소가 없습니다.
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* 최신 공간 책갈피 섹션 - 어두운 배경 */}
        <View style={styles.spaceBookmarkSection}>
          <View style={styles.spaceBookmarkHeader}>
            <View style={styles.spaceBookmarkTitleContainer}>
              <Text style={styles.spaceBookmarkTitle}>최신 공간 책갈피</Text>
              {/* <Text style={styles.spaceBookmarkSubtitle}>
                좌우로 넘겨 책갈피를 저장하세요
              </Text> */}
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push("/(tabs)/maru/bookmark");
              }}
            >
              <Text style={styles.spaceBookmarkLink}>공간책갈피 &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* 스와이프 액션 버튼과 아이콘 */}
          {/*  <View style={styles.swipeActionContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSkip}>
              <Text style={styles.actionButtonText}>넘김</Text>
            </TouchableOpacity>

            <View style={styles.swipeIndicatorContainer}>
              <FingerArrowIcon />
              <BookmarkFingerIcon />
            </View>

            <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
              <Text style={styles.actionButtonText}>저장</Text>
            </TouchableOpacity>
          </View> */}

          {/* 카드 스택 */}
          <View style={styles.cardStackContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalScrollContainer}
            >
              {bookmarkData.readingSpotList.map((spot, index) => {
                console.log("템플릿 렌더링:", {
                  templateId: spot.templateId,
                  title: spot.title,
                });
                return (
                  <TouchableOpacity
                    key={spot.readingSpotId}
                    style={styles.mainCardContainer}
                    onPress={() => {
                      // 북마크 상세 페이지로 이동
                      router.push({
                        pathname: `/bookmark/[id]`,
                        params: {
                          id: spot.readingSpotId.toString(),
                          from: "index",
                        },
                      });
                    }}
                  >
                    <BookmarkTemplate
                      width={360}
                      height={360}
                      templateId={spot.templateId}
                    />
                    <View style={styles.mainCard}>
                      <Image
                        source={{ uri: spot.readingSpotImages[0] }}
                        style={styles.cardImage}
                        resizeMode="cover"
                      />

                      {/* 카드 내용 */}
                      <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>
                          {spot.title.length > 13
                            ? `${spot.title.slice(0, 13)}...`
                            : spot.title}
                        </Text>
                        <View style={styles.cardBottomRow}>
                          <Text style={styles.cardAddress}>
                            {spot.address.length > 18
                              ? `${spot.address.slice(0, 18)}...`
                              : spot.address}
                          </Text>
                          <TouchableOpacity
                            style={styles.scrapButton}
                            onPress={() => handleScrapPress(spot.readingSpotId)}
                          >
                            <ScrapIcon
                              width={24}
                              height={24}
                              isActive={scrapedItems.has(spot.readingSpotId)}
                              color={
                                scrapedItems.has(spot.readingSpotId)
                                  ? "#262423"
                                  : "#716C69"
                              }
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* 사이드 메뉴 */}
      <SideMenu visible={sideMenuVisible} onClose={closeSideMenu} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // 전체 배경을 하얀색으로
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#302E2D", // 헤더도 어두운 배경
  },
  appTitle: {
    fontSize: 22,
    fontFamily: "Gangwon",
    color: "#4D4947", // 헤더 텍스트를 연한 회색으로
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
    color: "#C5BFBB", // 아이콘 색상도 연한 회색으로
  },
  topSection: {
    backgroundColor: "#302E2D", // 상단 섹션 어두운 배경
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 120, // 하단 여백 추가
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  greetingText: {
    fontSize: 22,
    fontFamily: "SUIT-700",
    color: "#F8F4F2",
    lineHeight: 35,
    marginRight: 15,
  },
  userNameText: {
    fontFamily: "SUIT-400",
    fontSize: 22,
  },
  planButton: {
    backgroundColor: "#4D4947",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#716C69",
  },
  planButtonText: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#EEE9E6",
  },
  middleSection: {
    backgroundColor: "#FFFFFF", // 중간 섹션 하얀 배경
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderTopLeftRadius: 20, // 상단 둥근 모서리
    borderTopRightRadius: 20, // 상단 둥근 모서리
    marginTop: -20, // 어두운 배경과 겹치도록
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#262423",
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
    marginTop: 20,
  },
  categoryItem: {
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EEE9E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#716C69",
    textAlign: "center",
  },
  stampTourBanner: {
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
    padding: 20,
  },
  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#262423",
    flex: 1,
  },
  bannerGraphic: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bannerGraphicText: {
    fontSize: 12,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
  bottomSection: {
    backgroundColor: "#FFFFFF", // 하단 섹션 하얀 배경
    paddingVertical: 25,
    marginTop: 0, // 상단 여백 제거
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  moreButton: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#716C69",
    textDecorationLine: "underline",
  },
  userContentScroll: {
    flexDirection: "row",
  },
  userContentItem: {
    marginRight: 15,
    position: "relative",
  },
  userContentImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  userContentOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIconText: {
    fontSize: 16,
  },
  blueObject: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  blueObjectText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  cardsScrollView: {
    paddingLeft: 20,
  },
  cardsContainer: {
    paddingRight: 20,
  },
  recommendationSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 25,
    paddingBottom: 40,
  },
  recommendationTitle: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 20,
  },
  recommendationCard: {
    backgroundColor: "#F8F4F2",
    borderRadius: 12,
    padding: 20,
  },
  featuredRecommendation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  featuredImageContainer: {
    marginRight: 10,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 2,
  },
  featuredDescription: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
    lineHeight: 20,
  },
  recommendationList: {
    gap: 15,
  },
  recommendationItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  recommendationImageContainer: {
    marginRight: 15,
  },
  recommendationImage: {
    width: 77,
    height: 77,
    borderRadius: 5,
  },
  featuredImage: {
    width: 64,
    height: 64,
    borderRadius: 40,
  },
  recommendationItemContent: {
    flex: 1,
  },
  recommendationItemTitle: {
    fontSize: 16,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 4,
  },
  recommendationItemDescription: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#716C69",
    lineHeight: 18,
  },
  arrowContainer: {
    paddingLeft: 10,
  },
  arrowIcon: {
    fontSize: 16,
    color: "#9D9896",
    fontFamily: "SUIT-600",
  },
  spaceBookmarkSection: {
    backgroundColor: "#302E2D",
    paddingVertical: 30,
    paddingBottom: 40,
  },
  spaceBookmarkHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 0,
    paddingHorizontal: 20,
  },
  spaceBookmarkTitleContainer: {
    flex: 1,
  },
  spaceBookmarkTitle: {
    fontSize: 20,
    fontFamily: "SUIT-700",
    color: "#FFFFFF",
  },
  spaceBookmarkSubtitle: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#C5BFBB",
    lineHeight: 20,
  },
  spaceBookmarkLink: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    textDecorationLine: "underline",
  },
  swipeActionContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 30,
    alignSelf: "center",
  },
  actionButton: {
    backgroundColor: "#4D4947",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#DBD6D3",
  },
  swipeIndicatorContainer: {
    alignItems: "center",
    gap: 8,
  },
  cardStackContainer: {
    position: "relative",
    height: 400,
    marginTop: 20,
  },
  horizontalScrollContainer: {
    paddingHorizontal: 10,
    gap: 10,
  },
  mainCardContainer: {
    position: "relative",
    alignItems: "center",
  },
  mainCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 16,
  },
  cardImage: {
    width: "90%",
    height: 245,
    borderRadius: 12,
    alignSelf: "center",
  },
  cardContent: {
    padding: 20,
    alignItems: "flex-start",
    width: "100%",
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: "Gangwon",
    color: "#262423",
    marginBottom: 8,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  cardAddress: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#000000",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  scrapButton: {
    borderRadius: 6,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    width: 32,
    height: 32,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#716C69",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    marginBottom: 24,
    textAlign: "center",
  },
  createScheduleButtonText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
    textDecorationLine: "underline",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    fontStyle: "italic",
  },
});
