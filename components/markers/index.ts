// 문화/서점 관련 마커들
export * from './CulturalMarker';

// 관광/음식 관련 마커들
export * from './TouristMarker';

// 공통 타입 및 유틸리티
export interface BaseMarkerData {
  id: number;
  name: string;
  lat: number;
  lng: number;
  isActive?: boolean;
}

// 마커 타입 유니온
export type MarkerType = 
  | '독립서점' | '책갈피' | '북카페' | '북스테이'
  | '관광지' | '축제' | '맛집';

// 통합 마커 데이터 인터페이스
export interface UnifiedMarkerData extends BaseMarkerData {
  type: MarkerType;
}
