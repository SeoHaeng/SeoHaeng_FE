import EmptyBookIcon from "@/components/icons/EmptyBookIcon";
import BookStoreItem from "@/components/maruChallenge/bookStore";
import PopularChallenge from "@/components/maruChallenge/popularChallenge";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Challenge() {
  const router = useRouter();
  const bookstores = [
    { id: 1, name: "아름 서점", location: "강릉" },
    { id: 2, name: "책과 삶", location: "부산" },
    { id: 3, name: "달팽이", location: "서울" },
    { id: 4, name: "햇살 서점", location: "대구" },
    { id: 5, name: "숲 서점", location: "제주" },
  ];
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
    <ScrollView
      style={styles.mainScroll}
      contentContainerStyle={styles.mainContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.emptyBookContainer}>
        <Text style={styles.emptyBookText}>아직 책이 오지 않았어요</Text>
        <Text style={styles.bookComingText}>어떤 책이 올까요?</Text>
        <EmptyBookIcon style={styles.emptyBookImage} />
      </View>

      <View style={styles.bookStoreSection}>
        <View style={styles.bookStoreHeader}>
          <Text style={styles.sectionTitle}>북챌린지 서점</Text>
          <TouchableOpacity style={styles.applyButton} onPress={() => {}}>
            <Text style={styles.applyButtonText}>우리 서점 신청</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          contentContainerStyle={styles.horizontalScroll}
        >
          {bookstores.map((store) => (
            <BookStoreItem
              key={store.id}
              name={store.name}
              location={store.location}
              onPress={() =>
                router.push({
                  pathname: "/bookstore/[id]",
                  params: { id: store.id },
                })
              }
            />
          ))}
          <View style={styles.moreButton}>
            <Text style={styles.moreButtonText}>더보기 &gt;</Text>
          </View>
        </ScrollView>
      </View>

      <View style={styles.popularSection}>
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>인기 챌린지 인증</Text>
          <Text
            style={styles.viewAll}
            onPress={() => router.push("/popularity")}
          >
            전체 보기 &gt;
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          style={styles.scrollView}
        >
          {challenges.map((challenge) => (
            <PopularChallenge
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
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainScroll: {
    flex: 1,
  },
  mainContainer: {
    alignItems: "center",
    gap: 25,
  },
  emptyBookContainer: {
    width: 360,
    height: 85,
    backgroundColor: "#DBD6D3",
    borderRadius: 5,
    borderColor: "#C5BFBB",
    paddingHorizontal: 18,
    paddingVertical: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    marginTop: 30,
  },
  emptyBookText: {
    fontSize: 13,
    color: "#716C69",
    fontFamily: "SUIT-500",
  },
  bookComingText: {
    fontSize: 16,
    color: "#302E2D",
    fontFamily: "SUIT-700",
  },
  emptyBookImage: {
    position: "absolute",
    bottom: -2,
    right: 30,
  },
  bookStoreSection: {
    height: 210,
  },
  bookStoreHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  sectionTitle: {
    fontFamily: "SUIT-700",
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: "#EEE9E6",
    borderRadius: 10,
    borderColor: "#DBD6D3",
    width: 98,
    height: 31,
    justifyContent: "center",
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 12,
    color: "#716C69",
    fontFamily: "SUIT-500",
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 20,
    height: 140,
    flexDirection: "row",
    alignItems: "center",
  },
  moreButton: {
    width: 82,
    height: 82,
    borderRadius: 50,
    backgroundColor: "#EEE9E6",
    alignItems: "center",
    justifyContent: "center",
  },
  moreButtonText: {
    fontSize: 12,
    color: "#4D4947",
    fontFamily: "SUIT-700",
  },
  popularSection: {
    height: 350,
    width: "100%",
    overflow: "visible",
  },
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    padding: 20,
    marginBottom: 40,
  },

  viewAll: {
    fontFamily: "SUIT-500",
    fontSize: 12,
    color: "#716C69",
    textDecorationLine: "underline",
    textDecorationColor: "#716C69",
  },
  scrollView: {
    overflow: "visible",
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 20,
    height: 234,
  },
});
