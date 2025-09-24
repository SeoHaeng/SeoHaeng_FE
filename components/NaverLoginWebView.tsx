import Constants from "expo-constants";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

interface NaverLoginWebViewProps {
  visible: boolean;
  onClose: () => void;
  onCodeReceived: (code: string) => void;
}

const NaverLoginWebView: React.FC<NaverLoginWebViewProps> = ({
  visible,
  onClose,
  onCodeReceived,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      console.log("🔵 네이버 로그인 WebView 열림");
    }
  }, [visible]);

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    console.log("🔵 네이버 WebView 네비게이션:", url);

    // 네이버 로그인 성공 시 리다이렉트 URL에서 인가코드 추출
    if (
      url.includes("code=") &&
      url.includes(Constants.expoConfig?.extra?.OAUTH_REDIRECT_URI)
    ) {
      console.log("🔵 네이버 로그인 성공 URL 감지:", url);

      // URL에서 인가코드 추출
      const urlParams = new URLSearchParams(url.split("?")[1]);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      console.log("🔵 네이버 인가코드:", code);
      console.log("🔵 네이버 state:", state);

      if (code) {
        // 인가코드를 부모 컴포넌트로 전달
        onCodeReceived(code);
        onClose();
      } else {
        console.error("❌ 네이버 인가코드를 찾을 수 없음");
        onClose();
      }
    }

    // 에러 처리
    if (url.includes("error=")) {
      console.error("❌ 네이버 로그인 에러:", url);
      onClose();
    }
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("❌ 네이버 WebView 에러:", nativeEvent);
    onClose();
  };

  if (!visible) return null;

  const naverOAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${Constants.expoConfig?.extra?.NAVER_CLIENT_ID}&redirect_uri=${Constants.expoConfig?.extra?.OAUTH_REDIRECT_URI}&state=${Constants.expoConfig?.extra?.NAVER_STATE}`;

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
            네이버 로그인
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* WebView */}
        <View style={styles.webViewContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#03C75A" />
              <Text style={styles.loadingText} allowFontScaling={false}>
                네이버 로그인 페이지를 불러오는 중...
              </Text>
            </View>
          )}

          <WebView
            ref={webViewRef}
            source={{ uri: naverOAuthUrl }}
            style={styles.webView}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            mixedContentMode="compatibility"
            allowsFullscreenVideo={true}
            androidLayerType="hardware"
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#666666",
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  placeholder: {
    width: 30,
  },
  webViewContainer: {
    flex: 1,
    position: "relative",
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
    marginTop: 10,
    fontSize: 14,
    color: "#666666",
  },
  webView: {
    flex: 1,
  },
});

export default NaverLoginWebView;
