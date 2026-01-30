import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";
import { getAuthHeadersAsync, handleTokenError } from "./auth";

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
    refreshToken: string;
    userId: number;
  };
}

// 사용자 정보 조회 API 응답 타입
export interface UserInfoResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    userId: number;
    userName: string;
    nickName: string;
    profileImageUrl: string | null;
    loginType: string;
  };
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

// 북챌린지 인증 상세 개별조회 API 응답 타입
export interface BookChallengeDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
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
  };
}

// 북챌린지 댓글 목록 조회 API 응답 타입
export interface BookChallengeCommentListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    listSize: number;
    totalPage: number;
    totalElements: number;
    isFirst: boolean;
    isLast: boolean;
    getBookChallengeCommentList: BookChallengeComment[];
  };
}

// 북챌린지 댓글 타입
export interface BookChallengeComment {
  createdAt: string;
  userId: number;
  nickname: string;
  userProfileImageUrl: string | null;
  comment: string;
}

// 장소 검색 API 응답 타입
export interface PlaceSearchResponse {
  placeId: number;
  name: string;
  placeType: string;
  address: string;
}

// 독립서점 마커 조회 API 응답 타입
export interface BookstoreMarkerResponse {
  placeId: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

// 북스테이 마커 조회 API 응답 타입
export interface BookstayMarkerResponse {
  placeId: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

// 북카페 마커 조회 API 응답 타입
export interface BookcafeMarkerResponse {
  placeId: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
}

// 리뷰 작성 API 요청 타입
export interface CreateReviewRequest {
  rating: number;
  visitedDate: string;
  content: string;
}

// 리뷰 작성 API 응답 타입
export interface CreateReviewResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: any;
}

// 리뷰 조회 API 응답 타입
export interface ReviewListResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    listSize: number;
    totalPage: number;
    totalElements: number;
    isFirst: boolean;
    isLast: boolean;
    totalReviewRating: number;
    getReviewList: {
      createdAt: string;
      creatorId: number;
      rating: number;
      reviewContent: string;
      reviewImageList: string[];
      placeId: number;
      reviewId: number;
    }[];
  };
}

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

// 독립서점 마커 조회 API (뷰포트 기반)
export const getBookstoreMarkersAPI = async (
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
): Promise<BookstoreMarkerResponse[]> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/places/markers/bookstores?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`,
      {
        method: "GET",
        headers: {
          ...headers,
          accept: "*/*",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BookstoreMarkerResponse[] = await response.json();
    //console.log("독립서점 마커 조회 API 성공:", data);
    return data;
  } catch (error) {
    console.error("독립서점 마커 조회 API 에러:", error);
    throw error;
  }
};

// 북스테이 마커 조회 API (뷰포트 기반)
export const getBookstayMarkersAPI = async (
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
): Promise<BookstayMarkerResponse[]> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/places/markers/bookstays?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`,
      {
        method: "GET",
        headers: {
          ...headers,
          accept: "*/*",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BookstayMarkerResponse[] = await response.json();
    //console.log("북스테이 마커 조회 API 성공:", data);
    return data;
  } catch (error) {
    console.error("북스테이 마커 조회 API 에러:", error);
    throw error;
  }
};

// 북카페 마커 조회 API (뷰포트 기반)
export const getBookcafeMarkersAPI = async (
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
): Promise<BookcafeMarkerResponse[]> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/places/markers/bookcafes?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`,
      {
        method: "GET",
        headers: {
          ...headers,
          accept: "*/*",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: BookcafeMarkerResponse[] = await response.json();
    //console.log("북카페 마커 조회 API 성공:", data);
    return data;
  } catch (error) {
    console.error("북카페 마커 조회 API 에러:", error);
    throw error;
  }
};

// 장소 검색 API
export const searchPlacesAPI = async (
  keyword: string,
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
): Promise<PlaceSearchResponse[]> => {
  try {
    const headers = await getAuthHeadersAsync();

    const params = new URLSearchParams({
      keyword: keyword,
      minLat: minLat.toString(),
      minLng: minLng.toString(),
      maxLat: maxLat.toString(),
      maxLng: maxLng.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/places/search?${params.toString()}`,
      {
        method: "GET",
        headers: {
          ...headers,
          accept: "*/*",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: PlaceSearchResponse[] = await response.json();
    // console.log("장소 검색 API 성공:", data);
    return data;
  } catch (error) {
    console.error("장소 검색 API 에러:", error);
    throw error;
  }
};

