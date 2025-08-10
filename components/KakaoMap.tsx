import Constants from "expo-constants";
import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

type KakaoMapProps = {
  latitude: number;
  longitude: number;
  regions?: string[];
};

export interface KakaoMapRef {
  postMessage: (message: string) => void;
}

// 지역별 좌표 데이터를 컴포넌트 외부로 이동하여 불변성 보장
const regionCoordinates = {
  강릉: { lat: 37.7519, lng: 128.8759 },
  양구: { lat: 38.1074, lng: 127.9892 },
  태백: { lat: 37.1641, lng: 128.9856 },
  평창: { lat: 37.3705, lng: 128.39 },
  횡성: { lat: 37.4868, lng: 127.9852 },
  원주: { lat: 37.3441, lng: 127.92 },
  춘천: { lat: 37.8228, lng: 127.7322 },
  양양: { lat: 38.0754, lng: 128.6189 },
  속초: { lat: 38.1667, lng: 128.5833 },
  영월: { lat: 37.1837, lng: 128.4615 },
  정선: { lat: 37.3807, lng: 128.66 },
  철원: { lat: 38.1466, lng: 127.3132 },
  화천: { lat: 38.1065, lng: 127.7062 },
  인제: { lat: 38.0685, lng: 128.17 },
  고성: { lat: 38.3785, lng: 128.4675 },
  동해: { lat: 37.5236, lng: 129.1144 },
  삼척: { lat: 37.45, lng: 129.1667 },
};

const KakaoMap = forwardRef<KakaoMapRef, KakaoMapProps>(
  ({ latitude, longitude, regions = [] }, ref) => {
    const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;

    // HTML 내용을 useMemo로 최적화하여 불필요한 재생성 방지
    const htmlContent = useMemo(() => {
      return `
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
            let markers = [];
            
            window.onload = function() {
              console.log('Kakao Map API Loaded');
              if (typeof kakao !== 'undefined' && kakao.maps) {
                console.log('Kakao Maps is available');
                const mapContainer = document.getElementById('map');
                const mapOption = {
                  center: new kakao.maps.LatLng(${latitude}, ${longitude}),
                  level: 7
                };
                map = new kakao.maps.Map(mapContainer, mapOption);

                // 선택된 지역들의 마커 추가
                const selectedRegions = ${JSON.stringify(regions)};
                const regionCoords = ${JSON.stringify(regionCoordinates)};
                
                selectedRegions.forEach(regionName => {
                  if (regionCoords[regionName]) {
                    const coords = regionCoords[regionName];
                    const markerPosition = new kakao.maps.LatLng(coords.lat, coords.lng);
                    
                    // 마커 생성
                    const marker = new kakao.maps.Marker({
                      position: markerPosition
                    });
                    
                    // 마커를 지도에 표시
                    marker.setMap(map);
                    markers.push(marker);
                    
                    // 마커 클릭 시 지역 이름 표시
                    const infowindow = new kakao.maps.InfoWindow({
                      content: '<div style="padding:5px;font-size:14px;font-weight:bold;">' + regionName + '</div>'
                    });
                    
                    kakao.maps.event.addListener(marker, 'click', function() {
                      infowindow.open(map, marker);
                    });
                  }
                });
                
                // 모든 마커가 보이도록 지도 범위 조정
                if (markers.length > 0) {
                  const bounds = new kakao.maps.LatLngBounds();
                  markers.forEach(marker => {
                    bounds.extend(marker.getPosition());
                  });
                  map.setBounds(bounds);
                }
              } else {
                console.error('Kakao Maps is not available');
              }
            };
            
            // React Native에서 메시지 받기
            window.addEventListener('message', function(event) {
              try {
                const data = JSON.parse(event.data);
                if (data.type === 'updateLocation' && map && markers.length > 0) {
                  const newPosition = new kakao.maps.LatLng(data.latitude, data.longitude);
                  map.setCenter(newPosition);
                  markers.forEach(marker => {
                    marker.setPosition(newPosition);
                  });
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
    }, [apiKey, latitude, longitude, regions]);

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
