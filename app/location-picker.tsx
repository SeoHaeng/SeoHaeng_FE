import LocationPickerMap from "@/components/LocationPickerMap";
import { router, useLocalSearchParams } from "expo-router";
import React from "react";

export default function LocationPickerScreen() {
  const params = useLocalSearchParams();

  // URL 파라미터에서 초기 위치 정보 가져오기
  const initialLatitude =
    parseFloat(params.initialLatitude as string) || 37.8228; // 춘천 기본값
  const initialLongitude =
    parseFloat(params.initialLongitude as string) || 127.7322;

  // 위치 선택 완료 시 처리
  const handleLocationSelected = (
    latitude: number,
    longitude: number,
    address: string,
  ) => {
    // 선택된 위치 정보를 이전 화면으로 전달
    router.back();

    // 여기서 선택된 위치 정보를 처리할 수 있습니다
    // 예: 전역 상태 업데이트, API 호출 등
    console.log("선택된 위치:", { latitude, longitude, address });
  };

  // 취소 시 처리
  const handleCancel = () => {
    router.back();
  };

  return (
    <LocationPickerMap
      initialLatitude={initialLatitude}
      initialLongitude={initialLongitude}
      onLocationSelected={handleLocationSelected}
      onCancel={handleCancel}
    />
  );
}
