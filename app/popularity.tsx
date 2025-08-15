// app/popularity.tsx
import BackIcon from "@/components/icons/BackIcon";
import PopularChallengeTotal from "@/components/maruChallenge/popularChallengeTotal";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

  const challenges = [
    {
      id: 1,
      userName: "유딘딘",
      date: "1",
      text: "대박 이 책을 받을 줄은 몰았어요!ㅎ ㅎㅎ 잘 읽겠습니다!! 강릉 여행와서..",
      bookName: "물고기는 존재하지 않는다",
      bookAuthor: "룰루 밀러 / 정지인",
      year: "2022",
    },
    {
      id: 2,
      userName: "채영",
      date: "2",
      text: "오늘도 새로운 책과 함께하는 독서 시간! 이번에는 특별한 책을..",
      bookName: "물고기는 존재하지 않는다",
      bookAuthor: "룰루 밀러 / 정지인",
      year: "2022",
    },
    {
      id: 3,
      userName: "수빈",
      date: "3",
      text: "주말 아침 카페에서 독서하기! 오늘의 책은..",
      bookName: "물고기는 존재하지 않는다",
      bookAuthor: "룰루 밀러 / 정지인",
      year: "2022",
    },
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/maru/challenge")}
          style={styles.backButton}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.title}>인기 챌린지 인증</Text>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
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
            총 1583개
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
            key={challenge.id}
            {...challenge}
            onPress={() =>
              router.push({
                pathname: "/popularity/[id]",
                params: { id: challenge.id },
              })
            }
          />
        ))}
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
});
