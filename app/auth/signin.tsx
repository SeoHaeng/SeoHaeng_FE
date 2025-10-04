// import * as KakaoLogins from "@react-native-seoul/kakao-login";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
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
import GoogleIcon from "../../components/icons/SocialLoginIcon/GoogleIcon";
import KakaoIcon from "../../components/icons/SocialLoginIcon/KakaoIcon";
import NaverIcon from "../../components/icons/SocialLoginIcon/NaverIcon";
import KakaoLoginWebView from "../../components/KakaoLoginWebView";
import NaverLoginWebView from "../../components/NaverLoginWebView";
import {
  googleLoginWithCodeAPI,
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
  // Google은 시스템 브라우저를 사용하므로 WebView 상태 불필요
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
      const naverOAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${Constants.expoConfig?.extra?.NAVER_CLIENT_ID}&redirect_uri=${Constants.expoConfig?.extra?.OAUTH_BASE_URL}/auth/naver/callback&state=${Constants.expoConfig?.extra?.NAVER_STATE}`;

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

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      // 환경변수 검증
      const googleClientId = Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID;
      const oauthBaseUrl = Constants.expoConfig?.extra?.OAUTH_BASE_URL;
      const googleState = Constants.expoConfig?.extra?.GOOGLE_STATE;

      if (!googleClientId) {
        console.error("❌ GOOGLE_CLIENT_ID가 설정되지 않았습니다.");
        setErrorMessage("구글 클라이언트 ID가 설정되지 않았습니다.");
        return;
      }

      if (!oauthBaseUrl) {
        console.error("❌ OAUTH_BASE_URL이 설정되지 않았습니다.");
        setErrorMessage("OAuth 기본 URL이 설정되지 않았습니다.");
        return;
      }

      console.log("🔍 구글 OAuth 설정 검증:");
      console.log("- 클라이언트 ID:", googleClientId ? "✅ 설정됨" : "❌ 누락");
      console.log("- OAuth 기본 URL:", oauthBaseUrl);
      console.log("- 상태값:", googleState);

      // 네이티브: 웹 리다이렉트 URI 사용 (AuthSession 사용)
      if (Platform.OS !== "web") {
        WebBrowser.maybeCompleteAuthSession();

        // 웹과 동일한 리다이렉트 URI 사용
        const redirectUri = `${oauthBaseUrl}/auth/google/callback`;

        // 필수 파라미터만 사용하여 URL 구성
        const params = new URLSearchParams({
          response_type: "code",
          client_id: googleClientId,
          redirect_uri: redirectUri,
          scope: "openid email profile",
          access_type: "offline",
          prompt: "select_account", // consent 대신 select_account 사용
        });

        if (googleState) {
          params.append("state", googleState);
        }

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        console.log("🔵 구글 로그인 시작 (AuthSession):", authUrl);
        console.log("🔵 리다이렉트 URI:", redirectUri);

        const result = await WebBrowser.openAuthSessionAsync(
          authUrl,
          redirectUri,
        );

        if (result.type === "success" && result.url) {
          try {
            const urlObj = new URL(result.url);
            const code = urlObj.searchParams.get("code");
            const error = urlObj.searchParams.get("error");

            if (error) {
              const errorDescription =
                urlObj.searchParams.get("error_description");
              console.error("❌ 구글 OAuth 에러:", error, errorDescription);
              setErrorMessage(`구글 로그인 오류: ${errorDescription || error}`);
            } else if (code) {
              await handleGoogleLoginWithCode(code);
            } else {
              setErrorMessage("인가 코드가 없습니다.");
            }
          } catch (parseError) {
            console.error("❌ URL 파싱 에러:", parseError);
            setErrorMessage("응답 URL 파싱 중 오류가 발생했습니다.");
          }
        } else if (result.type === "dismiss" || result.type === "cancel") {
          setErrorMessage("구글 로그인을 취소했습니다.");
        } else {
          setErrorMessage("구글 로그인 중 오류가 발생했습니다.");
        }
      } else {
        // 웹: 서비스 콜백으로 리다이렉트
        const redirectUri = `${oauthBaseUrl}/auth/google/callback`;

        const params = new URLSearchParams({
          response_type: "code",
          client_id: googleClientId,
          redirect_uri: redirectUri,
          scope: "openid email profile",
          access_type: "offline",
          prompt: "select_account",
        });

        if (googleState) {
          params.append("state", googleState);
        }

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        console.log("🔵 구글 로그인 시작 (web):", authUrl);
        console.log("🔵 리다이렉트 URI:", redirectUri);

        if (typeof window !== "undefined") {
          (window as any).location.href = authUrl;
        }
      }
    } catch (error) {
      console.error("❌ 구글 로그인 에러:", error);
      setErrorMessage("구글 로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginWithCode = async (code: string) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      console.log("🔵 구글 인가코드로 로그인 시작:", code);

      const response = await googleLoginWithCodeAPI(code);

      if (response.isSuccess && response.result) {
        // 토큰과 사용자 정보 저장
        await saveToken(
          response.result.accessToken,
          response.result.refreshToken,
          response.result.userId,
        );

        console.log("✅ 구글 로그인 성공:", response.result);
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
        console.error("❌ 구글 로그인 실패:", response.message);
        setErrorMessage(response.message || "구글 로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error("❌ 구글 로그인 에러:", error);
      setErrorMessage("구글 로그인 중 오류가 발생했습니다.");
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
      {/* 에러 메시지 */}
      {errorMessage ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText} allowFontScaling={false}>
            {errorMessage}
          </Text>
        </View>
      ) : null}

      {/* 하단 링크 */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleSignUp}>
          <Text style={styles.bottomText} allowFontScaling={false}>
            아직 회원이 아니신가요?{" "}
            <Text style={styles.signUpLink}>회원가입하기</Text> &gt;
          </Text>
        </TouchableOpacity>
      </View>
      {/* 소셜 로그인 */}
      <View style={styles.socialContainer}>
        <Text style={styles.socialTitle} allowFontScaling={false}>
          소셜 로그인
        </Text>

        <TouchableOpacity style={styles.kakaoButton} onPress={handleKakaoLogin}>
          <KakaoIcon />
        </TouchableOpacity>
        <TouchableOpacity style={styles.kakaoButton} onPress={handleNaverLogin}>
          <NaverIcon />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.kakaoButton}
          onPress={handleGoogleLogin}
        >
          <GoogleIcon />
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
      {/* Google은 시스템 브라우저(AuthSession) 사용 */}
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
    marginBottom: 20,
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
    marginTop: 20,
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
    flexDirection: "row",
    gap: 50,
    justifyContent: "center",
    paddingTop: 30,
    marginHorizontal: 20,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#9D9896",
    position: "relative",
  },

  socialTitle: {
    fontSize: 16,
    color: "#9D9896",
    fontFamily: "SUIT-600",
    paddingHorizontal: 10,
    position: "absolute",
    top: -9,
    backgroundColor: "#F8F4F2",
    left: "50%",
    transform: [{ translateX: -50 }], // 👈 정확히 가운데로 이동
  },
  kakaoButton: { backgroundColor: "#F8F4F2" },

  bottomContainer: {
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 50,
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
