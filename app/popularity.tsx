// app/popularity.tsx
import BackIcon from "@/components/icons/BackIcon";
import PopularChallengeTotal from "@/components/maruChallenge/popularChallengeTotal";
import { BookChallenge, getBookChallengeListAPI } from "@/types/api";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        <Text style={styles.title}>챌린지 인증</Text>
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
            style={{ fontSize: 13, color: "#716C69", fontFamily: "SUIT-500" }}
          >
            총 {totalElements}개
          </Text>
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
            onPress={() => setShowSortModal(true)}
          >
            <Text
              style={{ fontSize: 13, color: "#716C69", fontFamily: "SUIT-500" }}
            >
              {sortType}
            </Text>
            <Image source={require("@/assets/images/DropdownArrow.png")} />
          </TouchableOpacity>
        </View>
        {challenges.map((challenge) => (
          <PopularChallengeTotal
            key={challenge.bookChallengeProofId}
            userName="사용자" // API에 userName이 없으므로 기본값 사용
            date={challenge.createdAt}
            text={challenge.proofContent}
            bookName={challenge.receivedBookTitle}
            bookAuthor={challenge.receivedBookAuthor}
            year={challenge.receivedBookPubDate}
            onPress={() =>
              router.push({
                pathname: "/popularity/[id]",
                params: { id: challenge.bookChallengeProofId },
              })
            }
          />
        ))}

        {/* 로딩 인디케이터 */}
        {isLoading && challenges.length > 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#302E2D" />
            <Text style={styles.loadingText}>
              더 많은 챌린지를 불러오는 중...
            </Text>
          </View>
        )}

        {/* 더 이상 데이터가 없는 경우 */}
        {!hasMore && challenges.length > 0 && (
          <View style={styles.noMoreContainer}>
            <Text style={styles.noMoreText}>모든 챌린지를 불러왔습니다</Text>
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
    fontSize: 16,
    fontFamily: "SUIT-700",
    color: "#000000",
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    fontSize: 16,
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
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  noMoreContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  noMoreText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    fontStyle: "italic",
  },
});
