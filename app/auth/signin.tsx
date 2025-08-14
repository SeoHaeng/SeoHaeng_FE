import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackIcon from "../../components/icons/BackIcon";
import GoogleLoginIcon from "../../components/icons/GoogleLoginIcon";
import KakaoLoginIcon from "../../components/icons/KakaoLoginIcon";
import NaverLoginIcon from "../../components/icons/NaverLoginIcon";

const { width, height } = Dimensions.get("window");

export default function SignInScreen() {
  const [email, setEmail] = useState("rkddbwls07 / rkddbwls07@gmail.com");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);

  const handleBack = () => {
    // WelcomeScreen으로 이동
    console.log("WelcomeScreen으로 이동");
    router.back();
  };

  const handleLogin = () => {
    // 로그인 로직
    console.log("로그인하기 클릭", { email, password, autoLogin });
  };

  const handleFindId = () => {
    // 아이디 찾기 로직
    console.log("아이디 찾기 클릭");
  };

  const handleFindPassword = () => {
    // 비밀번호 찾기 로직
    console.log("비밀번호 찾기 클릭");
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 로직
    console.log("카카오 로그인 클릭");
  };

  const handleNaverLogin = () => {
    // 네이버 로그인 로직
    console.log("네이버 로그인 클릭");
  };

  const handleGoogleLogin = () => {
    // 구글 로그인 로직
    console.log("구글 로그인 클릭");
  };

  const handleSignUp = () => {
    // 회원가입 화면으로 이동
    console.log("회원가입하기 클릭");
    router.push("/auth/signup");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>로그인 해주세요.</Text>
      </View>

      {/* 로그인 폼 */}
      <View style={styles.formContainer}>
        {/* 이메일/아이디 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>아이디 또는 이메일 주소</Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            placeholder="아이디 또는 이메일 주소를 입력하세요"
            placeholderTextColor="#9E9E9E"
          />
        </View>

        {/* 비밀번호 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>비밀번호</Text>
          <TextInput
            style={styles.textInput}
            value={password}
            onChangeText={setPassword}
            placeholder="영문, 숫자, 특수문자 포함 8-12자"
            placeholderTextColor="#9E9E9E"
            secureTextEntry
          />
        </View>

        {/* 추가 옵션 */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAutoLogin(!autoLogin)}
          >
            <View
              style={[styles.checkbox, autoLogin && styles.checkboxChecked]}
            >
              {autoLogin && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>자동 로그인</Text>
          </TouchableOpacity>

          <View style={styles.findLinks}>
            <TouchableOpacity onPress={handleFindId}>
              <Text style={styles.findLinkText}>아이디 찾기</Text>
            </TouchableOpacity>
            <Text style={styles.findLinkDivider}>•</Text>
            <TouchableOpacity onPress={handleFindPassword}>
              <Text style={styles.findLinkText}>비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 로그인 버튼 */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>로그인하기</Text>
        </TouchableOpacity>
      </View>

      {/* 소셜 로그인 */}
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleKakaoLogin}
        >
          <KakaoLoginIcon />
          <Text style={styles.socialButtonText}>카카오로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleNaverLogin}
        >
          <NaverLoginIcon />
          <Text style={styles.socialButtonText}>네이버로 로그인</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleLogin}
        >
          <GoogleLoginIcon />
          <Text style={styles.socialButtonText}>구글로 로그인</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 링크 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.bottomText}>
            아직 회원이 아니신가요?{" "}
            <Text style={styles.signUpLink}>회원가입하기</Text> &gt;
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  backButton: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#424242",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: 14,
    color: "#424242",
  },
  findLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  findLinkText: {
    fontSize: 14,
    color: "#757575",
  },
  findLinkDivider: {
    fontSize: 14,
    color: "#E0E0E0",
    marginHorizontal: 8,
  },
  loginButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  socialContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },
  socialButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#424242",
    fontWeight: "500",
  },
  bottomContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 40,
  },
  bottomText: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
  },
  signUpLink: {
    color: "#FF6B35",
    fontWeight: "600",
  },
});
