import { fetchAndStoreUserInfo } from "@/types/auth";
import { getUserInfo, setUserInfo } from "@/types/globalState";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserInfoDisplay() {
  const [userInfo, setLocalUserInfo] = React.useState(getUserInfo());
  const [isLoading, setIsLoading] = React.useState(false);

  // 사용자 정보 업데이트를 위한 주기적 체크
  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentUserInfo = getUserInfo();
      if (currentUserInfo !== userInfo) {
        setLocalUserInfo(currentUserInfo);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userInfo]);

  const handleRefreshUserInfo = async () => {
    setIsLoading(true);
    try {
      const newUserInfo = await fetchAndStoreUserInfo();
      setLocalUserInfo(newUserInfo);
    } catch (error) {
      console.error("사용자 정보 새로고침 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearUserInfo = () => {
    setUserInfo(null);
    setLocalUserInfo(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>사용자 정보</Text>

      {userInfo ? (
        <View style={styles.userInfoContainer}>
          {/* 프로필 이미지 표시 */}
          <View style={styles.profileImageContainer}>
            {userInfo.profileImageUrl ? (
              <Image
                source={{ uri: userInfo.profileImageUrl }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImagePlaceholderText}>프로필</Text>
              </View>
            )}
          </View>

          <Text style={styles.label}>사용자 ID:</Text>
          <Text style={styles.value}>{userInfo.userId}</Text>

          <Text style={styles.label}>닉네임:</Text>
          <Text style={styles.value}>{userInfo.nickName}</Text>

          <Text style={styles.label}>프로필 이미지 URL:</Text>
          <Text style={styles.value}>{userInfo.profileImageUrl || "없음"}</Text>

          <Text style={styles.label}>로그인 타입:</Text>
          <Text style={styles.value}>{userInfo.loginType}</Text>
        </View>
      ) : (
        <Text style={styles.noData}>사용자 정보가 없습니다.</Text>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRefreshUserInfo}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? "로딩 중..." : "사용자 정보 새로고침"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={handleClearUserInfo}
        >
          <Text style={styles.buttonText}>사용자 정보 초기화</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  userInfoContainer: {
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
  },
  profileImagePlaceholderText: {
    fontSize: 14,
    color: "#999",
    fontFamily: "SUIT-500",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    paddingLeft: 10,
  },
  noData: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    fontStyle: "italic",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  clearButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
