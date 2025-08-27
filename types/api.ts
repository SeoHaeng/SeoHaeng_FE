import { API_BASE_URL } from "../config/api";
import { getAuthHeadersAsync } from "./auth";
import {
  BookChallengeCommentListResponse,
  BookChallengeDetailResponse,
  LoginRequest,
  LoginResponse,
  ProfileUpdateRequest,
  ProfileUpdateResponse,
  UserByIdResponse,
  UserInfoResponse,
} from "./globalState";

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
  console.log("API URL:", "http://15.164.250.185:8081/api/v1/users");

  try {
    const headers = await getAuthHeadersAsync();
    console.log("getUserInfoAPI 헤더:", headers);

    console.log("fetch 요청 시작...");
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers,
    });

    console.log("getUserInfoAPI 응답 상태:", response.status);
    console.log("getUserInfoAPI 응답 헤더:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("getUserInfoAPI 에러 응답:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("getUserInfoAPI 성공:", data);
    return data;
  } catch (error) {
    console.error("getUserInfoAPI 실패:", error);
    console.error("에러 타입:", typeof error);
    console.error(
      "에러 메시지:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
};

// 아이디로 회원정보 조회 API
export const getUserByIdAPI = async (
  userId: number,
): Promise<UserByIdResponse> => {
  console.log("getUserByIdAPI 시작:", userId);
  console.log("API URL:", `${API_BASE_URL}/users/${userId}`);

  try {
    const headers = await getAuthHeadersAsync();
    console.log("getUserByIdAPI 헤더:", headers);

    console.log("fetch 요청 시작...");
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: "GET",
      headers,
    });

    console.log("getUserByIdAPI 응답 상태:", response.status);
    console.log("getUserByIdAPI 응답 헤더:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("getUserByIdAPI 에러 응답:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("getUserByIdAPI 성공:", data);
    return data;
  } catch (error) {
    console.error("getUserByIdAPI 실패:", error);
    console.error("에러 타입:", typeof error);
    console.error(
      "에러 메시지:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
};

// 북챌린지 인증 상세 개별조회 API
export const getBookChallengeDetailAPI = async (
  bookChallengeProofId: number,
): Promise<BookChallengeDetailResponse> => {
  console.log("getBookChallengeDetailAPI 시작:", bookChallengeProofId);
  console.log(
    "API URL:",
    `${API_BASE_URL}/book-challenges/${bookChallengeProofId}`,
  );

  try {
    const headers = await getAuthHeadersAsync();
    console.log("getBookChallengeDetailAPI 헤더:", headers);

    console.log("fetch 요청 시작...");
    const response = await fetch(
      `${API_BASE_URL}/book-challenges/${bookChallengeProofId}`,
      {
        method: "GET",
        headers,
      },
    );

    console.log("getBookChallengeDetailAPI 응답 상태:", response.status);
    console.log("getBookChallengeDetailAPI 응답 헤더:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("getBookChallengeDetailAPI 에러 응답:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("getBookChallengeDetailAPI 성공:", data);
    return data;
  } catch (error) {
    console.error("getBookChallengeDetailAPI 실패:", error);
    console.error("에러 타입:", typeof error);
    console.error(
      "에러 메시지:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
};

// 북챌린지 좋아요 토글 API
export const toggleBookChallengeLikeAPI = async (
  bookChallengeProofId: number,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: { nowLikeCount: number };
}> => {
  console.log("toggleBookChallengeLikeAPI 시작:", bookChallengeProofId);
  console.log(
    "API URL:",
    `${API_BASE_URL}/book-challenges/${bookChallengeProofId}/like`,
  );
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/book-challenges/${bookChallengeProofId}/like`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("toggleBookChallengeLikeAPI 에러:", error);
    throw error;
  }
};

// 북챌린지 댓글 등록 API
export const createBookChallengeCommentAPI = async (
  bookChallengeProofId: number,
  commentContent: string,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}> => {
  console.log("createBookChallengeCommentAPI 시작:", {
    bookChallengeProofId,
    commentContent,
  });
  console.log(
    "API URL:",
    `${API_BASE_URL}/book-challenges/${bookChallengeProofId}/comments`,
  );
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/book-challenges/${bookChallengeProofId}/comments`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentContent }),
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("createBookChallengeCommentAPI 에러:", error);
    throw error;
  }
};

// 북챌린지 댓글 목록 조회 API
export const getBookChallengeCommentListAPI = async (
  bookChallengeProofId: number,
  page: number = 1,
  size: number = 10,
): Promise<BookChallengeCommentListResponse> => {
  console.log("getBookChallengeCommentListAPI 시작:", {
    bookChallengeProofId,
    page,
    size,
  });
  console.log(
    "API URL:",
    `${API_BASE_URL}/book-challenges/${bookChallengeProofId}/comments?page=${page}&size=${size}`,
  );

  try {
    const headers = await getAuthHeadersAsync();
    console.log("getBookChallengeCommentListAPI 헤더:", headers);

    console.log("fetch 요청 시작...");
    const response = await fetch(
      `${API_BASE_URL}/book-challenges/${bookChallengeProofId}/comments?page=${page}&size=${size}`,
      {
        method: "GET",
        headers,
      },
    );

    console.log("getBookChallengeCommentListAPI 응답 상태:", response.status);
    console.log("getBookChallengeCommentListAPI 응답 헤더:", response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("getBookChallengeCommentListAPI 에러 응답:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("getBookChallengeCommentListAPI 성공:", data);
    return data;
  } catch (error) {
    console.error("getBookChallengeCommentListAPI 실패:", error);
    console.error("에러 타입:", typeof error);
    console.error(
      "에러 메시지:",
      error instanceof Error ? error.message : String(error),
    );
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

// 강원도 축제 API
export const getFestivalsAPI = async (): Promise<FestivalResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      "http://15.164.250.185:8081/api/v1/places/festival",
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("강원도 축제 API 호출 실패:", error);
    throw error;
  }
};

// 책갈피 조회 API
export const getReadingSpotsAPI = async (
  page: number = 1,
  size: number = 5,
  sort: string = "latest",
): Promise<ReadingSpotResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `http://15.164.250.185:8081/api/v1/reading-spot?page=${page}&size=${size}&sort=${sort}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("책갈피 조회 API 호출 실패:", error);
    throw error;
  }
};

// 내가 저장한 책갈피 조회 API
export const getMyScrapedReadingSpotsAPI = async (
  page: number = 1,
  size: number = 10,
): Promise<ReadingSpotResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/reading-spot/scraps/my?page=${page}&size=${size}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("내가 저장한 책갈피 조회 API 호출 실패:", error);
    throw error;
  }
};

// 내가 등록한 공간 책갈피 조회 API
export const getMyCreatedReadingSpotsAPI = async (
  page: number = 1,
  size: number = 10,
): Promise<ReadingSpotResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/reading-spot/my?page=${page}&size=${size}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("내가 등록한 공간 책갈피 조회 API 호출 실패:", error);
    throw error;
  }
};

// 내가 모은 스탬프 조회 API
export const getStampsAPI = async (): Promise<StampsResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch("http://15.164.250.185:8081/api/v1/stamps", {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("스탬프 조회 API 호출 실패:", error);
    throw error;
  }
};

// 북챌린지 챌린지 인증 조회 API
export const getBookChallengeListAPI = async (
  page: number = 1,
  size: number = 5,
  sort: string = "popular",
): Promise<BookChallengeListResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `http://15.164.250.185:8081/api/v1/book-challenges?page=${page}&size=${size}&sort=${sort}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("북챌린지 챌린지 인증 조회 API 호출 실패:", error);
    throw error;
  }
};
// 북챌린지 서점 조회 API
export const getBookChallengesAPI = async (
  page: number = 1,
  size: number = 10,
): Promise<BookChallengesResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `http://15.164.250.185:8081/api/v1/places/book-challenges?page=${page}&size=${size}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("북챌린지 서점 조회 API 호출 실패:", error);
    throw error;
  }
};

// 마지막 강원도 여행 날짜 API
export const getLastVisitAPI = async (): Promise<LastVisitResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      "http://15.164.250.185:8081/api/v1/travel-courses/last-visit",
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("마지막 방문 날짜 API 호출 실패:", error);
    throw error;
  }
};

// 오늘의 추천 강원도 API
export const getTodayRecommendationsAPI =
  async (): Promise<TodayRecommendationResponse> => {
    try {
      const headers = await getAuthHeadersAsync();

      const response = await fetch(
        "http://15.164.250.185:8081/api/v1/places/today",
        {
          method: "GET",
          headers,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("오늘의 추천 강원도 API 성공:", data);
      return data;
    } catch (error) {
      console.error("오늘의 추천 강원도 API 호출 실패:", error);
      throw error;
    }
  };

// 토큰 재발급 API
export const reissueTokenAPI = async (): Promise<TokenReissueResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      "http://15.164.250.185:8081/api/v1/users/reissue",
      {
        method: "POST",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("토큰 재발급 API 호출 실패:", error);
    throw error;
  }
};

// 나의 여행 일정 조회 API
export const getMyTravelCoursesAPI =
  async (): Promise<MyTravelCoursesResponse> => {
    try {
      const headers = await getAuthHeadersAsync();

      const response = await fetch(
        "http://15.164.250.185:8081/api/v1/travel-courses/mine",
        {
          method: "GET",
          headers,
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("나의 여행 일정 조회 API 호출 실패:", error);
      throw error;
    }
  };

// 책 검색 API
export const searchBooksAPI = async (
  query: string,
  sort: string = "sim",
  page: number = 1,
): Promise<BookSearchResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `http://15.164.250.185:8081/api/v1/common/books?query=${encodeURIComponent(query)}&sort=${sort}&page=${page}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("책 검색 API 호출 실패:", error);
    throw error;
  }
};

