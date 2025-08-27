import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserInfoAPI, reissueTokenAPI } from "./api";
import { AuthState, UserInfo } from "./globalState";

// AsyncStorage 키 상수
const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_ID: "userId",
  IS_AUTHENTICATED: "isAuthenticated",
};

// 토큰 저장 (AsyncStorage 기반)
export const saveToken = async (
  accessToken: string,
  refreshToken: string,
  userId: number,
) => {
  try {
    // 토큰 유효성 검증
    if (!accessToken || accessToken.length < 10) {
      throw new Error("유효하지 않은 액세스 토큰입니다.");
    }

    if (!refreshToken || refreshToken.length < 10) {
      throw new Error("유효하지 않은 리프레시 토큰입니다.");
    }

    // AsyncStorage에 저장
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId.toString());
    await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true");

    // 전역 상태도 업데이트
    const { setAuthState } = await import("./globalState");
    setAuthState({
      accessToken,
      refreshToken,
      userId,
      isAuthenticated: true,
    });

    console.log("토큰 저장됨 (AsyncStorage):", {
      accessToken: accessToken.substring(0, 20) + "...",
      refreshToken: refreshToken.substring(0, 20) + "...",
      userId,
      tokenLength: accessToken.length,
    });
  } catch (error) {
    console.error("토큰 저장 실패:", error);
    throw error;
  }
};

// 액세스 토큰만 저장 (기존 호환성 유지)
export const saveAccessToken = async (accessToken: string, userId: number) => {
  try {
    // 토큰 유효성 검증
    if (!accessToken || accessToken.length < 10) {
      throw new Error("유효하지 않은 액세스 토큰입니다.");
    }

    // AsyncStorage에 저장
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId.toString());
    await AsyncStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, "true");

    // 전역 상태도 업데이트
    const { setAuthState } = await import("./globalState");
    setAuthState({
      accessToken,
      userId,
      isAuthenticated: true,
    });

    console.log("액세스 토큰만 저장됨 (AsyncStorage):", {
      accessToken: accessToken.substring(0, 20) + "...",
      userId,
      tokenLength: accessToken.length,
    });
  } catch (error) {
    console.error("액세스 토큰 저장 실패:", error);
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

// 리프레시 토큰 가져오기 (AsyncStorage에서)
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    return token;
  } catch (error) {
    console.error("리프레시 토큰 조회 실패:", error);
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

// 토큰 재발급 (리프레시 토큰 사용)
export const reissueToken = async (): Promise<boolean> => {
  try {
    console.log("토큰 재발급 시도");

    // 리프레시 토큰 가져오기
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      console.error("리프레시 토큰이 없습니다.");
      return false;
    }

    const response = await reissueTokenAPI(refreshToken);

    if (response.isSuccess && response.result) {
      // 새로운 토큰 저장
      await saveToken(
        response.result.accessToken,
        response.result.refreshToken,
        response.result.userId,
      );
      console.log("토큰 재발급 성공");
      return true;
    } else {
      console.error("토큰 재발급 실패:", response.message);
      return false;
    }
  } catch (error) {
    console.error("토큰 재발급 중 오류:", error);
    return false;
  }
};

// 403 에러 시 자동 토큰 재발급 시도
export const handleTokenError = async (error: any): Promise<boolean> => {
  try {
    // 403 에러인 경우 토큰 재발급 시도
    if (error instanceof Error && error.message.includes("403")) {
      console.log("403 에러 감지: 토큰 재발급 시도");
      const reissueSuccess = await reissueToken();
      if (reissueSuccess) {
        console.log("토큰 재발급 성공, API 재시도 가능");
        return true;
      } else {
        console.log("토큰 재발급 실패, 로그아웃 필요");
        await removeToken();
        return false;
      }
    }
    return false;
  } catch (handleError) {
    console.error("토큰 에러 처리 중 오류:", handleError);
    return false;
  }
};

// 회원탈퇴
export const deleteUser = async (): Promise<boolean> => {
  try {
    console.log("회원탈퇴 시작");

    const { deleteUserAPI } = await import("./api");
    const response = await deleteUserAPI();

    if (response.isSuccess) {
      console.log("회원탈퇴 성공");
      // 모든 토큰과 사용자 정보 삭제
      await removeToken();
      return true;
    } else {
      console.error("회원탈퇴 실패:", response.message);
      return false;
    }
  } catch (error) {
    console.error("회원탈퇴 중 오류:", error);
    return false;
  }
};

