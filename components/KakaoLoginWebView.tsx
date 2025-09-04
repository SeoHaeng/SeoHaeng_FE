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

  // 카카오 OAuth URL
  const kakaoOAuthUrl =
    "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=2f457f4c7c6bc61411a671b4304b50c0&redirect_uri=http://localhost:3000/auth/kakao/callback&state=sGZAsXVZ5DriH5KWds7U8MNHIo%3D";

  // WebView에서 URL 변경 감지
  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    // redirect_uri로 리다이렉트되는지 확인
    if (url.includes("localhost:3000/auth/kakao/callback")) {
      // URL에서 인가 코드 추출
      const urlParams = new URL(url);
      const code = urlParams.searchParams.get("code");
      const state = urlParams.searchParams.get("state");

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
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>카카오 로그인</Text>
          <View style={styles.placeholder} />
        </View>

        {/* WebView */}
        <View style={styles.webViewContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#E60A34" />
              <Text style={styles.loadingText}>
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
    fontSize: 18,
    color: "#666666",
  },
  title: {
    fontSize: 18,
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
    fontSize: 14,
    color: "#666666",
    fontFamily: "SUIT-500",
  },
});
