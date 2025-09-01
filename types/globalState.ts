import React, { createContext, ReactNode, useContext, useState } from "react";

// 뷰포트 정보 타입
export interface ViewportInfo {
  north: number;
  south: number;
  east: number;
  west: number;
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

// 사용자 위치 정보 타입
export interface UserLocation {
  latitude: number;
  longitude: number;
}

// 전역 상태 타입
interface GlobalState {
  viewport: ViewportInfo | null;
  userLocation: UserLocation | null;
  travelScheduleList: TravelScheduleItem[];
  selectedRegions: string[]; // 선택된 지역들
  setViewport: (viewport: ViewportInfo) => void;
  setUserLocation: (location: UserLocation) => void;
  addTravelSchedule: (item: TravelScheduleItem) => void;
  updateTravelSchedule: (
    day: string,
    placeId: number,
    newPlaceId: number,
  ) => void;
  removeTravelSchedule: (day: string, placeId: number) => void;
  clearTravelSchedule: () => void;
  setSelectedRegions: (regions: string[]) => void; // 지역 설정
  clearSelectedRegions: () => void; // 지역 초기화
  clearViewport: () => void;
  clearUserLocation: () => void;
}

// Context 생성
const GlobalStateContext = createContext<GlobalState | undefined>(undefined);

// Provider 컴포넌트
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [viewport, setViewportState] = useState<ViewportInfo | null>(null);
  const [userLocation, setUserLocationState] = useState<UserLocation | null>(
    null,
  );
  const [travelScheduleList, setTravelScheduleList] = useState<
    TravelScheduleItem[]
  >([]);
  const [selectedRegions, setSelectedRegionsState] = useState<string[]>([]);

  //console.log("🌍 GlobalStateProvider 초기화됨");
  //console.log("📍 초기 상태:", { viewport, userLocation });

  const setViewport = (newViewport: ViewportInfo) => {
    //console.log("🌍 전역 뷰포트 업데이트:", newViewport);
    setViewportState(newViewport);
  };

  const setUserLocation = (newLocation: UserLocation) => {
    console.log("📍 전역 사용자 위치 업데이트:", newLocation);
    setUserLocationState(newLocation);
  };

  // 여행 스케줄 추가
  const addTravelSchedule = (item: TravelScheduleItem) => {
    console.log("📅 여행 스케줄 추가:", item);
    setTravelScheduleList((prev) => [...prev, item]);
  };

  // 여행 스케줄 업데이트
  const updateTravelSchedule = (
    day: string,
    placeId: number,
    newPlaceId: number,
  ) => {
    console.log("📅 여행 스케줄 업데이트:", { day, placeId, newPlaceId });
    setTravelScheduleList((prev) =>
      prev.map((item) =>
        item.day === day && item.placeId === placeId
          ? { ...item, placeId: newPlaceId }
          : item,
      ),
    );
  };

  // 여행 스케줄 제거
  const removeTravelSchedule = (day: string, placeId: number) => {
    console.log("📅 여행 스케줄 제거:", { day, placeId });
    setTravelScheduleList((prev) =>
      prev.filter((item) => !(item.day === day && item.placeId === placeId)),
    );
  };

  // 여행 스케줄 전체 초기화
  const clearTravelSchedule = () => {
    console.log("🗑️ 여행 스케줄 전체 초기화");
    setTravelScheduleList([]);
  };

  // 선택된 지역 설정
  const setSelectedRegions = (regions: string[]) => {
    console.log("🌍 선택된 지역 설정:", regions);
    setSelectedRegionsState(regions);
  };

  // 선택된 지역 초기화
  const clearSelectedRegions = () => {
    console.log("🌍 선택된 지역 초기화");
    setSelectedRegionsState([]);
  };

  const clearViewport = () => {
    console.log("🗑️ 전역 뷰포트 초기화");
    setViewportState(null);
  };

  const clearUserLocation = () => {
    console.log("🗑️ 전역 사용자 위치 초기화");
    setUserLocationState(null);
  };

