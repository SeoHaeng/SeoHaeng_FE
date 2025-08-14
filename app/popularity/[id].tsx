// app/popularity/[id].tsx
import BackIcon from "@/components/icons/BackIcon";
import ChallengeComment from "@/components/maruChallenge/detail/comment";
import GiftBook from "@/components/maruChallenge/detail/giftBook";
import { useFocusEffect, useRouter } from "expo-router";
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

export default function ChallengeDetail() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 네비게이션 스택 안정화를 위한 focus effect
  useFocusEffect(
    useCallback(() => {
      // 페이지가 포커스될 때 네비게이션 스택 상태 확인
      return () => {
        // 페이지가 포커스를 잃을 때 정리 작업
      };
    }, []),
  );

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
          source={require("@/assets/images/인기챌린지 책.png")}
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
              source={require("@/assets/images/인기챌린지 사진.png")}
              style={styles.profileImage}
            />
            <View style={styles.userHeader}>
              <Text style={styles.username}>유딘딘</Text>
              <Text style={styles.timeStamp}>1일 전</Text>
            </View>
          </View>
          <Text style={styles.description}>
            대박 이 책을 받을 줄은 몰랐어요 잘 읽겠습니다 강릉 여행와서 기분이
            너무 좋네요
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <GiftBook
              title="물고기는 존재하지 않는다"
              author="룰루 밀러 / 정지인"
              status="선물받은 책"
            />
            <GiftBook
              title="물고기는 존재하지 않는다"
              author="룰루 밀러 / 정지인"
              status="선물할 책"
            />
          </View>
          <Text style={styles.description}>
            대박 이 책을 받을 줄은 몰랐어요 잘 읽겠습니다 강릉 여행와서 기분이
            너무 좋네요
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
              댓글 (2)
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
                65
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "column", gap: 25 }}>
            <ChallengeComment
              userName="책벌레 501"
              date="25.05.13"
              text="저도 저 책 읽어봐야 겠어요! 사진 감성 너무 조아요. . 힐링"
            />
            <ChallengeComment
              userName="책벌레 501"
              date="25.05.13"
              text="저도 저 책 읽어봐야 겠어요! 사진 감성 너무 조아요. . 힐링"
            />
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
