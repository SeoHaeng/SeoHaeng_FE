import DefaultProfileIcon from "@/components/icons/DefaultProfileIcon";
import { removeToken } from "@/types/auth";
import { getUserInfo } from "@/types/globalState";
import { useRouter } from "expo-router";
import React from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const { width } = Dimensions.get("window");

export default function SideMenu({ visible, onClose }: SideMenuProps) {
  const router = useRouter();
  const slideAnim = React.useRef(new Animated.Value(width)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [userInfo, setUserInfo] = React.useState(getUserInfo());

  // 사용자 정보 업데이트를 위한 주기적 체크
  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentUserInfo = getUserInfo();
      if (currentUserInfo !== userInfo) {
        setUserInfo(currentUserInfo);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userInfo]);

  React.useEffect(() => {
    if (visible) {
      // 배경 페이드인과 메뉴 슬라이드인을 동시에 실행
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // 배경 페이드아웃과 메뉴 슬라이드아웃을 동시에 실행
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim]);

  const handleClose = () => {
    // 배경 페이드아웃과 메뉴 슬라이드아웃을 동시에 실행
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const handleLogout = async () => {
    try {
      await removeToken();
      onClose();
      // 로그인 화면으로 이동
      router.replace("/auth");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={handleClose}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.menuContainer,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.menuContent}>
            {/* 사용자 프로필 섹션 */}
            <View style={styles.profileSection}>
              <View style={styles.profileIcon}>
                <DefaultProfileIcon width={40} height={43} color="#9D9896" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>
                  {userInfo?.nickName || "사용자"}
                </Text>
                <Text style={styles.userEmail}>
                  {userInfo?.loginType === "LOCAL"
                    ? "로컬 계정"
                    : userInfo?.loginType || "계정 정보 없음"}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => router.push("/profile/edit")}
            >
              <Text style={styles.editProfileText}>프로필 수정하기</Text>
            </TouchableOpacity>

            {/* 구분선 */}
            <View style={styles.separator} />

            {/* 메뉴 항목들 */}
            <View style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuItemIconText}>🏢</Text>
                </View>
                <Text style={styles.menuItemText}>업체 추가하기</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuItemIconText}>🚨</Text>
                </View>
                <Text style={styles.menuItemText}>신고하기</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuItemIconText}>💡</Text>
                </View>
                <Text style={styles.menuItemText}>앱 개선 요청</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            </View>

            {/* 구분선 */}
            <View style={styles.separator} />

            {/* 계정 관련 메뉴 */}
            <View style={styles.accountMenuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuItemIconText}>🚪</Text>
                </View>
                <Text style={styles.menuItemText}>로그아웃</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuItemIcon}>
                  <Text style={styles.menuItemIconText}>❌</Text>
                </View>
                <Text style={styles.menuItemText}>회원 탈퇴</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  menuContainer: {
    width: width * 0.8,
    height: "100%",
    backgroundColor: "#F8F4F2",
  },
  menuContent: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#C5BFBB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileIconText: {
    fontSize: 24,
    fontFamily: "SUIT-700",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  editProfileButton: {
    backgroundColor: "#302E2D",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  editProfileText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "SUIT-600",
  },
  separator: {
    height: 1,
    backgroundColor: "#DBD6D3",
    marginVertical: 20,
  },
  menuItems: {
    marginBottom: 20,
  },
  accountMenuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  menuItemIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#C5BFBB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuItemIconText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
  arrowIcon: {
    fontSize: 18,
    color: "#9D9896",
    fontFamily: "SUIT-600",
  },
});
