// app/bookstore/[id].tsx
import StatusBadge from "@/components/bookStore/statusBadge";
import BookstoreBadge from "@/components/BookstoreBadge";
import BackIcon from "@/components/icons/BackIcon";
import FilledHeartIcon from "@/components/icons/FilledHeartIcon";
import PlaceIcon from "@/components/icons/PlaceIcon";
import StarIcon from "@/components/icons/StarIcon";
import {
  getPlaceDetailAPI,
  getReviewListAPI,
  PlaceDetailResponse,
  ReviewListResponse,
  togglePlaceBookmarkAPI,
} from "@/types/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventTab from "./event";
import PhotoTab from "./photo";
import ReviewTab from "./review";
import BookstoreDetail from "./types/BookstoreDetail";
import FestivalDetail from "./types/FestivalDetail";
import RestaurantDetail from "./types/RestaurantDetail";
import TouristSpotDetail from "./types/TouristSpotDetail";

export default function PlaceDetail() {
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("상세 정보");
  const [isLiked, setIsLiked] = useState(false);
  const [fromScreen, setFromScreen] = useState<string>("");
  const [placeDetail, setPlaceDetail] = useState<
    PlaceDetailResponse["result"] | null
  >(null);
  const [reviewData, setReviewData] = useState<
    ReviewListResponse["result"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 장소 상세 정보 조회
  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        setIsLoading(true);
        const placeId = params.placeId || params.id;
        if (placeId) {
          const response = await getPlaceDetailAPI(Number(placeId));
          if (response.isSuccess) {
            setPlaceDetail(response.result);
            setIsLiked(response.result.isBookmarked);
            console.log("장소 상세 정보 조회 성공:", response.result);
          } else {
            console.error("장소 상세 정보 조회 실패:", response.message);
          }
        }
      } catch (error) {
        console.error("장소 상세 정보 조회 에러:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaceDetail();
  }, [params.placeId, params.id]);

  // 리뷰 데이터 조회
  useEffect(() => {
    const fetchReviewData = async () => {
      try {
        const placeId = params.placeId || params.id;
        if (placeId) {
          const response = await getReviewListAPI(Number(placeId), 1, 10);
          if (response.isSuccess) {
            setReviewData(response.result);
            console.log("리뷰 데이터 조회 성공:", response.result);
          } else {
            console.error("리뷰 데이터 조회 실패:", response.message);
          }
        }
      } catch (error) {
        console.error("리뷰 데이터 조회 에러:", error);
      }
    };

    fetchReviewData();
  }, [params.placeId, params.id]);

  // 파라미터에서 출발 화면 정보 가져오기
  useEffect(() => {
    if (params.from) {
      setFromScreen(params.from as string);
      console.log("🏪 서점 상세 화면 진입 - 출발 화면:", params.from);
    }
  }, [params.from]);

  // 찜하기 토글
  const handleToggleLike = async () => {
    if (!placeDetail) return;

    try {
      const response = await togglePlaceBookmarkAPI(placeDetail.placeId);
      if (response.isSuccess) {
        setIsLiked(response.result?.isBookmarked || false);
        // placeDetail 상태도 업데이트
        setPlaceDetail((prev) =>
          prev
            ? {
                ...prev,
                isBookmarked: response.result?.isBookmarked || false,
              }
            : null,
        );
        console.log("찜하기 토글 성공:", response.result?.isBookmarked);
      } else {
        console.error("찜하기 토글 실패:", response.message);
      }
    } catch (error) {
      console.error("찜하기 토글 에러:", error);
      Alert.alert("오류", "찜하기 처리 중 오류가 발생했습니다.");
    }
  };

  // 공유 기능
  const handleShare = async () => {
    if (!placeDetail) return;

    try {
      const shareUrl = `https://seohaeng.app/${placeDetail.placeType.toLowerCase()}/${placeDetail.placeId}`;
      const shareMessage = `[서행] ${placeDetail.name}\n${placeDetail.address}\n\n${shareUrl}`;

      await Share.share({
        message: shareMessage,
        title: placeDetail.name,
      });
    } catch (error) {
      Alert.alert("공유 실패", "공유할 수 없습니다.");
    }
  };

  // 타입별 상세 정보 렌더링
  const renderTypeDetail = () => {
    if (!placeDetail) return null;

    switch (placeDetail.placeType) {
      case "BOOKSTORE":
        return <BookstoreDetail placeDetail={placeDetail} />;
      case "TOURIST_SPOT":
        return <TouristSpotDetail placeDetail={placeDetail} />;
      case "RESTAURANT":
        return <RestaurantDetail placeDetail={placeDetail} />;
      case "FESTIVAL":
        return <FestivalDetail placeDetail={placeDetail} />;
      default:
        return null;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "상세 정보":
        return renderTypeDetail();
      case "후기":
        return (
          <ReviewTab reviewData={reviewData} placeId={placeDetail?.placeId} />
        );
      case "사진":
        return <PhotoTab placeImageUrls={placeDetail?.placeImageUrls} />;
      case "이벤트":
        return <EventTab />;
      default:
        return renderTypeDetail();
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.wrapper}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (fromScreen === "milestone") {
                // 이정표에서 온 경우
                router.push("/(tabs)/milestone");
              } else if (fromScreen === "challenge") {
                // 챌린지에서 온 경우
                router.push("/(tabs)/maru/challenge");
              } else if (fromScreen === "likedPlaces") {
                // 좋아요한 장소에서 온 경우
                router.push("/(tabs)/memory/likedPlaces");
              } else {
                // 기본 뒤로가기
                router.back();
              }
            }}
            style={styles.backButton}
          >
            <BackIcon />
          </TouchableOpacity>
        </View>

        {/* 메인 이미지 */}
        <View style={styles.imageContainer}>
          {placeDetail?.placeImageUrls &&
          placeDetail.placeImageUrls.length > 0 ? (
            <Image
              source={{ uri: placeDetail.placeImageUrls[0] }}
              style={styles.mainImage}
            />
          ) : (
            <Image
              source={require("@/assets/images/서점.png")}
              style={styles.mainImage}
            />
          )}
          {placeDetail?.placeImageUrls &&
            placeDetail.placeImageUrls.length > 1 && (
              <View style={styles.imageOverlay}>
                <Text style={styles.imageCounter}>
                  1/{placeDetail.placeImageUrls.length}
                </Text>
              </View>
            )}
        </View>

        {/* 서점 정보 */}
        <View style={styles.storeInfo}>
          <View style={styles.storeHeader}>
            <View style={styles.storeTitleContainer}>
              <Text style={styles.storeName}>{placeDetail?.name}</Text>
              <BookstoreBadge placeType={placeDetail?.placeType} />
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleToggleLike}
              >
                <FilledHeartIcon isActive={isLiked} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleShare}
              >
                <Image source={require("@/assets/images/Share.png")} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.storeStats}>
            <Text style={styles.reviewText}>
              리뷰{" "}
              <Text style={styles.reviewCount}>
                {placeDetail?.reviewCount || 0}
              </Text>
            </Text>
            <View style={styles.ratingContainer}>
              <StarIcon width={14} height={14} />
              <Text style={styles.ratingText}>
                {placeDetail?.rating ? placeDetail.rating.toFixed(1) : "0.0"}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <PlaceIcon width={11} height={15} />
            <Text style={styles.storeLocation}>{placeDetail?.address}</Text>
          </View>
          {placeDetail?.tel && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 3 }}
            >
              <StatusBadge isOpen={true} />
              <Text style={styles.storeStatus}>{placeDetail.tel}</Text>
            </View>
          )}
        </View>

        {/* 탭 네비게이션 */}
        <View style={styles.tabContainer}>
          {(() => {
            const tabs = ["상세 정보", "사진", "후기"];

            // BOOKSTORE 타입이고 bookChallengeStatus가 true인 경우에만 이벤트 탭 추가
            if (
              placeDetail?.placeType === "BOOKSTORE" &&
              (placeDetail.placeDetail as any)?.bookChallengeStatus === true
            ) {
              tabs.push("이벤트");
            }

            return tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ));
          })()}
        </View>

        {/* 탭 컨텐츠 */}
        <View style={styles.content}>{renderTabContent()}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  backButton: {
    width: 44,
    height: 44,
    padding: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "SUIT-700",
    color: "#000000",
    flex: 1,
    textAlign: "center",
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(217, 217, 217, 0.33)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  imageCounter: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "SUIT-500",
  },
  storeInfo: {
    flexDirection: "column",
    gap: 10,
    padding: 20,
  },
  storeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  storeTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  storeName: {
    fontSize: 20,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#DBD6D3",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 15,
  },
  actionButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  storeStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: "SUIT-800",
    color: "#000000",
  },
  reviewText: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#000000",
  },
  reviewCount: {
    color: "#9D9896",
  },
  storeLocation: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
  storeStatus: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#262423 ",
  },
  tabText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  activeTabText: {
    color: "#262423",
    fontFamily: "SUIT-700",
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
