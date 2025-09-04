import BookmarkCard from "@/components/BookmarkCard";
import { getMyScrapedReadingSpotsAPI, ReadingSpot } from "@/types/api";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SavedBookmark() {
  const router = useRouter();
  const [scrapList, setScrapList] = useState<ReadingSpot[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 내가 저장한 책갈피 조회
  const fetchMyScrapedBookmarks = useCallback(
    async (page: number = 1, isRefresh: boolean = false) => {
      try {
        if (isRefresh) {
          setIsRefreshing(true);
          setCurrentPage(1);
        } else if (page === 1) {
          setIsLoading(true);
        } else {
          setIsLoadingMore(true);
        }

        const response = await getMyScrapedReadingSpotsAPI(page, 10);
        if (response.isSuccess) {
          if (isRefresh || page === 1) {
            setScrapList(response.result.readingSpotList);
          } else {
            setScrapList((prev) => [
              ...prev,
              ...response.result.readingSpotList,
            ]);
          }

          setTotalElements(response.result.totalElements);
          setHasMore(!response.result.isLast);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("내가 저장한 책갈피 조회 실패:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [],
  );

  // 초기 데이터 로드
  useEffect(() => {
    fetchMyScrapedBookmarks(1);
  }, [fetchMyScrapedBookmarks]);

  // 새로고침
  const onRefresh = useCallback(() => {
    fetchMyScrapedBookmarks(1, true);
  }, [fetchMyScrapedBookmarks]);

  // 더 많은 데이터 로드
  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      fetchMyScrapedBookmarks(currentPage + 1);
    }
  }, [hasMore, isLoadingMore, isLoading, currentPage, fetchMyScrapedBookmarks]);

  // 로딩 중일 때
  if (isLoading && scrapList.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E60A34" />
          <Text style={styles.loadingText}>저장된 책갈피를 불러오는 중...</Text>
        </View>
      </View>
    );
  }

  // 데이터가 없을 때
  if (!isLoading && scrapList.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>저장된 책갈피</Text>
          <Text style={styles.emptySubtext}>
            아직 저장된 책갈피가 없습니다.
          </Text>
        </View>
      </View>
    );
  }

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#E60A34" />
        <Text style={styles.footerText}>더 많은 책갈피를 불러오는 중...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>총 {totalElements}개</Text>
      </View>

      {/* 책갈피 목록 */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#302E2D"]}
            tintColor="#302E2D"
          />
        }
      >
        <View style={{ flexDirection: "row", paddingHorizontal: 15 }}>
          {/* 왼쪽 열 */}
          <View style={{ flex: 1, alignItems: "flex-start", gap: 6 }}>
            {scrapList
              .filter((_, index) => index % 2 === 0)
              .map((item) => (
                <BookmarkCard
                  key={item.readingSpotId}
                  imageUrl={item.readingSpotImages[0] || ""}
                  title={item.title}
                  address={item.address}
                  templateId={item.templateId}
                  onPress={() =>
                    router.push({
                      pathname: `/bookmark/[id]`,
                      params: {
                        id: item.readingSpotId.toString(),
                        from: "savedBookmark",
                      },
                    })
                  }
                />
              ))}
          </View>

          {/* 오른쪽 열 */}
          <View
            style={{ flex: 1, alignItems: "flex-end", paddingTop: 30, gap: 6 }}
          >
            {scrapList
              .filter((_, index) => index % 2 === 1)
              .map((item) => (
                <BookmarkCard
                  key={item.readingSpotId}
                  imageUrl={item.readingSpotImages[0] || ""}
                  title={item.title}
                  address={item.address}
                  templateId={item.templateId}
                  onPress={() =>
                    router.push({
                      pathname: `/bookmark/[id]`,
                      params: {
                        id: item.readingSpotId.toString(),
                        from: "savedBookmark",
                      },
                    })
                  }
                />
              ))}
          </View>
        </View>

        {/* 더 많은 데이터 로드 */}
        {hasMore && (
          <TouchableOpacity
            style={styles.loadMoreButton}
            onPress={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <ActivityIndicator size="small" color="#E60A34" />
            ) : (
              <Text style={styles.loadMoreText}>더 보기</Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    padding: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginTop: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#333333",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginTop: 10,
  },
  cardContainer: {
    flex: 1,
    alignItems: "center",
  },
  rightColumn: {
    paddingTop: 30,
  },
  loadMoreButton: {
    backgroundColor: "#EEE9E6",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DBD6D3",
  },
  loadMoreText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
});
