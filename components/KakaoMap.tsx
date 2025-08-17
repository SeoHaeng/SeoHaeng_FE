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
import { createCulturalMarkerImages } from "./bookstoreMarkers";

// 마커 스타일
const markerStyles = {
  width: 34,
  height: 39,
};

type KakaoMapProps = {
  latitude: number;
  longitude: number;
  regions?: string[];
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
  ({ latitude, longitude, regions = [] }, ref) => {
    const apiKey = Constants.expoConfig?.extra?.KAKAO_MAP_JS_KEY;
    // 활성화된 마커 ID 관리 (한 번에 하나만 활성화)
    const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null); // number에서 string으로 변경
    const webViewRef = React.useRef<WebView>(null);

    // activeMarkerId가 변경될 때마다 모든 마커를 다시 그리기
    useEffect(() => {
      if (webViewRef.current) {
        setTimeout(() => {
          mockData.forEach((item) => {
            const bookstore: Bookstore = {
              id: item.id, // parseInt 제거, 문자열 ID 그대로 사용
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

    // 문화/서점 마커 추가
    const addCulturalMarker = (bookstore: Bookstore) => {
      const isActive = activeMarkerId === bookstore.id;
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
          id: item.id, // parseInt 제거, 문자열 ID 그대로 사용
          name: item.name,
          lat: item.latitude,
          lng: item.longitude,
          type: item.type as "독립서점" | "북카페" | "북스테이" | "책갈피",
        };
        addCulturalMarker(bookstore);
      });
    };

    // 기존 마커의 이미지만 업데이트
    const updateBookstoreMarkerImage = (bookstore: Bookstore) => {
      const message = {
        type: "updateBookstoreMarkerImage",
        id: bookstore.id,
        isActive: activeMarkerId === bookstore.id,
      };
      webViewRef.current?.postMessage(JSON.stringify(message));
    };

    // 내 위치 마커 표시
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
        console.log("WebView에서 받은 메시지:", data); // 전체 메시지 확인

        if (data.type === "bookstoreClick") {
          const markerId = data.id!;
          console.log("bookstoreClick - 받은 데이터:", {
            type: data.type,
            id: data.id,
            name: data.name,
          });

          if (activeMarkerId !== markerId) {
            setActiveMarkerId(markerId);
            console.log("bookstoreClick - 새로운 마커 활성화:", markerId);
          } else {
            console.log("bookstoreClick - 이미 활성화된 마커:", markerId);
          }
        } else if (data.type === "mapClicked") {
          setActiveMarkerId(null);
        } else if (data.type === "mapReady") {
          showMyLocationMarker();
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
            
            window.onload = function() {
              if (typeof kakao !== 'undefined' && kakao.maps) {
                const mapContainer = document.getElementById('map');
                
                const initialLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, ${latitude}));
                const initialLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, ${longitude}));
                
                const mapOption = {
                  center: new kakao.maps.LatLng(initialLat, initialLng),
                  level: 7
                };
                map = new kakao.maps.Map(mapContainer, mapOption);
                
                // 지도 클릭 이벤트
                kakao.maps.event.addListener(map, 'click', function() {
                  if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'mapClicked'
                    }));
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
              }
            };

            // 독립서점 마커 추가 함수
            function addBookstoreMarkerToMap(id, name, lat, lng, imageData, width, height, isActive) {
              if (!map) {
                setTimeout(() => addBookstoreMarkerToMap(id, name, lat, lng, imageData, width, height, isActive), 100);
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
                    setupMarker(marker, id, name, lat, lng, isActive);
                  };
                  
                  img.onerror = function() {
                    createDefaultMarker();
                  };
                  
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
                setupMarker(marker, id, name, lat, lng, isActive);
              }
              
              function setupMarker(marker, id, name, lat, lng, isActive) {
                const infowindow = new kakao.maps.InfoWindow({
                  content: '<div style="padding:10px;font-size:14px;text-align:center;min-width:120px;"><strong>' + name + '</strong></div>'
                });

                kakao.maps.event.addListener(marker, 'click', function(event) {
                  if (event && event.stopPropagation) {
                    event.stopPropagation();
                  }
                  
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

                bookstoreMarkers[id] = {
                  marker: marker,
                  infowindow: infowindow,
                  name: name,
                  lat: lat,
                  lng: lng,
                  isActive: isActive,
                  originalImageData: imageData
                };
                
                if (Object.keys(bookstoreMarkers).length > 0) {
                  const bounds = new kakao.maps.LatLngBounds();
                  Object.values(bookstoreMarkers).forEach(function(bookstoreMarker) {
                    bounds.extend(bookstoreMarker.marker.getPosition());
                  });
                  map.setBounds(bounds, 50);
                }
              }
            }

            // 내 위치 마커 표시
            function showMyLocationMarker(lat, lng) {
              try {
                if (!map) {
                  setTimeout(() => showMyLocationMarker(lat, lng), 100);
                  return;
                }
                
                if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
                  return;
                }
                
                const restrictedLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, lat));
                const restrictedLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, lng));
                
                if (myLocationMarker) {
                  const currentPos = myLocationMarker.getPosition();
                  const newPos = new kakao.maps.LatLng(restrictedLat, restrictedLng);
                  
                  if (Math.abs(currentPos.getLat() - restrictedLat) < 0.0001 && 
                      Math.abs(currentPos.getLng() - restrictedLng) < 0.0001) {
                    return;
                  }
                  
                  myLocationMarker.setPosition(newPos);
                  return;
                }
                
                const myLocationPosition = new kakao.maps.LatLng(restrictedLat, restrictedLng);
                myLocationMarker = new kakao.maps.Marker({
                  position: myLocationPosition,
                  map: map
                });
                
              } catch (error) {
                console.error('내 위치 마커 생성 실패:', error);
              }
            }

            // 지도를 특정 위치로 이동
            function moveMapToLocation(lat, lng) {
              try {
                if (!map) {
                  setTimeout(() => moveMapToLocation(lat, lng), 100);
                  return;
                }
                
                if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
                  return;
                }
                
                const restrictedLat = Math.max(${koreaBounds.south}, Math.min(${koreaBounds.north}, lat));
                const restrictedLng = Math.max(${koreaBounds.west}, Math.min(${koreaBounds.east}, lng));
                
                const newPosition = new kakao.maps.LatLng(restrictedLat, restrictedLng);
                map.setCenter(newPosition);
                
                if (myLocationMarker) {
                  myLocationMarker.setPosition(newPosition);
                } else {
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
                const originalImageData = bookstoreMarkers[id].originalImageData;
                
                let imageData = originalImageData;
                const width = ${markerStyles.width};
                const height = ${markerStyles.height};
                
                try {
                  if (imageData && imageData.length > 0) {
                    const imageSize = new kakao.maps.Size(width, height);
                    const imageOption = {
                      offset: new kakao.maps.Point(width / 2, height)
                    };
                    
                    if (imageData.includes('<svg')) {
                      const svgBlob = new Blob([imageData], { type: 'image/svg+xml' });
                      const url = URL.createObjectURL(svgBlob);
                      
                      const img = new Image();
                      img.onload = function() {
                        const markerImage = new kakao.maps.MarkerImage(url, imageSize, imageOption);
                        marker.setImage(markerImage);
                        updateInfoWindow();
                      };
                      
                      img.onerror = function() {
                        updateInfoWindow();
                      };
                      
                      img.src = url;
                    } else {
                      const markerImage = new kakao.maps.MarkerImage(imageData, imageSize, imageOption);
                      marker.setImage(markerImage);
                      updateInfoWindow();
                    }
                  } else {
                    updateInfoWindow();
                  }
                  
                } catch (error) {
                  updateInfoWindow();
                }
                
                function updateInfoWindow() {
                  if (isActive) {
                    Object.values(bookstoreMarkers).forEach(function(bookstoreMarker) {
                      if (bookstoreMarker.infowindow) {
                        bookstoreMarker.infowindow.close();
                      }
                    });
                    infowindow.open(map, marker);
                  } else {
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