// 리뷰 작성 API
export const createReviewAPI = async (
  placeId: number,
  request: CreateReviewRequest,
  images: string[] = [],
): Promise<CreateReviewResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const formData = new FormData();

    // request 데이터를 JSON으로 변환하여 추가
    formData.append("request", JSON.stringify(request));

    // 이미지들을 FormData에 추가
    images.forEach((imageUri, index) => {
      const imageName = `image_${index}.jpg`;
      const imageFile = {
        uri: imageUri,
        type: "image/jpeg",
        name: imageName,
      } as any;

      formData.append("images", imageFile);
    });

    const response = await fetch(`${API_BASE_URL}/reviews/${placeId}`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: CreateReviewResponse = await response.json();
    return data;
  } catch (error) {
    console.error("리뷰 작성 API 에러:", error);
    throw error;
  }
};

// 리뷰 조회 API
export const getReviewListAPI = async (
  placeId: number,
  page: number = 1,
  size: number = 10,
): Promise<ReviewListResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/reviews/${placeId}?page=${page}&size=${size}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ReviewListResponse = await response.json();
    return data;
  } catch (error) {
    console.error("리뷰 조회 API 에러:", error);
    throw error;
  }
};

// 사용자 정보 조회 API
export const getUserInfoAPI = async (): Promise<UserInfoResponse> => {
  console.log("getUserInfoAPI 시작");
  console.log("API URL:", `${API_BASE_URL}/users`);

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

      // 403 에러 시 토큰 재발급 시도
      if (response.status === 403) {
        console.log("getUserInfoAPI 403 에러: 토큰 재발급 시도");
        const tokenRefreshed = await handleTokenError(
          new Error(`HTTP ${response.status}: ${errorText}`),
        );
        if (tokenRefreshed) {
          console.log("토큰 재발급 성공, getUserInfoAPI 재시도");
          // 새 토큰으로 재시도
          const newHeaders = await getAuthHeadersAsync();
          const retryResponse = await fetch(`${API_BASE_URL}/users`, {
            method: "GET",
            headers: newHeaders,
          });

          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            console.log("getUserInfoAPI 재시도 성공:", retryData);
            return retryData;
          }
        }
      }

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

