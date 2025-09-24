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

interface GoogleLoginWebViewProps {
  visible: boolean;
  onClose: () => void;
  onCodeReceived: (code: string) => void;
}

const GoogleLoginWebView: React.FC<GoogleLoginWebViewProps> = ({
  visible,
  onClose,
  onCodeReceived,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    console.log("🔵 구글 WebView 네비게이션:", url);

    if (url.includes("code=") && url.includes(Constants.expoConfig?.extra?.OAUTH_REDIRECT_URI)) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      console.log("🔵 구글 인가코드 추출:", { code, state });

      if (code) {
        onCodeReceived(code);
        onClose();
      }
    }
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error("❌ 구글 WebView 에러:", nativeEvent);
    setIsLoading(false);
  };

  const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID}&redirect_uri=${Constants.expoConfig?.extra?.OAUTH_REDIRECT_URI}&state=${Constants.expoConfig?.extra?.GOOGLE_STATE}&scope=email`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText} allowFontScaling={false}>
              ✕
            </Text>
          </TouchableOpacity>
          <Text style={styles.title} allowFontScaling={false}>
            구글 로그인
          </Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.webViewContainer}>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4285F4" />
              <Text style={styles.loadingText} allowFontScaling={false}>
                구글 로그인 페이지를 불러오는 중...
              </Text>
            </View>
          )}
          <WebView
            ref={webViewRef}
            source={{ uri: googleOAuthUrl }}
            style={styles.webView}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadEnd={handleLoadEnd}
            onError={handleError}
            startInLoadingState={true}
            scalesPageToFit={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
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

export default GoogleLoginWebView;
