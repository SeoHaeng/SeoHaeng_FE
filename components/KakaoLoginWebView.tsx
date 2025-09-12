import Constants from "expo-constants";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

interface KakaoLoginWebViewProps {
  visible: boolean;
  onClose: () => void;
  onCodeReceived: (code: string) => void;
}

export default function KakaoLoginWebView({
  visible,
  onClose,
  onCodeReceived,
}: KakaoLoginWebViewProps) {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 카카오 OAuth URL (환경변수 사용)
  const kakaoOAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${Constants.expoConfig?.extra?.KAKAO_CLIENT_ID}&redirect_uri=${Constants.expoConfig?.extra?.KAKAO_REDIRECT_URI}&state=${Constants.expoConfig?.extra?.KAKAO_STATE}`;

  // WebView에서 URL 변경 감지
  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    const redirectUri = Constants.expoConfig?.extra?.KAKAO_REDIRECT_URI;

    console.log("🔍 WebView URL 변경:", url);
    console.log("🔍 설정된 리다이렉트 URI:", redirectUri);

    // redirect_uri로 리다이렉트되는지 확인
    if (redirectUri && url.includes(redirectUri)) {
      // URL에서 인가 코드 추출
      const urlParams = new URL(url);
      const code = urlParams.searchParams.get("code");
      const state = urlParams.searchParams.get("state");

      console.log("✅ 리다이렉트 URI 매칭됨:", redirectUri);
      console.log("✅ 추출된 코드:", code);
      console.log("✅ 추출된 state:", state);

      if (code) {
        console.log("✅ 카카오 인가 코드 받음:", code);
        onCodeReceived(code);
        onClose();
      }
    }
  };

  // WebView 로딩 완료
  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText} allowFontScaling={false}>
              ✕
            </Text>
          </TouchableOpacity>
          <Text style={styles.title} allowFontScaling={false}>
            카카오 로그인
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* WebView */}
        <View style={styles.webViewContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E60A34" />
              <Text style={styles.loadingText} allowFontScaling={false}>
                카카오 로그인 페이지를 불러오는 중...
              </Text>
            </View>
          )}

          <WebView
            ref={webViewRef}
            source={{ uri: kakaoOAuthUrl }}
            style={styles.webView}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadEnd={handleLoadEnd}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 19,
    color: "#666666",
  },
  title: {
    fontSize: 19,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  placeholder: {
    width: 32,
  },
  webViewContainer: {
    flex: 1,
    position: "relative",
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#666666",
    fontFamily: "SUIT-500",
  },
});
