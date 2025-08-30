import {
  getPlaceDetailAPI,
  getPlaceInfoAPI,
  togglePlaceBookmarkAPI,
} from "@/types/api";
import { useGlobalState } from "@/types/globalState";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PlaceIcon from "./icons/PlaceIcon";
import ScrapIcon from "./icons/ScrapIcon";
import StarIcon from "./icons/StarIcon";

interface SelectedMarkerModalProps {
  marker: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    placeId?: number;
  } | null;
  onClose: () => void;
}

interface PlaceInfo {
  placeId: number;
  name: string;
  placeType: string;
  bookmarked: boolean;
  averageRating: number;
  reviewCount: number;
  distance: number;
  address: string;
  latitude: number;
  longitude: number;
}

interface PlaceDetail {
  placeId: number;
  placeType: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  websiteUrl?: string;
  tel?: string;
  reviewCount: number;
  rating: number;
  isBookmarked: boolean;
  placeDetail:
    | {
        overview: string;
        bookCafe: boolean;
        bookStay: boolean;
        bookChallengeStatus: boolean;
        parking: boolean;
        petFriendly: boolean;
        spaceRental: boolean;
        reservation: boolean;
        readingClub: boolean;
      }
    | {
        overview: string;
        parkingAvailable: string;
        petsAllowed: string;
        babyCarriageAllowed: string;
        creditCardAccepted: string;
      }
    | {
        firstmenu: string;
        treatmenu: string;
        kidsfacility: string;
        isSmokingAllowed: string;
        isTakeoutAvailable: string;
        hasParking: string;
        isReservable: string;
      }
    | {
        overview: string;
        programs: string;
        startDate: string;
        endDate: string;
      };
  placeImageUrls: string[];
}

