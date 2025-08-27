// app/popularity/[id].tsx
import BackIcon from "@/components/icons/BackIcon";
import ChallengeComment from "@/components/maruChallenge/detail/comment";
import GiftBook from "@/components/maruChallenge/detail/giftBook";
import {
    getBookChallengeCommentListAPI,
    getBookChallengeDetailAPI,
    getUserByIdAPI,
} from "@/types/api";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
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
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "오늘";
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
        <Image
          source={
            challengeDetail?.proofImageUrls?.[0]
              ? { uri: challengeDetail.proofImageUrls[0] }
              : require("@/assets/images/인기챌린지 책.png")
          }
          style={{ width: 404, height: 404 }}
        />
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
          <Text style={styles.description}>
            {challengeDetail?.proofContent || ""}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <GiftBook
              title={challengeDetail?.receivedBookTitle || ""}
              author={challengeDetail?.receivedBookAuthor || ""}
              status="선물받은 책"
            />
            <GiftBook
              title={challengeDetail?.givenBookTitle || ""}
              author={challengeDetail?.givenBookAuthor || ""}
              status="선물할 책"
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
              <Image source={require("@/assets/images/Heart.png")} />
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "SUIT-500",
                  color: "#C5BFBB",
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
            bottom: insets.bottom + keyboardHeight,
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
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>등록</Text>
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
    lineHeight: 20,
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
    backgroundColor: "#F5F3F2",
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
});