// 프로필 수정 API - 변경된 필드만 전송
export const updateProfileAPI = async (
  requestData: Partial<ProfileUpdateRequest>,
  profileImage?: string | null,
): Promise<ProfileUpdateResponse> => {
  console.log("updateProfileAPI 시작");
  console.log("updateProfileAPI 요청 데이터:", requestData);
  console.log("updateProfileAPI 프로필 이미지:", profileImage);

  try {
    const headers = await getAuthHeadersAsync();
    console.log("updateProfileAPI 헤더:", headers);

    const formData = new FormData();

    // 서버에서 요구하는 'request' 파트에 변경된 필드만 JSON으로 전송
    // 변경된 필드가 없어도 빈 객체라도 request 파트는 항상 전송해야 함
    const cleanRequestData = Object.fromEntries(
      Object.entries(requestData).filter(
        ([_, value]) => value !== undefined && value !== "",
      ),
    );

    // request 파트는 항상 전송 (빈 객체라도)
    formData.append("request", JSON.stringify(cleanRequestData));

    // 프로필 이미지가 변경된 경우에만 추가
    if (profileImage !== undefined) {
      const imageUri = profileImage?.startsWith("file://")
        ? profileImage
        : profileImage
          ? `file://${profileImage}`
          : "";

      if (imageUri) {
        const imageName = profileImage?.split("/").pop() || "profile.jpg";
        const imageType = "image/jpeg";

        formData.append("profileImage", {
          uri: imageUri,
          name: imageName,
          type: imageType,
        } as any);
      }
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

// 아이디 중복 확인 API
export const checkUsernameAPI = async (
  username: string,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}> => {
  console.log("checkUsernameAPI 시작:", username);

  try {
    const response = await fetch(
      `http://15.164.250.185:8081/api/v1/users/auth/check-username?username=${encodeURIComponent(
        username,
      )}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      },
    );

    console.log("checkUsernameAPI 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("checkUsernameAPI 에러 응답:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("checkUsernameAPI 성공:", data);
    return data;
  } catch (error) {
    console.log("checkUsernameAPI 실패:", error);
    throw error;
  }
};

// 닉네임 중복 확인 API
export const checkNicknameAPI = async (
  nickname: string,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}> => {
  console.log("checkNicknameAPI 시작:", nickname);

  try {
    const response = await fetch(
      `http://15.164.250.185:8081/api/v1/users/auth/check-nickname?nickname=${encodeURIComponent(
        nickname,
      )}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      },
    );

    console.log("checkNicknameAPI 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("checkNicknameAPI 에러 응답:", errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("checkNicknameAPI 성공:", data);
    return data;
  } catch (error) {
    console.log("checkNicknameAPI 실패:", error);
    throw error;
  }
};

// 책 검색 API 응답 타입
export interface BookSearchResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    bookSearchResults: BookSearchResult[];
  };
}

