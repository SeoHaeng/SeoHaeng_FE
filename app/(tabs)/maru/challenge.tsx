import EmptyBookIcon from "@/components/icons/EmptyBookIcon";
import BookStoreItem from "@/components/maruChallenge/bookStore";
import PopularChallenge from "@/components/maruChallenge/popularChallenge";
import {
  BookChallenge,
  BookChallengePlace,
  getBookChallengeInProgressInfoAPI,
  getBookChallengeListAPI,
  getBookChallengesAPI,
  getUserByIdAPI,
} from "@/types/api";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 날짜를 "X일 전" 형식으로 변환하는 함수
const formatDateToDaysAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffHours = diffTime / (1000 * 60 * 60);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "방금 전";
  if (diffHours < 24) return `${Math.floor(diffHours)}시간 전`;
  if (diffDays === 1) return "어제";
  return `${diffDays}일 전`;
};

// 주소에서 시/군 이름만 추출하는 함수
const extractCityFromAddress = (address: string): string => {
  // 강원특별자치도 춘천시 호반로 45 -> 춘천
  const match = address.match(/강원특별자치도\s*([^\s]+시|[^\s]+군)/);
  if (match) {
    // 시/군 접미사 제거
    return match[1].replace(/시$|군$/, "");
  }

  // 다른 형식의 주소 처리
  const cityMatch = address.match(/([^\s]+시|[^\s]+군)/);
  if (cityMatch) {
    // 시/군 접미사 제거
    return cityMatch[1].replace(/시$|군$/, "");
  }

  return address; // 매칭되지 않으면 원본 주소 반환
};

