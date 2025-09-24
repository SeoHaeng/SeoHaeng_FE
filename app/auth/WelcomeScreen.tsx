import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
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
    try {
      router.push("/auth/signin");
    } catch (error) {
      console.error("로그인 화면 이동 실패:", error);
      // 에러 발생 시 navigate로 시도
      try {
        router.navigate("/auth/signin");
      } catch (navigateError) {
        console.error("navigate도 실패:", navigateError);
      }
    }
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
          <Image
            source={require("../../assets/images/illu.png")}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* 앱 소개 텍스트 */}
        <View style={styles.textContainer}>
          <Text style={styles.subtitle} allowFontScaling={false}>
            책 타고 떠나는 느린 강원도 여행
          </Text>
          <View style={styles.titleContainer}>
            <Text style={styles.title} allowFontScaling={false}>
              서
            </Text>
            <Text style={styles.title} allowFontScaling={false}>
              행
            </Text>
          </View>
        </View>

        {/* 버튼 영역 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.buttonText} allowFontScaling={false}>
              회원가입
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
            <Text style={styles.loginButtonText} allowFontScaling={false}>
              로그인하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4F2",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 200,
    height: 200,

    marginBottom: 40,
  },
  illustration: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  subtitle: {
    fontSize: 17,
    color: "#424242",
    fontFamily: "SUIT-500",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "500", // 폰트 로딩 실패 시 대체
  },
  title: {
    fontSize: 33,
    fontFamily: "Gangwon",
    color: "#212121",
    textAlign: "center",
    fontWeight: "600", // 폰트 로딩 실패 시 대체
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
    backgroundColor: "#302E2D",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#C5BFBB",
    borderWidth: 1,
    borderColor: "#9D9896",
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
  loginButtonText: {
    color: "#262423",
    fontSize: 16,
    fontFamily: "SUIT-500",
  },

  linkContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    fontSize: 15,
    color: "#757575",
    paddingHorizontal: 16,
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: "#E0E0E0",
  },
});
