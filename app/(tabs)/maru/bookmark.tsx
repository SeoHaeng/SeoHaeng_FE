import BookmarkCard from "@/components/BookmarkCard";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

interface ScrapItem {
  title: string;
  imageUrl: string;
  address: string;
  latitude: number;
  longitude: number;
  templateId: number;
  readingSpotId: number;
  createdAt: string;
}

export default function Bookmark() {
  const router = useRouter();
  const [scrapList, setScrapList] = useState<ScrapItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);

  // API 데이터 예시 (실제로는 API 호출로 대체)
  useEffect(() => {
    // 임시 데이터 - 실제로는 API 호출
    const mockData = {
      listSize: 2,
      totalPage: 1,
      totalElements: 2,
      isFirst: true,
      isLast: true,
      scrapList: [
        {
          title: "강릉 앞바다",
          imageUrl:
            "https://shopping-phinf.pstatic.net/main_5441999/54419996237.20250429093306.jpg",
          address: "강원 강릉시 창해로 14번길 20-1",
          latitude: 90,
          longitude: 180,
          templateId: 1,
          readingSpotId: 4,
          createdAt: "2025-08-05",
        },
        {
          title: "춘천 책방",
          imageUrl:
            "https://shopping-phinf.pstatic.net/main_5441999/54419996237.20250429093306.jpg",
          address: "강원 춘천시 중앙로 123",
          latitude: 90,
          longitude: 180,
          templateId: 4,
          readingSpotId: 3,
          createdAt: "2025-08-05",
        },
      ],
    };

    setScrapList(mockData.scrapList);
    setTotalElements(mockData.totalElements);
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

      <View style={{ flexDirection: "row", gap: 5 }}>
        <View style={{ flexDirection: "column", gap: 5 }}>
          {scrapList.slice(0, 3).map((item, index) => (
            <BookmarkCard
              key={item.readingSpotId}
              imageUrl={item.imageUrl}
              title={item.title}
              address={item.address}
              templateId={item.templateId}
              onPress={() =>
                router.push(
                  `/bookmark/${item.readingSpotId}?imageUrl=${item.imageUrl}&title=${item.title}&address=${item.address}&templateId=${item.templateId}` as any,
                )
              }
            />
          ))}
        </View>
        <View style={{ flexDirection: "column", gap: 5, paddingTop: 30 }}>
          {scrapList.slice(3).map((item, index) => (
            <BookmarkCard
              key={item.readingSpotId}
              imageUrl={item.imageUrl}
              title={item.title}
              address={item.address}
              templateId={item.templateId}
              onPress={() =>
                router.push(
                  `/bookmark/${item.readingSpotId}?imageUrl=${item.imageUrl}&title=${item.title}&address=${item.address}&templateId=${item.templateId}` as any,
                )
              }
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
