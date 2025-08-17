import mockData from "@/assets/mockdata";
import Constants from "expo-constants";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import {
  createCulturalMarkerImages,
  createTouristMarkerImages,
} from "./bookstoreMarkers";

// 마커 스타일
const markerStyles = {
  width: 34, // 24에서 48로 증가
  height: 39, // 24에서 53으로 증가
};

type KakaoMapProps = {
  latitude: number;
  longitude: number;
  regions?: string[];
};

interface Bookstore {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type?: "독립서점" | "북카페" | "북스테이" | "책갈피"; // 마커 타입 추가
}

interface WebViewMessage {
  type: string;
  id?: number;
  name?: string;
  lat?: number;
  lng?: number;
}

export interface KakaoMapRef {
  postMessage: (message: string) => void;
  addBookstoreMarker: (bookstore: Bookstore) => void;
  addAllBookstores: () => void;
  clearAllMarkers: () => void;
  showMyLocationMarker: () => void;
  moveToLocation: (latitude: number, longitude: number) => void;
}

// 대한민국 남한 경계 좌표 (최대/최소 위도, 경도)
const koreaBounds = {
  north: 38.6, // 최북단 (강원도 철원)
  south: 33.0, // 최남단 (제주도)
  east: 132.0, // 최동단 (울릉도)
  west: 124.5, // 최서단 (서해안)
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

const KakaoMap = forwardRef<KakaoMapRef, KakaoMapProps>(
  ({ latitude, longitude, regions = [] }, ref) => {
    const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;

    // 활성화된 마커 ID 관리 (한 번에 하나만 활성화)
    const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

    // activeMarkerId가 변경될 때마다 모든 마커를 다시 그리기
    useEffect(() => {
      if (webViewRef.current) {
        // 마커 이미지만 업데이트하고 기존 마커는 제거하지 않음
        setTimeout(() => {
          mockData.forEach((item) => {
            const bookstore: Bookstore = {
              id: parseInt(item.id),
              name: item.name,
              lat: item.latitude,
              lng: item.longitude,
              type: item.type as "독립서점" | "북카페" | "북스테이" | "책갈피",
            };
            updateBookstoreMarkerImage(bookstore);
          });
        }, 100);
      }
    }, [activeMarkerId]);

    // 문화/서점 마커들
    const culturalMarkers = useMemo(() => {
      return createCulturalMarkerImages();
    }, []);

    // 관광/음식 마커들
    const touristMarkers = useMemo(() => {
      return createTouristMarkerImages();
    }, []);

    const webViewRef = React.useRef<WebView>(null);

    // 문화/서점 마커 추가 (모든 마커 동일한 크기 사용)
    const addCulturalMarker = (bookstore: Bookstore) => {
      const isActive = activeMarkerId === bookstore.id;
      // bookstore.type에 따라 적절한 마커 이미지 선택
      const markerType = bookstore.type || "독립서점";
      const imageData =
        culturalMarkers[markerType as keyof typeof culturalMarkers] ||
        culturalMarkers.독립서점;

      const message = {
        type: "addBookstoreMarker",
        id: bookstore.id,
        name: bookstore.name,
        lat: bookstore.lat,
        lng: bookstore.lng,
        imageData: imageData,
        width: markerStyles.width,
        height: markerStyles.height,
        isActive: isActive,
      };

      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 모든 문화/서점 마커 추가
    const addAllCulturalMarkers = () => {
      mockData.forEach((item) => {
        const bookstore: Bookstore = {
          id: parseInt(item.id),
          name: item.name,
          lat: item.latitude,
          lng: item.longitude,
          type: item.type as "독립서점" | "북카페" | "북스테이" | "책갈피",
        };
        addCulturalMarker(bookstore);
      });
    };

    // 기존 마커의 이미지만 업데이트 (마커 제거하지 않음)
    const updateBookstoreMarkerImage = (bookstore: Bookstore) => {
      const message = {
        type: "updateBookstoreMarkerImage",
        id: bookstore.id,
        isActive: activeMarkerId === bookstore.id,
      };
      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 내 위치 마커 표시 (항상 표시)
    const showMyLocationMarker = () => {
      const message = {
        type: "showMyLocationMarker",
        latitude: latitude,
        longitude: longitude,
      };
      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 지도를 특정 위치로 이동
    const moveToLocation = (newLatitude: number, newLongitude: number) => {
      const message = {
        type: "moveToLocation",
        latitude: newLatitude,
        longitude: newLongitude,
      };
      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 모든 마커 제거
    const clearAllMarkers = () => {
      setActiveMarkerId(null);
    };

    // WebView 로드 완료 후 마커 추가
    const handleWebViewLoad = () => {
      // 지도 로드 후 1초 뒤에 마커 추가 (더 빠른 타이밍)
      setTimeout(() => {
        addAllCulturalMarkers();
        // 내 위치 마커는 mapReady 이벤트에서 처리
      }, 1000);
    };

    // 지도가 준비되면 마커 추가
    const handleMapReady = () => {
      setTimeout(() => {
        addAllCulturalMarkers();
      }, 500);
    };

    // 웹뷰에서 메시지 받기
    const handleMessage = (event: any) => {
      try {
        const data: WebViewMessage = JSON.parse(event.nativeEvent.data);

        if (data.type === "bookstoreClick") {
          const markerId = data.id!;

          // 현재 활성화된 마커와 다른 마커인 경우 활성화
          if (activeMarkerId !== markerId) {
            setActiveMarkerId(markerId);
          }
          console.log("활성 마커 ID 설정됨:", markerId);
        } else if (data.type === "mapClicked") {
          // 지도 클릭 시 모든 마커 비활성화
          setActiveMarkerId(null);
          console.log("지도 클릭됨 - 모든 마커 비활성화");
        } else if (data.type === "mapReady") {
          // 지도가 완전히 로드된 후 내 위치 마커 표시
          showMyLocationMarker();
          // 지도가 준비되면 마커 추가
          handleMapReady();
        }
      } catch (error) {
        console.log("메시지 파싱 오류:", error);
      }
    };

    // HTML 내용
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
            let regionMarkers = [];
            let bookstoreMarkers = {};
            let myLocationMarker = null;
            
            // 전역 변수들을 안전하게 초기화
            if (typeof window.activeImageData === 'undefined') {
              window.activeImageData = null;
            }
            if (typeof window.inactiveImageData === 'undefined') {
              window.inactiveImageData = null;
            }
            if (typeof window.myLocationRetryCount === 'undefined') {
              window.myLocationRetryCount = 0;
            }
            
            // 콘솔 로그를 React Native로 전송 (Hermes 호환성 개선)
            if (typeof console !== 'undefined' && console.log) {
              const originalConsoleLog = console.log;
              try {
                console.log = function(...args) {
                  originalConsoleLog.apply(console, args);
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'console',
                      message: args.join(' ')
                    }));
                  }
                };
              } catch (e) {
                // console.log 재정의가 실패하면 원본 사용
                console.log('Console log override failed, using original');
              }
            }
            
            window.onload = function() {
              console.log('Kakao Map API Loaded');
              if (typeof kakao !== 'undefined' && kakao.maps) {
                console.log('Kakao Maps is available');
                const mapContainer = document.getElementById('map');
                
                // 초기 좌표를 대한민국 범위 내로 제한
                const initialLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, ${latitude}));
                const initialLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, ${longitude}));
                
                const mapOption = {
                  center: new kakao.maps.LatLng(initialLat, initialLng),
                  level: 7
                };
                map = new kakao.maps.Map(mapContainer, mapOption);
                
                // 지도 클릭 이벤트를 가장 먼저 설정 (다른 이벤트보다 우선)
                kakao.maps.event.addListener(map, 'click', function() {
                  // 지도 클릭 이벤트 발생 확인
                  console.log('지도 클릭 이벤트 발생');
                  
                  // React Native로 지도 클릭 메시지 전송 (인포박스는 activeMarkerId 변경으로 자동 처리)
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'mapClicked'
                    }));
                  }
                });
                
                // 지도 컨테이너에도 직접 클릭 이벤트 추가 (백업)
                mapContainer.addEventListener('click', function(event) {
                  // 마커 클릭이 아닌 경우에만 지도 클릭으로 처리
                  if (event.target === mapContainer || event.target.id === 'map') {
                    console.log('지도 컨테이너 클릭 이벤트 발생');
                    if (window.ReactNativeWebView) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'mapClicked'
                      }));
                    }
                  }
                });
                
                // 지도 범위 제한 설정
                const southWest = new kakao.maps.LatLng(${koreaBounds.south}, ${koreaBounds.west});
                const northEast = new kakao.maps.LatLng(${koreaBounds.north}, ${koreaBounds.east});
                const bounds = new kakao.maps.LatLngBounds(southWest, northEast);
                
                // 지도 범위 제한 적용
                map.setMaxBounds(bounds);

                // 지도 로드 완료 이벤트 리스너 추가
                kakao.maps.event.addListener(map, 'tilesloaded', function() {
                  // 지도가 완전히 로드된 후 지도 클릭 이벤트 재설정
                  console.log('지도 타일 로드 완료, 클릭 이벤트 재설정');
                  
                  // 지도 클릭 이벤트를 다시 설정 (더 확실한 처리)
                  kakao.maps.event.addListener(map, 'click', function() {
                    console.log('지도 클릭 이벤트 발생 (tilesloaded 후)');
                    if (window.ReactNativeWebView) {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'mapClicked'
                      }));
                    }
                  });
                  
                  // 지도가 완전히 로드된 후 내 위치 마커 생성
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'mapReady'
                    }));
                  }
                });

                // 선택된 지역들의 마커 추가
                const selectedRegions = ${JSON.stringify(regions)};
                const regionCoords = ${JSON.stringify(regionCoordinates)};
                
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
                      // 이벤트 버블링 방지 (지도 클릭 이벤트 방해 방지)
                      if (event && event.stopPropagation) {
                        event.stopPropagation();
                      }
                      infowindow.open(map, marker);
                    });
                  }
                });
                
                // 지역 마커들이 모두 보이도록 지도 범위 조정
                if (regionMarkers.length > 0) {
                  const bounds = new kakao.maps.LatLngBounds();
                  regionMarkers.forEach(marker => {
                    bounds.extend(marker.getPosition());
                  });
                  map.setBounds(bounds);
                }
                
                // 지도 이동 시 범위 제한 확인
                kakao.maps.event.addListener(map, 'bounds_changed', function() {
                  const center = map.getCenter();
                  const lat = center.getLat();
                  const lng = center.getLng();
                  
                  // 범위를 벗어난 경우 자동으로 범위 내로 조정
                  if (lat < ${koreaBounds.south} || lat > ${koreaBounds.north} || 
                      lng < ${koreaBounds.west} || lng > ${koreaBounds.east}) {
                    const restrictedLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, lat));
                    const restrictedLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, lng));
                    
                    const newPosition = new kakao.maps.LatLng(restrictedLat, restrictedLng);
                    map.setCenter(newPosition);
                  }
                });
              } else {
                console.error('Kakao Maps is not available');
              }
            };

            // 독립서점 마커 추가 함수
            function addBookstoreMarkerToMap(id, name, lat, lng, imageData, width, height, isActive) {
              // 지도가 준비되지 않았으면 대기
              if (!map) {
                setTimeout(() => addBookstoreMarkerToMap(id, name, lat, lng, imageData, width, height, isActive), 100);
                return;
              }
              
              // 기존 마커 제거
              if (bookstoreMarkers[id]) {
                bookstoreMarkers[id].marker.setMap(null);
                if (bookstoreMarkers[id].infowindow) {
                  bookstoreMarkers[id].infowindow.close();
                }
              }

              const markerPosition = new kakao.maps.LatLng(lat, lng);
              let marker;
              
              // 커스텀 이미지 마커 생성
              if (imageData && imageData.length > 0 && imageData.includes('<svg')) {
                try {
                  // SVG 데이터를 data URL로 변환
                  const svgBlob = new Blob([imageData], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(svgBlob);
                  
                  const imageSize = new kakao.maps.Size(width, height);
                  const imageOption = {
                    offset: new kakao.maps.Point(width / 2, height)
                  };
                  
                  // 이미지 로드 완료 후 마커 생성
                  const img = new Image();
                  img.onload = function() {
                    const markerImage = new kakao.maps.MarkerImage(url, imageSize, imageOption);
                    
                    marker = new kakao.maps.Marker({
                      position: markerPosition,
                      image: markerImage,
                      title: name
                    });
                    
                    marker.setMap(map);
                    
                    // 마커 정보 저장 및 이벤트 리스너 추가
                    setupMarker(marker, id, name, lat, lng, isActive);
                  };
                  
                  img.onerror = function() {
                    // SVG 로드 실패 시 기본 마커 사용
                    createDefaultMarker();
                  };
                  
                  img.src = url;
                  
                } catch (error) {
                  // SVG 생성 실패 시 기본 마커 사용
                  createDefaultMarker();
                }
              } else {
                createDefaultMarker();
              }
              
              // 기본 마커 생성 함수
              function createDefaultMarker() {
                marker = new kakao.maps.Marker({
                  position: markerPosition,
                  title: name
                });
                
                marker.setMap(map);
                
                // 마커 정보 저장 및 이벤트 리스너 추가
                setupMarker(marker, id, name, lat, lng, isActive);
              }
              
              // 마커 설정 함수
              function setupMarker(marker, id, name, lat, lng, isActive) {
                // 인포윈도우 생성 (활성/비활성 상태 표시)
                const infowindow = new kakao.maps.InfoWindow({
                  content: '<div style="padding:10px;font-size:14px;text-align:center;min-width:120px;"><strong>' + name + '</strong></div>'
                });

                // 마커 클릭 이벤트
                kakao.maps.event.addListener(marker, 'click', function(event) {
                  // 이벤트 버블링 방지 (지도 클릭 이벤트 방해 방지)
                  if (event && event.stopPropagation) {
                    event.stopPropagation();
                  }
                  
                  // React Native로 메시지 전송 (인포박스는 activeMarkerId 변경으로 자동 처리)
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'bookstoreClick',
                      id: id,
                      name: name,
                      lat: lat,
                      lng: lng
                    }));
                  }
                });

                // 마커 정보 저장
                bookstoreMarkers[id] = {
                  marker: marker,
                  infowindow: infowindow,
                  name: name,
                  lat: lat,
                  lng: lng,
                  isActive: isActive,
                  originalImageData: imageData // 원본 이미지 데이터 저장
                };
                
                // 모든 마커가 추가된 후 지도 범위 조정
                if (Object.keys(bookstoreMarkers).length > 0) {
                  const bounds = new kakao.maps.LatLngBounds();
                  Object.values(bookstoreMarkers).forEach(function(bookstoreMarker) {
                    bounds.extend(bookstoreMarker.marker.getPosition());
                  });
                  // 약간의 여백을 두고 지도 범위 설정
                  map.setBounds(bounds, 50);
                }
              }
            }

            // 내 위치 마커 표시 (항상 표시)
            function showMyLocationMarker(lat, lng) {
              try {
                // 지도가 준비되지 않았으면 대기
                if (!map) {
                  setTimeout(() => showMyLocationMarker(lat, lng), 100);
                  return;
                }
                
                // 좌표 유효성 검사
                if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
                  console.error('Invalid coordinates:', lat, lng);
                  return;
                }
                
                // 대한민국 남한 범위 내로 좌표 제한
                const restrictedLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, lat));
                const restrictedLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, lng));
                
                // 범위가 제한된 경우 로그 출력
                if (restrictedLat !== lat || restrictedLng !== lng) {
                  console.log('내 위치 마커 좌표가 대한민국 범위로 제한됨:', { original: [lat, lng], restricted: [restrictedLat, restrictedLng] });
                }
                
                // 제한된 좌표 사용
                const finalLat = restrictedLat;
                const finalLng = restrictedLng;
                
                // 기존 내 위치 마커가 있으면 위치만 업데이트 (제거하지 않음)
                if (myLocationMarker) {
                  const currentPos = myLocationMarker.getPosition();
                  const newPos = new kakao.maps.LatLng(finalLat, finalLng);
                  
                  // 위치가 같으면 업데이트하지 않음
                  if (Math.abs(currentPos.getLat() - finalLat) < 0.0001 && 
                      Math.abs(currentPos.getLng() - finalLng) < 0.0001) {
                    console.log('내 위치 마커가 이미 같은 위치에 있음, 업데이트 생략');
                    return;
                  }
                  
                  // 위치만 업데이트
                  myLocationMarker.setPosition(newPos);
                  console.log('기존 내 위치 마커 위치 업데이트됨:', finalLat, finalLng);
                  return;
                }
                
                // 새로운 내 위치 마커 생성 (카카오맵 기본 내 위치 마커)
                const myLocationPosition = new kakao.maps.LatLng(finalLat, finalLng);
                myLocationMarker = new kakao.maps.Marker({
                  position: myLocationPosition,
                  map: map
                });
                
                // 마커가 성공적으로 생성되었는지 확인
                if (myLocationMarker && myLocationMarker.getMap()) {
                  console.log('내 위치 마커 표시됨:', finalLat, finalLng);
                } else {
                  console.error('마커 생성 실패');
                  throw new Error('마커 생성 실패');
                }
              } catch (error) {
                console.error('내 위치 마커 생성 실패:', error);
                // 에러 발생 시 재시도 (최대 3번)
                if (typeof window.myLocationRetryCount === 'undefined') {
                  window.myLocationRetryCount = 0;
                }
                if (window.myLocationRetryCount < 3) {
                  window.myLocationRetryCount++;
                  console.log('재시도 중...', window.myLocationRetryCount);
                  setTimeout(() => showMyLocationMarker(lat, lng), 500);
                } else {
                  console.error('최대 재시도 횟수 초과');
                  window.myLocationRetryCount = 0;
                }
              }
            }

            // 지도를 특정 위치로 이동
            function moveMapToLocation(lat, lng) {
              try {
                if (!map) {
                  setTimeout(() => moveMapToLocation(lat, lng), 100);
                  return;
                }
                
                // 좌표 유효성 검사
                if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
                  console.error('Invalid coordinates for map move:', lat, lng);
                  return;
                }
                
                // 대한민국 남한 범위 내로 좌표 제한
                const restrictedLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, lat));
                const restrictedLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, lng));
                
                // 범위가 제한된 경우 로그 출력
                if (restrictedLat !== lat || restrictedLng !== lng) {
                  console.log('좌표가 대한민국 범위로 제한됨:', { original: [lat, lng], restricted: [restrictedLat, restrictedLng] });
                }
                
                const newPosition = new kakao.maps.LatLng(restrictedLat, restrictedLng);
                map.setCenter(newPosition);
                console.log('지도가 다음 위치로 이동됨:', restrictedLat, restrictedLng);
                
                // 내 위치 마커가 이미 있으면 위치만 업데이트, 없으면 새로 생성
                if (myLocationMarker) {
                  myLocationMarker.setPosition(newPosition);
                  console.log('기존 내 위치 마커 위치 업데이트됨');
                } else {
                  // 마커가 없으면 새로 생성
                  showMyLocationMarker(restrictedLat, restrictedLng);
                }
              } catch (error) {
                console.error('지도 이동 실패:', error);
              }
            }

            // 기존 마커의 이미지와 인포박스 상태 업데이트
            function updateBookstoreMarkerImage(id, isActive) {
              if (bookstoreMarkers[id]) {
                const marker = bookstoreMarkers[id].marker;
                const infowindow = bookstoreMarkers[id].infowindow;
                const name = bookstoreMarkers[id].name;
                const originalImageData = bookstoreMarkers[id].originalImageData;
                
                // 원본 이미지 데이터가 있으면 사용, 없으면 저장된 데이터 사용
                let imageData = originalImageData;
                if (!imageData) {
                  imageData = isActive ? window.activeImageData : window.inactiveImageData;
                }
                
                const width = ${markerStyles.width};
                const height = ${markerStyles.height};
                
                try {
                  // 이미지 데이터가 유효한 경우에만 마커 이미지 업데이트
                  if (imageData && imageData.length > 0) {
                    const imageSize = new kakao.maps.Size(width, height);
                    const imageOption = {
                      offset: new kakao.maps.Point(width / 2, height)
                    };
                    
                    // SVG 데이터를 Blob URL로 변환
                    if (imageData.includes('<svg')) {
                      const svgBlob = new Blob([imageData], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(svgBlob);
                      
                      const img = new Image();
                      img.onload = function() {
                        const markerImage = new kakao.maps.MarkerImage(url, imageSize, imageOption);
                        marker.setImage(markerImage);
                        
                        // 인포박스 상태 업데이트
                        updateInfoWindow();
                      };
                      
                      img.onerror = function() {
                        // SVG 로드 실패 시 기본 마커 유지
                        updateInfoWindow();
                      };
                      
                      img.src = url;
                    } else {
                      // 일반 이미지인 경우
                      const markerImage = new kakao.maps.MarkerImage(imageData, imageSize, imageOption);
                      marker.setImage(markerImage);
                      
                      // 인포박스 상태 업데이트
                      updateInfoWindow();
                    }
                  } else {
                    // 인포박스 상태만 업데이트
                    updateInfoWindow();
                  }
                  
                } catch (error) {
                  console.error('마커 이미지 업데이트 실패:', error);
                  // 에러 발생 시 인포박스 상태만 업데이트
                  updateInfoWindow();
                }
                
                // 인포박스 상태 업데이트 함수
                function updateInfoWindow() {
                  // 활성 상태에 따라 인포박스 표시/숨김
                  if (isActive) {
                    // 다른 모든 인포박스 닫기
                    Object.values(bookstoreMarkers).forEach(function(bookstoreMarker) {
                      if (bookstoreMarker.infowindow) {
                        bookstoreMarker.infowindow.close();
                      }
                    });
                    // 현재 마커의 인포박스 열기
                    infowindow.open(map, marker);
                  } else {
                    // 비활성 상태면 인포박스 닫기
                    infowindow.close();
                  }
                }
              }
            }

            // 모든 독립서점 마커 제거
            function clearAllBookstoreMarkers() {
              Object.values(bookstoreMarkers).forEach(function(bookstoreMarker) {
                bookstoreMarker.marker.setMap(null);
                if (bookstoreMarker.infowindow) {
                  bookstoreMarker.infowindow.close();
                }
              });
              bookstoreMarkers = {};
            }

            // React Native에서 메시지 받기
            window.addEventListener('message', function(event) {
              try {
                const data = JSON.parse(event.data);
                
                if (data.type === 'addBookstoreMarker') {
                  // 첫 번째 마커 추가 시 활성/비활성 이미지 데이터 저장
                  if (!window.activeImageData || !window.inactiveImageData) {
                    try {
                      window.activeImageData = data.imageData;
                      window.inactiveImageData = data.imageData; // 현재는 같은 이미지 사용
                    } catch (e) {
                      console.error('이미지 데이터 저장 실패:', e);
                    }
                  }
                  
                  addBookstoreMarkerToMap(
                    data.id, 
                    data.name, 
                    data.lat, 
                    data.lng, 
                    data.imageData, 
                    data.width, 
                    data.height,
                    data.isActive
                  );
                } else if (data.type === 'showMyLocationMarker') {
                  showMyLocationMarker(data.latitude, data.longitude);
                } else if (data.type === 'updateBookstoreMarkerImage') {
                  updateBookstoreMarkerImage(data.id, data.isActive);
                } else if (data.type === 'moveToLocation') {
                  moveMapToLocation(data.latitude, data.longitude);
                } else if (data.type === 'clearAllMarkers') {
                  clearAllBookstoreMarkers();
                }
              } catch (error) {
                console.error('Error parsing message from React Native:', error);
              }
            });
          </script>
        </body>
      </html>
    `;
    }, [apiKey, latitude, longitude, regions]);

    useImperativeHandle(ref, () => ({
      postMessage: (message: string) => {
        webViewRef.current?.postMessage(message);
      },
      addBookstoreMarker: addCulturalMarker,
      addAllBookstores: addAllCulturalMarkers,
      clearAllMarkers,
      showMyLocationMarker,
      moveToLocation,
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
          onLoad={handleWebViewLoad}
          onError={(e) => console.error("WebView error: ", e.nativeEvent)}
          onMessage={handleMessage}
          androidLayerType="hardware"
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
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
