import Constants from "expo-constants";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import {
  createCulturalMarkerImages,
  createTouristMarkerImages,
} from "./bookstoreMarkers";

type KakaoMapProps = {
  latitude: number;
  longitude: number;
  userLocation?: { latitude: number; longitude: number } | null;
  onMessage?: (event: any) => void;
  moveToLocation?: { latitude: number; longitude: number } | null;
  searchSelectedLocation?: {
    latitude: number;
    longitude: number;
    name?: string;
  } | null;
  selectedLocation?: {
    latitude: number;
    longitude: number;
    name: string;
    placeId?: number;
  } | null;
  independentBookstoreMarkers?: any[];
  bookStayMarkers?: any[];
  bookCafeMarkers?: any[];
  readingSpotMarkers?: any[];
  touristSpotMarkers?: any[];
  restaurantMarkers?: any[];
  festivalMarkers?: any[];
  filterType?: string;
  activeMarkerId?: string | null; // 활성화된 마커 ID 추가
};

const KakaoMap = ({
  latitude,
  longitude,
  userLocation,
  onMessage,
  moveToLocation,
  searchSelectedLocation,
  selectedLocation,
  independentBookstoreMarkers = [],
  bookStayMarkers = [],
  bookCafeMarkers = [],
  readingSpotMarkers = [],
  touristSpotMarkers = [],
  restaurantMarkers = [],
  festivalMarkers = [],
  filterType = "",
  activeMarkerId = null, // 활성화된 마커 ID 추가
}: KakaoMapProps) => {
  const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;
  const webViewRef = useRef<WebView>(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  console.log("🎯 KakaoMap 컴포넌트 렌더링:", {
    activeMarkerId,
    isWebViewReady,
    webViewRef: !!webViewRef.current,
  });

  // WebView가 준비되었는지 확인
  const handleWebViewLoad = () => {
    // console.log("🗺️ WebView 로드 완료");
    setIsWebViewReady(true);
  };

  // WebView 메시지 처리
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      //console.log("🗺️ React Native에서 WebView 메시지 수신:", data);

      if (data.type === "mapReady") {
        // console.log("🗺️ 지도 준비됨 - WebView 준비 상태 설정");
        setIsWebViewReady(true);
        setMapError(null); // 지도 로드 성공 시 에러 초기화
      } else if (data.type === "mapError") {
        console.error("🗺️ 지도 로드 에러:", data.message);
        setMapError(data.message);
      } else if (data.type === "testResponse") {
        // console.log("✅ WebView 테스트 응답 수신:", data.message);
      } else if (data.type === "markerClicked") {
        // console.log("📍 마커 클릭됨:", data.markerType, data.data.name);
      } else if (data.type === "viewportChanged") {
        //console.log("🔄 뷰포트 변경:", data);
      }

      if (onMessage) {
        onMessage(event);
      }
    } catch {
      // console.error("🗺️ 메시지 처리 오류");
    }
  };

  // moveToLocation이 변경될 때 WebView에 메시지 전송
  useEffect(() => {
    if (moveToLocation && webViewRef.current && isWebViewReady) {
      // console.log("🗺️ KakaoMap: moveToLocation 변경 감지:", moveToLocation);
      // console.log("🗺️ KakaoMap: WebView ref 존재 여부:", !!webViewRef.current);
      // console.log("🗺️ KakaoMap: WebView 준비 상태:", isWebViewReady);

      // 강제로 지도 이동 메시지 전송
      const message = JSON.stringify({
        type: "moveToLocation",
        latitude: moveToLocation.latitude,
        longitude: moveToLocation.longitude,
      });

      // console.log("🗺️ KakaoMap: 강제 지도 이동 메시지 전송:", message);

      try {
        webViewRef.current?.postMessage(message);
        // console.log("🗺️ KakaoMap: 강제 지도 이동 메시지 전송 성공");

        // 추가로 지도 중심점도 강제 업데이트
        const centerMessage = JSON.stringify({
          type: "forceCenter",
          latitude: moveToLocation.latitude,
          longitude: moveToLocation.longitude,
        });

        setTimeout(() => {
          webViewRef.current?.postMessage(centerMessage);
          // console.log("🗺️ KakaoMap: 지도 중심점 강제 업데이트 메시지 전송");
        }, 50); // 50ms로 단축
      } catch {
        // console.error("🗺️ KakaoMap: 강제 지도 이동 메시지 전송 실패");
      }
    } else {
      // console.log("🗺️ KakaoMap: moveToLocation 또는 webViewRef가 없음:", {
      //   moveToLocation: moveToLocation,
      //   webViewRef: !!webViewRef.current,
      //   isWebViewReady: isWebViewReady,
      // });
    }
  }, [moveToLocation, isWebViewReady]);

  // selectedLocation이 변경될 때 WebView에 선택된 장소 마커 업데이트 메시지 전송
  useEffect(() => {
    if (selectedLocation && webViewRef.current && isWebViewReady) {
      // console.log("📍 KakaoMap: selectedLocation 변경 감지:", selectedLocation);

      const message = JSON.stringify({
        type: "updateSelectedLocation",
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        name: selectedLocation.name,
        placeId: selectedLocation.placeId,
      });

      console.log("📍 KakaoMap: updateSelectedLocation 메시지 전송:", message);

      // console.log(
      //   "📍 KakaoMap: 선택된 장소 마커 업데이트 메시지 전송:",
      //   message,
      // );

      try {
        webViewRef.current.postMessage(message);
        // console.log("📍 KakaoMap: 선택된 장소 마커 업데이트 메시지 전송 성공");
      } catch {
        // console.error(
        //   "📍 KakaoMap: 선택된 장소 마커 업데이트 메시지 전송 실패"
        // );
      }
    }
  }, [selectedLocation, isWebViewReady]);

  // activeMarkerId가 변경될 때 WebView에 마커 활성화 메시지 전송
  useEffect(() => {
    console.log("🎯 KakaoMap: activeMarkerId useEffect 실행:", {
      activeMarkerId,
      webViewRef: !!webViewRef.current,
      isWebViewReady,
    });

    if (activeMarkerId && webViewRef.current && isWebViewReady) {
      console.log("🎯 KakaoMap: activeMarkerId 변경 감지:", activeMarkerId);

      const message = JSON.stringify({
        type: "activateMarker",
        markerId: activeMarkerId,
      });

      console.log("🎯 KakaoMap: 마커 활성화 메시지 전송:", message);

      try {
        webViewRef.current.postMessage(message);
        console.log("🎯 KakaoMap: 마커 활성화 메시지 전송 성공");
      } catch (error) {
        console.error("🎯 KakaoMap: 마커 활성화 메시지 전송 실패:", error);
      }
    } else {
      console.log("🎯 KakaoMap: activeMarkerId 메시지 전송 조건 불충족:", {
        activeMarkerId: !!activeMarkerId,
        webViewRef: !!webViewRef.current,
        isWebViewReady,
      });
    }
  }, [activeMarkerId, isWebViewReady]);

  // searchSelectedLocation이 변경될 때 WebView에 검색 선택 장소 이동 메시지 전송
  useEffect(() => {
    if (searchSelectedLocation && webViewRef.current && isWebViewReady) {
      console.log(
        "🔍 KakaoMap: searchSelectedLocation 변경 감지:",
        searchSelectedLocation,
      );

      const message = JSON.stringify({
        type: "searchSelectedLocation",
        latitude: searchSelectedLocation.latitude,
        longitude: searchSelectedLocation.longitude,
        name: searchSelectedLocation.name, // 장소 이름 포함
      });

      console.log("🔍 KakaoMap: 검색 선택 장소 이동 메시지 전송:", message);

      try {
        webViewRef.current?.postMessage(message);
        console.log("🔍 KakaoMap: 검색 선택 장소 이동 메시지 전송 성공");
      } catch (error) {
        console.error(
          "🔍 KakaoMap: 검색 선택 장소 이동 메시지 전송 실패:",
          error,
        );
      }
    }
  }, [searchSelectedLocation, isWebViewReady]);

  // latitude, longitude props가 변경될 때 지도 중심점 업데이트
  // 단, searchSelectedLocation이 있을 때는 전송하지 않음 (검색 선택 장소로 이동 중이므로)
  useEffect(() => {
    if (webViewRef.current && isWebViewReady && !searchSelectedLocation) {
      // console.log("🗺️ KakaoMap: 지도 중심점 업데이트:", {
      //   latitude,
      //   longitude,
      // });

      const message = JSON.stringify({
        type: "updateMapCenter",
        latitude: latitude,
        longitude: longitude,
      });

      try {
        webViewRef.current.postMessage(message);
        // console.log("🗺️ KakaoMap: 지도 중심점 업데이트 메시지 전송 성공");
      } catch {
        // console.error(
        //   "🗺️ KakaoMap: 지도 중심점 업데이트 메시지 전송 실패"
        // );
      }
    }
  }, [latitude, longitude, isWebViewReady, searchSelectedLocation]);

  // 마커 데이터가 변경될 때 WebView에 전송
  useEffect(() => {
    // console.log("🗺️ KakaoMap 마커 데이터 변경 감지:", {
    //   독립서점: independentBookstoreMarkers.length,
    //   북스테이: bookStayMarkers.length,
    //   북카페: bookCafeMarkers.length,
    //   공간책갈피: readingSpotMarkers.length,
    //   필터타입: filterType,
    //   WebView준비상태: isWebViewReady,
    // });

    // WebView가 준비되고 마커가 있을 때만 전송
    if (
      isWebViewReady &&
      webViewRef.current &&
      (independentBookstoreMarkers.length > 0 ||
        bookStayMarkers.length > 0 ||
        bookCafeMarkers.length > 0 ||
        readingSpotMarkers.length > 0 ||
        touristSpotMarkers.length > 0 ||
        restaurantMarkers.length > 0 ||
        festivalMarkers.length > 0)
    ) {
      // console.log("🗺️ WebView로 마커 데이터 전송 시작");

      // 마커 데이터 전송
      const message = JSON.stringify({
        type: "updateMarkers",
        independentBookstoreMarkers,
        bookStayMarkers,
        bookCafeMarkers,
        readingSpotMarkers,
        touristSpotMarkers,
        restaurantMarkers,
        festivalMarkers,
        filterType: "ALL", // 필터 타입을 "ALL"로 설정하여 모든 마커 표시
      });

      // console.log("🗺️ WebView로 마커 메시지 전송:", {
      //   메시지_타입: "updateMarkers",
      //   독립서점_개수: independentBookstoreMarkers.length,
      //   북스테이_개수: bookStayMarkers.length,
      //   북카페_개수: bookCafeMarkers.length,
      //   공간책갈피_개수: readingSpotMarkers.length,
      //   필터타입: "ALL (모든 마커 표시)",
      // });

      try {
        if (webViewRef.current) {
          webViewRef.current.postMessage(message);
          // console.log("🗺️ postMessage 성공");
        } else {
          // console.error("🗺️ WebView ref is null");
        }
      } catch {
        // console.error("🗺️ postMessage 실패");
      }

      // console.log("🗺️ 마커 데이터 WebView 전송 완료:", {
      //   독립서점: independentBookstoreMarkers.length,
      //   북스테이: bookStayMarkers.length,
      //   북카페: bookCafeMarkers.length,
      //   공간책갈피: readingSpotMarkers.length,
      //   필터타입: "ALL",
      // });
    } else {
      // console.log("🗺️ 마커 데이터 전송 조건 미충족:");
      // console.log("🗺️ WebView 준비 상태:", isWebViewReady);
      // console.log("🗺️ WebView ref:", webViewRef.current);
      // console.log("🗺️ 마커 개수:", {
      //   독립서점: independentBookstoreMarkers.length,
      //   북스테이: bookStayMarkers.length,
      //   북카페: bookCafeMarkers.length,
      //   공간책갈피: readingSpotMarkers.length,
      // });
    }
  }, [
    independentBookstoreMarkers,
    bookStayMarkers,
    bookCafeMarkers,
    readingSpotMarkers,
    touristSpotMarkers,
    restaurantMarkers,
    festivalMarkers,
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
          
          /* 커스텀 오버레이 스타일 */
          .customoverlay {
            position: relative;
            top: 0px;
            border-radius: 6px;
            border: 1px solid #ccc;
            border-bottom: 2px solid #ddd;
            float: left;
            background: #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }
          .customoverlay:nth-of-type(n) {
            border: 0;
            box-shadow: 0 1px 2px #888;
          }
          .customoverlay .title {
            display: block;
            text-align: center;
            background: #262423;
            margin-left: -1px;
            margin-right: -1px;
            padding: 8px 12px;
            font-size: 12px !important;
            font-weight: 600;
            color: #FFFFFF;
            border-radius: 6px;
            white-space: nowrap;
            min-width: 60px;
            /* 폰트 크기 고정을 위한 속성들 */
            font-size-adjust: none;
            text-size-adjust: none;
            -webkit-text-size-adjust: none;
            -moz-text-size-adjust: none;
            -ms-text-size-adjust: none;
            line-height: 1.2;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map;
          var myLocationMarker;
          var selectedLocationMarker = null; // 선택된 장소 마커
          var currentCustomOverlay = null; // 현재 열린 커스텀 오버레이
          
          // 마커 이미지 정의
          var markerImages = {
            독립서점: new kakao.maps.MarkerImage(
              'data:image/svg+xml;charset=UTF-8,${encodeURIComponent(createCulturalMarkerImages().독립서점)}',
              new kakao.maps.Size(48, 53)
            ),
            북카페: new kakao.maps.MarkerImage(
              'data:image/svg+xml;charset=UTF-8,${encodeURIComponent(createCulturalMarkerImages().북카페)}',
              new kakao.maps.Size(48, 53)
            ),
            북스테이: new kakao.maps.MarkerImage(
              'data:image/svg+xml;charset=UTF-8,${encodeURIComponent(createCulturalMarkerImages().북스테이)}',
              new kakao.maps.Size(48, 53)
            ),
            책갈피: new kakao.maps.MarkerImage(
              'data:image/svg+xml;charset=UTF-8,${encodeURIComponent(createCulturalMarkerImages().책갈피)}',
              new kakao.maps.Size(48, 53)
            ),
            관광지: new kakao.maps.MarkerImage(
              'data:image/svg+xml;charset=UTF-8,${encodeURIComponent(createTouristMarkerImages().관광지)}',
              new kakao.maps.Size(48, 53)
            ),
            맛집: new kakao.maps.MarkerImage(
              'data:image/svg+xml;charset=UTF-8,${encodeURIComponent(createTouristMarkerImages().맛집)}',
              new kakao.maps.Size(48, 53)
            ),
            축제: new kakao.maps.MarkerImage(
              'data:image/svg+xml;charset=UTF-8,${encodeURIComponent(createTouristMarkerImages().축제)}',
              new kakao.maps.Size(48, 53)
            ),
            선택된장소: new kakao.maps.MarkerImage(
              'data:image/svg+xml;charset=UTF-8,${encodeURIComponent(createCulturalMarkerImages().선택된장소)}',
              new kakao.maps.Size(48, 53)
            )
          };
          
          let isInitialized = false;
          
          function sendLog(message) {
            const logMessage = {
              type: 'log',
              message: message
            };
            
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify(logMessage));
            }
          }
          
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
              var mapContainer = document.getElementById('map');
              
              var mapOption = {
                center: new kakao.maps.LatLng(${latitude}, ${longitude}),
                level: 3
              };
              map = new kakao.maps.Map(mapContainer, mapOption);
              
              isInitialized = true;
              sendLog("맵 초기화 완료");
              
              // 내 위치 마커 추가 (예쁜 파란색 원형 마커)
              // userLocation이 있으면 사용, 없으면 기본값 사용
              var myLocationPosition = new kakao.maps.LatLng(
                ${userLocation ? userLocation.latitude : latitude}, 
                ${userLocation ? userLocation.longitude : longitude}
              );
              
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
              
              // 지도 로드 완료 후 이벤트 리스너 등록
              kakao.maps.event.addListener(map, 'tilesloaded', function() {
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
                
                // 지도 클릭 이벤트 리스너 등록
                kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
                  // 커스텀 오버레이 닫기
                  if (currentCustomOverlay) {
                    currentCustomOverlay.setMap(null);
                    currentCustomOverlay = null;
                  }
                  
                  // 마커가 클릭된 경우가 아닌 지도 자체가 클릭된 경우에만 처리
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'mapClicked',
                      lat: mouseEvent.latLng.getLat(),
                      lng: mouseEvent.latLng.getLng()
                    }));
                  }
                });
              });
              
              // React Native로 메시지 전송
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'mapReady'
                }));
              }
              
            } catch (error) {
              console.error('Kakao Maps 초기화 중 오류:', error);
              // React Native로 에러 메시지 전송
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'mapError',
                  message: 'Kakao Maps API를 로드할 수 없습니다. API 키를 확인해주세요.'
                }));
              }
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

          // React Native에서 보낸 메시지 처리 - document.addEventListener 사용
          // console.log('🗺️ WebView: 메시지 수신 리스너 등록 시작');
          
          // 방법 2: document.addEventListener
          document.addEventListener('message', function(event) {
            // console.log('=== WebView 메시지 수신 ===');
            // console.log('받은 메시지:', event.data);
            handleMessage(event.data);
          });
          
          // 공통 메시지 처리 함수
          function handleMessage(messageData) {
            // console.log('=== 공통 메시지 처리 함수 시작 ===');
            // console.log('받은 메시지:', messageData);
            
            try {
              var data = JSON.parse(messageData);
              // console.log('파싱된 메시지 데이터:', data);
              // console.log('메시지 타입:', data.type);
              // console.log('map 객체 존재 여부:', !!map);
              
              if (data.type === 'moveToLocation' && map) {
                // console.log('🗺️ WebView: moveToLocation 메시지 수신됨');
                
                var newPosition = new kakao.maps.LatLng(data.latitude, data.longitude);
                // console.log('🗺️ WebView: 새로운 위치:', newPosition.toString());
                // console.log('🗺️ WebView: 현재 지도 중심:', map.getCenter().toString());
                
                // 지도 중심을 새로운 위치로 강제 이동 (애니메이션 없이)
                // console.log('🗺️ WebView: 지도 강제 이동 시작');
                map.setCenter(newPosition);
                map.setLevel(3);
                // console.log('🗺️ WebView: 지도 강제 이동 완료');
                
                // 내 위치 마커도 새로운 위치로 이동
                if (myLocationMarker) {
                  // console.log('🗺️ WebView: 내 위치 마커 이동 시작');
                  myLocationMarker.setPosition(newPosition);
                  // console.log('🗺️ WebView: 내 위치 마커 이동 완료');
                } else {
                  // console.warn('🗺️ WebView: myLocationMarker가 없음');
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
                    // console.log('🗺️ WebView: moveToLocationComplete 메시지 전송 성공');
                  } catch (error) {
                    // console.error('WebView: 메시지 전송 실패:', error);
                  }
                }
                
                // console.log('🗺️ WebView: moveToLocation 처리 완료');
              } else if (data.type === 'searchSelectedLocation' && map) {
                console.log('🔍 WebView: 검색 선택 장소 이동 메시지 수신:', data);
                var newPosition = new kakao.maps.LatLng(data.latitude, data.longitude);
                
                // 지도 중심을 검색 선택 장소로 강제 이동
                console.log('🔍 WebView: 검색 선택 장소로 지도 이동 시작');
                map.setCenter(newPosition);
                map.setLevel(3);
                console.log('🔍 WebView: 검색 선택 장소로 지도 이동 완료');
                
                // 검색 선택 장소에 빨간색 마커 표시
                // selectedLocation의 placeId를 사용 (이미 전역 변수에 저장되어 있음)
                // data.name이 있으면 사용, 없으면 기본값 사용
                var markerName = data.name || '검색에서 선택된 장소';
                console.log('🔍 WebView: 마커 이름 설정:', markerName);
                updateSelectedLocationMarker(data.latitude, data.longitude, markerName, window.selectedLocationPlaceId);
                
                // 내 위치 마커는 이동시키지 않음 (원래 위치에 유지)
                console.log('🔍 WebView: 내 위치 마커는 이동하지 않음');
                
                // React Native로 완료 메시지 전송
                if (window.ReactNativeWebView) {
                  var completeMessage = JSON.stringify({
                    type: 'searchSelectedLocationComplete',
                    latitude: data.latitude,
                    longitude: data.longitude
                  });
                  
                  try {
                    window.ReactNativeWebView.postMessage(completeMessage);
                    console.log('🔍 WebView: searchSelectedLocationComplete 메시지 전송 성공');
                  } catch (error) {
                    // console.error('WebView: 메시지 전송 실패:', error);
                  }
                }
              } else if (data.type === 'forceCenter' && map) {
                // console.log('🗺️ WebView: 지도 중심점 강제 업데이트 메시지 수신:', data);
                var newCenter = new kakao.maps.LatLng(data.latitude, data.longitude);
                map.setCenter(newCenter);
                map.setLevel(3);
                // console.log('🗺️ WebView: 지도 중심점 강제 업데이트 완료:', newCenter.toString());
                
                // 내 위치 마커는 이동시키지 않음 (원래 위치에 유지)
                // console.log('🗺️ WebView: forceCenter - 내 위치 마커는 이동하지 않음');
              } else if (data.type === 'updateMapCenter' && map) {
                // console.log('🗺️ WebView: 지도 중심점 업데이트 메시지 수신:', data);
                var newCenter = new kakao.maps.LatLng(data.latitude, data.longitude);
                map.setCenter(newCenter);
                map.setLevel(3);
                // console.log('🗺️ WebView: 지도 중심점 업데이트 완료:', newCenter.toString());
                
                // 내 위치 마커는 이동시키지 않음 (원래 위치에 유지)
                // console.log('🗺️ WebView: updateMapCenter - 내 위치 마커는 이동하지 않음');
              } else if (data.type === 'updateSelectedLocation' && map) {
                // console.log('📍 선택된 장소 업데이트 메시지 수신:', data);
                updateSelectedLocationMarker(data.latitude, data.longitude, data.name, data.placeId);
              } else if (data.type === 'activateMarker' && map) {
                console.log('🎯 WebView: activateMarker 메시지 수신:', data);
                
                // selected_location_ 접두사가 있는 경우 빨간색 마커 처리
                if (data.markerId && data.markerId.startsWith('selected_location_')) {
                  console.log('🎯 WebView: 빨간색 마커 활성화 요청');
                  
                  // 기존 커스텀 오버레이 제거
                  if (currentCustomOverlay) {
                    currentCustomOverlay.setMap(null);
                    currentCustomOverlay = null;
                  }
                  
                  // selectedLocationMarker가 있으면 커스텀 오버레이 표시
                  if (selectedLocationMarker) {
                    console.log('🎯 WebView: 빨간색 마커 찾음, 커스텀 오버레이 표시');
                    
                    // 기존 커스텀 오버레이 제거
                    if (currentCustomOverlay) {
                      currentCustomOverlay.setMap(null);
                    }
                    
                    var content = '<div class="customoverlay">' +
                      '  <span class="title">' + selectedLocationMarker.getTitle() + '</span>' +
                      '</div>';
                    
                    var customOverlay = new kakao.maps.CustomOverlay({
                      map: map,
                      position: selectedLocationMarker.getPosition(),
                      content: content,
                      yAnchor: 0
                    });
                    
                    currentCustomOverlay = customOverlay;
                    console.log('🎯 WebView: 빨간색 마커 활성화 완료');
                  } else {
                    console.log('🎯 WebView: 빨간색 마커가 없음');
                  }
                  return;
                }
                
                // 모든 마커를 순회하면서 해당 ID의 마커를 찾아 활성화
                if (window.existingMarkers && window.existingMarkers.length > 0) {
                  var targetMarker = null;
                  
                  // 기존 커스텀 오버레이 제거
                  if (currentCustomOverlay) {
                    currentCustomOverlay.setMap(null);
                    currentCustomOverlay = null;
                  }
                  
                  console.log('🎯 WebView: 기존 마커 개수:', window.existingMarkers.length);
                  console.log('🎯 WebView: 찾을 마커 ID:', data.markerId);
                  console.log('🎯 WebView: 찾을 마커 ID 타입:', typeof data.markerId);
                  
                  // 마커 ID로 찾기 (placeId 또는 id로 매칭)
                  for (var i = 0; i < window.existingMarkers.length; i++) {
                    var marker = window.existingMarkers[i];
                    console.log('🎯 WebView: 마커', i, '검사:', {
                      title: marker.getTitle(),
                      placeId: marker.placeId,
                      markerId: marker.markerId,
                      targetId: data.markerId,
                      placeIdType: typeof marker.placeId,
                      markerIdType: typeof marker.markerId
                    });
                    
                    // 마커의 title에서 placeId를 추출하거나, 마커 객체의 속성에서 확인
                    if (marker.markerId === data.markerId || marker.placeId === data.markerId || marker.placeId === parseInt(data.markerId)) {
                      targetMarker = marker;
                      console.log('🎯 WebView: 마커 매칭 성공!');
                      break;
                    }
                  }
                  
                  if (targetMarker) {
                    console.log('🎯 WebView: 대상 마커 찾음, 커스텀 오버레이 표시');
                    
                    var content = '<div class="customoverlay">' +
                      '  <span class="title">' + targetMarker.getTitle() + '</span>' +
                      '</div>';
                    
                    var customOverlay = new kakao.maps.CustomOverlay({
                      map: map,
                      position: targetMarker.getPosition(),
                      content: content,
                      yAnchor: 0
                    });
                    
                    currentCustomOverlay = customOverlay;
                    console.log('🎯 WebView: 마커 활성화 완료');
                  } else {
                    console.log('🎯 WebView: 대상 마커를 찾을 수 없음:', data.markerId);
                    console.log('🎯 WebView: 모든 마커 정보:', window.existingMarkers.map(function(marker, index) {
                      return {
                        index: index,
                        title: marker.getTitle(),
                        placeId: marker.placeId,
                        markerId: marker.markerId
                      };
                    }));
                  }
                } else {
                  console.log('🎯 WebView: 기존 마커가 없음');
                }
              } else if (data.type === 'updateMarkers' && map) {
                // console.log('🗺️ WebView: 마커 업데이트 메시지 수신됨');
                
                // 기존 마커들 제거
                if (window.existingMarkers) {
                  window.existingMarkers.forEach(function(marker) {
                    marker.setMap(null);
                  });
                }
                
                // 새로운 마커 배열 생성
                window.existingMarkers = [];
                
                // 독립서점 마커 추가
                if (data.independentBookstoreMarkers && data.independentBookstoreMarkers.length > 0) {
                  // console.log('📚 독립서점 마커 추가:', data.independentBookstoreMarkers.length, '개');
                  data.independentBookstoreMarkers.forEach(function(bookstore) {
                    if (bookstore.latitude && bookstore.longitude) {
                      var marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(bookstore.latitude, bookstore.longitude),
                        map: map,
                        title: bookstore.name,
                        image: markerImages.독립서점
                      });
                      
                      // placeId를 마커 객체에 저장 (활성화 복원용)
                      marker.placeId = bookstore.placeId;
                      marker.markerId = bookstore.placeId ? bookstore.placeId.toString() : null;
                      
                      // 마커 클릭 이벤트
                      kakao.maps.event.addListener(marker, 'click', function() {
                        // 기존 커스텀 오버레이 제거
                        if (currentCustomOverlay) {
                          currentCustomOverlay.setMap(null);
                        }
                        
                        // 새로운 커스텀 오버레이 생성 및 표시
                        var content = '<div class="customoverlay">' +
                          '  <span class="title">' + bookstore.name + '</span>' +
                          '</div>';
                        
                        var customOverlay = new kakao.maps.CustomOverlay({
                          map: map,
                          position: marker.getPosition(),
                          content: content,
                          yAnchor: 0
                        });
                        
                        currentCustomOverlay = customOverlay;
                        
                        // React Native로 마커 클릭 메시지 전송
                        if (window.ReactNativeWebView) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'markerClicked',
                            markerType: '독립서점',
                            data: bookstore
                          }));
                        }
                      });
                      
                      window.existingMarkers.push(marker);
                    }
                  });
                }
                
                // 북스테이 마커 추가
                if (data.bookStayMarkers && data.bookStayMarkers.length > 0) {
                  // console.log('🏨 북스테이 마커 추가:', data.bookStayMarkers.length, '개');
                  data.bookStayMarkers.forEach(function(bookstay) {
                    if (bookstay.latitude && bookstay.longitude) {
                      var marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(bookstay.latitude, bookstay.longitude),
                        map: map,
                        title: bookstay.name,
                        image: markerImages.북스테이
                      });
                      
                      // placeId를 마커 객체에 저장 (활성화 복원용)
                      marker.placeId = bookstay.placeId;
                      marker.markerId = bookstay.placeId ? bookstay.placeId.toString() : null;
                      
                      // 마커 클릭 이벤트
                      kakao.maps.event.addListener(marker, 'click', function() {
                        // 기존 커스텀 오버레이 제거
                        if (currentCustomOverlay) {
                          currentCustomOverlay.setMap(null);
                        }
                        
                        // 새로운 커스텀 오버레이 생성 및 표시
                        var content = '<div class="customoverlay">' +
                          '  <span class="title">' + bookstay.name + '</span>' +
                          '</div>';
                        
                        var customOverlay = new kakao.maps.CustomOverlay({
                          map: map,
                          position: marker.getPosition(),
                          content: content,
                          yAnchor: 0
                        });
                        
                        currentCustomOverlay = customOverlay;
                        
                        // React Native로 마커 클릭 메시지 전송
                        if (window.ReactNativeWebView) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'markerClicked',
                            markerType: '북스테이',
                            data: bookstay
                          }));
                        }
                      });
                      
                      window.existingMarkers.push(marker);
                    }
                  });
                }
                
                // 북카페 마커 추가
                if (data.bookCafeMarkers && data.bookCafeMarkers.length > 0) {
                  // console.log('☕ 북카페 마커 추가:', data.bookCafeMarkers.length, '개');
                  data.bookCafeMarkers.forEach(function(bookcafe) {
                    if (bookcafe.latitude && bookcafe.longitude) {
                      var marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(bookcafe.latitude, bookcafe.longitude),
                        map: map,
                        title: bookcafe.name,
                        image: markerImages.북카페
                      });
                      
                      // placeId를 마커 객체에 저장 (활성화 복원용)
                      marker.placeId = bookcafe.placeId;
                      marker.markerId = bookcafe.placeId ? bookcafe.placeId.toString() : null;
                      
                      // 마커 클릭 이벤트
                      kakao.maps.event.addListener(marker, 'click', function() {
                        // 기존 커스텀 오버레이 제거
                        if (currentCustomOverlay) {
                          currentCustomOverlay.setMap(null);
                        }
                        
                        // 새로운 커스텀 오버레이 생성 및 표시
                        var content = '<div class="customoverlay">' +
                          '  <span class="title">' + bookcafe.name + '</span>' +
                          '</div>';
                        
                        var customOverlay = new kakao.maps.CustomOverlay({
                          map: map,
                          position: marker.getPosition(),
                          content: content,
                          yAnchor: 0
                        });
                        
                        currentCustomOverlay = customOverlay;
                        
                        // React Native로 마커 클릭 메시지 전송
                        if (window.ReactNativeWebView) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'markerClicked',
                            markerType: '북카페',
                            data: bookcafe
                          }));
                        }
                      });
                      
                      window.existingMarkers.push(marker);
                    }
                  });
                }
                
                // 공간책갈피 마커 추가
                if (data.readingSpotMarkers && data.readingSpotMarkers.length > 0) {
                  // console.log('📚 공간책갈피 마커 추가:', data.readingSpotMarkers.length, '개');
                  data.readingSpotMarkers.forEach(function(readingSpot) {
                    if (readingSpot.latitude && readingSpot.longitude) {
                      var marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(readingSpot.latitude, readingSpot.longitude),
                        map: map,
                        title: readingSpot.name,
                        image: markerImages.책갈피
                      });
                      
                      // placeId를 마커 객체에 저장 (활성화 복원용)
                      marker.placeId = readingSpot.placeId;
                      marker.markerId = readingSpot.placeId ? readingSpot.placeId.toString() : null;
                      
                      // 마커 클릭 이벤트 - 바로 공간책갈피 상세페이지로 이동
                      kakao.maps.event.addListener(marker, 'click', function() {
                        // React Native로 공간책갈피 마커 클릭 메시지 전송
                        if (window.ReactNativeWebView) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'readingSpotClicked',
                            markerType: '공간책갈피',
                            data: readingSpot
                          }));
                        }
                      });
                      
                      window.existingMarkers.push(marker);
                    }
                  });
                }
                
                // 관광지 마커 추가
                if (data.touristSpotMarkers && data.touristSpotMarkers.length > 0) {
                  // console.log('🏛️ 관광지 마커 추가:', data.touristSpotMarkers.length, '개');
                  data.touristSpotMarkers.forEach(function(touristSpot) {
                    if (touristSpot.latitude && touristSpot.longitude) {
                      var marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(touristSpot.latitude, touristSpot.longitude),
                        map: map,
                        title: touristSpot.name,
                        image: markerImages.관광지
                      });
                      
                      // placeId를 마커 객체에 저장 (활성화 복원용)
                      marker.placeId = touristSpot.placeId;
                      marker.markerId = touristSpot.placeId ? touristSpot.placeId.toString() : null;
                      
                      // 마커 클릭 이벤트
                      kakao.maps.event.addListener(marker, 'click', function() {
                        // 기존 커스텀 오버레이 제거
                        if (currentCustomOverlay) {
                          currentCustomOverlay.setMap(null);
                        }
                        
                        // 새로운 커스텀 오버레이 생성 및 표시
                        var content = '<div class="customoverlay">' +
                          '  <span class="title">' + touristSpot.name + '</span>' +
                          '</div>';
                        
                        var customOverlay = new kakao.maps.CustomOverlay({
                          map: map,
                          position: marker.getPosition(),
                          content: content,
                          yAnchor: 0
                        });
                        
                        currentCustomOverlay = customOverlay;
                        
                        // React Native로 마커 클릭 메시지 전송
                        if (window.ReactNativeWebView) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'markerClicked',
                            markerType: '관광지',
                            data: touristSpot
                          }));
                        }
                      });
                      
                      window.existingMarkers.push(marker);
                    }
                  });
                }
                
                // 맛집 마커 추가
                if (data.restaurantMarkers && data.restaurantMarkers.length > 0) {
                  // console.log('🍽️ 맛집 마커 추가:', data.restaurantMarkers.length, '개');
                  data.restaurantMarkers.forEach(function(restaurant) {
                    if (restaurant.latitude && restaurant.longitude) {
                      var marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(restaurant.latitude, restaurant.longitude),
                        map: map,
                        title: restaurant.name,
                        image: markerImages.맛집
                      });
                      
                      // placeId를 마커 객체에 저장 (활성화 복원용)
                      marker.placeId = restaurant.placeId;
                      marker.markerId = restaurant.placeId ? restaurant.placeId.toString() : null;
                      
                      // 마커 클릭 이벤트
                      kakao.maps.event.addListener(marker, 'click', function() {
                        // 기존 커스텀 오버레이 제거
                        if (currentCustomOverlay) {
                          currentCustomOverlay.setMap(null);
                        }
                        
                        // 새로운 커스텀 오버레이 생성 및 표시
                        var content = '<div class="customoverlay">' +
                          '  <span class="title">' + restaurant.name + '</span>' +
                          '</div>';
                        
                        var customOverlay = new kakao.maps.CustomOverlay({
                          map: map,
                          position: marker.getPosition(),
                          content: content,
                          yAnchor: 0
                        });
                        
                        currentCustomOverlay = customOverlay;
                        
                        // React Native로 마커 클릭 메시지 전송
                        if (window.ReactNativeWebView) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'markerClicked',
                            markerType: '맛집',
                            data: restaurant
                          }));
                        }
                      });
                      
                      window.existingMarkers.push(marker);
                    }
                  });
                }
                
                // 축제 마커 추가
                if (data.festivalMarkers && data.festivalMarkers.length > 0) {
                  // console.log('🎉 축제 마커 추가:', data.festivalMarkers.length, '개');
                  data.festivalMarkers.forEach(function(festival) {
                    if (festival.latitude && festival.longitude) {
                      var marker = new kakao.maps.Marker({
                        position: new kakao.maps.LatLng(festival.latitude, festival.longitude),
                        map: map,
                        title: festival.name,
                        image: markerImages.축제
                      });
                      
                      // placeId를 마커 객체에 저장 (활성화 복원용)
                      marker.placeId = festival.placeId;
                      marker.markerId = festival.placeId ? festival.placeId.toString() : null;
                      
                      // 마커 클릭 이벤트
                      kakao.maps.event.addListener(marker, 'click', function() {
                        // 기존 커스텀 오버레이 제거
                        if (currentCustomOverlay) {
                          currentCustomOverlay.setMap(null);
                        }
                        
                        // 새로운 커스텀 오버레이 생성 및 표시
                        var content = '<div class="customoverlay">' +
                          '  <span class="title">' + festival.name + '</span>' +
                          '</div>';
                        
                        var customOverlay = new kakao.maps.CustomOverlay({
                          map: map,
                          position: marker.getPosition(),
                          content: content,
                          yAnchor: 0
                        });
                        
                        currentCustomOverlay = customOverlay;
                        
                        // React Native로 마커 클릭 메시지 전송
                        if (window.ReactNativeWebView) {
                          window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'markerClicked',
                            markerType: '축제',
                            data: festival
                          }));
                        }
                      });
                      
                      window.existingMarkers.push(marker);
                    }
                  });
                }
                
                console.log('🗺️ WebView: 마커 업데이트 완료, 총', window.existingMarkers.length, '개');
      
      // 마커 상세 정보 로그 출력
      if (window.existingMarkers && window.existingMarkers.length > 0) {
        console.log('🗺️ WebView: 마커 상세 정보:', window.existingMarkers.map((marker, index) => ({
          index: index,
          title: marker.getTitle(),
          position: marker.getPosition().toString(),
          placeId: marker.placeId,
          markerId: marker.markerId
        })));
      }
              } else {
                // console.log('🗺️ WebView: 메시지 타입 미지원 또는 map 객체 없음:', {
                //   messageType: data.type,
                //   mapExists: !!map,
                //   data: data
                // });
              }
              
            } catch (error) {
              // console.error('공통 메시지 처리 오류:', error);
            }
            
            // console.log('=== 공통 메시지 처리 함수 완료 ===');
          }

          // 선택된 장소 마커 업데이트 함수
          function updateSelectedLocationMarker(latitude, longitude, name, placeId) {
            console.log('📍 updateSelectedLocationMarker 호출:', { latitude, longitude, name, placeId });
            
            // 기존 선택된 장소 마커 제거
            if (selectedLocationMarker) {
              selectedLocationMarker.setMap(null);
              selectedLocationMarker = null;
            }
            
            // 새로운 선택된 장소 마커 생성
            if (latitude && longitude) {
              var position = new kakao.maps.LatLng(latitude, longitude);
              
              // 빨간색 마커 이미지 생성 (LocationPicker와 동일한 스타일, 크기만 조정)
              var searchMarkerImage = new kakao.maps.MarkerImage(
                'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23FF0000"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>',
                new kakao.maps.Size(40, 40)
              );
              
              selectedLocationMarker = new kakao.maps.Marker({
                position: position,
                map: map,
                title: name || "선택된 장소",
                image: searchMarkerImage,
                zIndex: 2000 // 다른 마커들보다 위에 표시
              });
              
              // placeId를 전역 변수에 저장
              if (placeId) {
                window.selectedLocationPlaceId = placeId;
                console.log('📍 placeId 저장됨:', placeId);
              }
              
              // 빨간색 마커 클릭 이벤트 추가
              kakao.maps.event.addListener(selectedLocationMarker, 'click', function() {
                // React Native로 빨간색 마커 클릭 메시지 전송
                var clickMessage = {
                  type: 'selectedLocationMarkerClicked',
                  latitude: latitude,
                  longitude: longitude,
                  name: name || "선택된 장소",
                  placeId: window.selectedLocationPlaceId || placeId || null // 전역 변수에서 placeId 가져오기
                };
                console.log('🔴 빨간색 마커 클릭 메시지:', clickMessage);
                
                if (window.ReactNativeWebView) {
                  window.ReactNativeWebView.postMessage(JSON.stringify(clickMessage));
                }
              });
              
              // console.log('📍 선택된 장소 마커 생성:', { latitude, longitude, name });
            }
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
                // console.error('WebView: 뷰포트 업데이트 메시지 전송 실패:', error);
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
      {mapError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle} allowFontScaling={false}>
            지도 로드 실패
          </Text>
          <Text style={styles.errorMessage} allowFontScaling={false}>
            {mapError}
          </Text>
          <Text style={styles.errorSubMessage} allowFontScaling={false}>
            잠시 후 다시 시도해주세요.
          </Text>
        </View>
      ) : (
        <WebView
          ref={webViewRef}
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
            setMapError("WebView 로드 중 오류가 발생했습니다.");
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
      )}
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#FF4444",
    marginBottom: 10,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#666666",
    marginBottom: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  errorSubMessage: {
    fontSize: 12,
    fontFamily: "SUIT-400",
    color: "#999999",
    textAlign: "center",
  },
});

export default KakaoMap;