export default function Challenge() {
  const router = useRouter();
  const [bookstores, setBookstores] = useState<BookChallengePlace[]>([]);
  const [isLoadingBookstores, setIsLoadingBookstores] = useState(false);
  const [hasInProgressChallenge, setHasInProgressChallenge] = useState<
    boolean | null
  >(null);
  const [inProgressChallengeInfo, setInProgressChallengeInfo] = useState<{
    bookChallengeId: number;
    userNickName: string;
    bookStoreName: string;
    receivedBookTitle: string;
    receivedBookAuthor: string;
    receivedBookImage: string;
    givenBookTitle: string;
    givenBookAuthor: string;
    givenBookImage: string;
  } | null>(null);
  const [isLoadingChallengeStatus, setIsLoadingChallengeStatus] =
    useState(false);

  // 북챌린지 진행 여부 조회
  useEffect(() => {
    const fetchChallengeStatus = async () => {
      try {
        setIsLoadingChallengeStatus(true);
        const response = await getBookChallengeInProgressInfoAPI();
        if (response.isSuccess) {
          setHasInProgressChallenge(true);
          setInProgressChallengeInfo({
            bookChallengeId: response.result.bookChallengeId,
            userNickName: response.result.userNickName,
            bookStoreName: response.result.bookStoreName,
            receivedBookTitle: response.result.receivedBookTitle,
            receivedBookAuthor: response.result.receivedBookAuthor,
            receivedBookImage: response.result.receivedBookImage,
            givenBookTitle: response.result.givenBookTitle,
            givenBookAuthor: response.result.givenBookAuthor,
            givenBookImage: response.result.givenBookImage,
          });
          console.log("진행 중인 북챌린지가 있습니다:", response.result);
        } else {
          setHasInProgressChallenge(false);
          setInProgressChallengeInfo(null);
          console.log("진행 중인 북챌린지가 없습니다:", response.message);
        }
      } catch (error) {
        console.error("북챌린지 진행 여부 조회 실패:", error);
        setHasInProgressChallenge(false);
      } finally {
        setIsLoadingChallengeStatus(false);
      }
    };

    fetchChallengeStatus();
  }, []);

  // 북챌린지 서점 조회
  useEffect(() => {
    const fetchBookstores = async () => {
      try {
        setIsLoadingBookstores(true);
        const response = await getBookChallengesAPI();
        if (response.isSuccess) {
          console.log("북챌린지 서점 API 응답:", response.result.placeList);
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
  const [userInfoMap, setUserInfoMap] = useState<
    Record<number, { nickName: string; profileImageUrl: string }>
  >({});

  // 북챌린지 챌린지 인증 조회 (인기순 5개)
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setIsLoadingChallenges(true);
        const response = await getBookChallengeListAPI(1, 5, "popular");
        if (response.isSuccess) {
          setChallenges(response.result.getBookChallengeList);

          // 각 챌린지의 creatorId로 사용자 정보 가져오기
          const userInfoPromises = response.result.getBookChallengeList.map(
            async (challenge) => {
              try {
                const userResponse = await getUserByIdAPI(challenge.creatorId);
                if (userResponse.isSuccess) {
                  return {
                    creatorId: challenge.creatorId,
                    nickName: userResponse.result.nickName,
                    profileImageUrl: userResponse.result.profileImageUrl,
                  };
                }
              } catch (error) {
                console.error(
                  `사용자 ${challenge.creatorId} 정보 조회 실패:`,
                  error,
                );
              }
              return null;
            },
          );

          const userInfoResults = await Promise.all(userInfoPromises);
          const newUserInfoMap: Record<
            number,
            { nickName: string; profileImageUrl: string }
          > = {};

          userInfoResults.forEach((userInfo) => {
            if (userInfo) {
              newUserInfoMap[userInfo.creatorId] = {
                nickName: userInfo.nickName,
                profileImageUrl: userInfo.profileImageUrl,
              };
            }
          });

          setUserInfoMap(newUserInfoMap);
        }
      } catch (error) {
        console.error("북챌린지 챌린지 인증 조회 실패:", error);
      } finally {
        setIsLoadingChallenges(false);
      }
    };

    fetchChallenges();
  }, []);

  // 전체 로딩 상태 확인
  const isOverallLoading =
    isLoadingChallengeStatus || isLoadingBookstores || isLoadingChallenges;

  // 전체 로딩 중일 때 로딩 화면 표시
  if (isOverallLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E60A34" />
        <Text style={styles.loadingText}>북챌린지 데이터를 불러오는 중...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.mainScroll}
      contentContainerStyle={styles.mainContainer}
      showsVerticalScrollIndicator={false}
    >
      {hasInProgressChallenge ? (
        <TouchableOpacity
          style={styles.emptyBookContainer}
          onPress={() =>
            router.push({
              pathname: "/maru/challengeCertification",
              params: {
                bookChallengeId:
                  inProgressChallengeInfo?.bookChallengeId?.toString() || "",
                userNickName: inProgressChallengeInfo?.userNickName || "",
                bookStoreName: inProgressChallengeInfo?.bookStoreName || "",
                receivedBookTitle:
                  inProgressChallengeInfo?.receivedBookTitle || "",
                receivedBookAuthor:
                  inProgressChallengeInfo?.receivedBookAuthor || "",
                receivedBookImage:
                  inProgressChallengeInfo?.receivedBookImage || "",
                givenBookTitle: inProgressChallengeInfo?.givenBookTitle || "",
                givenBookAuthor: inProgressChallengeInfo?.givenBookAuthor || "",
                givenBookImage: inProgressChallengeInfo?.givenBookImage || "",
              },
            })
          }
        >
          {inProgressChallengeInfo && (
            <Text style={styles.emptyBookText}>
              {inProgressChallengeInfo.receivedBookTitle} -{" "}
              {inProgressChallengeInfo.receivedBookAuthor}
            </Text>
          )}
          <Text style={styles.bookComingText}>
            인증하고 나도 책 선물하기 &gt;
          </Text>
          {inProgressChallengeInfo?.receivedBookImage && (
            <Image
              source={{ uri: inProgressChallengeInfo.receivedBookImage }}
              style={styles.emptyBookImage}
            />
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.emptyBookContainer}>
          <Text style={styles.emptyBookText}>아직 책이 오지 않았어요</Text>
          <Text style={styles.bookComingText}>어떤 책이 올까요?</Text>
          <EmptyBookIcon style={styles.emptyBookImage} />
        </View>
      )}

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
              location={extractCityFromAddress(store.address)}
              imageUrl={(store as any).imageUrl} // API 응답에 imageUrl이 있다면 사용
              onPress={() => {
                const targetId = (store as any).placeId || store.id;
                router.navigate(`/bookstore/${targetId}?from=challenge`);
              }}
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
              userName={userInfoMap[challenge.creatorId]?.nickName || "사용자"}
              profileImageUrl={
                userInfoMap[challenge.creatorId]?.profileImageUrl
              }
              date={formatDateToDaysAgo(challenge.createdAt)}
              text={challenge.proofContent}
              bookImageSource={challenge.proofImageUrls[0]}
              receivedBookImage={challenge.receivedBookImage}
              bookName={challenge.receivedBookTitle}
              bookAuthor={challenge.receivedBookAuthor}
              year={
                challenge.receivedBookPubDate?.split("-")[0] ||
                challenge.receivedBookPubDate
              }
              likedByMe={challenge.likedByMe}
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
    zIndex: 100,
    width: 76,
    height: 105,
    borderRadius: 5,
  },
  inProgressContainer: {
    width: 360,
    height: 85,
    backgroundColor: "#4A90E2",
    borderRadius: 5,
    paddingHorizontal: 18,
    paddingVertical: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    marginTop: 30,
  },
  inProgressText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "SUIT-700",
  },
  inProgressSubText: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "SUIT-500",
    opacity: 0.8,
  },
  bookInfoText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "SUIT-600",
    opacity: 0.9,
    marginTop: 2,
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
    marginBottom: 25,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#716C69",
    marginTop: 16,
    fontFamily: "SUIT-500",
  },
});
