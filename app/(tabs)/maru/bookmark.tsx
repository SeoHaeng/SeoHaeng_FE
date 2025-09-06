import BookmarkCard from "@/components/BookmarkCard";
import { getReadingSpotsAPI, ReadingSpot } from "@/types/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Bookmark() {
  const router = useRouter();
  const [scrapList, setScrapList] = useState<ReadingSpot[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sortType, setSortType] = useState<"latest" | "popular">("popular");

  // 책갈피 조회 API 호출
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        const response = await getReadingSpotsAPI(1, 10, sortType);
        if (response.isSuccess) {
          setScrapList(response.result.readingSpotList);
          setTotalElements(response.result.totalElements);
        }
      } catch (error) {
        console.error("책갈피 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarks();
  }, [sortType]);

  // 로딩 중일 때
  if (isLoading && scrapList.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E60A34" />
        <Text style={styles.loadingText}>공간 책갈피를 불러오는 중...</Text>
      </View>
    );
  }

  // 데이터가 없을 때
  if (!isLoading && scrapList.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>공간 책갈피</Text>
        <Text style={styles.emptySubtext}>
          아직 등록된 공간 책갈피가 없습니다.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ alignItems: "center" }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 20,
          paddingBottom: 10,
        }}
      >
        <Text
          style={{ fontSize: 13, color: "#716C69", fontFamily: "SUIT-500" }}
        >
          총 {totalElements}개
        </Text>

        {/* 정렬 필터 메뉴 */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={{
              backgroundColor: sortType === "latest" ? "#302E2D" : "#EEE9E6",
              borderRadius: 10,
              borderColor: sortType === "latest" ? "#302E2D" : "#DBD6D3",
              width: 60,
              height: 31,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
            }}
            onPress={() => setSortType("latest")}
          >
            <Text
              style={{
                fontSize: 10,
                color: sortType === "latest" ? "#FFFFFF" : "#716C69",
                fontFamily: "SUIT-500",
              }}
            >
              최신순
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: sortType === "popular" ? "#302E2D" : "#EEE9E6",
              borderRadius: 10,
              borderColor: sortType === "popular" ? "#302E2D" : "#DBD6D3",
              width: 60,
              height: 31,
              justifyContent: "center",
              alignItems: "center",
              borderWidth: 1,
            }}
            onPress={() => setSortType("popular")}
          >
            <Text
              style={{
                fontSize: 10,
                color: sortType === "popular" ? "#FFFFFF" : "#716C69",
                fontFamily: "SUIT-500",
              }}
            >
              인기순
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        {/* 왼쪽 열 */}
        <View style={{ flexDirection: "column", gap: 6 }}>
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
                      from: "maruBookmark",
                    },
                  })
                }
              />
            ))}
        </View>

        {/* 오른쪽 열 */}
        <View style={{ flexDirection: "column", paddingTop: 30, gap: 6 }}>
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
                      from: "maruBookmark",
                    },
                  })
                }
              />
            ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    fontSize: 16,
    color: "#716C69",
    fontFamily: "SUIT-500",
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
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
});