// 토큰 삭제 (로그아웃)
export const removeToken = async () => {
  try {
    // AsyncStorage에서 삭제
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.IS_AUTHENTICATED,
    ]);

    // 전역 상태도 업데이트
    const { setAuthState } = await import("./globalState");
    setAuthState({
      accessToken: null,
      refreshToken: null,
      userId: null,
      isAuthenticated: false,
      userInfo: null,
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

      console.log("사용자 정보 조회 성공:", userInfo);

      // 전역 상태에 사용자 정보 저장
      const { setUserInfo } = await import("./globalState");
      setUserInfo(userInfo);

      return userInfo;
    } else {
      console.error("사용자 정보 조회 실패:", response.message);
      return null;
    }
  } catch (error) {
    console.error("사용자 정보 조회 중 오류 발생:", error);

    // 401 에러인 경우 토큰 재발급 시도
    if (error instanceof Error && error.message.includes("401")) {
      console.log("사용자 정보 조회 401 에러: 토큰 재발급 시도");
      const reissueSuccess = await reissueToken();
      if (reissueSuccess) {
        // 토큰 재발급 성공 시 다시 사용자 정보 조회 시도
        try {
          const retryResponse = await getUserInfoAPI();
          if (retryResponse.isSuccess && retryResponse.result) {
            const userInfo: UserInfo = retryResponse.result;
            console.log("토큰 재발급 후 사용자 정보 조회 성공:", userInfo);

            // 전역 상태에 사용자 정보 저장
            const { setUserInfo } = await import("./globalState");
            setUserInfo(userInfo);

            return userInfo;
          }
        } catch (retryError) {
          console.error(
            "토큰 재발급 후 사용자 정보 조회 재시도 실패:",
            retryError,
          );
        }
      }
    }

    // 403 에러인 경우 토큰 삭제
    if (error instanceof Error && error.message.includes("403")) {
      console.log("사용자 정보 조회 403 에러: 토큰 삭제");
      await removeToken();
    }

    return null;
  }
};

// JWT 토큰 만료 검증 함수
const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);

    // exp (만료 시간) 확인
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      return currentTime >= payload.exp;
    }
    return false;
  } catch (error) {
    console.error("토큰 만료 검증 실패:", error);
    return true; // 파싱 실패 시 만료된 것으로 간주
  }
};

// 저장된 토큰 복원 (앱 시작 시 호출)
export const restoreAuthState = async (): Promise<AuthState> => {
  try {
    const [accessToken, refreshToken, userId, isAuth] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN),
      AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
      AsyncStorage.getItem(STORAGE_KEYS.USER_ID),
      AsyncStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED),
    ]);

    // 토큰이 실제로 존재하고 유효한지 더 엄격하게 검증
    const hasValidToken =
      !!accessToken && accessToken.length > 10 && !isTokenExpired(accessToken);
    const hasRefreshToken = !!refreshToken && refreshToken.length > 10;
    const authState: AuthState = {
      isAuthenticated: isAuth === "true" && hasValidToken,
      accessToken: hasValidToken ? accessToken : null,
      refreshToken: hasRefreshToken ? refreshToken : null,
      userId: hasValidToken && userId ? parseInt(userId, 10) : null,
      userInfo: null, // 초기에는 null로 설정
    };

    // 토큰이 유효하면 사용자 정보도 가져오기
    if (hasValidToken) {
      console.log("토큰이 유효함, 사용자 정보 조회 시작");
      try {
        const userInfo = await fetchAndStoreUserInfo();
        console.log("fetchAndStoreUserInfo 결과:", userInfo);
        if (userInfo) {
          authState.userInfo = userInfo;
          // 전역 상태도 업데이트
          const { setUserInfo } = await import("./globalState");
          setUserInfo(userInfo);
          console.log("전역 상태에 사용자 정보 저장 완료");
        } else {
          console.log("사용자 정보가 null로 반환됨");
        }
      } catch (error) {
        console.log("사용자 정보 조회 실패 (토큰 복원 후):", error);

        // 401 에러인 경우 토큰 재발급 시도
        if (error instanceof Error && error.message.includes("401")) {
          console.log("사용자 정보 조회 401 에러: 토큰 재발급 시도");
          const reissueSuccess = await reissueToken();
          if (reissueSuccess) {
            // 토큰 재발급 성공 시 다시 사용자 정보 조회 시도
            try {
              const retryUserInfo = await fetchAndStoreUserInfo();
              if (retryUserInfo) {
                authState.userInfo = retryUserInfo;
                console.log("토큰 재발급 후 사용자 정보 조회 성공");
                return authState;
              }
            } catch (retryError) {
              console.error(
                "토큰 재발급 후 사용자 정보 조회 재시도 실패:",
                retryError,
              );
            }
          }
        }

        // 403 에러인 경우 토큰을 삭제하고 인증 상태를 false로 설정
        if (error instanceof Error && error.message.includes("403")) {
          console.log(
            "사용자 정보 조회 403 에러: 토큰 삭제 및 인증 상태 초기화",
          );
          await removeToken();

          const errorState: AuthState = {
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            userId: null,
            userInfo: null,
          };

          return errorState;
        }
      }
    }

    console.log("인증 상태 복원됨:", authState);
    return authState;
  } catch (error) {
    console.error("인증 상태 복원 실패:", error);
    const defaultState: AuthState = {
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      userId: null,
      userInfo: null,
    };

    return defaultState;
  }
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
