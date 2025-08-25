import { getAuthHeadersAsync } from "./auth";
import {
    KakaoLoginResponse,
    LoginRequest,
    LoginResponse,
    ProfileUpdateRequest,
    ProfileUpdateResponse,
    UserInfoResponse,
} from "./globalState";

const API_BASE_URL = "http://15.164.250.185:8081/api/v1";

export const loginAPI = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  try {
    console.log("로그인 API 호출 시작:", { username: credentials.username });

    const response = await fetch(`${API_BASE_URL}/users/auth/login`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    console.log("로그인 API 응답 상태:", response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("로그인 API 에러 응답:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    console.log("로그인 API 성공:", {
      isSuccess: data.isSuccess,
      userId: data.result?.userId,
      message: data.message,
    });
    return data;
  } catch (error) {
    console.error("로그인 API 에러:", error);
    throw error;
  }
};

// 사용자 정보 조회 API
export const getUserInfoAPI = async (): Promise<UserInfoResponse> => {
  console.log("getUserInfoAPI 시작");

  try {
    const headers = await getAuthHeadersAsync();
    console.log("getUserInfoAPI 헤더:", headers);

    const response = await fetch("http://15.164.250.185:8081/api/v1/users", {
      method: "GET",
      headers,
    });

    console.log("getUserInfoAPI 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("getUserInfoAPI 에러 응답:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("getUserInfoAPI 성공:", data);
    return data;
  } catch (error) {
    console.log("getUserInfoAPI 실패:", error);
    throw error;
  }
};

// 인증이 필요한 API 요청을 위한 헬퍼 함수
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  console.log("authenticatedFetch 시작:", url);

  try {
    const headers = await getAuthHeadersAsync();
    console.log("authenticatedFetch 헤더:", headers);

    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    console.log("authenticatedFetch 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("authenticatedFetch 에러 응답:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    console.log("authenticatedFetch 성공");
    return response;
  } catch (error) {
    console.log("authenticatedFetch 실패:", error);
    throw error;
  }
};

// JWT 토큰 디코드 함수
const decodeJWT = (token: string) => {
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
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT 디코드 실패:", error);
    return null;
  }
};

// 프로필 수정 API
export const updateProfileAPI = async (
  requestData: ProfileUpdateRequest,
  profileImage?: string | null,
): Promise<ProfileUpdateResponse> => {
  console.log("updateProfileAPI 시작");
  console.log("updateProfileAPI 요청 데이터:", requestData);
  console.log("updateProfileAPI 프로필 이미지:", profileImage);

  try {
    const headers = await getAuthHeadersAsync();
    console.log("updateProfileAPI 헤더:", headers);

    const formData = new FormData();
    formData.append("request", JSON.stringify(requestData));

    if (profileImage) {
      formData.append("profileImage", {
        uri: profileImage,
        type: "image/jpeg",
        name: "profile.jpg",
      } as any);
    }

    console.log("updateProfileAPI FormData:", formData);

    const response = await fetch("http://15.164.250.185:8081/api/v1/users", {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    console.log("updateProfileAPI 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("updateProfileAPI 에러 응답:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("updateProfileAPI 성공:", data);
    return data;
  } catch (error) {
    console.log("updateProfileAPI 실패:", error);
    throw error;
  }
};

// 카카오 소셜 로그인 API
export const kakaoLoginAPI = async (
  code: string,
): Promise<KakaoLoginResponse> => {
  try {
    console.log("카카오 소셜 로그인 API 호출 시작:", { code });

    const response = await fetch(
      `${API_BASE_URL}/users/auth/kakao?code=${code}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      },
    );

    console.log(
      "카카오 소셜 로그인 API 응답 상태:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("카카오 소셜 로그인 API 에러 응답:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: KakaoLoginResponse = await response.json();
    console.log("카카오 소셜 로그인 API 성공:", {
      isSuccess: data.isSuccess,
      userId: data.result?.userId,
      message: data.message,
    });
    return data;
  } catch (error) {
    console.error("카카오 소셜 로그인 API 에러:", error);
    throw error;
  }
};
