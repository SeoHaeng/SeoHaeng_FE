import Constants from "expo-constants";
import React, { forwardRef, useImperativeHandle } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

type KakaoMapProps = {
  latitude: number;
  longitude: number;
};

export interface KakaoMapRef {
  postMessage: (message: string) => void;
}

const KakaoMap = forwardRef<KakaoMapRef, KakaoMapProps>(
  ({ latitude, longitude }, ref) => {
    const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services"></script>
        <style>
          body { margin: 0; padding: 0; height: 100%; }
          html { height: 100%; }
          #map { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          let map;
          let marker;
          
          window.onload = function() {
            console.log('Kakao Map API Loaded');
            if (typeof kakao !== 'undefined' && kakao.maps) {
              console.log('Kakao Maps is available');
              const mapContainer = document.getElementById('map');
              const mapOption = {
                center: new kakao.maps.LatLng(${latitude}, ${longitude}),
                level: 3
              };
              map = new kakao.maps.Map(mapContainer, mapOption);

              // 마커 추가 (선택 사항)
              const markerPosition = new kakao.maps.LatLng(${latitude}, ${longitude});
              marker = new kakao.maps.Marker({
                position: markerPosition
              });
              marker.setMap(map);
            } else {
              console.error('Kakao Maps is not available');
            }
          };
          
          // React Native에서 메시지 받기
          window.addEventListener('message', function(event) {
            try {
              const data = JSON.parse(event.data);
              if (data.type === 'updateLocation' && map && marker) {
                const newPosition = new kakao.maps.LatLng(data.latitude, data.longitude);
                map.setCenter(newPosition);
                marker.setPosition(newPosition);
                console.log('Location updated:', data.latitude, data.longitude);
              }
            } catch (error) {
              console.error('Error parsing message:', error);
            }
          });
        </script>
      </body>
    </html>
  `;

    console.log("Kakao Map JS Key:", apiKey);

    const webViewRef = React.useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      postMessage: (message: string) => {
        webViewRef.current?.postMessage(message);
      },
    }));

    return (
      <View style={styles.container}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onLoad={() => console.log("WebView loaded successfully")}
          onError={(e) => console.error("WebView error: ", e.nativeEvent)}
          injectedJavaScript={`(function() {
          window.console.log = function(message) {
            window.ReactNativeWebView.postMessage(message);
          }
        })();`}
          onMessage={(event) => console.log(event.nativeEvent.data)}
        />
      </View>
    );
  },
);

KakaoMap.displayName = "KakaoMap";

export default KakaoMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
