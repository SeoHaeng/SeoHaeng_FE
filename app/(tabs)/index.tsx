import HamburgerIcon from "@/components/icons/HamburgerIcon";
import NotificationIcon from "@/components/icons/NotificationIcon";
import SideMenu from "@/components/SideMenu";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [sideMenuVisible, setSideMenuVisible] = useState(false);

  const openSideMenu = () => setSideMenuVisible(true);
  const closeSideMenu = () => setSideMenuVisible(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 헤더 */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>서행</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <NotificationIcon width={23} height={23} color="#9D9896" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={openSideMenu}>
              <HamburgerIcon width={20} height={17} color="#9D9896" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 개인화된 북트립 섹션 - 어두운 배경 */}
        <View style={styles.topSection}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              유딘딘님의 다음 강원 북트립은?
            </Text>
            <TouchableOpacity style={styles.planButton}>
              <Text style={styles.planButtonText}>여행 일정 짜기 &gt;</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 서행 200% 즐기기 섹션 - 하얀 배경, 상단 둥근 모서리 */}
        <View style={styles.middleSection}>
          <Text style={styles.sectionTitle}>서행 200% 즐기기</Text>

          {/* 기능 카테고리 */}
          <View style={styles.categoriesContainer}>
            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>📚</Text>
              </View>
              <Text style={styles.categoryText}>북챌린지</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>☕</Text>
              </View>
              <Text style={styles.categoryText}>책팟</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>🎯</Text>
              </View>
              <Text style={styles.categoryText}>독파민 클럽</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>⭐</Text>
              </View>
              <Text style={styles.categoryText}>오늘 추천책</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryItem}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryIconText}>🔥</Text>
              </View>
              <Text style={styles.categoryText}>핫북플</Text>
            </TouchableOpacity>
          </View>

          {/* 스탬프 투어 배너 */}
          <View style={styles.stampTourBanner}>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>2025 강원 스탬프 투어 개최</Text>
              <View style={styles.bannerGraphic}>
                <Text style={styles.bannerGraphicText}>미션! 스탬프투어</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 다른 유저의 서행 섹션 - 하얀 배경 */}
        <View style={styles.bottomSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>다른 유저의 서행</Text>
            <TouchableOpacity>
              <Text style={styles.moreButton}>더보기 &gt;</Text>
            </TouchableOpacity>
          </View>

          {/* 유저 콘텐츠 스크롤 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.userContentScroll}
          >
            <View style={styles.userContentItem}>
              <Image
                source={{
                  uri: "https://via.placeholder.com/200x150/EEE9E6/716C69?text=Bookshelves",
                }}
                style={styles.userContentImage}
              />
              <View style={styles.userContentOverlay}>
                <View style={styles.profileSection}>
                  <View style={styles.profileIcon}>
                    <Text style={styles.profileIconText}>👤</Text>
                  </View>
                  <View style={styles.blueObject}>
                    <Text style={styles.blueObjectText}>🔵</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.userContentItem}>
              <Image
                source={{
                  uri: "https://via.placeholder.com/200x150/EEE9E6/716C69?text=Bookshelves",
                }}
                style={styles.userContentImage}
              />
              <View style={styles.userContentOverlay}>
                <View style={styles.profileSection}>
                  <View style={styles.profileIcon}>
                    <Text style={styles.profileIconText}>👤</Text>
                  </View>
                  <View style={styles.blueObject}>
                    <Text style={styles.blueObjectText}>🔵</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.userContentItem}>
              <Image
                source={{
                  uri: "https://via.placeholder.com/200x150/EEE9E6/716C69?text=Bookshelves",
                }}
                style={styles.userContentImage}
              />
              <View style={styles.userContentOverlay}>
                <View style={styles.profileSection}>
                  <View style={styles.profileIcon}>
                    <Text style={styles.profileIconText}>👤</Text>
                  </View>
                  <View style={styles.blueObject}>
                    <Text style={styles.blueObjectText}>🔵</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* 사이드 메뉴 */}
      <SideMenu visible={sideMenuVisible} onClose={closeSideMenu} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#302E2D", // 상단만 어두운 배경
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#302E2D", // 헤더도 어두운 배경
  },
  appTitle: {
    fontSize: 22,
    fontFamily: "Gangwon",
    color: "#4D4947", // 헤더 텍스트를 연한 회색으로
  },
  headerIcons: {
    flexDirection: "row",
    gap: 15,
  },
  iconButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 20,
    color: "#C5BFBB", // 아이콘 색상도 연한 회색으로
  },
  topSection: {
    backgroundColor: "#302E2D", // 상단 섹션 어두운 배경
    paddingHorizontal: 20,
    paddingVertical: 30,
    paddingBottom: 40, // 하단 여백 추가
  },
  greetingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greetingText: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#FFFFFF",
    flex: 1,
    marginRight: 20,
  },
  planButton: {
    backgroundColor: "#C5BFBB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  planButtonText: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  middleSection: {
    backgroundColor: "#FFFFFF", // 중간 섹션 하얀 배경
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderTopLeftRadius: 20, // 상단 둥근 모서리
    borderTopRightRadius: 20, // 상단 둥근 모서리
    marginTop: -20, // 어두운 배경과 겹치도록
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 20,
  },
  categoriesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  categoryItem: {
    alignItems: "center",
    flex: 1,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#EEE9E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#716C69",
    textAlign: "center",
  },
  stampTourBanner: {
    backgroundColor: "#E8F5E8",
    borderRadius: 12,
    padding: 20,
  },
  bannerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#262423",
    flex: 1,
  },
  bannerGraphic: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bannerGraphicText: {
    fontSize: 12,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
  bottomSection: {
    backgroundColor: "#FFFFFF", // 하단 섹션 하얀 배경
    paddingHorizontal: 20,
    paddingVertical: 25,
    marginTop: 0, // 상단 여백 제거
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  moreButton: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  userContentScroll: {
    flexDirection: "row",
  },
  userContentItem: {
    marginRight: 15,
    position: "relative",
  },
  userContentImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  userContentOverlay: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  profileIconText: {
    fontSize: 16,
  },
  blueObject: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#2196F3",
    justifyContent: "center",
    alignItems: "center",
  },
  blueObjectText: {
    fontSize: 12,
    color: "#FFFFFF",
  },
});
