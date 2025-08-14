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
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");

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

  // 회원가입 버튼 활성화 여부 확인
  const isSignUpButtonActive =
    nickname.trim() !== "" &&
    isNicknameChecked &&
    email.trim() !== "" &&
    isEmailChecked &&
    validatePassword(password) &&
    password === confirmPassword &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "";

  const handleBack = () => {
    // 이전 화면으로 이동
    console.log("이전 화면으로 이동");
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
        <Text style={styles.headerTitle}>
          회원가입을 위한{"\n"}정보를 입력해주세요.
        </Text>
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
              onChangeText={(text) => {
                setNickname(text);
                setNicknameError("");
                setIsNicknameChecked(false);
              }}
              placeholder="닉네임을 입력해주세요 최소2자, 최대 6자"
              placeholderTextColor="#9E9E9E"
            />
            <TouchableOpacity
              style={[
                styles.duplicateButton,
                isNicknameChecked && styles.duplicateButtonChecked,
              ]}
              onPress={() => {
                if (nickname.trim().length < 2 || nickname.trim().length > 6) {
                  setNicknameError("닉네임은 2-6자 사이여야 합니다");
                  setIsNicknameChecked(false);
                } else {
                  // API 연결 전 임시로 랜덤하게 중복/사용가능 처리
                  const isDuplicate = Math.random() > 0.5;
                  if (isDuplicate) {
                    setNicknameError("이미 있는 닉네임입니다");
                    setIsNicknameChecked(false);
                  } else {
                    setNicknameError("");
                    setIsNicknameChecked(true);
                  }
                }
              }}
            >
              <Text
                style={[
                  styles.duplicateButtonText,
                  isNicknameChecked && styles.duplicateButtonTextChecked,
                ]}
              >
                {isNicknameChecked ? "확인완료" : "중복확인"}
              </Text>
            </TouchableOpacity>
          </View>
          {nicknameError ? (
            <Text style={styles.validationError}>{nicknameError}</Text>
          ) : isNicknameChecked ? (
            <Text style={styles.validationSuccess}>
              ✓ 사용 가능한 닉네임입니다
            </Text>
          ) : null}
        </View>

        {/* 아이디 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>아이디</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError("");
                setIsEmailChecked(false);
              }}
              placeholder="아이디를 입력해주세요."
              placeholderTextColor="#9E9E9E"
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={[
                styles.duplicateButton,
                isEmailChecked && styles.duplicateButtonChecked,
              ]}
              onPress={() => {
                if (email.trim().length < 4) {
                  setEmailError("아이디는 4자 이상이어야 합니다");
                  setIsEmailChecked(false);
                } else {
                  // API 연결 전 임시로 랜덤하게 중복/사용가능 처리
                  const isDuplicate = Math.random() > 0.5;
                  if (isDuplicate) {
                    setEmailError("이미 있는 아이디입니다");
                    setIsEmailChecked(false);
                  } else {
                    setEmailError("");
                    setIsEmailChecked(true);
                  }
                }
              }}
            >
              <Text
                style={[
                  styles.duplicateButtonText,
                  isEmailChecked && styles.duplicateButtonTextChecked,
                ]}
              >
                {isEmailChecked ? "확인완료" : "중복확인"}
              </Text>
            </TouchableOpacity>
          </View>
          {emailError ? (
            <Text style={styles.validationError}>{emailError}</Text>
          ) : isEmailChecked ? (
            <Text style={styles.validationSuccess}>
              ✓ 사용 가능한 아이디입니다
            </Text>
          ) : null}
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

        {/* 비밀번호 확인 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>비밀번호 확인</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="비밀번호 확인"
              placeholderTextColor="#9E9E9E"
              secureTextEntry={!showConfirmPassword}
              autoCorrect={false}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <EyeIcon width={20} height={14} color="#C5BFBB" />
            </TouchableOpacity>
          </View>
          {confirmPassword.length > 0 && (
            <Text
              style={[
                styles.validationText,
                password === confirmPassword && password.trim() !== ""
                  ? styles.validationSuccess
                  : styles.validationError,
              ]}
            >
              {password === confirmPassword && password.trim() !== ""
                ? "✓ 비밀번호가 일치합니다"
                : "✗ 비밀번호가 일치하지 않습니다"}
            </Text>
          )}
        </View>

        {/* 회원가입 버튼 */}
        <TouchableOpacity
          style={[
            styles.signUpButton,
            isSignUpButtonActive && styles.signUpButtonActive,
          ]}
          onPress={handleSignUp}
          disabled={!isSignUpButtonActive}
        >
          <Text
            style={[
              styles.signUpButtonText,
              isSignUpButtonActive && styles.signUpButtonTextActive,
            ]}
          >
            회원가입
          </Text>
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
    fontFamily: "SUIT-700",
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
    fontSize: 13,
    fontFamily: "SUIT-700",
    color: "#424242",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  passwordInputContainer: {
    position: "relative",
  },
  textInput: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    paddingHorizontal: 10,
    paddingVertical: 14,
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#424242",
  },
  duplicateButton: {
    backgroundColor: "#302E2D",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 5,
    minWidth: 80,
    alignItems: "center",
  },
  duplicateButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  duplicateButtonChecked: {
    backgroundColor: "#9D9896",
  },
  duplicateButtonTextChecked: {
    color: "#262423",
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 14,
    padding: 4,
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

  signUpButton: {
    backgroundColor: "#DBD6D3",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#C5BFBB",
    paddingVertical: 16,
    alignItems: "center",
  },
  signUpButtonText: {
    color: "#716C69",
    fontSize: 16,
    fontFamily: "SUIT-600",
  },
  signUpButtonActive: {
    backgroundColor: "#302E2D",
    borderColor: "#302E2D",
  },
  signUpButtonTextActive: {
    color: "#FFFFFF",
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
  signInLink: {
    color: "#262423",
    fontFamily: "SUIT-700",
  },
});
