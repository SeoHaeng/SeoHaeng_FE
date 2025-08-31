import Constants from "expo-constants";
import React, { forwardRef, useImperativeHandle, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";

type ItineraryMapProps = {
  latitude: number;
  longitude: number;
  regions: string[];
  onMessage?: (event: any) => void;
  selectedDaySpots?: Array<{
    id: string;
    name: string;
    latitude?: number;
    longitude?: number;
    placeType?: string;
  }>;
};

export interface ItineraryMapRef {
  postMessage: (message: string) => void;
}

// 대한민국 남한 경계 좌표
const koreaBounds = {
  north: 38.6,
  south: 33.0,
  east: 132.0,
  west: 124.5,
};

// 지역별 좌표 데이터
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

const ItineraryMap = forwardRef<ItineraryMapRef, ItineraryMapProps>(
  ({ latitude, longitude, regions, onMessage, selectedDaySpots = [] }, ref) => {
    const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;
    const webViewRef = React.useRef<WebView>(null);

    // selectedDaySpots가 변경될 때마다 지도에 마커 업데이트
    React.useEffect(() => {
      if (webViewRef.current && selectedDaySpots.length > 0) {
        const message = JSON.stringify({
          type: "updateSpots",
          spots: selectedDaySpots,
        });
        webViewRef.current.postMessage(message);
      }
    }, [selectedDaySpots]);

    // HTML 내용
    const htmlContent = useMemo(() => {
      return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services"></script>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              height: 100vh; 
              width: 100vw;
              overflow: hidden;
            }
            html { 
              height: 100vh; 
              width: 100vw;
            }
            #map { 
              width: 100%; 
              height: 100%; 
              position: absolute;
              top: 0;
              left: 0;
              background-color: #f0f0f0;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            let map;
            let regionMarkers = [];
            
            // 카카오맵 SDK 로딩 대기 함수
            function waitForKakaoMap() {
              console.log("🔄 카카오맵 SDK 로딩 대기 중...");
              
              if (typeof kakao !== 'undefined' && kakao.maps) {
                console.log("✅ 카카오맵 SDK 로드 완료");
                initializeMap();
              } else {
                console.log("⏳ 카카오맵 SDK 아직 로딩 중, 100ms 후 재시도");
                setTimeout(waitForKakaoMap, 100);
              }
            }
            
            // 지도 초기화 함수
            function initializeMap() {
              console.log("🗺️ 지도 초기화 시작");
              
              try {
                const mapContainer = document.getElementById('map');
                if (!mapContainer) {
                  console.error("❌ map 컨테이너를 찾을 수 없음");
                  return;
                }
                
                console.log("✅ map 컨테이너 찾음:", mapContainer);
                console.log("📍 컨테이너 크기:", mapContainer.offsetWidth, "x", mapContainer.offsetHeight);
                
                const initialLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, ${latitude}));
                const initialLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, ${longitude}));
                
                console.log("📍 초기 좌표:", initialLat, initialLng);
                console.log("📍 API Key:", "${apiKey ? apiKey.substring(0, 10) + "..." : "undefined"}");
                
                const mapOption = {
                  center: new kakao.maps.LatLng(initialLat, initialLng),
                  level: 5
                };
                
                console.log("🗺️ 지도 옵션:", mapOption);
                
                map = new kakao.maps.Map(mapContainer, mapOption);
                console.log("✅ 지도 객체 생성 완료");
                console.log("📍 지도 객체:", map);
                
                // 지도 범위 제한 설정
                const southWest = new kakao.maps.LatLng(${koreaBounds.south}, ${koreaBounds.west});
                const northEast = new kakao.maps.LatLng(${koreaBounds.north}, ${koreaBounds.east});
                const bounds = new kakao.maps.LatLngBounds(southWest, northEast);
                map.setMaxBounds(bounds);
                console.log("✅ 지도 범위 제한 설정 완료");

                // 선택된 지역들의 마커 추가
                const selectedRegions = ${JSON.stringify(regions)};
                const regionCoords = ${JSON.stringify(regionCoordinates)};
                
                console.log("📍 선택된 지역:", selectedRegions);
                
                selectedRegions.forEach(regionName => {
                  if (regionCoords[regionName]) {
                    const coords = regionCoords[regionName];
                    const markerPosition = new kakao.maps.LatLng(coords.lat, coords.lng);
                    
                    const marker = new kakao.maps.Marker({
                      position: markerPosition
                    });
                    
                    marker.setMap(map);
                    regionMarkers.push(marker);
                    
                    const infowindow = new kakao.maps.InfoWindow({
                      content: '<div style="padding:8px;font-size:14px;font-weight:bold;">' + regionName + '</div>'
                    });
                    
                    kakao.maps.event.addListener(marker, 'click', function(event) {
                      if (event && event.stopPropagation) {
                        event.stopPropagation();
                      }
                      infowindow.open(map, marker);
                    });
                    
                    console.log("📍 마커 추가됨:", regionName, coords.lat, coords.lng);
                  }
                });
                
                // 지역 마커들이 모두 보이도록 지도 범위 조정
                if (regionMarkers.length > 0) {
                  const bounds = new kakao.maps.LatLngBounds();
                  regionMarkers.forEach(marker => {
                    bounds.extend(marker.getPosition());
                  });
                  map.setBounds(bounds);
                  console.log("✅ 지도 범위 자동 조정 완료");
                }
                
                // 지도 이동 시 범위 제한 확인
                kakao.maps.event.addListener(map, 'bounds_changed', function() {
                  const center = map.getCenter();
                  const lat = center.getLat();
                  const lng = center.getLng();
                  
                  if (lat < ${koreaBounds.south} || lat > ${koreaBounds.north} || 
                      lng < ${koreaBounds.west} || lng > ${koreaBounds.east}) {
                    const restrictedLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, lat));
                    const restrictedLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, lng));
                    
                    const newPosition = new kakao.maps.LatLng(restrictedLat, restrictedLng);
                    map.setCenter(newPosition);
                  }
                });
                
                console.log("🎉 지도 초기화 완료!");
                
                // React Native로 지도 준비 완료 메시지 전송
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'mapReady',
                    message: 'ItineraryMap 초기화 완료'
                  }));
                }
                
              } catch (error) {
                console.error("❌ 지도 초기화 중 오류:", error);
              }
            }
            
            // 페이지 로드 시 카카오맵 SDK 로딩 대기
            window.onload = function() {
              console.log("🌐 ItineraryMap WebView 로드 시작");
              waitForKakaoMap();
            };

            // React Native에서 메시지 받기
            window.addEventListener('message', function(event) {
              try {
                const data = JSON.parse(event.data);
                console.log("📨 ItineraryMap 메시지 수신:", data);
                
                if (data.type === 'updateSpots') {
                  updateSpotsOnMap(data.spots);
                }
              } catch (error) {
                console.error("❌ 메시지 처리 오류:", error);
              }
            });

            // 장소 마커들을 지도에 표시하는 함수
            function updateSpotsOnMap(spots) {
              // 기존 마커들 제거
              if (window.spotMarkers) {
                window.spotMarkers.forEach(marker => marker.setMap(null));
              }
              window.spotMarkers = [];

              // 새로운 마커들 추가
              spots.forEach((spot, index) => {
                if (spot.latitude && spot.longitude) {
                  const position = new kakao.maps.LatLng(spot.latitude, spot.longitude);
                  
                  // 마커 이미지 생성 (장소 타입에 따라 다른 색상)
                  let markerColor = '#FF6B6B'; // 기본 빨간색
                  if (spot.placeType === 'BOOKSTORE') markerColor = '#4ECDC4'; // 독립서점
                  else if (spot.placeType === 'BOOKCAFE') markerColor = '#45B7D1'; // 북카페
                  else if (spot.placeType === 'BOOKSTAY') markerColor = '#96CEB4'; // 북스테이
                  else if (spot.placeType === 'TOURIST_SPOT') markerColor = '#FFEAA7'; // 관광명소
                  else if (spot.placeType === 'RESTAURANT') markerColor = '#DDA0DD'; // 식당/카페
                  
                  const markerImage = new kakao.maps.MarkerImage(
                    'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="' + markerColor + '"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
                    new kakao.maps.Size(32, 32)
                  );
                  
                  const marker = new kakao.maps.Marker({
                    position: position,
                    map: map,
                    title: spot.name,
                    image: markerImage
                  });
                  
                  // 마커 클릭 시 InfoWindow 표시
                  const infowindow = new kakao.maps.InfoWindow({
                    content: '<div style="padding:8px;font-size:12px;font-weight:600;color:#262423;text-align:center;min-width:80px;border-radius:3px;">' + spot.name + '</div>',
                    removable: false
                  });
                  
                  kakao.maps.event.addListener(marker, 'click', function() {
                    infowindow.open(map, marker);
                  });
                  
                  window.spotMarkers.push(marker);
                }
              });
              
              console.log('📍 장소 마커 업데이트 완료:', spots.length, '개');
            }
          </script>
        </body>
      </html>
    `;
    }, [apiKey, latitude, longitude, regions]);

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
          onLoad={() => console.log("🌐 ItineraryMap WebView 로드 완료")}
          onError={(e) =>
            console.error("ItineraryMap WebView error: ", e.nativeEvent)
          }
          onMessage={
            onMessage ||
            ((event) => {
              try {
                const data = JSON.parse(event.nativeEvent.data);
                console.log("📨 ItineraryMap 메시지 수신:", data);
              } catch (error) {
                console.log("ItineraryMap 메시지 파싱 오류:", error);
              }
            })
          }
          androidLayerType="hardware"
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>지도 로딩 중...</Text>
            </View>
          )}
        />
      </View>
    );
  },
);

ItineraryMap.displayName = "ItineraryMap";

export default ItineraryMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#F8F8F8",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
});
