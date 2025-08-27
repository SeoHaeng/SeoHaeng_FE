// 전역 변수로 선택된 책 정보를 저장
export interface BookData {
  id: string;
  title: string;
  author: string;
  cover: { uri: string };
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

// 로그인 API 관련 타입
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    userId: number;
  };
}

// 사용자 정보 조회 API 응답 타입
export interface UserInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: UserInfo;
}

// 아이디로 회원정보 조회 API 응답 타입
export interface UserByIdResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    userId: number;
    nickName: string;
    profileImageUrl: string;
  };
}

// 프로필 수정 API 요청 타입
export interface ProfileUpdateRequest {
  username: string;
  nickname: string;
  password1: string;
  password2: string;
}

// 프로필 수정 API 응답 타입
export interface ProfileUpdateResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: any;
}

// 사용자 인증 상태 관리
export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  userId: number | null;
  userInfo: UserInfo | null;
}

export let authState: AuthState = {
  isAuthenticated: false,
  accessToken: null,
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
    userId: null,
    userInfo: null,
  };
};
