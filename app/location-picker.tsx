import LocationPickerMap from "@/components/LocationPickerMap";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function LocationPickerScreen() {
  const params = useLocalSearchParams();

  // URL 파라미터에서 초기 위치 정보 가져오기
  const initialLatitude =
    parseFloat(params.initialLatitude as string) || 37.8228; // 춘천 기본값
  const initialLongitude =
    parseFloat(params.initialLongitude as string) || 127.7322;

  return (
    <LocationPickerMap
      initialLatitude={initialLatitude}
      initialLongitude={initialLongitude}
    />
  );
}
