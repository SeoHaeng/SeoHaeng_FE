import StarIcon from "@/components/icons/StarIcon";
import { getReviewListAPI, getUserByIdAPI } from "@/types/api";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ReviewTabProps {
  reviewData: {
    listSize: number;
    totalPage: number;
    totalElements: number;
    isFirst: boolean;
    isLast: boolean;
    totalReviewRating: number;
    getReviewList: {
      createdAt: string;
      creatorId: number;
      rating: number;
      reviewContent: string;
      reviewImageList: string[];
      placeId: number;
      reviewId: number;
    }[];
  } | null;
  placeId?: number;
}

export default function ReviewTab({ reviewData, placeId }: ReviewTabProps) {
  const router = useRouter();
  const [userInfoMap, setUserInfoMap] = useState<{ [key: number]: any }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allReviews, setAllReviews] = useState<any[]>([]);

  // 사용자 정보 조회
  useEffect(() => {
    const fetchUserInfos = async () => {
      if (!reviewData?.getReviewList) return;

      const uniqueUserIds = [
        ...new Set(reviewData.getReviewList.map((review) => review.creatorId)),
      ];

      for (const userId of uniqueUserIds) {
        if (!userInfoMap[userId]) {
          try {
            const userResponse = await getUserByIdAPI(userId);
            if (userResponse.isSuccess) {
              setUserInfoMap((prev) => ({
                ...prev,
                [userId]: userResponse.result,
              }));
            }
          } catch (error) {
            console.error(`사용자 ${userId} 정보 조회 실패:`, error);
          }
        }
      }
    };

    fetchUserInfos();
  }, [reviewData?.getReviewList]);

  // 초기 리뷰 데이터 설정
  useEffect(() => {
    if (reviewData?.getReviewList) {
      setAllReviews(reviewData.getReviewList);
      setHasMore(!reviewData.isLast);
    }
  }, [reviewData]);

  // 무한 스크롤 처리
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore || !placeId) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const response = await getReviewListAPI(placeId, nextPage, 10);

      if (response.isSuccess && response.result.getReviewList.length > 0) {
        setAllReviews((prev) => [...prev, ...response.result.getReviewList]);
        setCurrentPage(nextPage);
        setHasMore(!response.result.isLast);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("추가 리뷰 로드 실패:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;

    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      handleLoadMore();
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            size={15}
            style={[styles.star, { opacity: star <= rating ? 1 : 0.3 }]}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
    >
      {/* 리뷰 요약 */}
      <View style={styles.reviewSummary}>
        <Text style={styles.reviewCount}>
          리뷰 {reviewData?.totalElements || 0}
        </Text>
        <View style={styles.ratingContainer}>
          <StarIcon size={15} style={styles.star} />
          <Text style={styles.ratingText}>
            {reviewData?.totalReviewRating?.toFixed(1) || "0.0"}
          </Text>
        </View>
      </View>

      {/* 후기 남기기 버튼 */}
      <TouchableOpacity
        style={styles.writeReviewButton}
        onPress={() => {
          if (placeId) {
            router.push({
              pathname: "/bookstore/writeReview",
              params: {
                placeId: placeId.toString(),
              },
            });
          }
        }}
      >
        <Text style={styles.writeReviewText}>나도 후기 남기기</Text>

        <Entypo name="chevron-small-right" size={20} color="#4D4947" />
      </TouchableOpacity>

      {/* 개별 리뷰들 */}
      {allReviews.map((review) => (
        <View key={review.reviewId} style={styles.reviewItem}>
          {/* 사용자 정보 */}
          <View style={styles.reviewHeader}>
            <View style={styles.userInfo}>
              {userInfoMap[review.creatorId]?.profileImageUrl ? (
                <Image
                  source={{
                    uri: userInfoMap[review.creatorId].profileImageUrl,
                  }}
                  style={styles.userAvatar}
                />
              ) : (
                <View style={styles.userAvatar} />
              )}
              <Text style={styles.username}>
                {userInfoMap[review.creatorId]?.nickName ||
                  `사용자 ${review.creatorId}`}
              </Text>
              <Text style={styles.reviewDate}>
                {new Date(review.createdAt)
                  .toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .replace(/\. /g, ".")
                  .replace(/\.$/, "") +
                  " " +
                  new Date(review.createdAt).toLocaleDateString("ko-KR", {
                    weekday: "short",
                  })}
              </Text>
            </View>
            <View style={styles.reviewMeta}>{renderStars(review.rating)}</View>
          </View>

          {/* 리뷰 텍스트 */}
          <Text style={styles.reviewText}>{review.reviewContent}</Text>

          {/* 리뷰 이미지들 */}
          {review.reviewImageList && review.reviewImageList.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesContainer}
            >
              {review.reviewImageList.map((imageUrl: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={[
                    styles.reviewImage,
                    review.reviewImageList.length === 1
                      ? styles.singleImage
                      : styles.multipleImage,
                  ]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}
        </View>
      ))}

      {/* 무한 스크롤 로딩 인디케이터 */}
      {isLoadingMore && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>리뷰를 불러오는 중...</Text>
        </View>
      )}

      {/* 더 이상 로드할 리뷰가 없음 */}
      {!hasMore && allReviews.length > 0 && (
        <View style={styles.noMoreContainer}>
          <Text style={styles.noMoreText}>모든 리뷰를 불러왔습니다</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewSummary: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  reviewCount: {
    fontSize: 13,
    fontFamily: "SUIT-700",
    color: "#262423",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: "SUIT-8 00",
    color: "#000000",
  },
  star: {
    width: 16,
    height: 16,
  },
  writeReviewButton: {
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
  },
  writeReviewText: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#4D4947",
  },
  reviewItem: {
    marginBottom: 10,
    paddingBottom: 20,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userAvatar: {
    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: "#9D9896",
  },
  username: {
    fontSize: 14,
    fontFamily: "SUIT-700",
    color: "#716C69",
  },
  reviewMeta: {
    alignItems: "flex-end",
    gap: 5,
  },
  reviewDate: {
    fontSize: 11,
    fontFamily: "SUIT-500",
    color: "#C5BFBB",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#000000",
    lineHeight: 20,
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 4,
  },
  reviewImage: {
    borderRadius: 8,
    marginRight: 8,
  },
  singleImage: {
    width: 200,
    height: 150,
  },
  multipleImage: {
    width: 150,
    height: 150,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  noMoreContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  noMoreText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
});
