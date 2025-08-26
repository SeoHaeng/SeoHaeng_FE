import BookmarkCard from "@/components/BookmarkCard";
import { getReadingSpotsAPI, ReadingSpot } from "@/types/api";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Bookmark() {
  const router = useRouter();
  const [scrapList, setScrapList] = useState<ReadingSpot[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 책갈피 조회 API 호출
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setIsLoading(true);
        const response = await getReadingSpotsAPI(1, 10); // 10개씩 로드
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
  }, []);

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
        }}
      >
        <Text
          style={{ fontSize: 13, color: "#716C69", fontFamily: "SUIT-500" }}
        >
          총 {totalElements}개
        </Text>
      </View>

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
                      imageUrl: item.readingSpotImages[0] || "",
                      title: item.title,
                      address: item.address,
                      templateId: item.templateId,
                      from: "maruBookmark",
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
                  router.push(
                    `/bookmark/${item.readingSpotId}?imageUrl=${item.readingSpotImages[0] || ""}&title=${item.title}&address=${item.address}&templateId=${item.templateId}` as any,
                  )
                }
              />
            ))}
        </View>
      </View>
    </ScrollView>
  );
}