// 북챌린지 인증 게시글 생성 API
export const createBookChallengeProofAPI = async (
  bookChallengeId: number,
  presentMessage: string,
  proofContent: string,
  images: string[],
): Promise<{ isSuccess: boolean; message: string }> => {
  try {
    console.log("북챌린지 인증 생성 API 시작:", {
      bookChallengeId,
      presentMessage,
      proofContent,
      imageCount: images.length,
    });

    const headers = await getAuthHeadersAsync();

    // FormData 생성
    const formData = new FormData();

    // request JSON 데이터
    const requestData = {
      presentMessage,
      proofContent,
      mainImageIndex: 0,
    };

    formData.append("request", JSON.stringify(requestData));

    // 이미지들 추가
    images.forEach((imageUri, index) => {
      const imageFile = {
        uri: imageUri,
        type: "image/jpeg",
        name: `image_${index}.jpg`,
      } as any;

      formData.append("images", imageFile);
    });

    console.log("FormData 생성 완료:", formData);

    const response = await fetch(
      `${API_BASE_URL}/book-challenges?bookChallengeId=${bookChallengeId}`,
      {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      },
    );

    console.log("북챌린지 인증 생성 API 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("북챌린지 인증 생성 API 에러 응답:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("북챌린지 인증 생성 API 성공:", data);

    return {
      isSuccess: true,
      message: "북챌린지 인증이 성공적으로 생성되었습니다.",
    };
  } catch (error) {
    console.error("북챌린지 인증 생성 API 실패:", error);
    return {
      isSuccess: false,
      message:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
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

      // 403 에러인 경우 토큰 재발급 시도
      if (response.status === 403) {
        console.log("403 에러 감지: 토큰 재발급 시도");

        // handleTokenError 함수 import
        const { handleTokenError } = await import("./auth");
        const reissueSuccess = await handleTokenError(
          new Error(`HTTP ${response.status}: ${errorText}`),
        );

        if (reissueSuccess) {
          console.log("토큰 재발급 성공, API 재시도");
          // 새로운 토큰으로 재시도
          const newHeaders = await getAuthHeadersAsync();
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...newHeaders,
              ...options.headers,
            },
          });

          if (!retryResponse.ok) {
            const retryErrorText = await retryResponse.text();
            throw new Error(`HTTP ${retryResponse.status}: ${retryErrorText}`);
          }

          console.log("토큰 재발급 후 API 재시도 성공");
          return retryResponse;
        } else {
          console.log("토큰 재발급 실패, 에러 발생");
        }
      }

      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    console.log("authenticatedFetch 성공");
    return response;
  } catch (error) {
    console.log("authenticatedFetch 실패:", error);
    throw error;
  }
};

