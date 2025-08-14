import { router } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpCompleteScreen() {
  const handleGoToMain = () => {
    // 홈 화면으로 이동
    console.log("홈 화면으로 이동");
    router.push("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 회원가입 완료 메시지 */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageTitle}>회원가입이</Text>
        <Text style={styles.messageTitle}>완료되었습니다!</Text>
      </View>

      {/* 중앙 일러스트/아이콘 플레이스홀더 */}
      <View style={styles.iconContainer}>
        <Text style={styles.iconPlaceholder}>일러스트 or 앱아이콘</Text>
      </View>

      {/* 메인 화면으로 가기 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.mainButton} onPress={handleGoToMain}>
          <Text style={styles.mainButtonText}>메인 화면으로 가기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
  },
  messageContainer: {
    alignItems: "flex-start",
    marginTop: 80,
    marginBottom: 60,
    marginLeft: 20,
  },
  messageTitle: {
    fontSize: 24,
    fontFamily: "SUIT-700",
    color: "#212121",
    lineHeight: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 60,
  },
  iconPlaceholder: {
    fontSize: 12,
    color: "#9E9E9E",
    textAlign: "center",
    lineHeight: 16,
  },
  buttonContainer: {
    width: "100%",
    marginTop: "auto",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  mainButton: {
    backgroundColor: "#302E2D",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#302E2D",
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    alignSelf: "stretch",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SUIT-600",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});
