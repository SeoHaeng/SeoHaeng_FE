import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import { AuthProvider, useAuth } from "../components/AuthProvider";
import { googleLoginWithCodeAPI } from "../types/api";
import { saveToken } from "../types/auth";
import { GlobalStateProvider } from "../types/globalState";

SplashScreen.preventAutoHideAsync();

interface TextWithDefaultProps extends Text {
  defaultProps?: { allowFontScaling?: boolean };
}
interface TextInputWithDefaultProps extends TextInput {
  defaultProps?: { allowFontScaling?: boolean };
}

// Text 적용 : 시스템 폰트 크기를 무시하고 앱에서 지정한 크기를 사용함.
(Text as unknown as TextWithDefaultProps).defaultProps =
  (Text as unknown as TextWithDefaultProps).defaultProps || {};
(Text as unknown as TextWithDefaultProps).defaultProps!.allowFontScaling =
  false;

// TextInput 적용 : 시스템 폰트 크기를 앱에서 지정
(TextInput as unknown as TextInputWithDefaultProps).defaultProps =
  (TextInput as unknown as TextInputWithDefaultProps).defaultProps || {};
(
  TextInput as unknown as TextInputWithDefaultProps
).defaultProps!.allowFontScaling = false;

// 추가적인 폰트 스케일링 방지 설정
try {
  if ((Text as any).defaultProps) {
    (Text as any).defaultProps.allowFontScaling = false;
  }
  if ((TextInput as any).defaultProps) {
    (TextInput as any).defaultProps.allowFontScaling = false;
  }
} catch {
  // defaultProps가 없는 경우 무시
  console.log("Font scaling setup completed");
}

// 전역 기본값만 사용 (권장). 추가 오버라이드는 제거하여 예측 가능하게 유지
// 이미 위에서 defaultProps에 allowFontScaling=false를 설정했으므로 여기서는 아무 것도 하지 않음

// 인증 상태에 따른 화면 라우팅을 관리하는 컴포넌트
function RootLayoutNav() {
  const { authState, isLoading, refreshAuthState } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // 구글 로그인 처리 함수
  const handleGoogleLoginWithCode = async (code: string) => {
    try {
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
      }
    } catch (error) {
      console.error("❌ 구글 로그인 에러:", error);
    }
  };

  // 딥링크 처리
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log("🔗 딥링크 수신:", url);

      // URL 파싱
      const parsedUrl = Linking.parse(url);
      console.log("📱 파싱된 URL:", parsedUrl);

      // 카카오 로그인 리다이렉트 처리
      if (parsedUrl.path?.includes("auth/kakao/callback")) {
        const code = parsedUrl.queryParams?.code;
        const state = parsedUrl.queryParams?.state;

        if (code) {
          console.log("✅ 카카오 인증 코드 받음:", code);
          // 여기서 카카오 로그인 처리 로직 추가
          // 예: AuthProvider의 로그인 함수 호출
        }
        return;
      }

      // 구글 로그인 리다이렉트 처리 (유니버셜 링크)
      if (parsedUrl.path?.includes("auth/google/callback.html")) {
        const code = parsedUrl.queryParams?.code;
        const state = parsedUrl.queryParams?.state;

        if (code && typeof code === "string") {
          console.log("✅ 구글 인증 코드 받음 (유니버셜 링크):", code);
          // 구글 로그인 처리 로직
          handleGoogleLoginWithCode(code);
        }
        return;
      }

      // 카카오맵 리다이렉트 처리
      if (parsedUrl.path?.includes("map/callback")) {
        const placeId = parsedUrl.queryParams?.placeId;
        const placeName = parsedUrl.queryParams?.placeName;

        if (placeId) {
          console.log("📍 카카오맵 장소 정보:", { placeId, placeName });
          // 여기서 카카오맵 장소 정보 처리 로직 추가
        }
        return;
      }

      // 일반 경로에 따라 라우팅
      if (parsedUrl.path) {
        const path = parsedUrl.path.replace(/^\//, ""); // 앞의 슬래시 제거

        if (path === "milestone") {
          router.push("/(tabs)/milestone");
        } else if (path === "maru") {
          router.push("/(tabs)/maru");
        } else {
          // 기본적으로 홈으로 이동
          router.push("/(tabs)");
        }
      }
    };

    // 앱이 실행 중일 때 딥링크 처리
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    // 앱이 종료된 상태에서 딥링크로 실행된 경우 처리
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("🚀 초기 딥링크:", url);
        handleDeepLink(url);
      }
    });

    return () => subscription?.remove();
  }, [router]);

  useEffect(() => {
    if (isLoading) {
      console.log("AuthProvider 로딩 중...");
      return; // 로딩 중이면 아무것도 하지 않음
    }

    const inAuthGroup = segments[0] === "auth";
    const inTabsGroup = segments[0] === "(tabs)";

    console.log("라우팅 체크:", {
      isAuthenticated: authState.isAuthenticated,
      hasToken: !!authState.accessToken,
      tokenLength: authState.accessToken?.length || 0,
      currentSegment: segments[0],
      inAuthGroup,
      inTabsGroup,
    });

    // 토큰 유효성 검증 강화
    const hasValidToken =
      authState.isAuthenticated &&
      authState.accessToken &&
      authState.accessToken.length > 10 &&
      authState.refreshToken &&
      authState.refreshToken.length > 10;

    if (hasValidToken) {
      // 유효한 토큰이 있으면 홈 화면으로 이동
      if (inAuthGroup) {
        console.log("✅ 유효한 토큰 있음: auth 화면에서 홈 화면으로 이동");
        router.replace("/(tabs)");
      }
    } else {
      // 토큰이 없거나 유효하지 않으면 WelcomeScreen으로 이동
      if (inTabsGroup) {
        console.log(
          "❌ 토큰 없음 또는 유효하지 않음: 홈 화면에서 WelcomeScreen으로 이동",
        );
        router.replace("/auth/WelcomeScreen");
      }
    }
  }, [
    authState.isAuthenticated,
    authState.accessToken,
    authState.refreshToken,
    segments,
    isLoading,
    router,
  ]);

  // 로딩 중일 때는 빈 화면을 보여주지 않음
  return <Slot />;
}

export default function RootLayout() {
  const [loaded] = useFonts({
    "SUIT-400": require("@/assets/fonts/SUIT-Regular.ttf"),
    "SUIT-500": require("@/assets/fonts/SUIT-Medium.ttf"),
    "SUIT-600": require("@/assets/fonts/SUIT-SemiBold.ttf"),
    "SUIT-700": require("@/assets/fonts/SUIT-Bold.ttf"),
    "SUIT-800": require("@/assets/fonts/SUIT-ExtraBold.ttf"),
    Gangwon: require("@/assets/fonts/GANGWONSTATE-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GlobalStateProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </GlobalStateProvider>
  );
}
