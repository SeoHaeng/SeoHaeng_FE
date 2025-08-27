// app/popularity/[id].tsx
import BackIcon from "@/components/icons/BackIcon";
import FilledHeartIcon from "@/components/icons/FilledHeartIcon";
import PlaceIcon from "@/components/icons/PlaceIcon";
import ChallengeComment from "@/components/maruChallenge/detail/comment";
import GiftBook from "@/components/maruChallenge/detail/giftBook";
import {
  createBookChallengeCommentAPI,
  getBookChallengeCommentListAPI,
  getBookChallengeDetailAPI,
  getUserByIdAPI,
  toggleBookChallengeLikeAPI,
} from "@/types/api";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
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

export default function ChallengeDetail() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [challengeDetail, setChallengeDetail] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [commentList, setCommentList] = useState<any[]>([]);
  const [totalComments, setTotalComments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // 네비게이션 스택 안정화를 위한 focus effect
  useFocusEffect(
    useCallback(() => {
      // 페이지가 포커스될 때 네비게이션 스택 상태 확인
      return () => {
        // 페이지가 포커스를 잃을 때 정리 작업
      };
    }, []),
  );

  // 북챌린지 상세 정보 조회
  useEffect(() => {
    const fetchChallengeDetail = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const response = await getBookChallengeDetailAPI(Number(id));
        if (response.isSuccess) {
          setChallengeDetail(response.result);

          // 작성자 정보 조회
          const userResponse = await getUserByIdAPI(response.result.creatorId);
          if (userResponse.isSuccess) {
            setUserInfo(userResponse.result);
          }

          // 댓글 목록 조회
          const commentResponse = await getBookChallengeCommentListAPI(
            Number(id),
            1,
            10,
          );
          if (commentResponse.isSuccess) {
            setCommentList(commentResponse.result.getBookChallengeCommentList);
            setTotalComments(commentResponse.result.totalElements);
          }
        }
      } catch (error) {
        console.error("북챌린지 상세 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallengeDetail();
  }, [id]);

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

  // 좋아요 토글 함수
  const toggleLike = async () => {
    if (!id) return;

    try {
      const response = await toggleBookChallengeLikeAPI(Number(id));

      if (response.isSuccess) {
        // 좋아요 상태 토글
        setChallengeDetail((prev: any) => ({
          ...prev,
          likedByMe: !prev?.likedByMe,
          likes: response.result.nowLikeCount,
        }));
      }
    } catch (error) {
      console.error("좋아요 토글 실패:", error);
    }
  };

  // 댓글 등록 함수
  const submitComment = async () => {
    if (!commentText.trim() || !id) return;

    try {
      setIsSubmittingComment(true);
      const response = await createBookChallengeCommentAPI(
        Number(id),
        commentText.trim(),
      );

      if (response.isSuccess) {
        // 댓글 등록 성공 시 입력창 초기화
        setCommentText("");

        // 댓글 목록 새로고침
        const commentResponse = await getBookChallengeCommentListAPI(
          Number(id),
          1,
          10,
        );
        if (commentResponse.isSuccess) {
          setCommentList(commentResponse.result.getBookChallengeCommentList);
          setTotalComments(commentResponse.result.totalElements);
        }
      }
    } catch (error) {
      console.error("댓글 등록 실패:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        position: "relative",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/*  <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      > */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: keyboardHeight + 80,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              // 네비게이션 스택이 비어있으면 기본적으로 인기챌린지 목록으로
              router.push("/popularity");
            }
          }}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 1,
            width: 44,
            height: 44,
            justifyContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <BackIcon color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x /
                  Dimensions.get("window").width,
              );
              setCurrentImageIndex(index);
            }}
            style={styles.imageScrollView}
          >
            {challengeDetail?.proofImageUrls?.map(
              (imageUrl: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: imageUrl }}
                  style={styles.challengeImage}
                  resizeMode="cover"
                />
              ),
            ) || (
              <Image
                source={require("@/assets/images/인기챌린지 책.png")}
                style={styles.challengeImage}
              />
            )}
          </ScrollView>

          {/* 이미지 개수 표시 */}
          {challengeDetail?.proofImageUrls &&
            challengeDetail.proofImageUrls.length > 1 && (
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1} /{" "}
                  {challengeDetail.proofImageUrls.length}
                </Text>
              </View>
            )}
        </View>
        <View
          style={{
            padding: 20,
            borderBottomColor: "#E8E3E0",
            borderBottomWidth: 7,
          }}
        >
          <View style={styles.userInfo}>
            <Image
              source={
                userInfo?.profileImageUrl
                  ? { uri: userInfo.profileImageUrl }
                  : require("@/assets/images/인기챌린지 사진.png")
              }
              style={styles.profileImage}
            />
            <View style={styles.userHeader}>
              <Text style={styles.username}>
                {userInfo?.nickName || "사용자"}
              </Text>
              <Text style={styles.timeStamp}>
                {challengeDetail?.createdAt
                  ? formatDateToDaysAgo(challengeDetail.createdAt)
                  : ""}
              </Text>
            </View>
          </View>
          {/* 서점 정보 */}
          <View style={styles.bookstoreInfo}>
            <PlaceIcon />
            <Text style={styles.bookstoreName}>
              {challengeDetail?.bookStoreName || "서점명 없음"}
            </Text>
          </View>
          <Text style={styles.description}>
            {challengeDetail?.proofContent || ""}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <GiftBook
              title={challengeDetail?.receivedBookTitle || ""}
              author={challengeDetail?.receivedBookAuthor || ""}
              status="선물받은 책"
              bookImage={
                challengeDetail?.receivedBookImage
                  ? { uri: challengeDetail.receivedBookImage }
                  : undefined
              }
            />
            <GiftBook
              title={challengeDetail?.givenBookTitle || ""}
              author={challengeDetail?.givenBookAuthor || ""}
              status="선물할 책"
              bookImage={
                challengeDetail?.givenBookImage
                  ? { uri: challengeDetail.givenBookImage }
                  : undefined
              }
            />
          </View>
          <Text style={styles.description}>
            {challengeDetail?.presentMessage || ""}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "column",
            padding: 20,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingBottom: 25,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: "SUIT-500",
                color: "#716C69",
              }}
            >
              댓글 ({totalComments})
            </Text>
            <View
              style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
            >
              <TouchableOpacity onPress={toggleLike} activeOpacity={0.7}>
                <FilledHeartIcon
                  color="#FF6B6B"
                  isActive={challengeDetail?.likedByMe || false}
                  width={17}
                  height={17}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "SUIT-500",
                  color: "#C5BFBB",
                  marginLeft: 4,
                }}
              >
                {challengeDetail?.likes || 0}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "column", gap: 25 }}>
            {commentList.map((comment, index) => (
              <ChallengeComment
                key={index}
                userName={comment.nickname}
                date={formatDateToDaysAgo(comment.createdAt)}
                text={comment.comment}
                userProfileImageUrl={comment.userProfileImageUrl}
              />
            ))}
          </View>
        </View>
      </ScrollView>

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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F8F4F2",
            width: "100%",
            height: 45,
            borderRadius: 10,
          }}
        >
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 남겨주세요"
            placeholderTextColor="#9D9896"
            value={commentText}
            onChangeText={setCommentText}
            multiline={false}
          />
          <TouchableOpacity style={styles.sendButton} onPress={submitComment}>
            <Text style={styles.sendButtonText}>
              {isSubmittingComment ? "등록 중..." : "등록"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/*  </KeyboardAvoidingView> */}
    </SafeAreaView>
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
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userHeader: {
    flexDirection: "column",
    gap: 3,
  },
  username: {
    fontSize: 14,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  timeStamp: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  description: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#000000",
    lineHeight: 25,
    marginBottom: 15,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#DBD6D3",
  },
  commentInput: {
    flex: 1,
    height: 45,
    backgroundColor: "#F8F4F2",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    fontFamily: "SUIT-500",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#F8F4F2",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#302E2D",
    fontSize: 14,
    fontFamily: "SUIT-700",
  },

  bookstoreInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 5,
    marginBottom: 30,
    marginLeft: 10,
  },
  bookstoreIcon: {
    width: 16,
    height: 16,
  },
  bookstoreName: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 404,
  },
  imageScrollView: {
    width: "100%",
    height: 404,
  },
  challengeImage: {
    width: Dimensions.get("window").width,
    height: 404,
  },
  imageCounter: {
    position: "absolute",
    bottom: 15,
    right: 15,
    backgroundColor: "rgba(217, 217, 217, 0.33)",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  imageCounterText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "SUIT-600",
  },
});
