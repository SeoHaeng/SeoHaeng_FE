// app/bookstore/[id].tsx
import StatusBadge from "@/components/bookStore/statusBadge";
import BookstoreBadge from "@/components/BookstoreBadge";
import BackIcon from "@/components/icons/BackIcon";
import FilledHeartIcon from "@/components/icons/FilledHeartIcon";
import PlaceIcon from "@/components/icons/PlaceIcon";
import StarIcon from "@/components/icons/StarIcon";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailTab from "./detail";
import EventTab from "./event";
import PhotoTab from "./photo";
import ReviewTab from "./review";

export default function BookstoreDetail() {
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState("상세 정보");
  const [isLiked, setIsLiked] = useState(false);
  const [fromScreen, setFromScreen] = useState<string>("");
  const router = useRouter();

  // 파라미터에서 출발 화면 정보 가져오기
  useEffect(() => {
    if (params.from) {
      setFromScreen(params.from as string);
      console.log("🏪 서점 상세 화면 진입 - 출발 화면:", params.from);
    }
  }, [params.from]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "상세 정보":
        return <DetailTab />;
      case "후기":
        return <ReviewTab />;
      case "사진":
        return <PhotoTab />;
      case "이벤트":
        return <EventTab />;
      default:
        return <DetailTab />;
    }
  };

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
          <Text style={styles.headerTitle}>북챌린지 서점</Text>
        </View>

        {/* 메인 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/서점.png")}
            style={styles.mainImage}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageCounter}>2/4</Text>
          </View>
        </View>

        {/* 서점 정보 */}
        <View style={styles.storeInfo}>
          <View style={styles.storeHeader}>
            <View style={styles.storeTitleContainer}>
              <Text style={styles.storeName}>이스트씨네</Text>
              <BookstoreBadge />
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setIsLiked(!isLiked)}
              >
                <FilledHeartIcon isActive={isLiked} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Image source={require("@/assets/images/Share.png")} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.storeStats}>
            <Text style={styles.reviewText}>
              리뷰 <Text style={styles.reviewCount}>212</Text>
            </Text>
            <View style={styles.ratingContainer}>
              <StarIcon width={14} height={14} />
              <Text style={styles.ratingText}>4.2</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <PlaceIcon width={11} height={15} />
            <Text style={styles.storeLocation}>
              강원 강릉시 강동면 현화로 973 1층
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <StatusBadge isOpen={true} />
            <Text style={styles.storeStatus}>22:00에 영업 종료</Text>
          </View>
        </View>

        {/* 탭 네비게이션 */}
        <View style={styles.tabContainer}>
          {["상세 정보", "사진", "후기", "이벤트"].map((tab) => (
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
          ))}
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
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    position: "absolute",
    left: 10,
    top: 10,
    justifyContent: "center",
    alignItems: "center",
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
