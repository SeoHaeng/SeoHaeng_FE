import BackIcon from "@/components/icons/BackIcon";
import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChallengeInfoScreen() {
  const handleBack = () => {
    router.push("/maru/challenge");
  };

  const handleConfirm = () => {
    router.push("/maru/challenge");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>북 챌린지 설명</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            북 챌린지 📚..{"\n"}어떻게 참여하나요?
          </Text>

          <Text style={styles.memberOnly}>[서행] 회원만 참여 가능</Text>
        </View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {/* Step 1 */}
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                이 서점의 북 챌린지 책을 수령해요.
              </Text>
              <Text style={styles.stepDescription}>
                • 이전 참여자가 남긴 책이 전달되며, 어떤 책인지 미리 알 수
                없어요.
              </Text>
            </View>
          </View>

          {/* Step 2 */}
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                다음 참여자를 위해 책 한 권을 구입해 이 곳에 남겨주세요.
              </Text>
            </View>
          </View>

          {/* Step 3 */}
          <View style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>
                [서행]에 접속해 챌린지 인증을 해주세요.
              </Text>
              <Text style={styles.stepDescription}>
                • 선물받고, 선물한 책은 어플에 등록되어 있어요.
              </Text>
              <Text style={styles.stepDescription}>
                • 버튼만 누르면 인증 끝! ✨
              </Text>
              <Text style={styles.stepDescription}>
                • 다음 사람에게 책과 함께 글도 남길 수 있어요.
              </Text>
              <Text style={styles.stepDescription}>
                • 7일 이내로 인증하지 않으면, 자동으로 책 정보가 입력된 게시글이
                등록돼요.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>확인했어요!</Text>
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
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3A3A",
  },
  backButton: {
    padding: 8,
    position: "absolute",
    left: 20,
    top: 20,
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: "SUIT-700",
    color: "#F8F4F2",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    paddingVertical: 30,
    paddingBottom: 50,
  },
  mainTitle: {
    fontSize: 23,
    fontFamily: "SUIT-700",
    color: "#FFFFFF",
    marginBottom: 8,
    lineHeight: 32,
  },
  memberOnly: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  stepsContainer: {
    paddingBottom: 30,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    marginTop: 4,
  },
  stepNumberText: {
    fontSize: 15,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
    lineHeight: 24,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    lineHeight: 20,
    marginBottom: 4,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
  },
  confirmButton: {
    backgroundColor: "#716C69",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 15,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
});
