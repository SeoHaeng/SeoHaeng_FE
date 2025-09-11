import BookmarkCard from "@/components/BookmarkCard";
import { getMyCreatedReadingSpotsAPI, ReadingSpot } from "@/types/api";
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

export default function MyBookmark() {
  const router = useRouter();
  const [bookmarkList, setBookmarkList] = useState<ReadingSpot[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 내가 등록한 공간 책갈피 조회
  const fetchMyCreatedBookmarks = useCallback(
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

        const response = await getMyCreatedReadingSpotsAPI(page, 10);
        if (response.isSuccess) {
          if (isRefresh || page === 1) {
            setBookmarkList(response.result.readingSpotList);
          } else {
            setBookmarkList((prev) => [
              ...prev,
              ...response.result.readingSpotList,
            ]);
          }

          setTotalElements(response.result.totalElements);
          setHasMore(!response.result.isLast);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("내가 등록한 공간 책갈피 조회 실패:", error);
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
    fetchMyCreatedBookmarks(1);
  }, [fetchMyCreatedBookmarks]);

  // 새로고침
  const onRefresh = useCallback(() => {
    fetchMyCreatedBookmarks(1, true);
  }, [fetchMyCreatedBookmarks]);

  // 더 많은 데이터 로드
  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      fetchMyCreatedBookmarks(currentPage + 1);
    }
  }, [hasMore, isLoadingMore, isLoading, currentPage, fetchMyCreatedBookmarks]);

  // 로딩 중일 때
  if (isLoading && bookmarkList.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E60A34" />
          <Text style={styles.loadingText} allowFontScaling={false}>
            내 책갈피를 불러오는 중...
          </Text>
        </View>
      </View>
    );
  }

  // 데이터가 없을 때
  if (!isLoading && bookmarkList.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle} allowFontScaling={false}>
            내 책갈피
          </Text>
          <Text style={styles.emptySubtext} allowFontScaling={false}>
            아직 등록한 책갈피가 없습니다.
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
        <Text style={styles.footerText} allowFontScaling={false}>
          더 많은 책갈피를 불러오는 중...
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          총 {totalElements}개
        </Text>
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
        <View style={{ flexDirection: "row", gap: 8, paddingHorizontal: 15 }}>
          {/* 왼쪽 열 */}
          <View style={{ flexDirection: "column", gap: 6 }}>
            {bookmarkList
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
                        from: "myBookmark",
                      },
                    })
                  }
                />
              ))}
          </View>

          {/* 오른쪽 열 */}
          <View style={{ flexDirection: "column", paddingTop: 30, gap: 6 }}>
            {bookmarkList
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
                        from: "myBookmark",
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
              <Text style={styles.loadMoreText} allowFontScaling={false}>
                더 보기
              </Text>
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
    fontSize: 21,
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
    fontSize: 17,
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
    fontSize: 19,
    fontFamily: "SUIT-700",
    color: "#333333",
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
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
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
});
