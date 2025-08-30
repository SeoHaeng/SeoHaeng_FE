// import * as KakaoLogins from "@react-native-seoul/kakao-login";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../components/AuthProvider";
import BackIcon from "../../components/icons/BackIcon";
import EyeIcon from "../../components/icons/EyeIcon";
import KakaoIcon from "../../components/icons/KakaoIcon";
import KakaoLoginWebView from "../../components/KakaoLoginWebView";
import { kakaoLoginWithCodeAPI, loginAPI } from "../../types/api";
import { saveToken } from "../../types/auth";

const { width, height } = Dimensions.get("window");

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [autoLogin, setAutoLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showKakaoWebView, setShowKakaoWebView] = useState(false);
  const { refreshAuthState } = useAuth();

  const handleBack = () => {
    // WelcomeScreen으로 이동
    console.log("WelcomeScreen으로 이동");
    router.back();
  };

  const handleLogin = async () => {
    // 로그인 성공 시 홈 화면으로 이동
    if (isLoginButtonActive) {
      try {
        setIsLoading(true);

        const response = await loginAPI({
          username: email,
          password: password,
        });

        if (response.isSuccess) {
          try {
            // 토큰과 사용자 정보 저장
            await saveToken(
              response.result.accessToken,
              response.result.refreshToken,
              response.result.userId,
            );

            console.log("로그인 성공:", response.result);

            // 에러 메시지 초기화
            setErrorMessage("");

            // 인증 상태 새로고침
            await refreshAuthState();
            console.log("로그인 후 인증 상태 새로고침 완료");

            // 홈 화면으로 이동
            router.push("/(tabs)");
          } catch (error) {
            console.error("토큰 저장 실패:", error);
            setErrorMessage("토큰 저장에 실패했습니다. 다시 시도해주세요.");
          }
        } else {
          setErrorMessage(response.message || "로그인에 실패했습니다.");
        }
      } catch (error) {
        console.error("로그인 에러:", error);
        setErrorMessage("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKakaoLogin = () => {
    console.log("=== 카카오 로그인 시작 ===");
    setShowKakaoWebView(true);
  };

  const handleKakaoCodeReceived = async (code: string) => {
    try {
      setIsLoading(true);
      console.log("🔄 카카오 인가 코드로 서버 로그인 시도:", code);

      // 카카오 로그인 API 호출
      const response = await kakaoLoginWithCodeAPI(code);

      if (response.isSuccess && response.result) {
        // 토큰과 사용자 정보 저장
        await saveToken(
          response.result.accessToken,
          response.result.refreshToken,
          response.result.userId,
        );

        console.log("✅ 카카오 로그인 성공:", response.result);
        setErrorMessage("");

        // 신규 사용자인 경우 약관 동의 화면으로 이동
        if (response.result.isNewUser) {
          console.log("🔄 신규 사용자 - 약관 동의 화면으로 이동");
          router.push("/auth/signup");
        } else {
          console.log("🔄 기존 사용자 - 홈 화면으로 이동");
          // 인증 상태 새로고침 후 홈 화면으로 이동
          await refreshAuthState();
          router.push("/(tabs)");
        }
      } else {
        console.error("❌ 카카오 로그인 실패:", response.message);
        setErrorMessage(response.message || "카카오 로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 카카오 로그인 에러:", error);
      setErrorMessage("카카오 로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = () => {
    // 회원가입 화면으로 이동
    console.log("회원가입하기 클릭");
    router.push("/auth/signup");
  };

  // 아이디 유효성 검사
  const validateEmail = (email: string) => {
    const minLength = 4;
    const maxLength = 12;

    return email.length >= minLength && email.length <= maxLength;
  };

  // 비밀번호 유효성 검사
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

  // 로그인 버튼 활성화 여부 확인
  const isLoginButtonActive =
    validateEmail(email) && validatePassword(password);

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
            onChangeText={(text) => {
              setEmail(text);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="아이디 또는 이메일 주소를 입력하세요"
            placeholderTextColor="#9E9E9E"
          />
          {email.length > 0 && (
            <Text
              style={[
                styles.validationText,
                validateEmail(email)
                  ? styles.validationSuccess
                  : styles.validationError,
              ]}
            >
              {validateEmail(email)
                ? "✓ 아이디 조건을 만족합니다"
                : "✗ 아이디는 4-12자로 입력해주세요"}
            </Text>
          )}
        </View>

        {/* 비밀번호 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>비밀번호</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage("");
              }}
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
                : "✗ 영문, 숫자, 특수문자 포함 8-20자 입력 필요"}
            </Text>
          )}
        </View>

        {/* 에러 메시지 */}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* 로그인 버튼 */}
        <TouchableOpacity
          style={[
            styles.loginButton,
            isLoginButtonActive && styles.loginButtonActive,
            isLoading && styles.loginButtonLoading,
          ]}
          onPress={handleLogin}
          disabled={!isLoginButtonActive || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text
              style={[
                styles.loginButtonText,
                isLoginButtonActive && styles.loginButtonTextActive,
              ]}
            >
              로그인하기
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 소셜 로그인 */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.kakaoButton} onPress={handleKakaoLogin}>
          <View style={styles.kakaoIcon}>
            <KakaoIcon />
          </View>
          <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
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

      {/* 카카오 로그인 WebView */}
      <KakaoLoginWebView
        visible={showKakaoWebView}
        onClose={() => setShowKakaoWebView(false)}
        onCodeReceived={handleKakaoCodeReceived}
      />
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
    fontWeight: "700", // 폰트 로딩 실패 시 대체
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
    fontSize: 11,
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
    fontSize: 12,
    color: "#424242",
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
  loginButtonLoading: {
    backgroundColor: "#9E9E9E",
    borderColor: "#9E9E9E",
  },
  loginButtonText: {
    color: "#716C69",
    fontSize: 14,
    fontFamily: "SUIT-600",
    fontWeight: "600", // 폰트 로딩 실패 시 대체
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
  kakaoButton: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DBD6D3",
  },
  kakaoButtonText: {
    fontSize: 14,
    color: "#262423",
    fontFamily: "SUIT-600",
  },
  kakaoIcon: {
    position: "absolute",
    left: 15,
    top: 13,
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
    fontWeight: "700", // 폰트 로딩 실패 시 대체
  },
  errorContainer: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 14,
    color: "#F44336",
    textAlign: "center",
  },
});
