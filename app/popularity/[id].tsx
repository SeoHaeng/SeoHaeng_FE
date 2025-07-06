// app/maru/popularity/[id].tsx
import ChallengeComment from "@/components/maruChallenge/detail/comment";
import GiftBook from "@/components/maruChallenge/detail/giftBook";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
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
  const navigation = useNavigation();
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
          onPress={navigation.goBack}
          style={{ position: "absolute", top: 20, left: 20, zIndex: 1 }}
        >
          <Image source={require("@/assets/images/BackWhite.png")} />
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
                fontSize: 13,
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
        <TextInput
          style={styles.commentInput}
          placeholder="댓글을 남겨주세요"
          placeholderTextColor="#9D9896"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>등록</Text>
        </TouchableOpacity>
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
  profileImage: {
    width: 43,
    height: 43,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  userHeader: {
    flexDirection: "column",
    gap: 5,
  },
  username: {
    fontSize: 14,
    fontFamily: "SUIT-700",
  },
  timeStamp: {
    fontSize: 10,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
  },
  title: {
    fontSize: 18,
    fontFamily: "SUIT-700",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    lineHeight: 20,
  },

  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#C5BFBB",
    borderTopWidth: 1,
    borderTopColor: "#E8E3E0",
    gap: 12,
  },
  commentInput: {
    flex: 1,
    height: 45,
    width: "100%",
    backgroundColor: "#F5F2F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontFamily: "SUIT-500",
    fontSize: 13,
  },
  sendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    position: "absolute",
    right: 16,
    top: 16,
  },
  sendButtonText: {
    color: "#302E2D",
    fontFamily: "SUIT-700",
    fontSize: 13,
  },
});