// 책 검색 결과 타입
export interface BookSearchResult {
  title: string;
  author: string;
  bookImage: string;
  pubDate: string;
}

// 나의 여행 일정 조회 API 응답 타입
export interface MyTravelCoursesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: TravelCourse[];
}

// 여행 일정 타입
export interface TravelCourse {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  duration: number;
  regions: string[];
  imageUrl?: string;
}

// 북챌린지 서점 조회 API 응답 타입
export interface BookChallengesResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    listSize: number;
    totalPage: number;
    totalElements: number;
    isFirst: boolean;
    isLast: boolean;
    placeList: BookChallengePlace[];
  };
}

// 북챌린지 챌린지 인증 조회 API 응답 타입
export interface BookChallengeListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    listSize: number;
    totalPage: number;
    totalElements: number;
    isFirst: boolean;
    isLast: boolean;
    getBookChallengeList: BookChallenge[];
  };
}

// 내가 모은 스탬프 조회 API 응답 타입
export interface StampsResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    userId: number;
    totalStampCount: number;
    stampList: {
      chuncheon: string | null;
      wonju: string | null;
      gangneung: string | null;
      donghae: string | null;
      taebaek: string | null;
      sokcho: string | null;
      samcheok: string | null;
      hongcheon: string | null;
      hoengseong: string | null;
      yeongwol: string | null;
      pyeongchang: string | null;
      jeongseon: string | null;
      cheorwon: string | null;
      hwacheon: string | null;
      yanggu: string | null;
      inje: string | null;
      goseong: string | null;
      yangyang: string | null;
    };
    regionImageList: {
      chuncheon: string | null;
      wonju: string | null;
      gangneung: string | null;
      donghae: string | null;
      taebaek: string | null;
      sokcho: string | null;
      samcheok: string | null;
      hongcheon: string | null;
      hoengseong: string | null;
      yeongwol: string | null;
      pyeongchang: string | null;
      jeongseon: string | null;
      cheorwon: string | null;
      hwacheon: string | null;
      yanggu: string | null;
      inje: string | null;
      goseong: string | null;
      yangyang: string | null;
    };
  };
}

