// app/bookstore/[id].tsx
import StatusBadge from "@/components/bookStore/statusBadge";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookstoreDetail() {
  const [activeTab, setActiveTab] = useState("이벤트");
  const router = useRouter();

  const renderTabContent = () => {
    switch (activeTab) {
      case "상세 정보":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>서점 정보</Text>
            <Text style={styles.description}>
              이스트씨네는 강릉에 위치한 독립서점입니다. 영화와 책을 사랑하는
              사람들이 모이는 공간으로, 다양한 독립영화와 독서 문화를 즐길 수
              있습니다.
            </Text>
            <Text style={styles.tabTitle}>영업시간</Text>
            <Text style={styles.description}>
              평일: 10:00 - 22:00{"\n"}주말: 10:00 - 22:00
            </Text>
            <Text style={styles.tabTitle}>연락처</Text>
            <Text style={styles.infoText}>033-123-4567</Text>
          </View>
        );
      case "후기":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>서점 후기</Text>
            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>책벌레123</Text>
                <Text style={styles.reviewDate}>2024.01.15</Text>
              </View>
              <Text style={styles.reviewText}>
                정말 아늑한 분위기의 서점이에요! 영화와 책을 동시에 즐길 수
                있어서 좋았습니다.
              </Text>
            </View>
            <View style={styles.reviewItem}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewerName}>독서광</Text>
                <Text style={styles.reviewDate}>2024.01.10</Text>
              </View>
              <Text style={styles.reviewText}>
                북챌린지 이벤트도 진행하고 있어서 더욱 특별한 경험이었어요.
              </Text>
            </View>
          </View>
        );
      case "사진":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>서점 사진</Text>
            <View style={styles.photoGrid}>
              <Image
                source={require("@/assets/images/서점.png")}
                style={styles.photoItem}
              />
              <Image
                source={require("@/assets/images/독립서점.png")}
                style={styles.photoItem}
              />
            </View>
          </View>
        );
      case "이벤트":
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabTitle}>북챌린지 이벤트</Text>
            <Text style={styles.description}>
              3월 16일부터 이스트 씨네에서도 북 챌린지 이벤트를 진행합니다!
              이유는 없습니다. 다들 하길래 저희도 하는겁니다 ㅎㅎ 많은 참여
              부탁드려요~!!
            </Text>
            <Text style={styles.tabTitle}>챌린지 리워드</Text>
            <View style={styles.rewardContainer}>
              <View style={styles.rewardItem} />
              <View style={styles.rewardItem} />
              <View style={styles.rewardItem} />
            </View>
            <Text style={styles.description}>
              챌린지에 참여하는 모든 분들께 이스트씨네의 책갈피를 드립니다
            </Text>
            <Text style={styles.tabTitle}>사장님 한 마디</Text>
            <Text style={styles.description}>
              3월 16일부터 이스트 씨네에서도 북 챌린지 이벤트를 진행합니다!
              이유는 없습니다. 다들 하길래 저희도 하는겁니다 ㅎㅎ 많은 참여
              부탁드려요~!!
            </Text>
          </View>
        );
      default:
        return null;
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
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Image source={require("@/assets/images/Back.png")} />
          </TouchableOpacity>
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
              <View style={styles.badgeContainer}>
                <Image source={require("@/assets/images/bookStoreBadge.png")} />
                <Text style={styles.badgeText}>독립서점</Text>
              </View>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Image source={require("@/assets/images/FilledHeart.png")} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Image source={require("@/assets/images/Share.png")} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.storeStats}>
            리뷰 <Text style={styles.reviewCount}>212</Text>
            {"    "}⭐ 4.2{"  "}
            <Image
              source={require("@/assets/images/서점 리뷰 더보기 화살표.png")}
            />
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <Image source={require("@/assets/images/place.png")} />
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
          {["상세 정보", "후기", "사진", "이벤트"].map((tab) => (
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
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 13,
    fontFamily: "SUIT-700",
    color: "#000000",
    marginBottom: 4,
  },
  reviewCount: {
    color: "#9D9896",
  },
  storeLocation: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
    marginBottom: 4,
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
  tabContent: {
    minHeight: 400,
  },
  tabTitle: {
    fontSize: 13,
    fontFamily: "SUIT-700",
    color: "262423",
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
    lineHeight: 20,
    marginBottom: 50,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginBottom: 4,
  },
  reviewItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E3E0",
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  reviewText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#000000",
    lineHeight: 20,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoItem: {
    width: "48%",
    height: 150,
    borderRadius: 8,
  },
  rewardContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  rewardItem: {
    flex: 1,
    height: 80,
    backgroundColor: "#F5F3F2",
    borderRadius: 8,
  },
});
