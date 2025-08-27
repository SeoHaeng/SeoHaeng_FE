import { useFonts } from "expo-font";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Text, TextInput } from "react-native";
import { AuthProvider, useAuth } from "../components/AuthProvider";

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

// 인증 상태에 따른 화면 라우팅을 관리하는 컴포넌트
function RootLayoutNav() {
  const { authState, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

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
    segments,
    isLoading,
    router,
  ]);

  // 로딩 중일 때는 빈 화면을 보여주지 않음
  return <Slot />;
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "SUIT-400": require("@/assets/fonts/SUIT-Regular.ttf"),
    "SUIT-500": require("@/assets/fonts/SUIT-Medium.ttf"),
    "SUIT-600": require("@/assets/fonts/SUIT-SemiBold.ttf"),
    "SUIT-700": require("@/assets/fonts/SUIT-Bold.ttf"),
    "SUIT-800": require("@/assets/fonts/SUIT-ExtraBold.ttf"),
    Gangwon: require("@/assets/fonts/GANGWONSTATE-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
