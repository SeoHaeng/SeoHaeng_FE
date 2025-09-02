import { useAuth } from "@/components/AuthProvider";
import DeleteUserConfirmModal from "@/components/DeleteUserConfirmModal";
import DefaultProfileIcon from "@/components/icons/DefaultProfileIcon";
import LogoutConfirmModal from "@/components/LogoutConfirmModal";
import { deleteUser, removeToken } from "@/types/auth";
import { getUserInfo } from "@/types/globalState";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
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
  const { refreshAuthState } = useAuth();
  const slideAnim = React.useRef(new Animated.Value(width)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [userInfo, setUserInfo] = React.useState(getUserInfo());
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = React.useState(false);

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

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      // 토큰 삭제
      await removeToken();

      // 전역 상태 초기화
      setUserInfo(null);

      // AuthProvider의 인증 상태도 새로고침
      await refreshAuthState();

      // 모달과 사이드 메뉴 닫기
      setShowLogoutModal(false);
      onClose();

      // 강제로 로그인 화면으로 이동 (replace 사용)
      console.log("로그아웃 완료, 로그인 화면으로 이동");
      router.replace("/auth");

      // 추가적으로 홈 화면으로 이동 시도 (혹시 캐시된 라우트가 있을 경우)
      setTimeout(() => {
        router.replace("/auth");
      }, 100);
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleDeleteUserClick = () => {
    setShowDeleteUserModal(true);
  };

  const handleDeleteUserConfirm = async () => {
    try {
      console.log("회원탈퇴 확인됨");

      // 회원탈퇴 API 호출
      const success = await deleteUser();

      if (success) {
        console.log("회원탈퇴 성공");

        // 모달과 사이드 메뉴 닫기
        setShowDeleteUserModal(false);
        onClose();

        // 인증 상태 초기화
        await refreshAuthState();

        // 웰컴스크린으로 이동
        router.replace("/auth");
      } else {
        console.error("회원탈퇴 실패");
        // 에러 처리 (필요시 Alert 표시)
      }
    } catch (error) {
      console.error("회원탈퇴 중 오류:", error);
    }
  };

  const handleDeleteUserCancel = () => {
    setShowDeleteUserModal(false);
  };

  const handleFeedbackAndReport = async () => {
    const url =
      "https://docs.google.com/forms/d/e/1FAIpQLSe-fkoR9ZvO5lp9Sd9to2TyuFgFurjP8YQ2tSOgN1hdlFbDeQ/viewform";

    try {
      // URL이 열릴 수 있는지 확인
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        // 구글폼 링크 열기
        await Linking.openURL(url);
      } else {
        Alert.alert("오류", "링크를 열 수 없습니다.");
      }
    } catch (error) {
      console.error("링크 열기 실패:", error);
      Alert.alert("오류", "링크를 열 수 없습니다.");
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
                {userInfo?.profileImageUrl ? (
                  <Image
                    source={{ uri: userInfo.profileImageUrl }}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <DefaultProfileIcon width={40} height={43} color="#9D9896" />
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.userName}>
                  {userInfo?.nickName || "사용자"}
                </Text>
                <Text style={styles.userEmail}>{userInfo?.userName}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => router.push("/profile/edit")}
            >
              <Text style={styles.editProfileText}>프로필 수정하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleFeedbackAndReport}
            >
              <MaterialIcons
                name="report-gmailerrorred"
                size={24}
                color="black"
              />
              <Text style={styles.menuItemText}>의견 및 신고</Text>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
            {/* 구분선 */}
            <View style={styles.separator} />

            <View style={styles.accountMenuItems}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleLogoutClick}
              >
                <MaterialIcons name="logout" size={22} color="black" />
                <Text style={styles.menuItemText}>로그아웃</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleDeleteUserClick}
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={24}
                  color="black"
                />
                <Text style={styles.menuItemText}>회원 탈퇴</Text>
                <Text style={styles.arrowIcon}>›</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>

      {/* 로그아웃 확인 모달 */}
      <LogoutConfirmModal
        visible={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      {/* 회원탈퇴 확인 모달 */}
      <DeleteUserConfirmModal
        visible={showDeleteUserModal}
        onClose={handleDeleteUserCancel}
        onConfirm={handleDeleteUserConfirm}
      />
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
    paddingTop: 40,
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
    overflow: "hidden",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
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
  accountMenuItems: {
    marginTop: 0,
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
    marginLeft: 10,
  },
  arrowIcon: {
    fontSize: 18,
    color: "#9D9896",
    fontFamily: "SUIT-600",
  },
});