// 책갈피 조회 API 응답 타입
export interface ReadingSpotResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    listSize: number;
    totalPage: number;
    totalElements: number;
    isFirst: boolean;
    isLast: boolean;
    readingSpotList: ReadingSpot[];
  };
}

// 강원도 축제 API 응답 타입
export interface FestivalResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Festival[];
}

// 축제 타입
export interface Festival {
  placeId: number;
  placeType: "FESTIVAL";
  festivalName: string;
  startDate: string;
  endDate: string;
  imageUrl: string;
}

// 책갈피 타입
export interface ReadingSpot {
  userId: number;
  userNickname: string;
  userProfilImage: string | null;
  readingSpotId: number;
  region: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  templateId: number;
  title: string;
  content: string;
  readingSpotImages: string[];
  bookTitle: string;
  bookAuthor: string;
  bookImage: string;
  bookPubDate: string;
  likes: number;
  scraps: number;
  opened: boolean;
  liked: boolean;
  scraped: boolean;
}

// 북챌린지 챌린지 타입
export interface BookChallenge {
  createdAt: string;
  creatorId: number;
  bookStoreName: string;
  bookChallengeProofId: number;
  presentMessage: string;
  proofContent: string;
  likes: number;
  likedByMe: boolean;
  receivedBookTitle: string;
  receivedBookAuthor: string;
  receivedBookImage: string;
  receivedBookPubDate: string;
  givenBookTitle: string;
  givenBookAuthor: string;
  givenBookImage: string;
  givenBookPubDate: string;
  proofImageUrls: string[];
}

// 북챌린지 장소 타입
export interface BookChallengePlace {
  id: number;
  name: string;
  placeType: "BOOK_CAFE" | "SPACE_BOOKMARK" | "BOOK_STAY";
  address: string;
  introduction: string;
  websiteUrl: string;
  latitude: number;
  longitude: number;
}

// 마지막 강원도 여행 날짜 API 응답 타입
export interface LastVisitResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    userId: number;
    lastVisitDate: string | null;
    daysAgo: number | null;
  };
}

// 오늘의 추천 강원도 API 응답 타입
export interface TodayRecommendationResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: TodayRecommendation[];
}

// 오늘의 추천 장소 타입
export interface TodayRecommendation {
  placeId: number;
  name: string;
  placeType: "TOURIST_SPOT" | "FESTIVAL" | "RESTAURANT" | "BOOKSTORE";
  overview: string;
  imageUrl: string;
}

