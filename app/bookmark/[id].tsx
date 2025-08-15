import BackIcon from "@/components/icons/BackIcon";
import BookmarkTemplate from "@/components/icons/bookmarkTemplate/BookmarkTemplate";
import FilledHeartIcon from "@/components/icons/FilledHeartIcon";
import ScrapIcon from "@/components/icons/ScrapIcon";
import ChallengeComment from "@/components/maruChallenge/detail/comment";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookmarkDetail() {
  const { id, imageUrl, title, address, templateId } = useLocalSearchParams();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comment, setComment] = useState("");

  // API 데이터 형식에 맞춘 예시 데이터
  const bookmarkData = {
    readingSpotId: 1,
    address: "서울특별시 중구 세종대로 110",
    latitude: 37.5665,
    longitude: 126.978,
    templateId: 1,
    title: "개발자의 독서 공간",
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
        commentContent: "와대박",
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
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          카드를 터치해 뒷면도 확인해보세요
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
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

        {/* 상호작용 및 메타데이터 */}
        <View style={styles.interactionSection}>
          <TouchableOpacity style={styles.bookmarkLocation}>
            <Text style={styles.bookmarkLocationText}>이 책갈피 위치 &gt;</Text>
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
      <View style={styles.commentInputContainer}>
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
  mainCardContainer: {
    position: "relative",
    alignItems: "center",
    margin: 20,
    marginBottom: 10,
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
  bookInfo: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "center",
  },
  bookImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  bookDetails: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 25,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginBottom: 2,
  },
  bookPubDate: {
    fontSize: 12,
    fontFamily: "SUIT-400",
    color: "#9D9896",
  },
  content: {
    fontSize: 16,
    fontFamily: "SUIT-400",
    color: "#262423",
    lineHeight: 24,
    marginBottom: 20,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tags: {
    flexDirection: "row",
    gap: 5,
  },
  tagArrow: {
    fontSize: 16,
    color: "#4CAF50",
  },
  locationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  locationButtonText: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#EEE9E6",
  },
  interactionSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 30,
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
    backgroundColor: "##262423",
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
