import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import BackIcon from "../../components/icons/BackIcon";
import { API_BASE_URL } from "../../config/api";
import { checkNicknameAPI, checkUsernameAPI } from "../../types/api";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true); // 기본값을 true로 변경
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeLocationService, setAgreeLocationService] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [nicknameError, setNicknameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [signupError, setSignupError] = useState("");

  // 비밀번호 유효성 검사 (API 요구사항: 8~20자, 영문, 숫자, 특수문자 포함)
  const validatePassword = (password: string) => {
    const minLength = 8;
    const maxLength = 20;
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

  // 아이디 유효성 검사 (4~12자)
  const validateUsername = (username: string) => {
    return username.length >= 4 && username.length <= 12;
  };

  // 회원가입 버튼 활성화 여부 확인
  const isSignUpButtonActive =
    nickname.trim() !== "" &&
    isNicknameChecked &&
    email.trim() !== "" &&
    isEmailChecked &&
    validateUsername(email) &&
    validatePassword(password) &&
    password === confirmPassword &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    agreeTerms &&
    agreePrivacy &&
    agreeLocationService;

  const handleBack = () => {
    // 이전 화면으로 이동
    console.log("이전 화면으로 이동");
    router.back();
  };

  // 이용약관 보기 링크 처리
  const handleTermsLink = async () => {
    const url =
      "https://dog-sweatpants-971.notion.site/25d1744decc880798dabc486a20344f4";

    try {
      // URL이 열릴 수 있는지 확인
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Notion 링크 열기
        await Linking.openURL(url);
      } else {
        Alert.alert("오류", "링크를 열 수 없습니다.");
      }
    } catch (error) {
      console.error("링크 열기 실패:", error);
      Alert.alert("오류", "링크를 열 수 없습니다.");
    }
  };

  // 개인정보 수집 및 이용 보기 링크 처리
  const handlePrivacyLink = async () => {
    const url =
      "https://dog-sweatpants-971.notion.site/25d1744decc88082824ec60209d2dcf5";

    try {
      // URL이 열릴 수 있는지 확인
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Notion 링크 열기
        await Linking.openURL(url);
      } else {
        Alert.alert("오류", "링크를 열 수 없습니다.");
      }
    } catch (error) {
      console.error("링크 열기 실패:", error);
      Alert.alert("오류", "링크를 열 수 없습니다.");
    }
  };

  // 위치 기반 서비스 이용약관 보기 링크 처리
  const handleLocationServiceLink = async () => {
    const url =
      "https://dog-sweatpants-971.notion.site/25d1744decc880529587ea2423c0b015?source=copy_link";

    try {
      // URL이 열릴 수 있는지 확인
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // Notion 링크 열기
        await Linking.openURL(url);
      } else {
        Alert.alert("오류", "링크를 열 수 없습니다.");
      }
    } catch (error) {
      console.error("링크 열기 실패:", error);
      Alert.alert("오류", "링크를 열 수 없습니다.");
    }
  };

  // API 연동을 위한 회원가입 함수
  const signUpAPI = async (userData: {
    username: string;
    nickname: string;
    password1: string;
    password2: string;
    termsOfServiceAgreed: boolean;
    privacyPolicyAgreed: boolean;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("회원가입 성공:", result);
        return { success: true, data: result };
      } else {
        const errorData = await response.json();
        console.error("회원가입 실패:", errorData);
        return { success: false, error: errorData };
      }
    } catch (error) {
      console.error("API 호출 오류:", error);
      return { success: false, error: "아이디 또는 비밀번호를 확인해주세요" };
    }
  };

  const handleSignUp = async () => {
    // 회원가입 로직
    console.log("회원가입하기 클릭", {
      email,
      password,
      confirmPassword,
      nickname,
      agreeTerms,
      agreePrivacy,
      agreeLocationService,
    });

    if (!isSignUpButtonActive) {
      return;
    }

    // 약관 동의 확인
    if (!agreeTerms || !agreePrivacy || !agreeLocationService) {
      Alert.alert("알림", "모든 약관에 동의해주세요.");
      return;
    }

    setSignupError("");

    try {
      const userData = {
        username: email, // email이 username(아이디)로 사용됨
        nickname: nickname,
        password1: password,
        password2: confirmPassword,
        termsOfServiceAgreed: agreeTerms,
        privacyPolicyAgreed: agreePrivacy,
        locationServiceAgreed: agreeLocationService,
      };

      const result = await signUpAPI(userData);

      if (result.success) {
        // 회원가입 성공 시 완료 화면으로 이동
        router.push("/auth/signupComplete");
      } else {
        // 회원가입 실패 시 에러 메시지 표시
        setSignupError(
          result.error?.message ||
            "회원가입에 실패했습니다. 다시 시도해주세요.",
        );
        Alert.alert(
          "회원가입 실패",
          result.error?.message || "회원가입에 실패했습니다.",
        );
      }
    } catch (error) {
      console.error("회원가입 처리 오류:", error);
      setSignupError("회원가입 처리 중 오류가 발생했습니다.");
      Alert.alert("오류", "회원가입 처리 중 오류가 발생했습니다.");
    }
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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
                onPress={async () => {
                  // 조건 검증 먼저 수행
                  if (!nickname.trim()) {
                    setNicknameError("닉네임을 입력해주세요");
                    setIsNicknameChecked(false);
                    return;
                  }

                  if (
                    nickname.trim().length < 2 ||
                    nickname.trim().length > 6
                  ) {
                    setNicknameError("닉네임은 2-6자 사이여야 합니다");
                    setIsNicknameChecked(false);
                    return;
                  }

                  // 특수문자나 공백이 포함되어 있는지 확인
                  if (!/^[가-힣a-zA-Z0-9]+$/.test(nickname.trim())) {
                    setNicknameError(
                      "닉네임은 한글, 영문, 숫자만 사용 가능합니다",
                    );
                    setIsNicknameChecked(false);
                    return;
                  }

                  try {
                    const result = await checkNicknameAPI(nickname.trim());

                    if (result.isSuccess) {
                      if (result.result === "사용 가능한 닉네임입니다.") {
                        setNicknameError("");
                        setIsNicknameChecked(true);
                      } else {
                        setNicknameError("이미 있는 닉네임입니다");
                        setIsNicknameChecked(false);
                      }
                    } else {
                      setNicknameError("중복 확인에 실패했습니다");
                      setIsNicknameChecked(false);
                    }
                  } catch (error) {
                    console.error("닉네임 중복 확인 오류:", error);
                    setNicknameError("중복 확인 중 오류가 발생했습니다");
                    setIsNicknameChecked(false);
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
                onPress={async () => {
                  // 조건 검증 먼저 수행
                  if (!email.trim()) {
                    setEmailError("아이디를 입력해주세요");
                    setIsEmailChecked(false);
                    return;
                  }

                  if (email.trim().length < 4 || email.trim().length > 12) {
                    setEmailError("아이디는 4~12자 사이여야 합니다");
                    setIsEmailChecked(false);
                    return;
                  }

                  // 영문, 숫자, 특수문자만 허용
                  if (
                    !/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+$/.test(
                      email.trim(),
                    )
                  ) {
                    setEmailError(
                      "아이디는 영문, 숫자, 특수문자만 사용 가능합니다",
                    );
                    setIsEmailChecked(false);
                    return;
                  }

                  try {
                    const result = await checkUsernameAPI(email.trim());

                    if (result.isSuccess) {
                      if (result.result === "사용 가능한 아이디입니다.") {
                        setEmailError("");
                        setIsEmailChecked(true);
                      } else {
                        setEmailError("이미 있는 아이디입니다");
                        setIsEmailChecked(false);
                      }
                    } else {
                      setEmailError("중복 확인에 실패했습니다");
                      setIsEmailChecked(false);
                    }
                  } catch (error) {
                    console.error("아이디 중복 확인 오류:", error);
                    setEmailError("중복 확인 중 오류가 발생했습니다");
                    setIsEmailChecked(false);
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
                placeholder="영문, 숫자, 특수문자 포함 8-20자"
                placeholderTextColor="#9E9E9E"
                secureTextEntry={!showPassword}
                autoCorrect={false}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <AntDesign name="eye" size={22} color="#C5BFBB" />
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
                  : "✗ 영문, 숫자, 특수문자 포함 8-20자 입력 필요"}
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
                <AntDesign name="eye" size={22} color="#C5BFBB" />
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

          {/* 약관 동의 */}
          <View style={styles.termsContainer}>
            <View style={styles.termsRow}>
              <TouchableOpacity
                style={[styles.checkbox, agreeTerms && styles.checkboxActive]}
                onPress={() => setAgreeTerms(!agreeTerms)}
              >
                {agreeTerms && <Entypo name="check" size={15} color="white" />}
              </TouchableOpacity>
              <Text style={styles.termsText}>(필수) 이용약관에 동의</Text>
              <TouchableOpacity
                style={styles.termsLink}
                onPress={handleTermsLink}
              >
                <Text style={styles.termsLinkText}>자세히 보기 &gt;</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.termsRow}>
              <TouchableOpacity
                style={[styles.checkbox, agreePrivacy && styles.checkboxActive]}
                onPress={() => setAgreePrivacy(!agreePrivacy)}
              >
                {agreePrivacy && (
                  <Entypo name="check" size={15} color="white" />
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                (필수) 개인정보 수집 및 이용에 동의
              </Text>
              <TouchableOpacity onPress={handlePrivacyLink}>
                <Text style={styles.termsLinkText}>자세히 보기 &gt;</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.termsRow}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  agreeLocationService && styles.checkboxActive,
                ]}
                onPress={() => setAgreeLocationService(!agreeLocationService)}
              >
                {agreeLocationService && (
                  <Entypo name="check" size={15} color="white" />
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                (필수) 위치 기반 서비스 이용약관에 동의
              </Text>
              <TouchableOpacity onPress={handleLocationServiceLink}>
                <Text style={styles.termsLinkText}>자세히 보기 &gt;</Text>
              </TouchableOpacity>
            </View>
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

          {/* 에러 메시지 */}
          {signupError ? (
            <Text style={styles.validationError}>{signupError}</Text>
          ) : null}
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
      </ScrollView>
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
    marginBottom: 10,
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
    fontSize: 11,
    fontFamily: "SUIT-500",
    color: "#424242",
    height: 48, // 고정 높이 추가
    minHeight: 48, // 최소 높이 보장
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
    fontSize: 11,
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
  },
  validationText: {
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
  validationSuccess: {
    color: "#4CAF50",
    fontSize: 11,
  },
  validationError: {
    color: "#F44336",
    fontSize: 11,
  },

  signUpButton: {
    backgroundColor: "#DBD6D3",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#C5BFBB",
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
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
  termsContainer: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#C5BFBB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: "#4A4A4A",
    borderColor: "#4A4A4A",
  },
  checkmark: {
    fontSize: 16,
    color: "#302E2D",
  },
  termsText: {
    fontSize: 12,
    color: "#4D4947",
    flex: 1,
    fontFamily: "SUIT-600",
  },
  termsLink: {
    paddingLeft: 8,
  },
  termsLinkText: {
    fontSize: 11,
    color: "#4D4947",
    fontFamily: "SUIT-500",
    textDecorationLine: "underline",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
