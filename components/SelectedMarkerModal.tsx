import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
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
  } | null;
  onClose: () => void;
}

const SelectedMarkerModal = ({ marker, onClose }: SelectedMarkerModalProps) => {
  const slideAnim = useRef(new Animated.Value(300)).current; // 초기값을 화면 아래로 설정

  useEffect(() => {
    if (marker) {
      // 마커가 선택되면 아래에서 위로 슬라이드 업
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      // 마커가 해제되면 아래로 슬라이드 다운
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [marker, slideAnim]);

  // 마커 ID가 변경될 때마다 애니메이션 재실행
  useEffect(() => {
    if (marker) {
      // 현재 모달을 아래로 내린 후 다시 위로 슬라이드 업
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
  }, [marker?.id]); // marker.id가 변경될 때만 실행

  if (!marker) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        if (marker) {
          router.push({
            pathname: "/bookstore/[id]",
            params: { id: marker.id },
          });
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
            <Text style={styles.modalImageText}>📚</Text>
          </View>

          <View style={styles.modalInfo}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={styles.nameTypeContainer}>
                <Text style={styles.modalName}>
                  {marker.name.length > 10
                    ? marker.name.substring(0, 10) + "..."
                    : marker.name}
                </Text>
                <Text style={styles.modalType}>독립서점</Text>
              </View>
              <TouchableOpacity style={styles.modalBookmarkButton}>
                <ScrapIcon />
              </TouchableOpacity>
            </View>

            <View style={styles.modalRating}>
              <StarIcon />
              <Text style={styles.modalRatingText}>
                <Text style={styles.ratingScore}>4.2</Text>
                <Text style={styles.reviewCount}> (103)</Text>
              </Text>
              <Text style={styles.modalDistance}>1.2 km</Text>
            </View>
            <View style={styles.addressStatusContainer}>
              <View style={styles.modalAddress}>
                <PlaceIcon />
                <Text style={styles.modalAddressText}>
                  양양시 금하로 760, 지상 1층
                </Text>
              </View>

              <View style={styles.modalStatus}>
                <Text style={styles.modalStatusText}>영업종료</Text>
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
    fontSize: 16,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  modalType: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
  modalRating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  modalRatingText: {
    fontSize: 14,
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
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
  modalAddress: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalAddressText: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginLeft: 5,
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
