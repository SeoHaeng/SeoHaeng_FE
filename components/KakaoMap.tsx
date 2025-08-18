import { bookCafeData } from "@/assets/mockdata/bookCafeData";
import { bookStayData } from "@/assets/mockdata/bookStayData";
import { bookmarkData } from "@/assets/mockdata/bookmarkData";
import { festivalData } from "@/assets/mockdata/festivalData";
import { independentBookstoreData } from "@/assets/mockdata/independentBookstoreData";
import { restaurantData } from "@/assets/mockdata/restaurantData";
import { touristData } from "@/assets/mockdata/touristData";
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
  width: 34,
  height: 39,
};

type KakaoMapProps = {
  latitude: number;
  longitude: number;
  regions?: string[];
  filterType?: string; // 필터 타입 추가
  bottomFilterTypes?: string[]; // 하단 필터 타입들 추가
  onMessage?: (event: any) => void; // 메시지 핸들러 추가
  activeMarkerId: string | null; // 활성화된 마커 ID
  onActiveMarkerChange: (id: string | null) => void; // 마커 ID 변경 콜백
  onLoad?: () => void; // WebView 로드 완료 핸들러
};

interface Bookstore {
  id: string; // number에서 string으로 변경
  name: string;
  lat: number;
  lng: number;
  type?: "독립서점" | "북카페" | "북스테이" | "책갈피";
}

interface WebViewMessage {
  type: string;
  id?: string; // number에서 string으로 변경
  name?: string;
  lat?: number;
  lng?: number;
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  centerLat?: number;
  centerLng?: number;
  zoom?: number;
}

