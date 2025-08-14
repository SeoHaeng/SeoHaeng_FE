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
import { router } from "expo-router";
import BackIcon from "../../components/icons/BackIcon";
import GoogleLoginIcon from "../../components/icons/GoogleLoginIcon";
import KakaoLoginIcon from "../../components/icons/KakaoLoginIcon";
import NaverLoginIcon from "../../components/icons/NaverLoginIcon";

const { width, height } = Dimensions.get("window");

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true); // 기본값을 true로 변경
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBack = () => {
    // WelcomeScreen으로 이동
    console.log("WelcomeScreen으로 이동");
    router.back();
  };

  const handleSignUp = () => {
    // 회원가입 로직
    console.log("회원가입하기 클릭", {
      email,
      password,
      confirmPassword,
      nickname,
      agreeTerms,
      agreePrivacy,
    });
  };

  const handleKakaoSignUp = () => {
    // 카카오 회원가입 로직
    console.log("카카오 회원가입 클릭");
  };

  const handleNaverSignUp = () => {
    // 네이버 회원가입 로직
    console.log("네이버 회원가입 클릭");
  };

  const handleGoogleSignUp = () => {
    // 구글 회원가입 로직
    console.log("구글 회원가입 클릭");
  };

  const handleSignIn = () => {
    // 로그인 화면으로 이동
    console.log("로그인하기 클릭");
    router.push("/auth/signin");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sign up</Text>
      </View>

      {/* 안내 문구 */}
      <View style={styles.guideContainer}>
        <Text style={styles.guideText}>회원가입을 위한 정보를 입력해주세요.</Text>
      </View>

      {/* 회원가입 폼 */}
      <View style={styles.formContainer}>
        {/* 닉네임 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>닉네임</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={nickname}
              onChangeText={setNickname}
              placeholder="닉네임을 입력해주세요 최소2자, 최대 6자"
              placeholderTextColor="#9E9E9E"
            />
            <TouchableOpacity style={styles.duplicateButton}>
              <Text style={styles.duplicateButtonText}>중복확인</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 아이디 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>아이디</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              placeholder="아이디를 입력해주세요."
              placeholderTextColor="#9E9E9E"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.duplicateButton}>
              <Text style={styles.duplicateButtonText}>중복확인</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 비밀번호 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>비밀번호</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="영문, 숫자, 특수문자 포함 8-12자"
              placeholderTextColor="#9E9E9E"
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.eyeIcon}>👁</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 비밀번호 확인 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>비밀번호 확인</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="비밀번호 확인"
              placeholderTextColor="#9E9E9E"
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity 
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Text style={styles.eyeIcon}>👁</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 약관 동의 */}
        <View style={styles.termsContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreeTerms(!agreeTerms)}
          >
            <View
              style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}
            >
              {agreeTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.termsTextContainer}>
              <Text style={styles.checkboxText}>✓ 이용약관에 동의합니다.</Text>
              <TouchableOpacity>
                <Text style={styles.termsLink}>이용약관 보기 ></Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreePrivacy(!agreePrivacy)}
          >
            <View
              style={[styles.checkbox, agreePrivacy && styles.checkboxChecked]}
            >
              {agreePrivacy && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxText}>개인정보 처리 방침</Text>
          </TouchableOpacity>
        </View>

        {/* 회원가입 버튼 */}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>회원가입</Text>
        </TouchableOpacity>
      </View>

      {/* 소셜 회원가입 */}
      <View style={styles.socialContainer}>
        <Text style={styles.socialTitle}>소셜 계정으로 간편 가입</Text>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleKakaoSignUp}
        >
          <KakaoLoginIcon />
          <Text style={styles.socialButtonText}>카카오로 회원가입</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleNaverSignUp}
        >
          <NaverLoginIcon />
          <Text style={styles.socialButtonText}>네이버로 회원가입</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleGoogleSignUp}
        >
          <GoogleLoginIcon />
          <Text style={styles.socialButtonText}>구글로 회원가입</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 링크 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleSignIn}>
          <Text style={styles.bottomText}>
            이미 계정이 있으신가요?{" "}
            <Text style={styles.signInLink}>로그인 하기</Text> &gt;
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
  guideContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  guideText: {
    fontSize: 16,
    color: "#424242",
    textAlign: "center",
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
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#424242",
  },
  duplicateButton: {
    backgroundColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  duplicateButtonText: {
    fontSize: 14,
    color: "#757575",
    fontWeight: "500",
  },
  eyeButton: {
    paddingHorizontal: 8,
    paddingVertical: 14,
  },
  eyeIcon: {
    fontSize: 18,
  },
  termsContainer: {
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    marginRight: 8,
    marginTop: 2,
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
    flex: 1,
    lineHeight: 20,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  termsLink: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "500",
  },
  signUpButton: {
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#424242",
    fontSize: 16,
    fontWeight: "600",
  },
  socialContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#424242",
    textAlign: "center",
    marginBottom: 20,
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
  signInLink: {
    color: "#FF6B35",
    fontWeight: "600",
  },
});
