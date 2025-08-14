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
import EyeIcon from "../../components/icons/EyeIcon";
import GoogleLoginIcon from "../../components/icons/GoogleLoginIcon";
import KakaoLoginIcon from "../../components/icons/KakaoLoginIcon";
import NaverLoginIcon from "../../components/icons/NaverLoginIcon";

const { width, height } = Dimensions.get("window");

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    const minLength = 8;
    const maxLength = 12;
    const hasEnglish = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );

    return (
      password.length >= minLength &&
      password.length <= maxLength &&
      hasEnglish &&
      hasNumber &&
      hasSpecialChar
    );
  };

  // 로그인 버튼 활성화 여부 확인
  const isLoginButtonActive = email.trim() !== "" && validatePassword(password);

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
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="영문, 숫자, 특수문자 포함 8-12자"
              placeholderTextColor="#9E9E9E"
              secureTextEntry={!showPassword}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <EyeIcon width={20} height={14} color="#C5BFBB" />
            </TouchableOpacity>
          </View>
          {password.length > 0 && (
            <Text
              style={[
                styles.validationText,
                validatePassword(password)
                  ? styles.validationSuccess
                  : styles.validationError,
              ]}
            >
              {validatePassword(password)
                ? "✓ 비밀번호 조건을 만족합니다"
                : "✗ 영문, 숫자, 특수문자 포함 8-12자 입력 필요"}
            </Text>
          )}
        </View>

        {/* 로그인 버튼 */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            isLoginButtonActive && styles.loginButtonActive,
          ]}
          onPress={handleLogin}
          disabled={!isLoginButtonActive}
        >
          <Text
            style={[
              styles.loginButtonText,
              isLoginButtonActive && styles.loginButtonTextActive,
            ]}
          >
            로그인하기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 소셜 로그인 */}
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleKakaoLogin}
        >
          <KakaoLoginIcon />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleNaverLogin}
        >
          <NaverLoginIcon />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleLogin}
        >
          <GoogleLoginIcon />
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
    fontFamily: "SUIT-700",
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
    fontSize: 13,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 8,
  },
  validationText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  validationSuccess: {
    color: "#4CAF50",
  },
  validationError: {
    color: "#F44336",
  },
  passwordInputContainer: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 14,
    padding: 4,
  },
  textInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
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
    backgroundColor: "#DBD6D3",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#C5BFBB",
    paddingVertical: 16,
    alignItems: "center",
  },
  loginButtonActive: {
    backgroundColor: "#302E2D",
    borderColor: "#302E2D",
  },
  loginButtonText: {
    color: "#716C69",
    fontSize: 16,
    fontFamily: "SUIT-600",
  },
  loginButtonTextActive: {
    color: "#FFFFFF",
  },
  socialContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
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
    marginTop: 20,
    marginBottom: 40,
  },
  bottomText: {
    fontSize: 14,
    color: "#4D4947",
    textAlign: "center",
    textDecorationLine: "underline",
  },
  signUpLink: {
    color: "#262423",
    fontFamily: "SUIT-700",
  },
});
