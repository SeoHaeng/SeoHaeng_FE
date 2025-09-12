import Constants from "expo-constants";
import React, { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { WebView } from "react-native-webview";

interface TravelDetailMapProps {
  latitude: number;
  longitude: number;
  regions: string[];
  selectedDaySpots: {
    id: string;
    name: string;
    placeId?: number;
    latitude?: number;
    longitude?: number;
    placeType?: string;
  }[];
  onMessage?: (event: any) => void;
}

export interface TravelDetailMapRef {
  sendMessage: (message: any) => void;
}

const TravelDetailMap = forwardRef<TravelDetailMapRef, TravelDetailMapProps>(
  ({ latitude, longitude, regions, selectedDaySpots, onMessage }, ref) => {
    const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      sendMessage: (message: any) => {
        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify(message));
        }
      },
    }));

    // 카카오맵 HTML 생성
    const htmlContent = useMemo(() => {
      const spots = selectedDaySpots
        .filter((spot) => spot.latitude && spot.longitude)
        .map((spot, spotIndex) => ({
          id: spot.id,
          name: spot.name,
          lat: spot.latitude,
          lng: spot.longitude,
          placeType: spot.placeType,
        }));

      return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
          <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey || "undefined"}&libraries=services"></script>
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
            .map-info {
              position: absolute;
              top: 10px;
              left: 10px;
              background: rgba(255, 255, 255, 0.9);
              padding: 10px;
              border-radius: 8px;
              font-family: Arial, sans-serif;
              font-size: 12px;
              z-index: 1000;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
        
          <script>
            let map;
            let markers = [];
            let isInitialized = false;
            
            function initializeMap() {
              console.log("맵 초기화 함수 호출됨");
              console.log("API Key: ${apiKey ? apiKey.substring(0, 10) + "..." : "undefined"}");
              
              if (isInitialized) {
                console.log("이미 초기화됨");
                return;
              }
              
              if (!window.kakao) {
                console.log("카카오 API 아직 로드되지 않음, 재시도...");
                setTimeout(initializeMap, 500);
                return;
              }
              
              if (!kakao.maps) {
                console.log("kakao.maps 아직 로드되지 않음, 재시도...");
                setTimeout(initializeMap, 500);
                return;
              }
              
              if (!kakao.maps.services) {
                console.log("kakao.maps.services 아직 로드되지 않음, 재시도...");
                setTimeout(initializeMap, 500);
                return;
              }
              
              console.log("kakao 객체들 모두 로드 완료");
              
              try {
                console.log("🗺️ 여행 상세 지도 초기화 시작");
                
                const mapContainer = document.getElementById('map');
                if (!mapContainer) {
                  console.error("❌ map 컨테이너를 찾을 수 없음");
                  return;
                }
                
                console.log("✅ map 컨테이너 찾음:", mapContainer);
                console.log("📍 컨테이너 크기:", mapContainer.offsetWidth, "x", mapContainer.offsetHeight);
                console.log("📍 API Key:", "${apiKey ? apiKey.substring(0, 10) + "..." : "undefined"}");
                
                const mapOption = {
                  center: new kakao.maps.LatLng(${latitude}, ${longitude}),
                  level: 8
                };
                
                console.log("🗺️ 지도 옵션:", mapOption);
                
                map = new kakao.maps.Map(mapContainer, mapOption);
                console.log("✅ 지도 객체 생성 완료");
                
                isInitialized = true;
                console.log("맵 초기화 완료");
                

                
                // 여행 장소 마커들 (빨간색) - 일차별로 번호 표시
                const spots = ${JSON.stringify(spots)};
                
                if (spots.length > 0) {
                  // 장소들의 중심점 계산
                  let centerLat = 0;
                  let centerLng = 0;
                  
                  spots.forEach((spot, spotIndex) => {
                    centerLat += spot.lat;
                    centerLng += spot.lng;
                    
                    const marker = new kakao.maps.Marker({
                      position: new kakao.maps.LatLng(spot.lat, spot.lng),
                      map: map
                    });
                    
                    // 여행 장소 마커 스타일 - 일차별 순서 번호 표시 (완전 동적 생성)
                    const markerNumber = spotIndex + 1;
                    const svgContent = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#716C69"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="1"/><text x="12" y="16" text-anchor="middle" fill="white" font-size="11" font-weight="normal">' + markerNumber + '</text></svg>';
                    const svgString = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgContent);
                    const travelSpotImage = new kakao.maps.MarkerImage(svgString, new kakao.maps.Size(32, 32));
                    marker.setImage(travelSpotImage);

                    
                    markers.push(marker);
                  });
                  
                  // 순차적 점선 연결 (1→2, 2→3, 3→4...)
                  if (spots.length > 1) {
                    for (let i = 0; i < spots.length - 1; i++) {
                      const currentSpot = spots[i];
                      const nextSpot = spots[i + 1];
                      
                      const polyline = new kakao.maps.Polyline({
                        path: [
                          new kakao.maps.LatLng(currentSpot.lat, currentSpot.lng),
                          new kakao.maps.LatLng(nextSpot.lat, nextSpot.lng)
                        ],
                        strokeWeight: 2,
                        strokeColor: '#000000',
                        strokeOpacity: 0.8,
                        strokeStyle: 'dash'
                      });
                      
                      polyline.setMap(map);
                      console.log((i + 1) + '번 → ' + (i + 2) + '번 점선 연결 완료');
                    }
                  }
                  
                  // 장소들의 중심점 계산
                  centerLat = centerLat / spots.length;
                  centerLng = centerLng / spots.length;
                  
                  // 중심점으로 지도 이동
                  map.setCenter(new kakao.maps.LatLng(centerLat, centerLng));
                  console.log("📍 장소들의 중심점으로 지도 이동:", centerLat, centerLng);
                  
                  // 모든 마커가 보이도록 지도 범위 조정
                  const bounds = new kakao.maps.LatLngBounds();
                  spots.forEach(spot => {
                    bounds.extend(new kakao.maps.LatLng(spot.lat, spot.lng));
                  });
                  
                  map.setBounds(bounds);
                  console.log("✅ 지도 범위 자동 조정 완료");
                }
                
                console.log("🎉 여행 상세 지도 초기화 완료!");
                
                // React Native로 지도 준비 완료 메시지 전송
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'mapReady',
                    message: 'TravelDetailMap 초기화 완료',
                    spotsCount: spots.length
                  }));
                }
                
              } catch (error) {
                console.error("❌ 지도 초기화 중 오류:", error);
              }
            }
            
            // 카카오 API 로드 완료 대기
            function waitForKakao() {
              if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
                console.log("카카오 API 완전히 로드됨");
                initializeMap();
              } else {
                console.log("카카오 API 로딩 대기 중...");
                setTimeout(waitForKakao, 100);
              }
            }
            
            // 카카오 API 로드 완료 대기 (추가 안전장치)
            function waitForKakaoMap() {
              if (typeof kakao !== 'undefined' && kakao.maps && kakao.maps.services) {
                console.log("✅ 카카오맵 SDK 로드 완료");
                initializeMap();
              } else {
                console.log("⏳ 카카오맵 SDK 아직 로딩 중, 100ms 후 재시도");
                setTimeout(waitForKakaoMap, 100);
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
              console.log("윈도우 로드 완료");
              if (!isInitialized) {
                setTimeout(waitForKakao, 1000);
                setTimeout(waitForKakaoMap, 1500);
              }
            });
            
            // 최종 안전장치
            setTimeout(function() {
              if (!isInitialized) {
                console.log("최종 안전장치 실행");
                waitForKakaoMap();
              }
            }, 3000);

            // React Native에서 메시지 받기
            window.addEventListener('message', function(event) {
              try {
                const data = JSON.parse(event.data);
                console.log("📨 TravelDetailMap 메시지 수신:", data);
                
                // 메시지 타입에 따른 처리
                switch (data.type) {
                  case 'centerMap':
                    if (data.latitude && data.longitude) {
                      map.setCenter(new kakao.maps.LatLng(data.latitude, data.longitude));
                    }
                    break;
                  case 'zoomIn':
                    map.setLevel(map.getLevel() - 1);
                    break;
                  case 'zoomOut':
                    map.setLevel(map.getLevel() + 1);
                    break;
                  case 'resetView':
                    if (spots && spots.length > 0) {
                      const bounds = new kakao.maps.LatLngBounds();
                      bounds.extend(new kakao.maps.LatLng(${latitude}, ${longitude}));
                      spots.forEach(spot => {
                        bounds.extend(new kakao.maps.LatLng(spot.lat, spot.lng));
                      });
                      map.setBounds(bounds);
                    }
                    break;
                }
              } catch (error) {
                console.error('메시지 처리 오류:', error);
              }
            });
          </script>
        </body>
      </html>
    `;
    }, [apiKey, latitude, longitude, regions, selectedDaySpots]);

    return (
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        onMessage={onMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("TravelDetailMap WebView 오류:", nativeEvent);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error("TravelDetailMap HTTP 오류:", nativeEvent);
        }}
      />
    );
  },
);

TravelDetailMap.displayName = "TravelDetailMap";

export default TravelDetailMap;
