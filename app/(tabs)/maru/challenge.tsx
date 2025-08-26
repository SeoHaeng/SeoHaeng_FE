import EmptyBookIcon from "@/components/icons/EmptyBookIcon";
import BookStoreItem from "@/components/maruChallenge/bookStore";
import PopularChallenge from "@/components/maruChallenge/popularChallenge";
import {
  BookChallenge,
  BookChallengePlace,
  getBookChallengeListAPI,
  getBookChallengesAPI,
} from "@/types/api";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Challenge() {
  const router = useRouter();
  const [bookstores, setBookstores] = useState<BookChallengePlace[]>([]);
  const [isLoadingBookstores, setIsLoadingBookstores] = useState(false);

  // 북챌린지 서점 조회
  useEffect(() => {
    const fetchBookstores = async () => {
      try {
        setIsLoadingBookstores(true);
        const response = await getBookChallengesAPI();
        if (response.isSuccess) {
          setBookstores(response.result.placeList);
        }
      } catch (error) {
        console.error("북챌린지 서점 조회 실패:", error);
      } finally {
        setIsLoadingBookstores(false);
      }
    };

    fetchBookstores();
  }, []);
  const [challenges, setChallenges] = useState<BookChallenge[]>([]);
  const [isLoadingChallenges, setIsLoadingChallenges] = useState(false);

  // 북챌린지 챌린지 인증 조회 (인기순 5개)
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setIsLoadingChallenges(true);
        const response = await getBookChallengeListAPI(1, 5, "popular");
        if (response.isSuccess) {
          setChallenges(response.result.getBookChallengeList);
        }
      } catch (error) {
        console.error("북챌린지 챌린지 인증 조회 실패:", error);
      } finally {
        setIsLoadingChallenges(false);
      }
    };

    fetchChallenges();
  }, []);

  return (
    <ScrollView
      style={styles.mainScroll}
      contentContainerStyle={styles.mainContainer}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity
        style={styles.emptyBookContainer}
        onPress={() => router.push("/maru/challengeCertification")}
      >
        <Text style={styles.emptyBookText}>아직 책이 오지 않았어요</Text>
        <Text style={styles.bookComingText}>어떤 책이 올까요?</Text>
        <EmptyBookIcon style={styles.emptyBookImage} />
      </TouchableOpacity>

      <View style={styles.bookStoreSection}>
        <View style={styles.bookStoreHeader}>
          <Text style={styles.sectionTitle}>북챌린지 서점</Text>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              // Google Forms 링크로 이동
              router.push(
                "https://docs.google.com/forms/d/e/1FAIpQLSdngVZHOaAmsXlCfjpvuGT7wWysFIGDeihrc7WEm7gKha1NuA/viewform",
              );
            }}
          >
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
              location={store.address}
              onPress={() =>
                router.push({
                  pathname: "/bookstore/[id]",
                  params: { id: store.id },
                })
              }
            />
          ))}
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
              key={challenge.bookChallengeProofId}
              id={challenge.bookChallengeProofId}
              userName="사용자" // API에 userName이 없으므로 기본값 사용
              date={challenge.createdAt}
              text={challenge.proofContent}
              bookName={challenge.receivedBookTitle}
              bookAuthor={challenge.receivedBookAuthor}
              year={challenge.receivedBookPubDate}
              onPress={() =>
                router.push({
                  pathname: "/popularity/[id]",
                  params: { id: challenge.bookChallengeProofId },
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
    width: 85,
    height: 31,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  applyButtonText: {
    fontSize: 10,
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
