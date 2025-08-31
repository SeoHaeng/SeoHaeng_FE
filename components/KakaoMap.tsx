import Constants from "expo-constants";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { createCulturalMarkerImages } from "./bookstoreMarkers";

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
  filterType?: string;
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
  filterType = "",
}: KakaoMapProps) => {
  const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;
  const webViewRef = useRef<WebView>(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);

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
    } catch (error) {
      // console.error("🗺️ 메시지 처리 오류:", error);
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
      } catch (error) {
        // console.error("🗺️ KakaoMap: 강제 지도 이동 메시지 전송 실패:", error);
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
      } catch (error) {
        // console.error(
        //   "📍 KakaoMap: 선택된 장소 마커 업데이트 메시지 전송 실패:",
        //   error,
        // );
      }
    }
  }, [selectedLocation, isWebViewReady]);

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
      } catch (error) {
        // console.error(
        //   "🗺️ KakaoMap: 지도 중심점 업데이트 메시지 전송 실패:",
        //   error,
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
        readingSpotMarkers.length > 0)
    ) {
      // console.log("🗺️ WebView로 마커 데이터 전송 시작");

      // 마커 데이터 전송
      const message = JSON.stringify({
        type: "updateMarkers",
        independentBookstoreMarkers,
        bookStayMarkers,
        bookCafeMarkers,
        readingSpotMarkers,
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
      } catch (error) {
        // console.error("🗺️ postMessage 실패:", error);
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
          var selectedLocationMarker = null; // 선택된 장소 마커
          var currentInfoWindow = null; // 현재 열린 InfoWindow
          
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
            선택된장소: new kakao.maps.MarkerImage(
              'data:image/svg+xml;charset=UTF-8,${encodeURIComponent(createCulturalMarkerImages().선택된장소)}',
              new kakao.maps.Size(48, 53)
            )
          };
          
          window.onload = function() {
            // console.log('Kakao Map API Loaded');
            if (typeof kakao !== 'undefined' && kakao.maps) {
              // console.log('Kakao Maps is available');
              var mapContainer = document.getElementById('map');
              var mapOption = {
                center: new kakao.maps.LatLng(${latitude}, ${longitude}),
                level: 3
              };
              map = new kakao.maps.Map(mapContainer, mapOption);

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
              
              // console.log('Map and 내 위치 마커 created successfully');
              
              // 지도 로드 완료 후 이벤트 리스너 등록
              kakao.maps.event.addListener(map, 'tilesloaded', function() {
                // console.log('🗺️ 지도 타일 로드 완료 - 이벤트 리스너 등록 시작');
                
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
                  // InfoWindow 닫기
                  if (currentInfoWindow) {
                    currentInfoWindow.close();
                    currentInfoWindow = null;
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
              
            } else {
              // console.error('Kakao Maps is not available');
            }
          };

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
                      
                      // 마커 클릭 이벤트
                      kakao.maps.event.addListener(marker, 'click', function() {
                        // 기존 InfoWindow 닫기
                        if (currentInfoWindow) {
                          currentInfoWindow.close();
                        }
                        
                        // 새로운 InfoWindow 생성 및 표시
                        var infowindow = new kakao.maps.InfoWindow({
                          content: '<div style="padding:8px;font-size:12px;font-weight:600;color:#262423;text-align:center;min-width:80px;border-radius:3px;display:flex;align-items:center;justify-content:center;">' + bookstore.name + '</div>',
                          removable: false,
                          zIndex: 1000
                        });
                        
                        infowindow.open(map, marker);
                        currentInfoWindow = infowindow;
                        
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
                      
                      // 마커 클릭 이벤트
                      kakao.maps.event.addListener(marker, 'click', function() {
                        // 기존 InfoWindow 닫기
                        if (currentInfoWindow) {
                          currentInfoWindow.close();
                        }
                        
                        // 새로운 InfoWindow 생성 및 표시
                        var infowindow = new kakao.maps.InfoWindow({
                          content: '<div style="padding:8px;font-size:12px;font-weight:600;color:#262423;text-align:center;min-width:80px;border-radius:3px;display:flex;align-items:center;justify-content:center;">' + bookstay.name + '</div>',
                          removable: false,
                          zIndex: 1000
                        });
                        
                        infowindow.open(map, marker);
                        currentInfoWindow = infowindow;
                        
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
                      
                      // 마커 클릭 이벤트
                      kakao.maps.event.addListener(marker, 'click', function() {
                        // 기존 InfoWindow 닫기
                        if (currentInfoWindow) {
                          currentInfoWindow.close();
                        }
                        
                        // 새로운 InfoWindow 생성 및 표시
                        var infowindow = new kakao.maps.InfoWindow({
                          content: '<div style="padding:8px;font-size:12px;font-weight:600;color:#262423;text-align:center;min-width:80px;border-radius:3px;display:flex;align-items:center;justify-content:center;">' + bookcafe.name + '</div>',
                          removable: false,
                          zIndex: 1000
                        });
                        
                        infowindow.open(map, marker);
                        currentInfoWindow = infowindow;
                        
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
                
                // console.log('🗺️ WebView: 마커 업데이트 완료, 총', window.existingMarkers.length, '개');
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