const SelectedMarkerModal = ({ marker, onClose }: SelectedMarkerModalProps) => {
  const slideAnim = useRef(new Animated.Value(300)).current; // 초기값을 화면 아래로 설정
  const [placeInfo, setPlaceInfo] = useState<PlaceInfo | null>(null);
  const [placeDetail, setPlaceDetail] = useState<PlaceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userLocation } = useGlobalState();

  useEffect(() => {
    if (marker) {
      // 마커가 선택되면 아래에서 위로 슬라이드 업
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();

      // placeId가 있으면 두 API 모두 호출
      if (marker.placeId) {
        fetchPlaceInfo(marker.placeId);
        fetchPlaceDetail(marker.placeId);
      }
    } else {
      // 마커가 해제되면 아래로 슬라이드 다운
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // 상세 정보 초기화
      setPlaceInfo(null);
      setPlaceDetail(null);
    }
  }, [marker, slideAnim]);

  // 장소 기본 정보 조회 (getPlaceInfoAPI)
  const fetchPlaceInfo = async (placeId: number) => {
    try {
      console.log("📍 SelectedMarkerModal: getPlaceInfoAPI 호출 시작", {
        placeId,
      });

      const currentLocation = userLocation || {
        latitude: 37.5665,
        longitude: 126.978,
      }; // 기본값
      const userId = 1; // 기본값

      const response = await getPlaceInfoAPI(
        placeId,
        currentLocation.latitude,
        currentLocation.longitude,
        userId,
      );

      console.log("📍 SelectedMarkerModal: getPlaceInfoAPI 응답", {
        isSuccess: response.isSuccess,
        code: response.code,
        message: response.message,
        result: response.result,
      });

      if (response.isSuccess) {
        setPlaceInfo(response.result);
        console.log(
          "📍 SelectedMarkerModal: placeInfo 상태 업데이트 완료",
          response.result,
        );
      }
    } catch (error) {
      console.error(
        "📍 SelectedMarkerModal: getPlaceInfoAPI 호출 실패:",
        error,
      );
    }
  };

  // 장소 상세 정보 조회 (getPlaceDetailAPI)
  const fetchPlaceDetail = async (placeId: number) => {
    try {
      console.log("📍 SelectedMarkerModal: getPlaceDetailAPI 호출 시작", {
        placeId,
      });

      const response = await getPlaceDetailAPI(placeId);

      console.log("📍 SelectedMarkerModal: getPlaceDetailAPI 응답", {
        isSuccess: response.isSuccess,
        code: response.code,
        message: response.message,
        result: response.result,
      });

      if (response.isSuccess) {
        setPlaceDetail(response.result);
        console.log(
          "📍 SelectedMarkerModal: placeDetail 상태 업데이트 완료",
          response.result,
        );
      }
    } catch (error) {
      console.error(
        "📍 SelectedMarkerModal: getPlaceDetailAPI 호출 실패:",
        error,
      );
    }
  };

  // 찜하기 토글 처리
  const handleBookmarkToggle = async () => {
    if (!placeDetail?.placeId) {
      console.warn("📍 찜하기 토글: placeId가 없음");
      return;
    }

    try {
      console.log("📍 찜하기 토글 시작:", {
        placeId: placeDetail.placeId,
        currentBookmarked: placeDetail.isBookmarked,
      });

      const response = await togglePlaceBookmarkAPI(placeDetail.placeId);

      console.log("📍 찜하기 토글 API 응답:", {
        isSuccess: response.isSuccess,
        code: response.code,
        message: response.message,
        result: response.result,
      });

      if (response.isSuccess && response.result?.isBookmarked !== undefined) {
        // placeDetail 상태 업데이트
        setPlaceDetail((prev) =>
          prev
            ? {
                ...prev,
                isBookmarked: response.result!.isBookmarked,
              }
            : null,
        );

        console.log("📍 찜하기 상태 업데이트 완료:", {
          newBookmarked: response.result.isBookmarked,
        });
      }
    } catch (error) {
      console.error("📍 찜하기 토글 실패:", error);
    }
  };

  // 두 지점 간의 거리 계산 (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // 지구의 반지름 (km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 마커가 처음 나타날 때만 애니메이션 실행 (지도 움직임에는 반응하지 않음)
  useEffect(() => {
    if (marker && !placeInfo && !placeDetail) {
      // placeInfo와 placeDetail이 모두 없을 때만 애니메이션 실행 (처음 로드 시)
      slideAnim.setValue(300); // 즉시 아래로 이동

      // 다음 프레임에서 위로 슬라이드 업
      requestAnimationFrame(() => {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }).start();
      });
    }
  }, [marker, placeInfo, placeDetail]); // marker, placeInfo, placeDetail 상태 변경 시에만 실행

  if (!marker) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        if (placeDetail?.placeId) {
          console.log("📍 모달 클릭: 상세 페이지로 이동", {
            placeId: placeDetail.placeId,
            placeType: placeDetail.placeType,
            name: placeDetail.name,
          });

          router.push({
            pathname: "/bookstore/[id]",
            params: {
              id: placeDetail.placeId.toString(),
              from: "milestone",
              placeType: placeDetail.placeType,
              name: placeDetail.name,
            },
          });
        } else if (marker?.placeId) {
          console.log("📍 모달 클릭: marker.placeId로 상세 페이지 이동", {
            placeId: marker.placeId,
            name: marker.name,
          });

          router.push({
            pathname: "/bookstore/[id]",
            params: {
              id: marker.placeId.toString(),
              from: "milestone",
              name: marker.name,
            },
          });
        } else {
          console.warn("📍 모달 클릭: placeId가 없어서 이동할 수 없음");
        }
      }}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.selectedMarkerModal,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.modalHeader} />
        <View style={styles.modalContent}>
          <View style={styles.modalImagePlaceholder}>
            {placeDetail?.placeImageUrls &&
              placeDetail.placeImageUrls.length > 0 && (
                <Image
                  source={{ uri: placeDetail.placeImageUrls[0] }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
              )}
          </View>

          <View style={styles.modalInfo}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.nameTypeContainer}>
                <Text style={styles.modalName}>
                  {placeDetail?.name || marker.name}
                </Text>
                <Text style={styles.modalType}>
                  {placeDetail?.placeType === "BOOKSTORE"
                    ? "독립서점"
                    : placeDetail?.placeType === "BOOKCAFE"
                      ? "북카페"
                      : placeDetail?.placeType === "BOOKSTAY"
                        ? "북스테이"
                        : placeDetail?.placeType === "TOURIST_SPOT"
                          ? "관광지"
                          : placeDetail?.placeType === "RESTAURANT"
                            ? "음식점"
                            : placeDetail?.placeType === "FESTIVAL"
                              ? "축제"
                              : "장소"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalBookmarkButton}
                onPress={handleBookmarkToggle}
                activeOpacity={0.7}
              >
                <ScrapIcon
                  color={placeDetail?.isBookmarked ? "#FF6B6B" : "#9D9896"}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.modalRating}>
              <StarIcon />
              <Text style={styles.modalRatingText}>
                <Text style={styles.ratingScore}>
                  {placeDetail?.rating ? placeDetail.rating.toFixed(1) : "0.0"}
                </Text>
                <Text style={styles.reviewCount}>
                  {placeDetail?.reviewCount
                    ? ` (${placeDetail.reviewCount})`
                    : " (0)"}
                </Text>
              </Text>
              <Text style={styles.modalDistance}>
                {placeDetail?.latitude && placeDetail?.longitude
                  ? `${calculateDistance(marker.lat, marker.lng, placeDetail.latitude, placeDetail.longitude).toFixed(1)} km`
                  : "거리 계산 중..."}
              </Text>
            </View>
            <View style={styles.addressStatusContainer}>
              <View style={styles.modalAddress}>
                <PlaceIcon />
                <Text style={styles.modalAddressText}>
                  {placeDetail?.address || "주소 정보 없음"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  selectedMarkerModal: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 15,
    paddingTop: 10,
    zIndex: 1000,
  },
  modalHeader: {
    width: 42,
    height: 4,
    backgroundColor: "#C5BFBB",
    borderRadius: 50,
    alignSelf: "center",
  },

  modalContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
  },
  modalImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#EEE9E6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    overflow: "hidden",
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  modalImageText: {
    fontSize: 32,
  },
  modalInfo: {
    flex: 1,
  },
  nameTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 0,
  },
  addressStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalName: {
    fontSize: 15,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  modalType: {
    fontSize: 11,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
  modalRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  modalRatingText: {
    fontSize: 12,
    marginRight: 15,
    marginLeft: 5,
  },
  ratingScore: {
    fontFamily: "SUIT-800",
    color: "#000000",
  },
  reviewCount: {
    fontFamily: "SUIT-500",
    color: "#7E7E7E",
  },
  modalDistance: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
  modalAddress: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalAddressText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginLeft: 5,
    width: "95%",
  },
  modalStatus: {
    backgroundColor: "#DBD6D3",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
    alignSelf: "flex-start",
  },
  modalStatusText: {
    fontSize: 12,
    fontFamily: "SUIT-600",
    color: "#9D9896",
  },
  modalBookmarkButton: {
    padding: 10,
  },
});

export default SelectedMarkerModal;
