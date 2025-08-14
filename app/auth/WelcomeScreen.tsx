import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const handleSignUp = () => {
    // 회원가입 화면으로 이동
    console.log("SignUpScreen으로 이동");
    router.push("/auth/signup");
  };

  const handleSignIn = () => {
    // 로그인 화면으로 이동
    console.log("SignInScreen으로 이동");
    router.push("/auth/signin");
  };

  const handleContact = () => {
    // 문의하기 로직
    console.log("문의하기 클릭");
  };

  const handleBrowse = () => {
    // 둘러보기 로직
    console.log("둘러보기 클릭");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 메인 콘텐츠 영역 */}
      <View style={styles.content}>
        {/* 앱 아이콘/일러스트 영역 */}
        <View style={styles.iconContainer}>
          <Text style={styles.iconPlaceholder}>일러스트 or 앱아이콘</Text>
        </View>

        {/* 앱 소개 텍스트 */}
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>책 타고 떠나는 느린 여행</Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>서</Text>
            <Text style={styles.title}>행</Text>
          </View>
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
            <Text style={styles.buttonText}>로그인하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  iconPlaceholder: {
    fontSize: 12,
    color: "#9E9E9E",
    textAlign: "center",
    lineHeight: 16,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  subtitle: {
    fontSize: 16,
    color: "#424242",
    fontFamily: "SUIT-500",
    marginBottom: 12,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontFamily: "Gangwon",
    color: "#212121",
    textAlign: "center",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 40,
  },
  signUpButton: {
    backgroundColor: "#424242",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#757575",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SUIT-500",
  },

  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#757575",
    paddingHorizontal: 16,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: "#E0E0E0",
  },
});
