import BackIcon from "@/components/icons/BackIcon";
import BookmarkTemplate from "@/components/icons/bookmarkTemplate/BookmarkTemplate";
import FilledHeartIcon from "@/components/icons/FilledHeartIcon";
import ScrapIcon from "@/components/icons/ScrapIcon";
import ChallengeComment from "@/components/maruChallenge/detail/comment";
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
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookmarkDetail() {
  const { id, title, address, from } = useLocalSearchParams();
  const router = useRouter();
  const [fromScreen, setFromScreen] = useState<string>("");

  // 파라미터에서 출발 화면 정보 가져오기
  useEffect(() => {
    if (from) {
      setFromScreen(from as string);
      console.log("🔖 북마크 상세 화면 진입 - 출발 화면:", from);
    }
  }, [from]);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comment, setComment] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

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

  // API 데이터 형식에 맞춘 예시 데이터 (전달받은 파라미터 사용)
  const bookmarkData = {
    readingSpotId: Number(id) || 1,
    address: address || "서울특별시 중구 세종대로 110",
    latitude: 37.5665,
    longitude: 126.978,
    templateId: 1,
    title: title || "개발자의 독서 공간",
    content:
      "이 책은 개발자 삶에 대한 통찰을 담고 있습니다. 광화문 근처 카페에서 읽으면 좋아요.",
    readingSpotImages: [
      "https://shopping-phinf.pstatic.net/main_5441999/54419996237.20250429093306.jpg",
      "https://shopping-phinf.pstatic.net/main_3248337/32483376086.20250627083930.jpg",
    ],
    bookTitle: "오늘도 개발자를 꿈꾸다",
    bookAuthor: "이소정",
    bookImage:
      "https://shopping-phinf.pstatic.net/main_5441999/54419996237.20250429093306.jpg",
    bookPubDate: "2022-05-10",
    likes: 0,
    scraps: 0,
    opened: true,
    comments: [
      {
        commentId: 3,
        createdAt: "2025-08-05",
        userId: 1,
        commentContent: "와박",
      },
      {
        commentId: 2,
        createdAt: "2025-08-05",
        userId: 1,
        commentContent: "와대박",
      },
      {
        commentId: 1,
        createdAt: "2025-08-05",
        userId: 1,
        commentContent: "와대박",
      },
    ],
  };

  const handleSubmitComment = () => {
    if (comment.trim()) {
      // 댓글 등록 로직
      console.log("댓글 등록:", comment);
      setComment("");
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
                templateId={bookmarkData.templateId}
              />
              <View style={styles.mainCard}>
                <Image
                  source={{ uri: bookmarkData.readingSpotImages[0] }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />

                {/* 카드 내용 */}
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{bookmarkData.title}</Text>
                  <Text style={styles.cardAddress}>{bookmarkData.address}</Text>
                </View>
              </View>
            </View>

            {/* 소셜미디어 포스트 */}
            <View style={styles.socialPost}>
              <View style={styles.postHeader}>
                <View style={styles.userAvatar} />

                <Text style={styles.username}>유딘딘</Text>
                <Text style={styles.postDate}>2025.05.13 토</Text>
              </View>

              <Text style={styles.postContent}>
                안목해변 가서 책 읽었다. 사람이 많기는 한데 독서 스팟을 잘
                찾으면 책 읽기에 베리베리 굿굿이다ㅎㅎ 좌표 남길테니 다른 분들도
                여기서 함 읽어보시길 은근 집중이 잘 돼서 한 100페이지 읽은 거
                같다... + 바다 짠 냄새 나서 매운탕 땡긴다: 🌊 이따 집 가는 길에
                매운탕 포장해서 가야겠삼 야호
              </Text>

              <View style={styles.bookRecommendation}>
                <Image
                  source={{
                    uri: "https://shopping-phinf.pstatic.net/main_5441999/54419996237.20250429093306.jpg",
                  }}
                  style={styles.bookCover}
                />
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>물고기는 존재하지 않는다</Text>
                  <Text style={styles.bookAuthor}>룰루 밀러 / 정지인</Text>
                  <View style={styles.bookYearContainer}>
                    <Text style={styles.bookYear}>2022</Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* 상호작용 및 메타데이터 */}
          <View style={styles.interactionSection}>
            <TouchableOpacity style={styles.bookmarkLocation}>
              <Text style={styles.bookmarkLocationText}>
                이 책갈피 위치 &gt;
              </Text>
            </TouchableOpacity>

            <View style={styles.statsContainer}>
              <TouchableOpacity
                style={styles.statItem}
                onPress={() => setIsBookmarked(!isBookmarked)}
              >
                <ScrapIcon isActive={isBookmarked} />
                <Text style={styles.statNumber}>{bookmarkData.scraps}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.statItem}
                onPress={() => setIsLiked(!isLiked)}
              >
                <FilledHeartIcon isActive={isLiked} />
                <Text style={styles.statNumber}>{bookmarkData.likes}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 댓글 섹션 */}
          <View style={styles.commentsSection}>
            {bookmarkData.comments.map((comment) => (
              <ChallengeComment
                key={comment.commentId}
                userName={`사용자 ${comment.userId}`}
                date={comment.createdAt}
                text={comment.commentContent}
                color="#FFFFFF"
              />
            ))}
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
              bottom: keyboardHeight,
            },
          ]}
        >
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 남겨주세요"
            placeholderTextColor="#9D9896"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSubmitComment}
          >
            <Text style={styles.sendButtonText}>등록</Text>
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
    gap: 13,
    width: "100%",
  },

  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#262423",
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
  },
  bookTitle: {
    fontSize: 14,
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
    paddingHorizontal: 4,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  bookYear: {
    fontSize: 12,
    fontFamily: "SUIT-600",
    color: "#EEE9E6",
  },

  commentInput: {
    flex: 1,
    height: 45,
    backgroundColor: "#302E2D",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: "SUIT-500",
    marginRight: 0,
  },
  sendButton: {
    backgroundColor: "#302E2D",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
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