// 강원도 축제 API
export const getFestivalsAPI = async (): Promise<FestivalResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(`${API_BASE_URL}/places/festival`, {
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
      `${API_BASE_URL}/reading-spots?page=${page}&size=${size}&sort=${sort}`,
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
      `${API_BASE_URL}/reading-spots/scraps/my?page=${page}&size=${size}`,
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
      `${API_BASE_URL}/reading-spots/my?page=${page}&size=${size}`,
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

// 공간 책갈피 등록 API
export const createReadingSpotAPI = async (
  requestData: {
    bookPubDate: string;
    opened: boolean;
    latitude: number;
    bookTitle: string;
    longitude: number;
    mainImageIndex: number;
    bookImage: string;
    bookAuthor: string;
    address: string;
    templateId: number;
    title: string;
    content: string;
  },
  images: string[],
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: { readingSpotId: number };
}> => {
  try {
    const headers = await getAuthHeadersAsync();

    // FormData 생성
    const formData = new FormData();

    // request 데이터를 JSON 문자열로 변환하여 추가
    formData.append("request", JSON.stringify(requestData));

    // 이미지들을 FormData에 추가
    images.forEach((imageUri, index) => {
      const imageFile = {
        uri: imageUri,
        type: "image/jpeg",
        name: `image_${index}.jpg`,
      } as any;
      formData.append("images", imageFile);
    });

    const response = await fetch(`${API_BASE_URL}/reading-spots`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("공간 책갈피 등록 API 호출 실패:", error);
    throw error;
  }
};

// 내가 모은 스탬프 조회 API
export const getStampsAPI = async (): Promise<StampsResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(`${API_BASE_URL}/stamps`, {
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

// 북챌린지 진행 여부 조회 API
export const getBookChallengeInProgressInfoAPI = async (): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result?: any;
}> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/book-challenges/inprogress-info`,
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
    console.error("북챌린지 진행 여부 조회 API 호출 실패:", error);
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
      `${API_BASE_URL}/book-challenges?page=${page}&size=${size}&sort=${sort}`,
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
// 장소 상세 조회 API
export const getPlaceDetailAPI = async (
  placeId: number,
): Promise<PlaceDetailResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(`${API_BASE_URL}/places/${placeId}/details`, {
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
    console.error("장소 상세 조회 API 호출 실패:", error);
    throw error;
  }
};

// 장소 찜하기 토글 API
export const togglePlaceBookmarkAPI = async (
  placeId: number,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    isBookmarked: boolean;
  };
}> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/places/${placeId}/book-marks`,
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
    console.error("장소 찜하기 토글 API 호출 실패:", error);
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
      `${API_BASE_URL}/places/book-challenges?page=${page}&size=${size}`,
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

    const response = await fetch(`${API_BASE_URL}/travel-courses/last-visit`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();

      // 403 에러 시 토큰 재발급 시도
      if (response.status === 403) {
        console.log("getLastVisitAPI 403 에러: 토큰 재발급 시도");
        const tokenRefreshed = await handleTokenError(
          new Error(`HTTP ${response.status}: ${errorText}`),
        );
        if (tokenRefreshed) {
          console.log("토큰 재발급 성공, getLastVisitAPI 재시도");
          // 새 토큰으로 재시도
          const newHeaders = await getAuthHeadersAsync();
          const retryResponse = await fetch(
            `${API_BASE_URL}/travel-courses/last-visit`,
            {
              method: "GET",
              headers: newHeaders,
            },
          );

          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            console.log("getLastVisitAPI 재시도 성공:", retryData);
            return retryData;
          }
        }
      }

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

      const response = await fetch(`${API_BASE_URL}/places/today`, {
        method: "GET",
        headers,
      });

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
export const reissueTokenAPI = async (
  refreshToken: string,
): Promise<TokenReissueResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/reissue`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        "Content-Type": "application/json",
      },
    });

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

// 여행 상세 조회 API 응답 타입
export interface TravelCourseDetailResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    travelCourseId: number;
    memberId: number;
    courseTitle: string;
    startDate: string;
    endDate: string;
    travelRegions: string[];
    schedules: {
      day: number;
      date: string;
      schedules: {
        orderInday: number;
        placeId: number;
      }[];
    }[];
  };
}

// 여행 상세 조회 API
export const getTravelCourseDetailAPI = async (
  travelCourseId: number,
): Promise<TravelCourseDetailResponse> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/travel-courses/${travelCourseId}`,
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
    console.error("여행 상세 조회 API 호출 실패:", error);
    throw error;
  }
};

// 나의 여행 일정 조회 API
export const getMyTravelCoursesAPI =
  async (): Promise<MyTravelCoursesResponse> => {
    try {
      const headers = await getAuthHeadersAsync();

      const response = await fetch(`${API_BASE_URL}/travel-courses/mine`, {
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
      `${API_BASE_URL}/common/books?query=${encodeURIComponent(query)}&sort=${sort}&page=${page}`,
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

    const response = await fetch(`${API_BASE_URL}/users`, {
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
      `${API_BASE_URL}/users/auth/check-username?username=${encodeURIComponent(
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
      `${API_BASE_URL}/users/auth/check-nickname?nickname=${encodeURIComponent(
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
  travelCourseId: number;
  title: string;
  startDate: string;
  endDate: string;
  duration: string; // API 응답에 맞게 문자열로 변경
  travelRegions: string[]; // API 응답에 맞게 필드명 변경
  imageUrl?: string;
  memberId?: number; // API 응답에 맞게 추가
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
  placeId?: number; // 실제 API 응답에 placeId가 있다면 추가
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

// 약관 동의 API
export const postUserAgreementAPI = async (agreementData: {
  termsOfServiceAgreed: boolean;
  privacyPolicyAgreed: boolean;
  locationServiceAgreed: boolean;
}): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    agreementId: number;
    userId: number;
    termsOfServiceAgreed: boolean;
    privacyPolicyAgreed: boolean;
    locationServiceAgreed: boolean;
  };
}> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(`${API_BASE_URL}/users/auth/agreement`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(agreementData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("약관 동의 API 호출 실패:", error);
    throw error;
  }
};

// 로그아웃 API
export const logoutAPI = async (): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: string;
}> => {
  try {
    const accessToken = await AsyncStorage.getItem("accessToken");
    const refreshToken = await AsyncStorage.getItem("refreshToken");

    const response = await fetch(`${API_BASE_URL}/users/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("로그아웃 API 호출 실패:", error);
    throw error;
  }
};

// 회원탈퇴 API
export const deleteUserAPI = async (): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
}> => {
  try {
    const headers = await getAuthHeadersAsync();

    const refreshToken = await AsyncStorage.getItem("refreshToken");

    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "DELETE",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("회원탈퇴 API 호출 실패:", error);
    throw error;
  }
};

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

    const requestUrl = `${API_BASE_URL}/users/auth/check-nickname?nickname=${encodeURIComponent(nickname)}`;
    console.log("🔗 닉네임 중복확인 API 요청 URL:", requestUrl);
    console.log("📝 요청 닉네임:", nickname);
    console.log("🔑 인증 헤더:", headers);

    const response = await fetch(requestUrl, {
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
      `${API_BASE_URL}/users/auth/check-username?username=${encodeURIComponent(username)}`,
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

// 카카오 로그인 API (인가 코드 사용)
export const kakaoLoginWithCodeAPI = async (
  code: string,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    isNewUser: boolean;
    accessToken: string;
    refreshToken: string;
    userId: number;
  };
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/auth/kakao?code=${code}`,
      {
        method: "GET",
        headers: {
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
    console.error("카카오 로그인 API 호출 실패:", error);
    throw error;
  }
};

// 네이버 로그인 API (인가 코드 사용)
export const naverLoginWithCodeAPI = async (
  code: string,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    isNewUser: boolean;
    accessToken: string;
    refreshToken: string;
    userId: number;
  };
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/auth/naver?code=${code}`,
      {
        method: "GET",
        headers: {
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
    console.error("네이버 로그인 API 호출 실패:", error);
    throw error;
  }
};

export const googleLoginWithCodeAPI = async (
  code: string,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    isNewUser: boolean;
    accessToken: string;
    refreshToken: string;
    userId: number;
  };
}> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/users/auth/google?code=${code}`,
      {
        method: "GET",
        headers: {
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
    console.error("구글 로그인 API 호출 실패:", error);
    throw error;
  }
};

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
    `${API_BASE_URL}/reading-spots/${readingSpotId}/scraps`,
  );
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/reading-spots/${readingSpotId}/scraps`,
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
    `${API_BASE_URL}/reading-spots/${readingSpotId}/likes`,
  );
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/reading-spots/${readingSpotId}/likes`,
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
    `${API_BASE_URL}/reading-spots/${readingSpotId}/comments`,
  );
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/reading-spots/${readingSpotId}/comments`,
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
    `${API_BASE_URL}/reading-spots/${readingSpotId}/comments?page=${page}&size=${size}`,
  );
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/reading-spots/${readingSpotId}/comments?page=${page}&size=${size}`,
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

// 북마크 상세 조회 API (기존 함수 - 북마크용)
export const getBookmarkDetailAPI = async (
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
  console.log("getBookmarkDetailAPI 시작:", readingSpotId);
  console.log("API URL:", `${API_BASE_URL}/reading-spots/${readingSpotId}`);
  try {
    const headers = await getAuthHeadersAsync();
    const response = await fetch(
      `${API_BASE_URL}/reading-spots/${readingSpotId}`,
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
    console.error("getBookmarkDetailAPI 에러:", error);
    throw error;
  }
};

// 장소 상세 조회 응답 타입
// 공간책갈피 마커 조회 API (뷰포트 기반)
export const getReadingSpotMarkersAPI = async (
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
): Promise<ReadingSpotMarker[]> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/places/markers/readingspots?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: ReadingSpotMarker[] = await response.json();
    return data;
  } catch (error) {
    console.error("공간책갈피 마커 조회 API 호출 실패:", error);
    throw error;
  }
};

// 관광지 마커 조회 API
export const getTouristSpotMarkersAPI = async (
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
): Promise<TouristSpotMarker[]> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/places/markers/touristspots?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: TouristSpotMarker[] = await response.json();
    return data;
  } catch (error) {
    console.error("관광지 마커 조회 API 호출 실패:", error);
    throw error;
  }
};

// 맛집 마커 조회 API
export const getRestaurantMarkersAPI = async (
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
): Promise<RestaurantMarker[]> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/places/markers/restaurants?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: RestaurantMarker[] = await response.json();
    return data;
  } catch (error) {
    console.error("맛집 마커 조회 API 호출 실패:", error);
    throw error;
  }
};

// 축제 마커 조회 API
export const getFestivalMarkersAPI = async (
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
): Promise<FestivalMarker[]> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/places/markers/festivals?minLat=${minLat}&minLng=${minLng}&maxLat=${maxLat}&maxLng=${maxLng}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data: FestivalMarker[] = await response.json();
    return data;
  } catch (error) {
    console.error("축제 마커 조회 API 호출 실패:", error);
    throw error;
  }
};

// 공간책갈피 상세 조회 API
export const getReadingSpotDetailAPI = async (
  placeId: number,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: ReadingSpotDetail;
}> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(`${API_BASE_URL}/places/${placeId}/details`, {
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
    console.error("공간책갈피 상세 조회 API 호출 실패:", error);
    throw error;
  }
};

// 공간책갈피 마커 타입
export interface ReadingSpotMarker {
  placeId: number;
  name: string;
  latitude: number;
  longitude: number;
}

// 관광지 마커 타입
export interface TouristSpotMarker {
  placeId: number;
  name: string;
  latitude: number;
  longitude: number;
}

// 맛집 마커 타입
export interface RestaurantMarker {
  placeId: number;
  name: string;
  latitude: number;
  longitude: number;
}

// 축제 마커 타입
export interface FestivalMarker {
  placeId: number;
  name: string;
  latitude: number;
  longitude: number;
}

// 북챌린지 서점 이벤트 조회 API
export const getBookChallengeEventAPI = async (
  placeId: number,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: BookChallengeEvent;
}> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/places/${placeId}/book-challenge-events`,
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
    console.error("북챌린지 서점 이벤트 조회 API 호출 실패:", error);
    throw error;
  }
};

// 북챌린지 서점 이벤트 타입
export interface BookChallengeEvent {
  eventDescription: string;
  rewardDescription: string;
  ownerMessage: string;
  rewardImageUrls: string[];
}

// 공간책갈피 상세 정보 타입
export interface ReadingSpotDetail {
  placeId: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  overview: string;
  placeImageUrls: string[];
  isBookmarked: boolean;
  rating: number;
  reviewCount: number;
}

export type PlaceDetailResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    placeId: number;
    placeType: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    websiteUrl?: string;
    tel?: string;
    reviewCount: number;
    rating: number;
    isBookmarked: boolean;
    placeDetail:
      | BookstorePlaceDetail
      | TouristSpotPlaceDetail
      | RestaurantPlaceDetail
      | FestivalPlaceDetail;
    placeImageUrls: string[];
  };
};

// 독립서점 상세 정보
export interface BookstorePlaceDetail {
  overview: string;
  bookCafe: boolean;
  bookStay: boolean;
  bookChallengeStatus: boolean;
  parking: boolean;
  petFriendly: boolean;
  spaceRental: boolean;
  reservation: boolean;
  readingClub: boolean;
}

// 관광지 상세 정보
export interface TouristSpotPlaceDetail {
  overview: string;
  parkingAvailable: string;
  petsAllowed: string;
  babyCarriageAllowed: string;
  creditCardAccepted: string;
}

// 음식점 상세 정보
export interface RestaurantPlaceDetail {
  firstmenu: string;
  treatmenu: string;
  kidsfacility: string;
  isSmokingAllowed: string;
  isTakeoutAvailable: string;
  hasParking: string;
  isReservable: string;
}

// 축제 상세 정보
export interface FestivalPlaceDetail {
  overview: string;
  programs: string;
  startDate: string;
  endDate: string;
}

// 찜한 장소 조회 API
export const getLikedPlacesAPI = async (
  currentLat: number,
  currentLng: number,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    placeId: number;
    name: string;
    placeType: string;
    bookmarked: boolean;
    averageRating: number;
    reviewCount: number;
    distance: number;
    address: string;
    latitude: number;
    longitude: number;
    imageUrl: string;
  }[];
}> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/places/book-marks?currentLat=${currentLat}&currentLng=${currentLng}`,
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
    console.error("찜한 장소 조회 API 호출 실패:", error);
    throw error;
  }
};

