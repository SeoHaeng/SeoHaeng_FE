import Constants from "expo-constants";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { WebView } from "react-native-webview";

// 대한민국 남한 경계 좌표
const koreaBounds = {
  north: 38.6,
  south: 33.0,
  east: 132.0,
  west: 124.5,
};

type LocationPickerMapProps = {
  initialLatitude: number;
  initialLongitude: number;
  onLocationSelected: (
    latitude: number,
    longitude: number,
    address: string,
  ) => void;
  onCancel: () => void;
};

const LocationPickerMap = ({
  initialLatitude,
  initialLongitude,
  onLocationSelected,
  onCancel,
}: LocationPickerMapProps) => {
  const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  } | null>(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: initialLatitude,
    longitude: initialLongitude,
  });

  // selectedLocation 상태 변화 로그
  React.useEffect(() => {
    console.log("selectedLocation 상태 변화:", selectedLocation);
  }, [selectedLocation]);

  // 컴포넌트 마운트 시 현재 위치 가져오기
  React.useEffect(() => {
    getCurrentLocation();
  }, []);

  // 현재 위치 가져오기
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("위치 권한이 거부됨");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(newLocation);
      console.log("현재 위치 가져오기 완료:", newLocation);
    } catch (error) {
      console.log("현재 위치 가져오기 실패:", error);
    }
  };

  // HTML 내용
  const htmlContent = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
          <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services"></script>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              height: 100vh; 
            }
            html { 
              height: 100vh; 
            }
            #map { 
              width: 100%; 
              height: 100%; 
            }
            .center-marker {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 40px;
              height: 40px;
              background: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF0000"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>') no-repeat center;
              background-size: contain;
              pointer-events: none;
              z-index: 1000;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <div class="center-marker"></div>
          <script>
            let map;
            let updateTimer;
            let isInitialized = false;
        
            
            function initializeMap() {
              sendLog("맵 초기화 함수 호출됨");
              sendLog("API Key: ${apiKey ? apiKey.substring(0, 10) + "..." : "undefined"}");
              
              if (isInitialized) {
                sendLog("이미 초기화됨");
                return;
              }
              
              if (!window.kakao) {
                sendLog("카카오 API 아직 로드되지 않음, 재시도...");
                setTimeout(initializeMap, 500);
                return;
              }
              
              if (!kakao.maps) {
                sendLog("kakao.maps 아직 로드되지 않음, 재시도...");
                setTimeout(initializeMap, 500);
                return;
              }
              
              if (!kakao.maps.services) {
                sendLog("kakao.maps.services 아직 로드되지 않음, 재시도...");
                setTimeout(initializeMap, 500);
                return;
              }
              
              sendLog("kakao 객체들 모두 로드 완료");
              
              try {
                const mapContainer = document.getElementById('map');
                
                const mapOption = {
                  center: new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude}),
                  level: 3
                };
                
                map = new kakao.maps.Map(mapContainer, mapOption);
                
                isInitialized = true;
                sendLog("맵 초기화 완료");
                
                // 내 위치 마커 표시
                showMyLocationMarker();
                
                // 초기 주소 로드
                setTimeout(function() {
                  updateAddress();
                }, 1000);
                
                // 지도 이동 완료 이벤트
                kakao.maps.event.addListener(map, 'idle', function() {
                  sendLog("지도 idle (이동 완료)");
                  updateAddress();
                });
                
                kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
                  sendLog("맵 클릭됨");
                  const latlng = mouseEvent.latLng;
                  map.setCenter(latlng);
                  setTimeout(function() {
                    updateAddress();
                  }, 300);
                });
                
                sendLog("모든 이벤트 리스너 등록 완료");
                
              } catch (error) {
                sendLog("맵 초기화 중 오류: " + error.message);
              }
            }
            
                         function updateAddress() {
               sendLog("주소 업데이트 함수 호출됨");
               
               if (!map) {
                 sendLog("map이 없음");
                 return;
               }
               
               const center = map.getCenter();
               const lat = center.getLat();
               const lng = center.getLng();
               
               sendLog("현재 좌표: " + lat + ", " + lng);
               
               // 한국 영역 체크
               if (lat < 33.0 || lat > 38.6 || lng < 124.5 || lng > 132.0) {
                 sendLog("한국 영역 밖의 좌표");
                 sendLocationUpdate(lat, lng, "지원하지 않는 지역입니다");
                 return;
               }
               
               // 단순히 좌표만 전송 (주소 변환은 React Native에서 처리)
               sendLocationUpdate(lat, lng, "주소 변환 중...");
             }

             // 내 위치 마커 표시
             function showMyLocationMarker() {
               if (!map) {
                 sendLog("map이 없어서 마커를 표시할 수 없음");
                 return;
               }
               
               const myLocationPosition = new kakao.maps.LatLng(${currentLocation.latitude}, ${currentLocation.longitude});
               
               // 내 위치 마커 생성 (파란색 원형 마커)
               const myLocationMarker = new kakao.maps.Marker({
                 position: myLocationPosition,
                 map: map,
                 zIndex: 1000 // 다른 마커들보다 위에 표시
               });
               
               // 내 위치 마커는 절대 제거되지 않도록 보호
               myLocationMarker.setDraggable(false);
               
               sendLog("내 위치 마커 표시 완료");
             }
            
            function sendLocationUpdate(lat, lng, address) {
              const message = {
                type: 'locationUpdate',
                latitude: lat,
                longitude: lng,
                address: address
              };
              
              sendLog("React Native로 전송: " + JSON.stringify(message));
              
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify(message));
              }
            }
            
            function sendLog(message) {
              const logMessage = {
                type: 'log',
                message: message
              };
              
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify(logMessage));
              }
              
            }
            
            // 카카오 API 로드 완료 대기
            function waitForKakao() {
              if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
                sendLog("카카오 API 완전히 로드됨");
                initializeMap();
              } else {
                sendLog("카카오 API 로딩 대기 중...");
                setTimeout(waitForKakao, 100);
              }
            }
            
            // 시작
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', waitForKakao);
            } else {
              waitForKakao();
            }
            
            // 추가 안전장치
            window.addEventListener('load', function() {
              sendLog("윈도우 로드 완료");
              if (!isInitialized) {
                setTimeout(waitForKakao, 1000);
              }
            });
          </script>
        </body>
      </html>
    `;
  }, [apiKey, currentLocation.latitude, currentLocation.longitude]);

  // WebView에서 메시지 받기
  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "log") {
        console.log("WebView 로그:", data.message);
      } else if (data.type === "locationUpdate") {
        console.log("위치 업데이트:", data.latitude, data.longitude);

        // expo-location을 사용하여 주소 변환
        try {
          const addressResponse = await Location.reverseGeocodeAsync({
            latitude: data.latitude,
            longitude: data.longitude,
          });

          if (addressResponse.length > 0) {
            const address = addressResponse[0];
            // 전체 주소 구성
            const fullAddress = [
              address.region,
              address.city,
              address.district,
              address.street,
              address.name,
            ]
              .filter(Boolean)
              .join(" ");

            setSelectedLocation({
              lat: data.latitude,
              lng: data.longitude,
              address: fullAddress || "알 수 없는 지역",
            });
          } else {
            // 주소 변환 실패 시 기본 주소 사용
            setSelectedLocation({
              lat: data.latitude,
              lng: data.longitude,
              address: `위도 ${data.latitude.toFixed(4)}, 경도 ${data.longitude.toFixed(4)}`,
            });
          }
        } catch (error) {}
      }
    } catch (error) {
      console.log("메시지 파싱 오류:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // 이정표 화면으로 이동
            router.push("/(tabs)/milestone");
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.instructionText}>
          지도를 움직여서 위치를 선택해주세요
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* 맵 */}
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        onLoad={() => {
          console.log("WebView 로드 완료");
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.log("WebView 에러:", nativeEvent);
        }}
        onLoadEnd={() => {
          console.log("WebView 로드 종료");
        }}
        androidLayerType="hardware"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        allowsFullscreenVideo={true}
        startInLoadingState={true}
      />

      {/* 하단 안내 및 버튼 */}
      <View style={styles.bottomContainer}>
        {selectedLocation ? (
          <View style={styles.locationInfo}>
            <Text style={styles.addressText}>{selectedLocation.address}</Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() =>
                onLocationSelected(
                  selectedLocation.lat,
                  selectedLocation.lng,
                  selectedLocation.address,
                )
              }
            >
              <Text style={styles.confirmButtonText}>여기로 하기 {">"}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.loadingText}>주소를 불러오는 중...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: "#333",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  placeholder: {
    width: 44,
  },
  webview: {
    flex: 1,
  },
  bottomContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  instructionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  locationInfo: {
    alignItems: "center",
  },
  addressText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});

export default LocationPickerMap;