// 토큰 재발급 API 응답 타입
export interface TokenReissueResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    accessToken: string;
    refreshToken: string;
    userId: number;
  };
}

// 중복확인 API 응답 타입
export interface DuplicateCheckResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    isDuplicate: boolean;
  };
}

// 닉네임 중복확인 API
export const checkNicknameDuplicateAPI = async (
  nickname: string,
): Promise<DuplicateCheckResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/users/check-nickname?nickname=${encodeURIComponent(nickname)}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("닉네임 중복확인 API 에러:", error);
    throw error;
  }
};

// 아이디 중복확인 API
export const checkUsernameDuplicateAPI = async (
  username: string,
): Promise<DuplicateCheckResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/users/check-username?username=${encodeURIComponent(username)}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("아이디 중복확인 API 에러:", error);
    throw error;
  }
};

// 카카오 로그인 결과 타입
export interface KakaoLoginResult {
  accessToken: string;
  refreshToken: string;
  scopes: string[];
  tokenType: string;
}

// 공간 책갈피 스크랩 토글 API
export const toggleReadingSpotScrapAPI = async (
  readingSpotId: number,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: { nowScrapCount: number };
}> => {
  console.log("toggleReadingSpotScrapAPI 시작:", readingSpotId);
  console.log(
    "API URL:",
    `${API_BASE_URL}/reading-spot/${readingSpotId}/scraps`,
  );
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/reading-spot/${readingSpotId}/scraps`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("toggleReadingSpotScrapAPI 에러:", error);
    throw error;
  }
};

// 공간 책갈피 좋아요 토글 API
export const toggleReadingSpotLikeAPI = async (
  readingSpotId: number,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: { nowLikeCount: number };
}> => {
  console.log("toggleReadingSpotLikeAPI 시작:", readingSpotId);
  console.log(
    "API URL:",
    `${API_BASE_URL}/reading-spot/${readingSpotId}/likes`,
  );
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/reading-spot/${readingSpotId}/likes`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("toggleReadingSpotLikeAPI 에러:", error);
    throw error;
  }
};

// 공간 책갈피 댓글 등록 API
export const createReadingSpotCommentAPI = async (
  readingSpotId: number,
  content: string,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: { commentId: number };
}> => {
  console.log("createReadingSpotCommentAPI 시작:", {
    readingSpotId,
    content,
  });
  console.log(
    "API URL:",
    `${API_BASE_URL}/reading-spot/${readingSpotId}/comments`,
  );
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/reading-spot/${readingSpotId}/comments`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("createReadingSpotCommentAPI 에러:", error);
    throw error;
  }
};

// 공간 책갈피 댓글 목록 조회 API
export const getReadingSpotCommentListAPI = async (
  readingSpotId: number,
  page: number = 1,
  size: number = 10,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    listSize: number;
    totalPage: number;
    totalElements: number;
    isFirst: boolean;
    isLast: boolean;
    comments: {
      commentId: number;
      createdAt: string;
      userId: number;
      commentContent: string;
    }[];
  };
}> => {
  console.log("getReadingSpotCommentListAPI 시작:", {
    readingSpotId,
    page,
    size,
  });
  console.log(
    "API URL:",
    `${API_BASE_URL}/reading-spot/${readingSpotId}/comments?page=${page}&size=${size}`,
  );
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/reading-spot/${readingSpotId}/comments?page=${page}&size=${size}`,
      {
        method: "GET",
        headers,
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getReadingSpotCommentListAPI 에러:", error);
    throw error;
  }
};

// 북마크 상세 조회 API
export const getReadingSpotDetailAPI = async (
  readingSpotId: number,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    userId: number;
    userNickname: string;
    userProfilImage: string;
    readingSpotId: number;
    region: string;
    address: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    templateId: number;
    title: string;
    content: string;
    readingSpotImages: string[];
    bookTitle: string;
    bookAuthor: string;
    bookImage: string;
    bookPubDate: string;
    likes: number;
    scraps: number;
    opened: boolean;
    liked: boolean;
    scraped: boolean;
  };
}> => {
  console.log("getReadingSpotDetailAPI 시작:", readingSpotId);
  console.log("API URL:", `${API_BASE_URL}/reading-spot/${readingSpotId}`);
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/reading-spot/${readingSpotId}`,
      {
        method: "GET",
        headers,
      },
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("getReadingSpotDetailAPI 에러:", error);
    throw error;
  }
};
