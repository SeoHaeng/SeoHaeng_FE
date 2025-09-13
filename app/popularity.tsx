// app/popularity.tsx
import BackIcon from "@/components/icons/BackIcon";
import PopularChallengeTotal from "@/components/maruChallenge/popularChallengeTotal";
import {
  BookChallenge,
  getBookChallengeListAPI,
  getUserByIdAPI,
} from "@/types/api";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 날짜를 "X일 전" 형식으로 변환하는 함수
const formatDateToDaysAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffHours = diffTime / (1000 * 60 * 60);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "방금 전";
  if (diffHours < 24) return `${Math.floor(diffHours)}시간 전`;
  if (diffDays === 1) return "어제";
  return `${diffDays}일 전`;
};

export default function Popularity() {
  const router = useRouter();
  const [sortType, setSortType] = useState("최신순");
  const [showSortModal, setShowSortModal] = useState(false);

  // API 데이터 상태
  const [challenges, setChallenges] = useState<BookChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [userInfoMap, setUserInfoMap] = useState<
    Record<number, { nickName: string; profileImageUrl: string }>
  >({});

  // 정렬 타입을 API 파라미터로 변환
  const getSortParam = (sortType: string) => {
    switch (sortType) {
      case "최신순":
        return "latest";
      case "인기순":
        return "popular";
      default:
        return "latest";
    }
  };

  // 챌린지 데이터 가져오기
  const fetchChallenges = useCallback(
    async (page: number = 1, append: boolean = false) => {
      try {
        setIsLoading(true);
        const sortParam = getSortParam(sortType);
        const response = await getBookChallengeListAPI(page, 10, sortParam);

        if (response.isSuccess) {
          const newChallenges = response.result.getBookChallengeList;
          setTotalElements(response.result.totalElements);

          if (append) {
            setChallenges((prev) => [...prev, ...newChallenges]);
          } else {
            setChallenges(newChallenges);
          }

          setHasMore(response.result.totalPage > page);
          setCurrentPage(page);

          // 각 챌린지의 creatorId로 사용자 정보 가져오기
          const userInfoPromises = newChallenges.map(async (challenge) => {
            try {
              const userResponse = await getUserByIdAPI(challenge.creatorId);
              if (userResponse.isSuccess) {
                return {
                  creatorId: challenge.creatorId,
                  nickName: userResponse.result.nickName,
                  profileImageUrl: userResponse.result.profileImageUrl,
                };
              }
            } catch (error) {
              console.error(
                `사용자 ${challenge.creatorId} 정보 조회 실패:`,
                error,
              );
            }
            return null;
          });

          const userInfoResults = await Promise.all(userInfoPromises);
          const newUserInfoMap: Record<
            number,
            { nickName: string; profileImageUrl: string }
          > = {};

          userInfoResults.forEach((userInfo) => {
            if (userInfo) {
              newUserInfoMap[userInfo.creatorId] = {
                nickName: userInfo.nickName,
                profileImageUrl: userInfo.profileImageUrl,
              };
            }
          });

          if (append) {
            setUserInfoMap((prev) => ({ ...prev, ...newUserInfoMap }));
          } else {
            setUserInfoMap(newUserInfoMap);
          }
        }
      } catch (error) {
        console.error("챌린지 인증 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [sortType],
  );

  // 초기 데이터 로드
  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchChallenges(1, false);
  }, [sortType, fetchChallenges]);

  // 더 많은 데이터 로드
  const loadMoreChallenges = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchChallenges(currentPage + 1, true);
    }
  }, [isLoading, hasMore, currentPage, fetchChallenges]);

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/maru/challenge")}
          style={styles.backButton}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.title} allowFontScaling={false}>
          챌린지 인증
        </Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const paddingToBottom = 20;
          if (
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom
          ) {
            loadMoreChallenges();
          }
        }}
        scrollEventThrottle={400}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text
            style={{ fontSize: 14, color: "#716C69", fontFamily: "SUIT-500" }}
            allowFontScaling={false}
          >
            총 {totalElements}개
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
            onPress={() => setShowSortModal(true)}
          >
            <Text
              style={{ fontSize: 13, color: "#716C69", fontFamily: "SUIT-500" }}
              allowFontScaling={false}
            >
              {sortType}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={15}
              color="#716C69"
            />
          </TouchableOpacity>
        </View>
        {/* 초기 로딩 상태 */}
        {isLoading && challenges.length === 0 && (
          <View style={styles.initialLoadingContainer}>
            <ActivityIndicator size="large" color="#E60A34" />
            <Text style={styles.initialLoadingText} allowFontScaling={false}>
              챌린지 인증을 불러오는 중...
            </Text>
          </View>
        )}

        {/* 데이터가 있을 때만 렌더링 */}
        {!isLoading &&
          challenges.length > 0 &&
          challenges.map((challenge) => (
            <PopularChallengeTotal
              key={challenge.bookChallengeProofId}
              userName={userInfoMap[challenge.creatorId]?.nickName || "사용자"}
              profileImageUrl={
                userInfoMap[challenge.creatorId]?.profileImageUrl
              }
              date={formatDateToDaysAgo(challenge.createdAt)}
              text={challenge.proofContent}
              bookImageSource={challenge.proofImageUrls[0]}
              receivedBookImage={challenge.receivedBookImage}
              bookName={challenge.receivedBookTitle}
              bookAuthor={challenge.receivedBookAuthor}
              year={
                challenge.receivedBookPubDate?.split("-")[0] ||
                challenge.receivedBookPubDate
              }
              likedByMe={challenge.likedByMe}
              onPress={() =>
                router.push({
                  pathname: "/popularity/[id]",
                  params: { id: challenge.bookChallengeProofId },
                })
              }
            />
          ))}

        {/* 데이터가 없을 때 */}
        {!isLoading && challenges.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText} allowFontScaling={false}>
              챌린지 인증이 없습니다.
            </Text>
          </View>
        )}

        {/* 로딩 인디케이터 */}
        {isLoading && challenges.length > 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#E60A34" />
            <Text style={styles.loadingText} allowFontScaling={false}>
              더 많은 챌린지를 불러오는 중...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* 정렬 옵션 모달 */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.sortModal}>
            <TouchableOpacity
              style={[
                styles.sortOption,
                sortType === "최신순" && styles.selectedSortOption,
              ]}
              onPress={() => {
                setSortType("최신순");
                setShowSortModal(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortType === "최신순" && styles.selectedSortOptionText,
                ]}
                allowFontScaling={false}
              >
                최신순
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortOption,
                sortType === "인기순" && styles.selectedSortOption,
              ]}
              onPress={() => {
                setSortType("인기순");
                setShowSortModal(false);
              }}
            >
              <Text
                style={[
                  styles.sortOptionText,
                  sortType === "인기순" && styles.selectedSortOptionText,
                ]}
                allowFontScaling={false}
              >
                인기순
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 25,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderColor: "#C5BFBB",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 20,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    zIndex: 1,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 17,
    fontFamily: "SUIT-700",
    color: "#000000",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F4F2",
  },
  content: {
    padding: 20,
    gap: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  sortModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedSortOption: {
    backgroundColor: "#F0F0F0",
  },
  sortOptionText: {
    fontSize: 17,
    fontFamily: "SUIT-500",
    color: "#262423",
    textAlign: "center",
  },
  selectedSortOptionText: {
    color: "#FF6B35",
    fontFamily: "SUIT-600",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  initialLoadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 15,
  },
  initialLoadingText: {
    fontSize: 17,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  noMoreContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noMoreText: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    fontStyle: "italic",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  emptyText: {
    fontSize: 17,
    fontFamily: "SUIT-600",
    color: "#716C69",
  },
});
