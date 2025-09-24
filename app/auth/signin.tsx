// import * as KakaoLogins from "@react-native-seoul/kakao-login";
import NaverIcon from "@/components/icons/SocialLoginIcon/NaverIcon";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/AuthProvider";
import BackIcon from "../../components/icons/BackIcon";
import KakaoIcon from "../../components/icons/SocialLoginIcon/KakaoIcon";
import KakaoLoginWebView from "../../components/KakaoLoginWebView";
import NaverLoginWebView from "../../components/NaverLoginWebView";
import {
  kakaoLoginWithCodeAPI,
  loginAPI,
  naverLoginWithCodeAPI,
} from "../../types/api";
import { saveToken } from "../../types/auth";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showKakaoWebView, setShowKakaoWebView] = useState(false);
  const [showNaverWebView, setShowNaverWebView] = useState(false);
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
        setErrorMessage("아이디 또는 비밀번호를 확인해주세요");
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
          router.push("/auth/AgreementScreen");
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

  const handleNaverLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      // 네이버 OAuth URL 생성
      const naverOAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${Constants.expoConfig?.extra?.NAVER_CLIENT_ID}&redirect_uri=${Constants.expoConfig?.extra?.OAUTH_REDIRECT_URI}&state=${Constants.expoConfig?.extra?.NAVER_STATE}`;

      console.log("🔵 네이버 로그인 시작:", naverOAuthUrl);
      setShowNaverWebView(true);
    } catch (error) {
      console.error("❌ 네이버 로그인 에러:", error);
      setErrorMessage("네이버 로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNaverLoginWithCode = async (code: string) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      console.log("🔵 네이버 인가코드로 로그인 시작:", code);

      const response = await naverLoginWithCodeAPI(code);

      if (response.isSuccess && response.result) {
        // 토큰과 사용자 정보 저장
        await saveToken(
          response.result.accessToken,
          response.result.refreshToken,
          response.result.userId,
        );

        console.log("✅ 네이버 로그인 성공:", response.result);
        setErrorMessage("");

        // 신규 사용자인 경우 약관 동의 화면으로 이동
        if (response.result.isNewUser) {
          console.log("🔄 신규 사용자 - 약관 동의 화면으로 이동");
          router.push("/auth/AgreementScreen");
        } else {
          console.log("🔄 기존 사용자 - 홈 화면으로 이동");
          // 인증 상태 새로고침 후 홈 화면으로 이동
          await refreshAuthState();
          router.push("/(tabs)");
        }
      } else {
        console.error("❌ 네이버 로그인 실패:", response.message);
        setErrorMessage(response.message || "네이버 로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 네이버 로그인 에러:", error);
      setErrorMessage("네이버 로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setShowNaverWebView(false);
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          로그인 해주세요.
        </Text>
      </View>

      {/* 로그인 폼 */}
      <View style={styles.formContainer}>
        {/* 이메일/아이디 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel} allowFontScaling={false}>
            아이디
          </Text>
          <TextInput
            style={styles.textInput}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="아이디를 입력하세요"
            placeholderTextColor="#9E9E9E"
            allowFontScaling={false}
          />
          {email.length > 0 && (
            <Text
              style={[
                styles.validationText,
                validateEmail(email)
                  ? styles.validationSuccess
                  : styles.validationError,
              ]}
              allowFontScaling={false}
            >
              {validateEmail(email)
                ? "✓ 아이디 조건을 만족합니다"
                : "✗ 아이디는 4-12자로 입력해주세요"}
            </Text>
          )}
        </View>

        {/* 비밀번호 입력 */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel} allowFontScaling={false}>
            비밀번호
          </Text>
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
              allowFontScaling={false}
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
              allowFontScaling={false}
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
            <Text style={styles.errorText} allowFontScaling={false}>
              {errorMessage}
            </Text>
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
            <ActivityIndicator color="#E60A34" />
          ) : (
            <Text
              style={[
                styles.loginButtonText,
                isLoginButtonActive && styles.loginButtonTextActive,
              ]}
              allowFontScaling={false}
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
          <Text style={styles.kakaoButtonText} allowFontScaling={false}>
            카카오로 로그인
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.kakaoButton} onPress={handleNaverLogin}>
          <View style={styles.naverIcon}>
            <NaverIcon />
          </View>
          <Text style={styles.kakaoButtonText} allowFontScaling={false}>
            네이버로 로그인
          </Text>
        </TouchableOpacity>
      </View>

      {/* 하단 링크 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.bottomText} allowFontScaling={false}>
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
      <NaverLoginWebView
        visible={showNaverWebView}
        onClose={() => setShowNaverWebView(false)}
        onCodeReceived={handleNaverLoginWithCode}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4F2",
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
    fontSize: 25,
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
    fontSize: 14,
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
  },
  textInput: {
    backgroundColor: "#F0F0F0",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 13,
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
    fontSize: 15,
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
    fontSize: 17,
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
    fontSize: 15,
    color: "#262423",
    fontFamily: "SUIT-600",
  },
  kakaoIcon: {
    position: "absolute",
    left: 15,
    top: 13,
  },
  naverIcon: {
    position: "absolute",
    left: 16,
    top: 15,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  bottomText: {
    fontSize: 15,
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
    fontSize: 15,
    color: "#F44336",
    textAlign: "center",
  },
});
