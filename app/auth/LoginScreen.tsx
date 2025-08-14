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

export default function LoginScreen() {
  const handleSignUp = () => {
    // 회원가입 로직
    console.log("회원가입 버튼 클릭");
  };

  const handleLogin = () => {
    // 로그인 로직
    console.log("로그인 버튼 클릭");
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
          <Text style={styles.title}>서행</Text>
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>로그인하기</Text>
          </TouchableOpacity>
        </View>

        {/* 하단 링크 영역 */}
        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={handleContact}>
            <Text style={styles.linkText}>문의하기</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity onPress={handleBrowse}>
            <Text style={styles.linkText}>둘러보기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5", // 밝은 베이지/오프화이트 배경
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
    backgroundColor: "#E0E0E0", // 연한 회색 원형 배경
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
    marginBottom: 80,
  },
  subtitle: {
    fontSize: 16,
    color: "#424242",
    marginBottom: 8,
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#212121",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 40,
  },
  signUpButton: {
    backgroundColor: "#424242", // 진한 회색
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#757575", // 중간 회색
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
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
