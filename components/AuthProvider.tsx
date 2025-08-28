import React, { createContext, useContext, useEffect, useState } from "react";
import { restoreAuthState } from "../types/auth";
import { AuthState } from "../types/globalState";

interface AuthContextType {
  authState: AuthState;
  isLoading: boolean;
  refreshAuthState: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    userId: null,
    userInfo: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 초기 상태를 명확하게 설정
  console.log("AuthProvider 초기 상태:", authState);

  const refreshAuthState = async () => {
    try {
      const restoredState = await restoreAuthState();

      // 토큰 유효성 검증 강화
      const isValidToken =
        restoredState.accessToken &&
        restoredState.accessToken.length > 10 &&
        restoredState.refreshToken &&
        restoredState.refreshToken.length > 10;

      if (isValidToken) {
        setAuthState(restoredState);
        console.log("✅ 유효한 토큰으로 인증 상태 복원 완료:", {
          isAuthenticated: restoredState.isAuthenticated,
          hasAccessToken: !!restoredState.accessToken,
          hasRefreshToken: !!restoredState.refreshToken,
          userId: restoredState.userId,
        });
      } else {
        console.log("❌ 토큰이 유효하지 않음, 기본 상태로 설정");
        const defaultState = {
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          userId: null,
          userInfo: null,
        };
        setAuthState(defaultState);
      }
    } catch (error) {
      console.error("인증 상태 복원 실패:", error);
      const defaultState = {
        isAuthenticated: false,
        accessToken: null,
        refreshToken: null,
        userId: null,
        userInfo: null,
      };
      setAuthState(defaultState);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("인증 상태 초기화 시작...");
        await refreshAuthState();
        console.log("인증 상태 초기화 완료");
      } catch (error) {
        console.error("초기 인증 상태 설정 실패:", error);
        // 에러 발생 시에도 기본 상태로 설정
        setAuthState({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          userId: null,
          userInfo: null,
        });
      } finally {
        setIsLoading(false);
        console.log("AuthProvider 로딩 완료, isLoading:", false);
      }
    };

    initializeAuth();
  }, []); // authState 의존성 제거

  const value: AuthContextType = {
    authState,
    isLoading,
    refreshAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
