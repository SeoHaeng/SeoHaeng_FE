import BackIcon from "@/components/icons/BackIcon";
import BookmarkTemplate from "@/components/icons/bookmarkTemplate/BookmarkTemplate";
import FilledHeartIcon from "@/components/icons/FilledHeartIcon";
import ScrapIcon from "@/components/icons/ScrapIcon";
import ChallengeComment from "@/components/maruChallenge/detail/comment";
import {
  createReadingSpotCommentAPI,
  getBookmarkDetailAPI,
  getReadingSpotCommentListAPI,
  getUserByIdAPI,
  toggleReadingSpotLikeAPI,
  toggleReadingSpotScrapAPI,
} from "@/types/api";
import { useGlobalState } from "@/types/globalState";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function BookmarkDetail() {
  const { id, from } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setViewport } = useGlobalState();
  const [fromScreen, setFromScreen] = useState<string>("");
  const [bookmarkDetail, setBookmarkDetail] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [commentList, setCommentList] = useState<any[]>([]);
  const [totalComments, setTotalComments] = useState(0);

  // 날짜 형식을 변환하는 함수 (2025-08-27 -> 2025.8.27)
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth()는 0부터 시작
    const day = date.getDate();
    const dayOfWeek = date.getDay(); // 0: 일요일, 6: 토요일

    let formattedDate = `${year}.${month}.${day}`;

    // 요일 추가
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    formattedDate += ` ${dayNames[dayOfWeek]}`;

    return formattedDate;
  };

  // 파라미터에서 출발 화면 정보 가져오기
  useEffect(() => {
    if (from) {
      setFromScreen(from as string);
      console.log("🔖 북마크 상세 화면 진입 - 출발 화면:", from);
    }
  }, [from]);

  // 북마크 상세 정보 조회
  useEffect(() => {
    const fetchBookmarkDetail = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getBookmarkDetailAPI(Number(id));
        if (response.isSuccess) {
          console.log("북마크 상세 조회 성공:", response.result);
          console.log("좋아요 상태:", response.result.liked);
          console.log("스크랩 상태:", response.result.scraped);
          console.log("좋아요 수:", response.result.likes);
          console.log("스크랩 수:", response.result.scraps);
          setBookmarkDetail(response.result);

          // 댓글 목록 조회
          const commentResponse = await getReadingSpotCommentListAPI(
            Number(id),
            1,
            10,
          );
          if (commentResponse.isSuccess) {
            console.log("댓글 목록 조회 성공:", commentResponse.result);

            // 각 댓글의 userId로 사용자 정보 가져오기
            const commentWithUserInfo = await Promise.all(
              commentResponse.result.comments.map(async (comment) => {
                try {
                  const userResponse = await getUserByIdAPI(comment.userId);
                  if (userResponse.isSuccess) {
                    return {
                      ...comment,
                      nickName: userResponse.result.nickName,
                      profileImageUrl: userResponse.result.profileImageUrl,
                    };
                  }
                } catch (error) {
                  console.error(
                    `사용자 ${comment.userId} 정보 조회 실패:`,
                    error,
                  );
                }
                return {
                  ...comment,
                  nickName: "사용자",
                  profileImageUrl: "",
                };
              }),
            );

            setCommentList(commentWithUserInfo);
            setTotalComments(commentResponse.result.totalElements);
          }
        }
      } catch (error) {
        console.error("북마크 상세 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookmarkDetail();
  }, [id]);

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // API 응답에서 좋아요/스크랩 상태 초기화
  useEffect(() => {
    if (bookmarkDetail) {
      setIsLiked(bookmarkDetail.liked);
      setIsBookmarked(bookmarkDetail.scraped);
    }
  }, [bookmarkDetail]);
  const [comment, setComment] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // 좋아요 토글 함수
  const toggleLike = async () => {
    if (!id) return;

    try {
      const response = await toggleReadingSpotLikeAPI(Number(id));

      if (response.isSuccess) {
        // 좋아요 상태 토글
        setBookmarkDetail((prev: any) => ({
          ...prev,
          liked: !prev?.liked,
          likes: response.result.nowLikeCount,
        }));
      }
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  // 스크랩 토글 함수
  const toggleScrap = async () => {
    if (!id) return;

    try {
      const response = await toggleReadingSpotScrapAPI(Number(id));

      if (response.isSuccess) {
        // 스크랩 상태 토글
        setBookmarkDetail((prev: any) => ({
          ...prev,
          scraped: !prev?.scraped,
          scraps: response.result.nowScrapCount,
        }));
      }
    } catch (error) {
      console.error("스크랩 토글 실패:", error);
    }
  };

  useEffect(() => {
    const showListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16 }}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 데이터가 없을 때 표시
  if (!bookmarkDetail) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16 }}>
            북마크 정보를 불러올 수 없습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmitComment = async () => {
    if (!comment.trim() || !id) return;

    try {
      const response = await createReadingSpotCommentAPI(
        Number(id),
        comment.trim(),
      );

      if (response.isSuccess) {
        console.log("댓글 등록 성공:", response.result);

        // 댓글 입력창 초기화
        setComment("");

        // 전체 북마크 상세 정보 새로고침
        setIsLoading(true);
        const bookmarkResponse = await getBookmarkDetailAPI(Number(id));
        if (bookmarkResponse.isSuccess) {
          setBookmarkDetail(bookmarkResponse.result);

          // 댓글 목록 조회
          const commentResponse = await getReadingSpotCommentListAPI(
            Number(id),
            1,
            10,
          );
          if (commentResponse.isSuccess) {
            // 각 댓글의 userId로 사용자 정보 가져오기
            const commentWithUserInfo = await Promise.all(
              commentResponse.result.comments.map(async (comment) => {
                try {
                  const userResponse = await getUserByIdAPI(comment.userId);
                  if (userResponse.isSuccess) {
                    return {
                      ...comment,
                      nickName: userResponse.result.nickName,
                      profileImageUrl: userResponse.result.profileImageUrl,
                    };
                  }
                } catch (error) {
                  console.error(
                    `사용자 ${comment.userId} 정보 조회 실패:`,
                    error,
                  );
                }
                return {
                  ...comment,
                  nickName: "사용자",
                  profileImageUrl: "",
                };
              }),
            );

            setCommentList(commentWithUserInfo);
            setTotalComments(commentResponse.result.totalElements);
          }
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: keyboardHeight + 80 }}
          showsVerticalScrollIndicator={false}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                if (fromScreen === "milestone") {
                  // 이정표에서 온 경우
                  router.push("/(tabs)/milestone");
                } else if (fromScreen === "itinerary") {
                  // 일정짜기에서 온 경우
                  router.push("/itinerary");
                } else if (fromScreen === "maruBookmark") {
                  // maru/bookmark에서 온 경우
                  router.push("/(tabs)/maru/bookmark");
                } else {
                  // 기본 뒤로가기
                  router.back();
                }
              }}
            >
              <BackIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>옆으로 넘겨보세요</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* 메인 카드 */}
          {/* 메인 카드와 소셜미디어 포스트를 가로 스크롤로 함께 넘기기 */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContainer}
          >
            {/* 메인 카드 */}
            <View style={styles.mainCardContainer}>
              <BookmarkTemplate
                width={360}
                height={360}
                templateId={bookmarkDetail.templateId}
              />
              <View style={styles.mainCard}>
                <Image
                  source={{ uri: bookmarkDetail.readingSpotImages[0] }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />

                {/* 카드 내용 */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{bookmarkDetail.title}</Text>
                  <Text style={styles.cardAddress}>
                    {bookmarkDetail.address}
                  </Text>
                </View>
              </View>
            </View>

            {/* 소셜미디어 포스트 */}
            <View style={styles.socialPost}>
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: bookmarkDetail.userProfilImage }}
                  style={styles.userAvatar}
                />
                <Text style={styles.username}>
                  {bookmarkDetail.userNickname}
                </Text>
                <Text style={styles.postDate}>
                  {formatDate(bookmarkDetail.createdAt)}
                </Text>
              </View>

              <Text style={styles.postContent}>{bookmarkDetail.content}</Text>

              <View style={styles.bookRecommendation}>
                <Image
                  source={{ uri: bookmarkDetail.bookImage }}
                  style={styles.bookCover}
                />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>
                    {bookmarkDetail.bookTitle}
                  </Text>
                  <Text style={styles.bookAuthor}>
                    {bookmarkDetail.bookAuthor}
                  </Text>
                  <View style={styles.bookYearContainer}>
                    <Text style={styles.bookYear}>
                      {bookmarkDetail.bookPubDate?.split("-")[0] ||
                        bookmarkDetail.bookPubDate}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* 상호작용 및 메타데이터 */}
          <View style={styles.interactionSection}>
            <TouchableOpacity
              style={styles.bookmarkLocation}
              onPress={() => {
                if (bookmarkDetail.latitude && bookmarkDetail.longitude) {
                  // 전역 뷰포트에 책갈피 위치 저장
                  setViewport({
                    north: bookmarkDetail.latitude + 0.01,
                    south: bookmarkDetail.latitude - 0.01,
                    east: bookmarkDetail.longitude + 0.01,
                    west: bookmarkDetail.longitude - 0.01,
                    center: {
                      lat: bookmarkDetail.latitude,
                      lng: bookmarkDetail.longitude,
                    },
                    zoom: 3,
                  });

                  // 이정표 화면으로 이동
                  router.push("/(tabs)/milestone");
                }
              }}
            >
              <Text style={styles.bookmarkLocationText}>
                이 책갈피 위치 &gt;
              </Text>
            </TouchableOpacity>

            <View style={styles.statsContainer}>
              <TouchableOpacity style={styles.statItem} onPress={toggleScrap}>
                <ScrapIcon
                  isActive={bookmarkDetail.scraped}
                  color={bookmarkDetail.scraped ? "#56AC70" : "#C5BFBB"}
                />
                <Text style={styles.statNumber}>{bookmarkDetail.scraps}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.statItem} onPress={toggleLike}>
                <FilledHeartIcon
                  isActive={bookmarkDetail.liked}
                  color={bookmarkDetail.liked ? "#E55E5E" : "#C5BFBB"}
                />
                <Text style={styles.statNumber}>{bookmarkDetail.likes}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 댓글 섹션 */}
          <View style={styles.commentsSection}>
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontFamily: "SUIT-600",
                marginBottom: 15,
              }}
            >
              댓글 ({totalComments})
            </Text>
            {commentList.length > 0 ? (
              commentList.map((comment) => (
                <ChallengeComment
                  key={comment.commentId}
                  userName={comment.nickName || `사용자 ${comment.userId}`}
                  date={formatDate(comment.createdAt)}
                  text={comment.commentContent}
                  color="#FFFFFF"
                  userProfileImageUrl={comment.profileImageUrl}
                />
              ))
            ) : (
              <Text
                style={{ color: "#FFFFFF", fontSize: 14, textAlign: "center" }}
              >
                아직 댓글이 없습니다.
              </Text>
            )}
          </View>
        </ScrollView>

        {/* 댓글 입력 */}
        <View
          style={[
            styles.commentInputContainer,
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: insets.bottom,
            },
          ]}
        >
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 남겨주세요"
            placeholderTextColor="#9D9896"
            value={comment}
            onChangeText={setComment}
            multiline={false}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSubmitComment}
          >
            <Text style={styles.sendButtonText}>
              {comment.trim() ? "등록" : "등록"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#262423",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    textAlign: "center",
    flex: 1,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },

  mainCard: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "transparent",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 16,
  },
  cardImage: {
    width: "93%",
    height: 245,
    borderRadius: 12,
    alignSelf: "center",
  },
  imageIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E0E0E0",
  },
  activeIndicator: {
    backgroundColor: "#FFFFFF",
  },
  cardContent: {
    padding: 20,
    alignItems: "flex-start",
    width: "100%",
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: "Gangwon",
    color: "#262423",
    marginBottom: 8,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  cardAddress: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#000000",
    textAlign: "left",
    alignSelf: "flex-start",
  },

  interactionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 10,
  },
  bookmarkLocation: {
    paddingVertical: 8,
  },
  bookmarkLocationText: {
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#FFFFFF",
    textDecorationLine: "underline",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statNumber: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
  commentsSection: {
    paddingHorizontal: 20,
    flexDirection: "column",
    gap: 15,
    width: "100%",
  },

  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#302E2D",
  },
  horizontalScrollContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  mainCardContainer: {
    position: "relative",
    alignItems: "center",
  },
  socialPost: {
    width: 320,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E3F2FD",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E0E0E0",
  },

  username: {
    fontSize: 16,
    fontFamily: "Gangwon",
    color: "#716C69",
  },
  postDate: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#C5BFBB",
  },
  postContent: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#000000",
    lineHeight: 23,
    marginBottom: 16,
  },
  bookRecommendation: {
    flexDirection: "row",
    backgroundColor: "#EEE9E6",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    position: "relative",
  },
  bookCover: {
    width: 50,
    height: 70,
    borderRadius: 6,
    marginRight: 12,
  },
  bookInfo: {
    flexDirection: "column",
    gap: 4,
    paddingTop: 2,
    width: "75%",
  },
  bookTitle: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  bookAuthor: {
    fontSize: 12,
    fontFamily: "SUIT-400",
    color: "#716C69",
    marginBottom: 4,
  },
  bookMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bookYearContainer: {
    backgroundColor: "#C5BFBB",
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  bookYear: {
    fontSize: 11,
    fontFamily: "SUIT-600",
    color: "#EEE9E6",
  },

  commentInput: {
    flex: 1,
    height: 45,
    backgroundColor: "#302E2D",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: "SUIT-500",
    marginRight: 10,
    color: "#FFFFFF",
  },
  sendButton: {
    backgroundColor: "#302E2D",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#C5BFBB",
    fontSize: 14,
    fontFamily: "SUIT-700",
  },
});
