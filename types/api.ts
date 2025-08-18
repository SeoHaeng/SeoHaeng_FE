import { getAuthHeaders } from "./auth";
import { LoginRequest, LoginResponse, UserInfoResponse } from "./globalState";

const API_BASE_URL = "http://15.164.250.185:8081/api/v1";

export const loginAPI = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/auth/login`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

// 사용자 정보 조회 API
export const getUserInfoAPI = async (): Promise<UserInfoResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        accept: "*/*",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: UserInfoResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Get user info API error:", error);
    throw error;
  }
};

// 인증이 필요한 API 요청을 위한 헬퍼 함수
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {},
) => {
  const headers = getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
};