  const value: GlobalState = {
    viewport,
    userLocation,
    travelScheduleList,
    selectedRegions,
    setViewport,
    setUserLocation,
    addTravelSchedule,
    updateTravelSchedule,
    removeTravelSchedule,
    clearTravelSchedule,
    setSelectedRegions,
    clearSelectedRegions,
    clearViewport,
    clearUserLocation,
  };

  return React.createElement(GlobalStateContext.Provider, { value }, children);
};

// Hook으로 Context 사용
export const useGlobalState = (): GlobalState => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

// 전역 변수로 선택된 책 정보를 저장
export interface BookData {
  id: string;
  title: string;
  author: string;
  cover: { uri: string };
  pubDate?: string; // 출판일 (YYYYMMDD 형식)
}

// 여행 스케줄 아이템 타입
export interface TravelScheduleItem {
  day: string; // 날짜 (YYYY-MM-DD 형식)
  placeId: number; // 갈 시설의 ID
  name?: string; // 장소 이름
  placeType?: string; // 장소 타입
  latitude?: number; // 위도
  longitude?: number; // 경도
}

// 사용자 정보 타입
export interface UserInfo {
  userId: number;
  userName: string;
  nickName: string;
  profileImageUrl: string | null;
  loginType: string;
}

// 받을 책 정보
export let receivedBookData: BookData | null = null;

// 줄 책 정보
export let giftBookData: BookData | null = null;

// 받을 책 정보 설정
export const setReceivedBookData = (book: BookData | null) => {
  receivedBookData = book;
};

// 줄 책 정보 설정
export const setGiftBookData = (book: BookData | null) => {
  giftBookData = book;
};

// 받을 책 정보 가져오기
export const getReceivedBookData = (): BookData | null => {
  return receivedBookData;
};

// 줄 책 정보 가져오기
export const getGiftBookData = (): BookData | null => {
  return giftBookData;
};

// 마커 등록용 도서 정보
export let markerBookData: BookData | null = null;

// 마커 등록용 도서 정보 설정
export const setMarkerBookData = (book: BookData | null) => {
  markerBookData = book;
};

// 마커 등록용 도서 정보 가져오기
export const getMarkerBookData = (): BookData | null => {
  return markerBookData;
};

// 마커 등록용 템플릿 선택 상태
export let markerTemplateData: number | null = null;

// 마커 등록용 템플릿 선택 상태 설정
export const setMarkerTemplateData = (templateId: number | null) => {
  markerTemplateData = templateId;
};

// 마커 등록용 템플릿 선택 상태 가져오기
export const getMarkerTemplateData = (): number | null => {
  return markerTemplateData;
};

// 마커 등록용 위치 정보
export interface MarkerLocationData {
  latitude: number;
  longitude: number;
  address: string;
}

export let markerLocationData: MarkerLocationData | null = null;

// 마커 등록용 위치 정보 설정
export const setMarkerLocationData = (location: MarkerLocationData | null) => {
  markerLocationData = location;
};

// 마커 등록용 위치 정보 가져오기
export const getMarkerLocationData = (): MarkerLocationData | null => {
  return markerLocationData;
};

// 사용자 인증 상태 관리
export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  userInfo: UserInfo | null;
}

export let authState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  userId: null,
  userInfo: null,
};

// 인증 상태 설정 (메모리 상태만 업데이트)
export const setAuthState = (state: Partial<AuthState>) => {
  authState = { ...authState, ...state };
};

// 인증 상태 가져오기
export const getAuthState = (): AuthState => {
  return authState;
};

// 사용자 정보 설정
export const setUserInfo = (userInfo: UserInfo | null) => {
  authState.userInfo = userInfo;
};

// 사용자 정보 가져오기
export const getUserInfo = (): UserInfo | null => {
  return authState.userInfo;
};

// 로그아웃
export const logout = () => {
  authState = {
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    userId: null,
    userInfo: null,
  };
};
