import BookmarkTemplate from "@/components/icons/bookmarkTemplate/BookmarkTemplate";
import HamburgerIcon from "@/components/icons/HamburgerIcon";
import NotificationIcon from "@/components/icons/NotificationIcon";
import ScrapIcon from "@/components/icons/ScrapIcon";
import SideMenu from "@/components/SideMenu";
import TravelCard from "@/components/TravelCard";
import { getUserInfo } from "@/types/globalState";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
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

  // 사용자 정보 업데이트를 위한 주기적 체크
  useEffect(() => {
    console.log("홈화면 진입 시 userInfo:", userInfo);

    const interval = setInterval(() => {
      const currentUserInfo = getUserInfo();
      console.log("주기적 체크 - currentUserInfo:", currentUserInfo);
      if (currentUserInfo !== userInfo) {
        console.log("사용자 정보 변경 감지:", currentUserInfo);
        setLocalUserInfo(currentUserInfo);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userInfo]);

  // 북마크 데이터 (API 형식)
  const bookmarkData = {
    listSize: 1,
    totalPage: 1,
    totalElements: 1,
    isFirst: true,
    isLast: true,
    readingSpotList: [
      {
        userId: 1,
        userNickname: "이소정",
        userProfilImage: null,
        readingSpotId: 12,
        region: "강릉",
        address: "강원 강릉시 경포로 365",
        latitude: 37.8882,
        longitude: 127.7297,
        createdAt: "2025-08-16",
        templateId: 4,
        title: "경포호 근처 북카페",
        content: "호수를 바라보며 여유롭게 책 읽기 좋은 카페입니다.",
        readingSpotImages: [
          "https://shopping-phinf.pstatic.net/main_5441999/54419996237.20250429093306.jpg",
        ],
        bookTitle: "노르웨이의 숲",
        bookAuthor: "무라카미 하루키",
        bookImage:
          "https://shopping-phinf.pstatic.net/main_5441999/54419996237.20250429093306.jpg",
        bookPubDate: "2025-08-16",
        likes: 0,
        scraps: 0,
        opened: true,
        scraped: false,
        liked: false,
      },
      {
        userId: 1,
        userNickname: "이소정",
        userProfilImage: null,
        readingSpotId: 13,
        region: "춘천",
        address: "강원 춘천시 남산면 남이섬길 1",
        latitude: 37.7904,
        longitude: 127.5252,
        createdAt: "2025-08-16",
        templateId: 4,
        title: "남이섬 근처 북카페",
        content: "자연 속에서 책 읽기 좋은 카페입니다.",
        readingSpotImages: [
          "https://shopping-phinf.pstatic.net/main_5441999/54419996237.20250429093306.jpg",
        ],
        bookTitle: "물고기는 존재하지 않는다",
        bookAuthor: "김영하",
        bookImage:
          "https://shopping-phinf.pstatic.net/main_5441999/54419996237.20250429093306.jpg",
        bookPubDate: "2025-08-16",
        likes: 0,
        scraps: 0,
        opened: true,
        scraped: false,
        liked: false,
      },
    ],
  };

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

  const userTravels = [
    {
      id: 1,
      image: require("@/assets/images/마루 목업.png"),
      title: "독파민을 쫓아서",
      dates: "2025.06.16 - 06.20",
      duration: "4박 5일",
      tags: ["강릉", "양양", "속초"],
    },
    {
      id: 2,
      image: require("@/assets/images/서점.png"),
      title: "야 책펴",
      dates: "2025.04.2",
      duration: "2박 3일",
      tags: ["영월"],
    },
    {
      id: 3,
      image: require("@/assets/images/독립서점.png"),
      title: "독파민",
      dates: "2025.05.10 - 05.12",
      duration: "2박 3일",
      tags: ["강릉"],
    },
  ];

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
              <Text style={styles.userNameText}>{userInfo?.nickName}님의</Text>
              {"\n"}다음 강원 북트립은?
            </Text>
            <View style={styles.planButton}>
              <Text style={styles.planButtonText}>D-23</Text>
            </View>
          </View>
        </View>

        {/* 서행 200% 즐기기 섹션 - 하얀 배경, 상단 둥근 모서리 */}
        <View style={styles.middleSection}>
          <Text style={styles.sectionTitle}>서행 200% 즐기기</Text>

          {/* 기능 카테고리 */}
          <View style={styles.categoriesContainer}>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>📚</Text>
              </View>
              <Text style={styles.categoryText}>북챌린지</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>☕</Text>
              </View>
              <Text style={styles.categoryText}>책팟</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>🎯</Text>
              </View>
              <Text style={styles.categoryText}>독파민 클럽</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>⭐</Text>
              </View>
              <Text style={styles.categoryText}>오늘 추천책</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>🔥</Text>
              </View>
              <Text style={styles.categoryText}>핫북플</Text>
            </TouchableOpacity>
          </View>

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

        {/* 다른 유저의 서행 섹션 - 하얀 배경 */}
        <View style={styles.bottomSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>다른 유저의 서행</Text>
            <TouchableOpacity>
              <Text style={styles.moreButton}>더보기 &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* 여행 카드 스크롤 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cardsScrollView}
            contentContainerStyle={styles.cardsContainer}
          >
            {userTravels.map((item) => (
              <TravelCard key={item.id} {...item} />
            ))}
          </ScrollView>
        </View>

        {/* 오늘의 추천 섹션 - 하얀 배경 */}
        <View style={styles.recommendationSection}>
          <Text style={styles.recommendationTitle}>
            오늘의 &apos;추천, 강원도!&apos;
          </Text>

          {/* 추천 카드 */}
          <View style={styles.recommendationCard}>
            {/* 춘천시 추천 */}
            <View style={styles.featuredRecommendation}>
              <View style={styles.featuredImageContainer}>
                <View style={styles.featuredImagePlaceholder} />
              </View>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredTitle}>춘천시</Text>
                <Text style={styles.featuredDescription}>
                  춘천시는 강원도 어쩌구 닭갈비가 맛있고...
                </Text>
              </View>
            </View>

            {/* 강릉 서점 추천 리스트 */}
            <View style={styles.recommendationList}>
              {[1, 2, 3].map((item, index) => (
                <TouchableOpacity key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationImageContainer}>
                    <View style={styles.recommendationImagePlaceholder} />
                  </View>
                  <View style={styles.recommendationItemContent}>
                    <Text style={styles.recommendationItemTitle}>
                      강릉 서점
                    </Text>
                    <Text style={styles.recommendationItemDescription}>
                      책 읽기 좋은 공간과 맛있는 커피
                    </Text>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Text style={styles.arrowIcon}>&gt;</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
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
            <TouchableOpacity>
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
                        <Text style={styles.cardTitle}>{spot.title}</Text>
                        <View style={styles.cardBottomRow}>
                          <Text style={styles.cardAddress}>{spot.address}</Text>
                          <TouchableOpacity
                            style={styles.scrapButton}
                            onPress={() => handleScrapPress(spot.readingSpotId)}
                          >
                            <ScrapIcon
                              width={25}
                              isActive={scrapedItems.has(spot.readingSpotId)}
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
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
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
  featuredImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 40,
    backgroundColor: "#C5BFBB",
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
  recommendationImagePlaceholder: {
    width: 77,
    height: 77,
    borderRadius: 5,
    backgroundColor: "#C5BFBB",
  },
  recommendationItemContent: {
    flex: 1,
  },
  recommendationItemTitle: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 4,
  },
  recommendationItemDescription: {
    fontSize: 14,
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
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#9D9896",
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
    padding: 8,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
});
