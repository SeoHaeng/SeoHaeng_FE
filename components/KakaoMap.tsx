import Constants from "expo-constants";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

type KakaoMapProps = {
  latitude: number;
  longitude: number;
  onMessage?: (event: any) => void;
  moveToLocation?: { latitude: number; longitude: number } | null;
  independentBookstoreMarkers?: any[];
  bookStayMarkers?: any[];
  bookCafeMarkers?: any[];
  filterType?: string;
};

const KakaoMap = ({
  latitude,
  longitude,
  onMessage,
  moveToLocation,
  independentBookstoreMarkers = [],
  bookStayMarkers = [],
  bookCafeMarkers = [],
  filterType = "",
}: KakaoMapProps) => {
  const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;
  const webViewRef = useRef<WebView>(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  // WebView가 준비되었는지 확인
  const handleWebViewLoad = () => {
    console.log("🗺️ WebView 로드 완료");
    setIsWebViewReady(true);
  };

  // WebView 메시지 처리
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      //console.log("🗺️ React Native에서 WebView 메시지 수신:", data);

      if (data.type === "mapReady") {
        console.log("🗺️ 지도 준비됨 - WebView 준비 상태 설정");
        setIsWebViewReady(true);
      } else if (data.type === "testResponse") {
        console.log("✅ WebView 테스트 응답 수신:", data.message);
      } else if (data.type === "markerClicked") {
        console.log("📍 마커 클릭됨:", data.markerType, data.data.name);
      } else if (data.type === "viewportChanged") {
        //console.log("🔄 뷰포트 변경:", data);
      }

      if (onMessage) {
        onMessage(event);
      }
    } catch (error) {
      console.error("🗺️ 메시지 처리 오류:", error);
    }
  };

  // moveToLocation이 변경될 때 WebView에 메시지 전송
  useEffect(() => {
    if (moveToLocation && webViewRef.current) {
      console.log("🗺️ KakaoMap: moveToLocation 변경 감지:", moveToLocation);
      console.log("🗺️ KakaoMap: WebView ref 존재 여부:", !!webViewRef.current);
      console.log("🗺️ KakaoMap: WebView 준비 상태:", isWebViewReady);

      const message = JSON.stringify({
        type: "moveToLocation",
        latitude: moveToLocation.latitude,
        longitude: moveToLocation.longitude,
      });

      console.log("🗺️ KakaoMap: 전송할 메시지:", message);

      try {
        webViewRef.current.postMessage(message);
        console.log("🗺️ KakaoMap: postMessage 성공");
      } catch (error) {
        console.error("🗺️ KakaoMap: postMessage 실패:", error);
      }
    } else {
      console.log("🗺️ KakaoMap: moveToLocation 또는 webViewRef가 없음:", {
        moveToLocation: moveToLocation,
        webViewRef: !!webViewRef.current,
        isWebViewReady: isWebViewReady,
      });
    }
  }, [moveToLocation, isWebViewReady]);

  // 마커 데이터가 변경될 때 WebView에 전송
  useEffect(() => {
    console.log("🗺️ KakaoMap 마커 데이터 변경 감지:", {
      독립서점: independentBookstoreMarkers.length,
      북스테이: bookStayMarkers.length,
      북카페: bookCafeMarkers.length,
      필터타입: filterType,
      WebView준비상태: isWebViewReady,
    });

    // 각 마커 배열의 상세 정보 로깅
    if (independentBookstoreMarkers.length > 0) {
      console.log(
        "📚 독립서점 마커 상세:",
        independentBookstoreMarkers.slice(0, 3),
      );
    }
    if (bookStayMarkers.length > 0) {
      console.log("🏨 북스테이 마커 상세:", bookStayMarkers.slice(0, 3));
    }
    if (bookCafeMarkers.length > 0) {
      console.log("☕ 북카페 마커 상세:", bookCafeMarkers.slice(0, 3));
    }

    // WebView가 준비되고 마커가 있을 때만 전송
    if (
      isWebViewReady &&
      webViewRef.current &&
      (independentBookstoreMarkers.length > 0 ||
        bookStayMarkers.length > 0 ||
        bookCafeMarkers.length > 0)
    ) {
      console.log("🗺️ WebView로 마커 데이터 전송 시작");

      // 마커 데이터 전송
      const message = JSON.stringify({
        type: "updateMarkers",
        independentBookstoreMarkers,
        bookStayMarkers,
        bookCafeMarkers,
        filterType: "ALL", // 필터 타입을 "ALL"로 설정하여 모든 마커 표시
      });

      console.log("🗺️ WebView로 마커 메시지 전송:", {
        메시지_타입: "updateMarkers",
        독립서점_개수: independentBookstoreMarkers.length,
        북스테이_개수: bookStayMarkers.length,
        북카페_개수: bookCafeMarkers.length,
        필터타입: "ALL (모든 마커 표시)",
      });

      try {
        if (webViewRef.current) {
          webViewRef.current.postMessage(message);
          console.log("🗺️ postMessage 성공");
        } else {
          console.error("🗺️ WebView ref is null");
        }
      } catch (error) {
        console.error("🗺️ postMessage 실패:", error);
      }

      console.log("🗺️ 마커 데이터 WebView 전송 완료:", {
        독립서점: independentBookstoreMarkers.length,
        북스테이: bookStayMarkers.length,
        북카페: bookCafeMarkers.length,
        필터타입: "ALL",
      });
    } else {
      console.log("🗺️ 마커 데이터 전송 조건 미충족:");
      console.log("🗺️ WebView 준비 상태:", isWebViewReady);
      console.log("🗺️ WebView ref:", webViewRef.current);
      console.log("🗺️ 마커 개수:", {
        독립서점: independentBookstoreMarkers.length,
        북스테이: bookStayMarkers.length,
        북카페: bookCafeMarkers.length,
      });
    }
  }, [
    independentBookstoreMarkers,
    bookStayMarkers,
    bookCafeMarkers,
    isWebViewReady, // WebView 준비 상태 의존성 추가
    // filterType 의존성 제거 - 필터 타입 변경 시 마커 재전송하지 않음
  ]);

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
          var map;
          var myLocationMarker;
          
          window.onload = function() {
            console.log('Kakao Map API Loaded');
            if (typeof kakao !== 'undefined' && kakao.maps) {
              console.log('Kakao Maps is available');
              var mapContainer = document.getElementById('map');
              var mapOption = {
                center: new kakao.maps.LatLng(${latitude}, ${longitude}),
                level: 3
              };
              map = new kakao.maps.Map(mapContainer, mapOption);

              // 내 위치 마커 추가 (예쁜 파란색 원형 마커)
              var myLocationPosition = new kakao.maps.LatLng(${latitude}, ${longitude});
              
              // SVG로 범위 원과 마커를 통합한 이미지 생성
              var markerImage = new kakao.maps.MarkerImage(
                'data:image/svg+xml;charset=UTF-8,<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="32" fill="%230669FD" fill-opacity="0.2"/><circle cx="32" cy="32" r="12" fill="white"/><circle cx="32" cy="32" r="8" fill="%230669FD"/></svg>',
                new kakao.maps.Size(64, 64)
              );
              
              myLocationMarker = new kakao.maps.Marker({
                position: myLocationPosition,
                map: map,
                zIndex: 1000 // 다른 마커들보다 위에 표시
              });
              
              // 마커 이미지 설정
              myLocationMarker.setImage(markerImage);
              
              // 내 위치 마커는 절대 제거되지 않도록 보호
              myLocationMarker.setDraggable(false);
              
              console.log('Map and 내 위치 마커 created successfully');
              
              // 지도 로드 완료 후 이벤트 리스너 등록
              kakao.maps.event.addListener(map, 'tilesloaded', function() {
                console.log('🗺️ 지도 타일 로드 완료 - 이벤트 리스너 등록 시작');
                
                // 초기 뷰포트 정보 전송
                updateViewport();
                
                // 지도 이동/줌 이벤트 리스너 등록
                kakao.maps.event.addListener(map, 'dragend', function() {
                  updateViewport();
                });
                
                kakao.maps.event.addListener(map, 'zoom_changed', function() {
                  updateViewport();
                });
                
                kakao.maps.event.addListener(map, 'bounds_changed', function() {
                  updateViewport();
                });
                
               
              });
              
              // React Native로 메시지 전송
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'mapReady'
                }));
              }
              
            } else {
              console.error('Kakao Maps is not available');
            }
          };

          // React Native에서 보낸 메시지 처리 - document.addEventListener 사용
          console.log('🗺️ WebView: 메시지 수신 리스너 등록 시작');
          
          // 방법 2: document.addEventListener
          document.addEventListener('message', function(event) {
            console.log('=== WebView 메시지 수신 ===');
            console.log('받은 메시지:', event.data);
            handleMessage(event.data);
          });
          
          // 공통 메시지 처리 함수
          function handleMessage(messageData) {
            console.log('=== 공통 메시지 처리 함수 시작 ===');
            console.log('받은 메시지:', messageData);
            
            try {
              var data = JSON.parse(messageData);
              console.log('파싱된 메시지 데이터:', data);
              console.log('메시지 타입:', data.type);
              console.log('map 객체 존재 여부:', !!map);
              
              if (data.type === 'moveToLocation' && map) {
                console.log('🗺️ WebView: moveToLocation 메시지 수신됨');
                
                var newPosition = new kakao.maps.LatLng(data.latitude, data.longitude);
                console.log('🗺️ WebView: 새로운 위치:', newPosition.toString());
                console.log('🗺️ WebView: 현재 지도 중심:', map.getCenter().toString());
                
                // 지도 중심을 새로운 위치로 이동
                console.log('🗺️ WebView: 지도 이동 시작');
                map.panTo(newPosition, { duration: 300 });
                map.setLevel(3);
                console.log('🗺️ WebView: 지도 이동 완료');
                
                // 내 위치 마커도 새로운 위치로 이동
                if (myLocationMarker) {
                  console.log('🗺️ WebView: 내 위치 마커 이동 시작');
                  myLocationMarker.setPosition(newPosition);
                  console.log('🗺️ WebView: 내 위치 마커 이동 완료');
                } else {
                  console.warn('🗺️ WebView: myLocationMarker가 없음');
                }
                
                // 지도 이동 완료 후 React Native로 완료 메시지 전송
                if (window.ReactNativeWebView) {
                  var completeMessage = JSON.stringify({
                    type: 'moveToLocationComplete',
                    latitude: data.latitude,
                    longitude: data.longitude
                  });
                  
                  try {
                    window.ReactNativeWebView.postMessage(completeMessage);
                    console.log('🗺️ WebView: moveToLocationComplete 메시지 전송 성공');
                  } catch (error) {
                    console.error('WebView: 메시지 전송 실패:', error);
                  }
                }
                
                console.log('🗺️ WebView: moveToLocation 처리 완료');
              } else {
                console.log('🗺️ WebView: moveToLocation 조건 미충족:', {
                  messageType: data.type,
                  mapExists: !!map,
                  data: data
                });
              }
              
            } catch (error) {
              console.error('공통 메시지 처리 오류:', error);
            }
            
            console.log('=== 공통 메시지 처리 함수 완료 ===');
          }

          // 지도 뷰포트 변경 감지 (이동, 줌, 드래그 등)
          function updateViewport() {
            if (map && window.ReactNativeWebView) {
              var bounds = map.getBounds();
              var center = map.getCenter();
              var level = map.getLevel();
              
              var viewportData = {
                type: 'viewportChanged',
                north: bounds.getNorthEast().getLat(),
                south: bounds.getSouthWest().getLat(),
                east: bounds.getNorthEast().getLng(),
                west: bounds.getSouthWest().getLng(),
                centerLat: center.getLat(),
                centerLng: center.getLng(),
                zoom: level,
                timestamp: Date.now()
              };
              
              try {
                window.ReactNativeWebView.postMessage(JSON.stringify(viewportData));
              } catch (error) {
                console.error('WebView: 뷰포트 업데이트 메시지 전송 실패:', error);
              }
            }
          }

          // 지도 이벤트 리스너 등록
          // 지도 로드 완료 후 이벤트 리스너 등록
          // kakao.maps.event.addListener(map, 'tilesloaded', function() {
          //   // 초기 뷰포트 정보 전송
          //   updateViewport();
          
          //   // 지도 이동/줌 이벤트 리스너 등록
          //   kakao.maps.event.addListener(map, 'dragend', updateViewport);
          //   kakao.maps.event.addListener(map, 'zoom_changed', updateViewport);
          //   kakao.maps.event.addListener(map, 'bounds_changed', updateViewport);
          // });
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleMessage}
        onError={(e) => console.error("WebView error: ", e.nativeEvent)}
        androidLayerType="hardware"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        onLoad={handleWebViewLoad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default KakaoMap;
