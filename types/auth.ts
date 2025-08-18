import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserInfoAPI } from "./api";
import {
  AuthState,
  getAuthState,
  setAuthState,
  setUserInfo,
  UserInfo,
} from "./globalState";

// AsyncStorage 키 상수
const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  USER_ID: "userId",
  IS_AUTHENTICATED: "isAuthenticated",
};

// 토큰 저장 (AsyncStorage 기반)
export const saveToken = async (accessToken: string, userId: number) => {
  try {
    // 토큰 유효성 검증
    if (!accessToken || accessToken.length < 10) {
      throw new Error("유효하지 않은 토큰입니다.");
    }

    // AsyncStorage에 저장
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId.toString());
    await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true");

    // 메모리 상태도 업데이트
    setAuthState({
      isAuthenticated: true,
      accessToken,
      userId,
      userInfo: null, // 초기에는 null로 설정
    });

    console.log("토큰 저장됨 (AsyncStorage):", {
      accessToken: accessToken.substring(0, 20) + "...",
      userId,
      tokenLength: accessToken.length,
    });

    // 토큰 저장 후 사용자 정보 가져오기
    try {
      await fetchAndStoreUserInfo();
    } catch (error) {
      console.log("사용자 정보 조회 실패 (토큰 저장 후):", error);
    }
  } catch (error) {
    console.error("토큰 저장 실패:", error);
    throw error;
  }
};

// 토큰 가져오기 (AsyncStorage에서)
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return token;
  } catch (error) {
    console.error("토큰 조회 실패:", error);
    return null;
  }
};

// 사용자 ID 가져오기 (AsyncStorage에서)
export const getUserId = async (): Promise<number | null> => {
  try {
    const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
    return userId ? parseInt(userId, 10) : null;
  } catch (error) {
    console.error("사용자 ID 조회 실패:", error);
    return null;
  }
};

// 인증 상태 확인 (AsyncStorage에서)
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const isAuth = await AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED);
    return isAuth === "true";
  } catch (error) {
    console.error("인증 상태 확인 실패:", error);
    return false;
  }
};

// 토큰 삭제 (로그아웃)
export const removeToken = async () => {
  try {
    // AsyncStorage에서 삭제
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.IS_AUTHENTICATED,
    ]);

    // 메모리 상태도 업데이트
    setAuthState({
      isAuthenticated: false,
      accessToken: null,
      userId: null,
    });

    console.log("토큰 삭제됨 (AsyncStorage)");
  } catch (error) {
    console.error("토큰 삭제 실패:", error);
    throw error;
  }
};

// 로그아웃 (토큰 삭제 + 홈 화면으로 이동)
export const logout = async () => {
  try {
    await removeToken();
    console.log("로그아웃 완료");
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
};

// 사용자 정보 가져오기 및 전역 상태에 저장
export const fetchAndStoreUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const response = await getUserInfoAPI();

    if (response.isSuccess && response.result) {
      const userInfo: UserInfo = response.result;

      // 전역 상태에 사용자 정보 저장
      setUserInfo(userInfo);

      console.log("사용자 정보 저장됨:", userInfo);
      return userInfo;
    } else {
      console.error("사용자 정보 조회 실패:", response.message);
      return null;
    }
  } catch (error) {
    console.error("사용자 정보 조회 중 오류 발생:", error);
    return null;
  }
};

// 저장된 토큰 복원 (앱 시작 시 호출)
export const restoreAuthState = async (): Promise<AuthState> => {
  try {
    const [accessToken, userId, isAuth] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.getItem(STORAGE_KEYS.USER_ID),
      AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED),
    ]);

    // 토큰이 실제로 존재하고 유효한지 더 엄격하게 검증
    const hasValidToken = !!accessToken && accessToken.length > 10; // 최소 길이 검증
    const authState: AuthState = {
      isAuthenticated: isAuth === "true" && hasValidToken,
      accessToken: hasValidToken ? accessToken : null,
      userId: hasValidToken && userId ? parseInt(userId, 10) : null,
      userInfo: null, // 초기에는 null로 설정
    };

    // 메모리 상태 업데이트
    setAuthState(authState);

    // 토큰이 유효하면 사용자 정보도 가져오기
    if (hasValidToken) {
      try {
        await fetchAndStoreUserInfo();
      } catch (error) {
        console.log("사용자 정보 조회 실패 (토큰 복원 후):", error);
      }
    }

    console.log("인증 상태 복원됨:", authState);
    return authState;
  } catch (error) {
    console.error("인증 상태 복원 실패:", error);
    const defaultState = {
      isAuthenticated: false,
      accessToken: null,
      userId: null,
      userInfo: null,
    };

    // 메모리 상태도 업데이트
    setAuthState(defaultState);
    return defaultState;
  }
};

// API 요청에 토큰을 포함하는 헤더 생성 (동기 버전)
export const getAuthHeaders = (): Record<string, string> => {
  const authState = getAuthState();
  if (authState.accessToken) {
    return {
      Authorization: `Bearer ${authState.accessToken}`,
      "Content-Type": "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
  };
};

// API 요청에 토큰을 포함하는 헤더 생성 (비동기 버전)
export const getAuthHeadersAsync = async (): Promise<
  Record<string, string>
> => {
  const token = await getToken();
  if (token) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }
  return {
    "Content-Type": "application/json",
  };
};