export interface KakaoMapRef {
  postMessage: (message: string) => void;
  addBookstoreMarker: (bookstore: Bookstore) => void;
  addAllBookstores: () => void;
  clearAllMarkers: () => void;
  showMyLocationMarker: () => void;
  moveToLocation: (latitude: number, longitude: number) => void;
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

const KakaoMap = forwardRef<KakaoMapRef, KakaoMapProps>(
  (
    {
      latitude,
      longitude,
      regions = [],
      filterType,
      bottomFilterTypes = [],
      onMessage,
      activeMarkerId,
      onActiveMarkerChange,
      onLoad,
    },
    ref,
  ) => {
    const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;
    // 현재 뷰포트 정보 저장
    const [currentViewport, setCurrentViewport] = useState<{
      north: number;
      south: number;
      east: number;
      west: number;
      center: { lat: number; lng: number };
      zoom: number;
    } | null>(null);
    const webViewRef = React.useRef<WebView>(null);

    // 필터 타입이나 하단 필터가 변경될 때마다 마커 다시 그리기
    useEffect(() => {
      if (webViewRef.current) {
        // 기존 마커 모두 제거 (내 위치 마커는 제거하지 않음)
        webViewRef.current.postMessage(
          JSON.stringify({
            type: "clearAllMarkers",
          }),
        );

        // 새로운 필터로 마커 추가
        setTimeout(() => {
          addAllCulturalMarkers();
        }, 100);
      }
    }, [filterType, bottomFilterTypes]); // bottomFilterTypes 의존성 추가

    // activeMarkerId가 변경될 때마다 마커 이미지만 업데이트 (마커 재생성하지 않음)
    useEffect(() => {
      if (webViewRef.current && activeMarkerId !== null) {
        console.log("🔄 activeMarkerId 변경됨, 마커 이미지만 업데이트");
        // 마커 이미지만 업데이트하고 기존 마커는 제거하지 않음
        setTimeout(() => {
          independentBookstoreData.forEach((item) => {
            const bookstore: Bookstore = {
              id: item.id,
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

    // 문화/서점 마커 추가
    const addCulturalMarker = (bookstore: Bookstore) => {
      const isActive = activeMarkerId === bookstore.id;
      const markerType = bookstore.type || "독립서점";

      // 문화/서점 마커인지 관광/음식 마커인지 판단
      let imageData;
      if (["독립서점", "북카페", "북스테이", "책갈피"].includes(markerType)) {
        imageData =
          culturalMarkers[markerType as keyof typeof culturalMarkers] ||
          culturalMarkers.독립서점;
      } else if (["맛집", "관광지", "축제"].includes(markerType)) {
        imageData =
          touristMarkers[markerType as keyof typeof touristMarkers] ||
          touristMarkers.관광지;
      } else {
        imageData = culturalMarkers.독립서점; // 기본값
      }

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
        markerType: bookstore.type, // 마커 타입 정보 추가
      };

      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 모든 문화/서점 마커 추가
    const addAllCulturalMarkers = () => {
      let allData: any[] = [];

      // 상단 필터 타입에 따라 데이터 선택
      if (filterType) {
        switch (filterType) {
          case "독립서점":
            allData = [...independentBookstoreData];
            break;
          case "북카페":
            allData = [...bookCafeData];
            break;
          case "북스테이":
            allData = [...bookStayData];
            break;
          case "책갈피":
            allData = [...bookmarkData];
            break;
          default:
            allData = [
              ...independentBookstoreData,
              ...bookCafeData,
              ...bookStayData,
              ...bookmarkData,
            ];
        }
      } else {
        // 상단 필터가 없으면 모든 서점 관련 데이터 추가
        allData = [
          ...independentBookstoreData,
          ...bookCafeData,
          ...bookStayData,
          ...bookmarkData,
        ];
      }

      // 하단 필터가 선택된 경우 해당 타입들 추가
      if (bottomFilterTypes && bottomFilterTypes.length > 0) {
        bottomFilterTypes.forEach((filterType) => {
          switch (filterType) {
            case "맛집":
              allData = [...allData, ...restaurantData];
              break;
            case "관광지":
              allData = [...allData, ...touristData];
              break;
            case "축제":
              allData = [...allData, ...festivalData];
              break;
          }
        });
      }

      // 중복 제거 (같은 id를 가진 항목이 있을 경우)
      const uniqueData = allData.filter(
        (item, index, self) =>
          index === self.findIndex((t) => t.id === item.id),
      );

      uniqueData.forEach((item) => {
        const bookstore: Bookstore = {
          id: item.id,
          name: item.name,
          lat: item.latitude,
          lng: item.longitude,
          type: item.type,
        };
        addCulturalMarker(bookstore);
      });
    };

    // 기존 마커의 이미지만 업데이트
    const updateBookstoreMarkerImage = (bookstore: Bookstore) => {
      console.log(
        "🔄 마커 이미지 업데이트:",
        bookstore.id,
        "활성화:",
        activeMarkerId === bookstore.id,
      );
      const message = {
        type: "updateBookstoreMarkerImage",
        id: bookstore.id,
        isActive: activeMarkerId === bookstore.id,
      };
      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 내 위치 마커 표시 (안정화된 버전)
    const showMyLocationMarker = () => {
      console.log("📍 showMyLocationMarker 호출됨:", latitude, longitude);

      // WebView가 준비되지 않았으면 대기
      if (!webViewRef.current) {
        console.log("⚠️ WebView가 준비되지 않음, 100ms 후 재시도");
        setTimeout(() => showMyLocationMarker(), 100);
        return;
      }

      const message = {
        type: "showMyLocationMarker",
        latitude: latitude,
        longitude: longitude,
      };
      webViewRef.current.postMessage(JSON.stringify(message));
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

    // 모든 마커 제거 (내 위치 마커는 절대 제거하지 않음)
    const clearAllMarkers = () => {
      console.log("🗑️ clearAllMarkers 호출됨 - 내 위치 마커 보호");
      onActiveMarkerChange(null);

      // 내 위치 마커 보호를 위해 WebView에 메시지 전송
      if (webViewRef.current) {
        const protectMessage = JSON.stringify({
          type: "protectMyLocationMarker",
        });
        webViewRef.current.postMessage(protectMessage);
      }
    };

    // WebView 로드 완료 후 마커 추가
    const handleWebViewLoad = () => {
      setTimeout(() => {
        addAllCulturalMarkers();
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

        // onMessage prop이 있으면 전달
        if (onMessage) {
          onMessage(event);
        }

        if (data.type === "bookstoreClick") {
          const markerId = data.id!;

          if (activeMarkerId !== markerId) {
            onActiveMarkerChange(markerId);

            // 마커 이미지 업데이트 메시지 전송
            if (webViewRef.current) {
              const updateMessage = JSON.stringify({
                type: "updateBookstoreMarkerImage",
                id: markerId,
                isActive: true,
              });
            }
          } else {
            console.log("📱 bookstoreClick - 이미 활성화된 마커:", markerId);
          }
        } else if (data.type === "mapClicked") {
          console.log("📱 지도 클릭됨 - 모든 인포박스 닫기");
          onActiveMarkerChange(null);

          // WebView에 모든 인포박스를 닫으라는 메시지 전송
          if (webViewRef.current) {
            const closeMessage = JSON.stringify({
              type: "closeAllInfoWindows",
            });

            webViewRef.current.postMessage(closeMessage);
          }
        } else if (data.type === "mapReady") {
          showMyLocationMarker();
          handleMapReady();
        } else if (data.type === "viewportChanged") {
          // 뷰포트 정보 업데이트
          const viewportInfo = {
            north: data.north!,
            south: data.south!,
            east: data.east!,
            west: data.west!,
            center: { lat: data.centerLat!, lng: data.centerLng! },
            zoom: data.zoom!,
          };
          setCurrentViewport(viewportInfo);

          // 뷰포트 정보를 console에 출력
          console.log("🔄 사용자 뷰포트 변경 감지:", {
            "북쪽 경계": viewportInfo.north.toFixed(6),
            "남쪽 경계": viewportInfo.south.toFixed(6),
            "동쪽 경계": viewportInfo.east.toFixed(6),
            "서쪽 경계": viewportInfo.west.toFixed(6),
            "중심 좌표": `(${viewportInfo.center.lat.toFixed(6)}, ${viewportInfo.center.lng.toFixed(6)})`,
            "줌 레벨": viewportInfo.zoom,
            타임스탬프: new Date().toLocaleTimeString(),
            "이벤트 소스": "드래그/이동/줌",
          });
        } else {
        }
      } catch (error) {}
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
            
            window.onload = function() {
              console.log("🌐 WebView 로드 시작");
              if (typeof kakao !== 'undefined' && kakao.maps) {
                console.log("🗺️ 카카오맵 SDK 로드됨");
                const mapContainer = document.getElementById('map');
                
                const initialLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, ${latitude}));
                const initialLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, ${longitude}));
                
                const mapOption = {
                  center: new kakao.maps.LatLng(initialLat, initialLng),
                  level: 5
                };
                map = new kakao.maps.Map(mapContainer, mapOption);
                console.log("🗺️ 지도 초기화 완료");
                
                // 지도 클릭 이벤트
                kakao.maps.event.addListener(map, 'click', function() {
                 
                  
                  if (window.ReactNativeWebView) {
                    
                    
                    // 클릭 시에도 뷰포트 정보 전송 (테스트용)
                    const bounds = map.getBounds();
                    const center = map.getCenter();
                    const sw = bounds.getSouthWest();
                    const ne = bounds.getNorthEast();
                    const zoom = map.getLevel();
                    
                    const viewportMessage = {
                      type: 'viewportChanged',
                      north: ne.getLat(),
                      south: sw.getLat(),
                      east: ne.getLng(),
                      west: sw.getLng(),
                      centerLat: center.getLat(),
                      centerLng: center.getLng(),
                      zoom: zoom
                    };
                    
                   
                    window.ReactNativeWebView.postMessage(JSON.stringify(viewportMessage));
                    
                    // 기존 mapClicked 메시지도 전송
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'mapClicked'
                    }));
                  } else {
                   
                  }
                });
                
                // 지도 범위 제한 설정
                const southWest = new kakao.maps.LatLng(${koreaBounds.south}, ${koreaBounds.west});
                const northEast = new kakao.maps.LatLng(${koreaBounds.north}, ${koreaBounds.east});
                const bounds = new kakao.maps.LatLngBounds(southWest, northEast);
                map.setMaxBounds(bounds);

                // 지도 로드 완료 이벤트
                kakao.maps.event.addListener(map, 'tilesloaded', function() {
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'mapReady'
                    }));
                    
                    // 초기 뷰포트 정보도 전송
                    const bounds = map.getBounds();
                    const center = map.getCenter();
                    const sw = bounds.getSouthWest();
                    const ne = bounds.getNorthEast();
                    const zoom = map.getLevel();
                    
                    const initialViewportMessage = {
                      type: 'viewportChanged',
                      north: ne.getLat(),
                      south: sw.getLat(),
                      east: ne.getLng(),
                      west: sw.getLng(),
                      centerLat: center.getLat(),
                      centerLng: center.getLng(),
                      zoom: zoom
                    };
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify(initialViewportMessage));
                  }
                });

                // 지도 드래그 이벤트 리스너 (LocationPickerMap과 동일하게)
                kakao.maps.event.addListener(map, 'drag', function() {
                  if (window.ReactNativeWebView) {
                    const bounds = map.getBounds();
                    const center = map.getCenter();
                    const sw = bounds.getSouthWest();
                    const ne = bounds.getNorthEast();
                    const zoom = map.getLevel();
                    
                    const viewportMessage = {
                      type: 'viewportChanged',
                      north: ne.getLat(),
                      south: sw.getLat(),
                      east: ne.getLng(),
                      west: sw.getLng(),
                      centerLat: center.getLat(),
                      centerLng: center.getLng(),
                      zoom: zoom
                    };
                    
                    console.log("🔄 드래그 중 뷰포트:", viewportMessage);
                    window.ReactNativeWebView.postMessage(JSON.stringify(viewportMessage));
                  }
                });
                
                // 지도 줌 변경 이벤트 리스너 (LocationPickerMap과 동일하게)
                kakao.maps.event.addListener(map, 'zoom_changed', function() {
                  if (window.ReactNativeWebView) {
                    const bounds = map.getBounds();
                    const center = map.getCenter();
                    const sw = bounds.getSouthWest();
                    const ne = bounds.getNorthEast();
                    const zoom = map.getLevel();
                    
                    const viewportMessage = {
                      type: 'viewportChanged',
                      north: ne.getLat(),
                      south: sw.getLat(),
                      east: ne.getLng(),
                      west: sw.getLng(),
                      centerLat: center.getLat(),
                      centerLng: center.getLng(),
                      zoom: zoom
                    };
                    
                    console.log("🔄 줌 변경 뷰포트:", viewportMessage);
                    window.ReactNativeWebView.postMessage(JSON.stringify(viewportMessage));
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
                
                // 지도 이동 시 범위 제한 확인 및 뷰포트 정보 전송
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
                  
                  // 뷰포트 정보를 React Native로 전송
                  if (window.ReactNativeWebView) {
                    const bounds = map.getBounds();
                    const sw = bounds.getSouthWest();
                    const ne = bounds.getNorthEast();
                    const zoom = map.getLevel();
                    
                    const viewportMessage = {
                      type: 'viewportChanged',
                      north: ne.getLat(),
                      south: sw.getLat(),
                      east: ne.getLng(),
                      west: sw.getLng(),
                      centerLat: center.getLat(),
                      centerLng: center.getLng(),
                      zoom: zoom
                    };
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify(viewportMessage));
                  }
                });

                // 드래그 중에도 뷰포트 정보 전송 (LocationPickerMap과 동일하게)
                kakao.maps.event.addListener(map, 'drag', function() {
                  if (window.ReactNativeWebView) {
                    const bounds = map.getBounds();
                    const center = map.getCenter();
                    const sw = bounds.getSouthWest();
                    const ne = bounds.getNorthEast();
                    const zoom = map.getLevel();
                    
                    const viewportMessage = {
                      type: 'viewportChanged',
                      north: ne.getLat(),
                      south: sw.getLat(),
                      east: ne.getLng(),
                      west: sw.getLng(),
                      centerLat: center.getLat(),
                      centerLng: center.getLng(),
                      zoom: zoom
                    };
                    
                    console.log("🔄 드래그 중 뷰포트:", viewportMessage);
                    window.ReactNativeWebView.postMessage(JSON.stringify(viewportMessage));
                  }
                });

                                // bounds_changed 이벤트로 드래그/줌 감지 (LocationPickerMap과 동일)
                kakao.maps.event.addListener(map, 'bounds_changed', function() {
                  console.log("🔄 지도 bounds_changed 이벤트 발생");
                  
                  if (window.ReactNativeWebView) {
                    const bounds = map.getBounds();
                    const center = map.getCenter();
                    const sw = bounds.getSouthWest();
                    const ne = bounds.getNorthEast();
                    const zoom = map.getLevel();
                    
                    const viewportMessage = {
                      type: 'viewportChanged',
                      north: ne.getLat(),
                      south: sw.getLat(),
                      east: ne.getLng(),
                      west: sw.getLng(),
                      centerLat: center.getLat(),
                      centerLng: center.getLng(),
                      zoom: zoom
                    };
                    
                    console.log("📤 bounds_changed 뷰포트 메시지:", viewportMessage);
                    window.ReactNativeWebView.postMessage(JSON.stringify(viewportMessage));
                  } else {
                    console.log("⚠️ ReactNativeWebView가 준비되지 않음");
                  }
                });
              }
            };

            // 독립서점 마커 추가 함수
            function addBookstoreMarkerToMap(id, name, lat, lng, imageData, width, height, isActive, markerType) {
              if (!map) {
                setTimeout(() => addBookstoreMarkerToMap(id, name, lat, lng, imageData, width, height, isActive, markerType), 100);
                return;
              }
              
              if (bookstoreMarkers[id]) {
                bookstoreMarkers[id].marker.setMap(null);
                if (bookstoreMarkers[id].infowindow) {
                  bookstoreMarkers[id].infowindow.close();
                }
              }

              const markerPosition = new kakao.maps.LatLng(lat, lng);
              let marker;
              
              if (imageData && imageData.length > 0 && imageData.includes('<svg')) {
                try {
                  const svgBlob = new Blob([imageData], { type: 'image/svg+xml' });
                  const url = URL.createObjectURL(svgBlob);
                  
                  const imageSize = new kakao.maps.Size(width, height);
                  const imageOption = {
                    offset: new kakao.maps.Point(width / 2, height)
                  };
                  
                  const img = new Image();
                  img.onload = function() {
                    const markerImage = new kakao.maps.MarkerImage(url, imageSize, imageOption);
                    
                    marker = new kakao.maps.Marker({
                      position: markerPosition,
                      image: markerImage,
                      title: name
                    });
                    
                    marker.setMap(map);
                    setupMarker(marker, id, name, lat, lng, isActive, imageData, markerType);
                  };
                  
                  img.onerror = function() {
                    createDefaultMarker();
                  }
                  
                  img.src = url;
                  
                } catch (error) {
                  createDefaultMarker();
                }
              } else {
                createDefaultMarker();
              }
              
              function createDefaultMarker() {
                marker = new kakao.maps.Marker({
                  position: markerPosition,
                  title: name
                });
                
                marker.setMap(map);
                setupMarker(marker, id, name, lat, lng, isActive, imageData, markerType);
              }
              
              function setupMarker(marker, id, name, lat, lng, isActive, imageData, markerType) {
                const infowindow = new kakao.maps.InfoWindow({
                  content: '<div style="padding:10px;font-size:14px;text-align:center;min-width:120px;"><strong>' + name + '</strong></div>'
                });

                kakao.maps.event.addListener(marker, 'click', function(event) {
                  if (event && event.stopPropagation) {
                    event.stopPropagation();
                  }
                  
                  if (window.ReactNativeWebView) {
                    console.log("🎯 마커 클릭됨:", id, name, "타입:", markerType);
                    
                    if (markerType === "책갈피") {
                      // 책갈피 마커 클릭 시 bookmark 상세 페이지로 이동
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'bookmarkClick',
                        id: id,
                        name: name,
                        lat: lat,
                        lng: lng
                      }));
                    } else {
                      // 일반 서점 마커 클릭 시 기존 로직
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'bookstoreClick',
                        id: id,
                        name: name,
                        lat: lat,
                        lng: lng
                      }));
                      
                      // 선택된 마커 정보를 React Native로 전송
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'markerSelected',
                        id: id,
                        name: name,
                        lat: lat,
                        lng: lng
                      }));
                    }
                  }
                });

                bookstoreMarkers[id] = {
                  marker: marker,
                  infowindow: infowindow,
                  name: name,
                  lat: lat,
                  lng: lng,
                  isActive: isActive,
                  originalImageData: imageData
                };
              }
            }

            // 내 위치 마커 표시 (완전히 안정화된 버전)
            function showMyLocationMarker(lat, lng) {
              try {
                console.log("📍 showMyLocationMarker 호출됨:", lat, lng);
                
                if (!map) {
                  console.log("⚠️ map이 없음, 100ms 후 재시도");
                  setTimeout(() => showMyLocationMarker(lat, lng), 100);
                  return;
                }
                
                if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
                  console.log("⚠️ 유효하지 않은 좌표:", lat, lng);
                  return;
                }
                
                const restrictedLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, lat));
                const restrictedLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, lng));
                
                console.log("📍 제한된 좌표:", restrictedLat, restrictedLng);
                
                // 기존 마커가 있으면 위치만 업데이트
                if (myLocationMarker) {
                  console.log("✅ 기존 내 위치 마커 존재, 위치만 업데이트");
                  
                  // 위치 업데이트
                  const newPos = new kakao.maps.LatLng(restrictedLat, restrictedLng);
                  myLocationMarker.setPosition(newPos);
                  
                  // 마커가 지도에 표시되어 있는지 확인하고 없으면 다시 추가
                  if (myLocationMarker.getMap() === null) {
                    console.log("🔄 내 위치 마커를 지도에 다시 추가");
                    myLocationMarker.setMap(map);
                  }
                  
                  console.log("✅ 내 위치 마커 위치 업데이트 완료");
                  return;
                }
                
                // 새 마커 생성
                console.log("🆕 새로운 내 위치 마커 생성");
                const myLocationPosition = new kakao.maps.LatLng(restrictedLat, restrictedLng);
                
                myLocationMarker = new kakao.maps.Marker({
                  position: myLocationPosition,
                  map: map,
                  zIndex: 1000
                });
                
                // SVG 이미지 설정
                const markerImage = new kakao.maps.MarkerImage(
                  'data:image/svg+xml;charset=UTF-8,<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="32" fill="%230669FD" fill-opacity="0.2"/><circle cx="32" cy="32" r="12" fill="white"/><circle cx="32" cy="32" r="8" fill="%230669FD"/></svg>',
                  new kakao.maps.Size(64, 64)
                );
                myLocationMarker.setImage(markerImage);
                myLocationMarker.setDraggable(false);
                
                console.log("✅ 새로운 내 위치 마커 생성 완료");
                
              } catch (error) {
                console.error("❌ showMyLocationMarker 오류:", error);
              }
            }

            // 지도를 특정 위치로 이동 (단순화된 버전)
            function moveMapToLocation(lat, lng) {
              try {
                console.log("🚀 moveMapToLocation 호출됨:", lat, lng);
                
                if (!map) {
                  console.log("⚠️ map이 없음, 100ms 후 재시도");
                  setTimeout(() => moveMapToLocation(lat, lng), 100);
                  return;
                }
                
                if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
                  console.log("⚠️ 유효하지 않은 좌표:", lat, lng);
                  return;
                }
                
                const restrictedLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, lat));
                const restrictedLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, lng));
                
                console.log("📍 제한된 좌표:", restrictedLat, restrictedLng);
                
                // 지도 중심 이동
                const newPosition = new kakao.maps.LatLng(restrictedLat, restrictedLng);
                map.setCenter(newPosition);
                console.log("✅ 지도 중심 이동 완료");
                
                // 내 위치 마커 처리
                showMyLocationMarker(restrictedLat, restrictedLng);
                
                console.log("✅ moveMapToLocation 완료");
              } catch (error) {
                console.error("❌ moveMapToLocation 오류:", error);
              }
            }

                        // 기존 마커의 인포박스 상태 업데이트 (이미지는 변경하지 않음)
            function updateBookstoreMarkerImage(id, isActive) {
              console.log("🔧 updateBookstoreMarkerImage 함수 시작");
              console.log("🔧 받은 ID:", id);
              console.log("🔧 받은 isActive:", isActive);
              console.log("🔧 bookstoreMarkers[id] 존재 여부:", !!bookstoreMarkers[id]);
              console.log("📍 내 위치 마커 상태:", myLocationMarker ? "존재" : "없음");
              
              if (bookstoreMarkers[id]) {
                const marker = bookstoreMarkers[id].marker;
                const infowindow = bookstoreMarkers[id].infowindow;
                
                console.log("📍 마커 객체:", marker);
                console.log("📍 인포박스 객체:", infowindow);
                
                // 인포박스 상태만 업데이트 (이미지는 변경하지 않음)
                if (isActive) {
                  console.log("✅ 인포박스 열기 시도");
                  
                  // 다른 모든 인포박스 닫기
                  Object.values(bookstoreMarkers).forEach(function(bookstoreMarker) {
                    if (bookstoreMarker.infowindow) {
                      bookstoreMarker.infowindow.close();
                    }
                  });
                  
                  // 현재 마커의 인포박스 열기
                  infowindow.open(map, marker);
                  console.log("🎯 인포박스 열기 완료");
                } else {
                  console.log("❌ 인포박스 닫기");
                  infowindow.close();
                }
              } else {
                console.log("⚠️ 마커를 찾을 수 없음:", id);
              }
              
              // 내 위치 마커 보호 및 복구 (더 강력하게)
              if (myLocationMarker) {
                console.log("🔄 내 위치 마커 보호 체크");
                
                // 마커가 지도에 표시되어 있는지 확인
                if (myLocationMarker.getMap() === null) {
                  console.log("🔄 내 위치 마커를 지도에 다시 추가");
                  myLocationMarker.setMap(map);
                  
                  // 추가 후에도 확인
                  setTimeout(() => {
                    if (myLocationMarker && myLocationMarker.getMap() === null) {
                      console.log("🔄 내 위치 마커 재시도");
                      myLocationMarker.setMap(map);
                    }
                  }, 50);
                }
              }
            }

            // 모든 독립서점 마커 제거 (내 위치 마커는 절대 제거하지 않음)
            function clearAllBookstoreMarkers() {
              console.log("🗑️ 모든 서점 마커 제거 시작");
              console.log("📍 내 위치 마커 상태:", myLocationMarker ? "존재" : "없음");
              
              // 서점 마커들만 제거
              Object.values(bookstoreMarkers).forEach(function(bookstoreMarker) {
                bookstoreMarker.marker.setMap(null);
                if (bookstoreMarker.infowindow) {
                  bookstoreMarker.infowindow.close();
                }
              });
              bookstoreMarkers = {};
              
              // 내 위치 마커 보호 및 복구
              if (myLocationMarker) {
                console.log("✅ 내 위치 마커 보존됨");
                
                // 마커가 지도에 표시되어 있는지 확인
                if (myLocationMarker.getMap() === null) {
                  console.log("🔄 내 위치 마커를 지도에 다시 추가");
                  myLocationMarker.setMap(map);
                }
                
                // 마커가 지도에 표시되어 있는지 한 번 더 확인
                if (myLocationMarker.getMap() === null) {
                  console.log("⚠️ 내 위치 마커 추가 실패, 재시도");
                  setTimeout(() => {
                    if (myLocationMarker && myLocationMarker.getMap() === null) {
                      myLocationMarker.setMap(map);
                      console.log("🔄 내 위치 마커 재시도 성공");
                    }
                  }, 100);
                }
              } else {
                console.log("⚠️ 내 위치 마커가 없음");
              }
            }

            // 내 위치 마커 보호 함수
            function protectMyLocationMarker() {
              console.log("🛡️ 내 위치 마커 보호 함수 실행");
              
              if (myLocationMarker) {
                console.log("📍 내 위치 마커 존재 확인");
                
                // 마커가 지도에 표시되어 있는지 확인
                if (myLocationMarker.getMap() === null) {
                  console.log("🔄 내 위치 마커를 지도에 다시 추가 (보호)");
                  myLocationMarker.setMap(map);
                  
                  // 추가 후에도 확인
                  setTimeout(() => {
                    if (myLocationMarker && myLocationMarker.getMap() === null) {
                      console.log("🔄 내 위치 마커 보호 재시도");
                      myLocationMarker.setMap(map);
                    }
                  }, 50);
                } else {
                  console.log("✅ 내 위치 마커가 지도에 안전하게 표시됨");
                }
              } else {
                console.log("⚠️ 보호할 내 위치 마커가 없음");
              }
            }

            // 모든 인포박스 닫기
            function closeAllInfoWindows() {
            
              Object.values(bookstoreMarkers).forEach(function(bookstoreMarker) {
                if (bookstoreMarker.infowindow) {
                  bookstoreMarker.infowindow.close();
                
                }
              });
            }

            // React Native에서 메시지 받기
            window.addEventListener('message', function(event) {
              try {
                console.log("📨 WebView 메시지 수신 시작");
                console.log("📨 원본 데이터:", event.data);
                console.log("📨 데이터 타입:", typeof event.data);
                
                const data = JSON.parse(event.data);
                console.log("📋 파싱된 데이터:", data);
                
                if (data.type === 'addBookstoreMarker') {
                  console.log("➕ addBookstoreMarker 처리");
                  addBookstoreMarkerToMap(
                    data.id, 
                    data.name, 
                    data.lat, 
                    data.lng, 
                    data.imageData, 
                    data.width, 
                    data.height,
                    data.isActive,
                    data.markerType
                  );
                } else if (data.type === 'showMyLocationMarker') {
                  console.log("📍 showMyLocationMarker 처리 시작");
                  console.log("📍 받은 좌표:", data.latitude, data.longitude);
                  showMyLocationMarker(data.latitude, data.longitude);
                } else if (data.type === 'updateBookstoreMarkerImage') {
                  console.log("🔄 updateBookstoreMarkerImage 처리 시작");
                  console.log("🔄 받은 데이터:", data);
                  console.log("🔄 ID:", data.id);
                  console.log("🔄 isActive:", data.isActive);
                  console.log("🔍 bookstoreMarkers 상태:", Object.keys(bookstoreMarkers));
                  console.log("🔍 bookstoreMarkers 전체:", bookstoreMarkers);
                  updateBookstoreMarkerImage(data.id, data.isActive);
                } else if (data.type === 'closeAllInfoWindows') {
                  console.log("❌ closeAllInfoWindows 처리");
                  closeAllInfoWindows();
                } else if (data.type === 'moveToLocation') {
                  console.log("🚀 moveToLocation 처리");
                  moveMapToLocation(data.latitude, data.longitude);
                } else if (data.type === 'clearAllMarkers') {
                  console.log("🗑️ clearAllMarkers 처리");
                  clearAllBookstoreMarkers();
                } else if (data.type === 'protectMyLocationMarker') {
                  console.log("🛡️ 내 위치 마커 보호 메시지 처리");
                  protectMyLocationMarker();
                } else {
                  console.log("⚠️ 알 수 없는 메시지 타입:", data.type);
                }
              } catch (error) {
                console.error("❌ 메시지 처리 오류:", error);
              }
            });
          </script>
        </body>
      </html>
    `;
    }, [apiKey, latitude, longitude, regions, filterType, bottomFilterTypes]); // bottomFilterTypes 의존성 추가

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
          onLoad={onLoad || handleWebViewLoad}
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
