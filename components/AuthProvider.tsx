import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthState, restoreAuthState } from "../types/auth";

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
    userId: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  // 초기 상태를 명확하게 설정
  console.log("AuthProvider 초기 상태:", authState);

  const refreshAuthState = async () => {
    try {
      const restoredState = await restoreAuthState();
      setAuthState(restoredState);
      console.log("인증 상태 새로고침 완료:", restoredState);
    } catch (error) {
      console.error("인증 상태 복원 실패:", error);
      setAuthState({
        isAuthenticated: false,
        accessToken: null,
        userId: null,
      });
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
          userId: null,
        });
      } finally {
        setIsLoading(false);
        console.log("AuthProvider 로딩 완료, isLoading:", false);
        console.log("최종 인증 상태:", authState);
      }
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    authState,
    isLoading,
    refreshAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