// 장소 상세 정보 조회 API (새로운 엔드포인트)
export const getPlaceInfoAPI = async (
  placeId: number,
  currentLat: number,
  currentLng: number,
  userId: number,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: PlaceInfo;
}> => {
  try {
    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/places/${placeId}/info?currentLat=${currentLat}&currentLng=${currentLng}&userId=${userId}`,
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
    console.error("장소 상세 정보 조회 API 호출 실패:", error);
    throw error;
  }
};

// 장소 상세 정보 응답 타입
export interface PlaceInfo {
  placeId: number;
  name: string;
  placeType: string;
  bookmarked: boolean;
  averageRating: number;
  reviewCount: number;
  distance: number;
  address: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
}

// 여행 일정 생성 API 요청 타입
export interface CreateTravelCourseRequest {
  startDate: string;
  endDate: string;
  travelCourseTitle: string;
  regionIdList: number[];
  travelCourseScheduleList: {
    day: string;
    orderInday: number;
    placeId: number;
  }[];
  isPublic: boolean;
}

// 여행 일정 생성 API 응답 타입
export interface CreateTravelCourseResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: {
    travelCourseId: number;
    title: string;
    startDate: string;
    endDate: string;
  };
}

// 여행 일정 생성 API
export const createTravelCourseAPI = async (
  requestData: CreateTravelCourseRequest,
): Promise<CreateTravelCourseResponse> => {
  try {
    console.log("🚀 여행 일정 생성 API 호출:", requestData);

    const headers = await getAuthHeadersAsync();

    const response = await fetch(`${API_BASE_URL}/travel-courses`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ 여행 일정 생성 성공:", result);

    if (result.isSuccess) {
      return result;
    } else {
      throw new Error(result.message || "여행 일정 생성 실패");
    }
  } catch (error) {
    console.error("❌ 여행 일정 생성 API 오류:", error);
    throw error;
  }
};

// 여행 일정 삭제 API 응답 타입
export interface DeleteTravelCourseResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result?: any;
}

// 여행 일정 삭제 API
export const deleteTravelCourseAPI = async (
  travelCourseId: number,
): Promise<DeleteTravelCourseResponse> => {
  try {
    console.log("🗑️ 여행 일정 삭제 API 호출:", travelCourseId);

    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/travel-courses/${travelCourseId}`,
      {
        method: "DELETE",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ 여행 일정 삭제 성공:", result);

    if (result.isSuccess) {
      return result;
    } else {
      throw new Error(result.message || "여행 일정 삭제 실패");
    }
  } catch (error) {
    console.error("❌ 여행 일정 삭제 API 오류:", error);
    throw error;
  }
};

// 다른 유저의 서행 목록 조회 API
export interface OtherUserTravelCourse {
  title: string;
  travelCourseId: number;
  memberId: number;
  imageUrl: string;
  startDate: string;
  endDate: string;
  duration: string;
  travelRegions: string[];
}

export const getOtherUserTravelCoursesAPI = async (
  page: number = 1,
  size: number = 10,
): Promise<{
  isSuccess: boolean;
  code: string;
  message: string;
  result: OtherUserTravelCourse[];
}> => {
  try {
    console.log("👥 다른 유저 서행 목록 조회 API 호출:", { page, size });

    const headers = await getAuthHeadersAsync();

    const response = await fetch(
      `${API_BASE_URL}/travel-courses?page=${page}&size=${size}`,
      {
        method: "GET",
        headers,
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ 다른 유저 서행 목록 조회 성공:", result);

    if (result.isSuccess) {
      return result;
    } else {
      throw new Error(result.message || "다른 유저 서행 목록 조회 실패");
    }
  } catch (error) {
    console.error("❌ 다른 유저 서행 목록 조회 API 오류:", error);
    throw error;
  }
};
