import BackIcon from "@/components/icons/BackIcon";
import CameraEnhanceIcon from "@/components/icons/CameraEnhanceIcon";
import DefaultProfileIcon from "@/components/icons/DefaultProfileIcon";
import { API_BASE_URL } from "@/config/api";
import {
  checkNicknameDuplicateAPI,
  checkUsernameDuplicateAPI,
  updateProfileAPI,
} from "@/types/api";
import { getUserInfo, setUserInfo } from "@/types/globalState";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileEdit() {
  const router = useRouter();
  const [userInfo, setLocalUserInfo] = useState(getUserInfo());
  const [nickname, setNickname] = useState(userInfo?.nickName || "");
  const [id, setId] = useState(userInfo?.userName || ""); // 현재 사용자 아이디로 초기화
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    userInfo?.profileImageUrl || null,
  );
  const [isNicknameChecked, setIsNicknameChecked] = useState(true); // 현재 닉네임은 이미 확인됨
  const [isIdChecked, setIsIdChecked] = useState(true); // 현재 아이디는 이미 확인됨

  // 사용자 정보 업데이트를 위한 주기적 체크
  useEffect(() => {
    const interval = setInterval(() => {
      const currentUserInfo = getUserInfo();
      if (currentUserInfo !== userInfo) {
        setLocalUserInfo(currentUserInfo);
        // 사용자 정보가 업데이트되면 관련 상태도 업데이트
        if (
          currentUserInfo?.nickName &&
          currentUserInfo.nickName !== nickname
        ) {
          setNickname(currentUserInfo.nickName);
        }
        if (currentUserInfo?.userName && currentUserInfo.userName !== id) {
          setId(currentUserInfo.userName);
        }
        if (
          currentUserInfo?.profileImageUrl &&
          currentUserInfo.profileImageUrl !== profileImage
        ) {
          setProfileImage(currentUserInfo.profileImageUrl);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [userInfo, nickname, profileImage]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleDuplicateCheck = async (type: "nickname" | "id") => {
    try {
      if (type === "nickname") {
        if (!nickname.trim()) {
          Alert.alert("입력 오류", "닉네임을 입력해주세요.");
          return;
        }

        // 현재 사용자와 동일한 닉네임인 경우 중복확인 건너뛰기
        if (nickname.trim() === userInfo?.nickName) {
          setIsNicknameChecked(true);
          Alert.alert("중복 확인", "현재 사용 중인 닉네임입니다.");
          return;
        }

        console.log("🔄 닉네임 중복확인 API 호출 시작");
        console.log("📝 요청 닉네임:", nickname.trim());
        console.log("🔗 API URL:", `${API_BASE_URL}/users/auth/check-nickname`);

        const response = await checkNicknameDuplicateAPI(nickname.trim());
        if (response.isSuccess) {
          if (response.result.isDuplicate) {
            Alert.alert("중복 확인", "이미 사용 중인 닉네임입니다.");
            setIsNicknameChecked(false);
          } else {
            setIsNicknameChecked(true);
            Alert.alert("중복 확인", "사용 가능한 닉네임입니다.");
          }
        } else {
          Alert.alert(
            "오류",
            response.message || "닉네임 중복확인에 실패했습니다.",
          );
        }
      } else {
        if (!id.trim()) {
          Alert.alert("입력 오류", "아이디를 입력해주세요.");
          return;
        }

        if (!validateId(id.trim())) {
          Alert.alert("입력 오류", "아이디는 4-12자로 입력해주세요.");
          return;
        }

        // 현재 사용자와 동일한 아이디인 경우 중복확인 건너뛰기
        if (id.trim() === userInfo?.userName) {
          setIsIdChecked(true);
          Alert.alert("중복 확인", "현재 사용 중인 아이디입니다.");
          return;
        }

        const response = await checkUsernameDuplicateAPI(id.trim());
        if (response.isSuccess) {
          if (response.result.isDuplicate) {
            Alert.alert("중복 확인", "이미 사용 중인 아이디입니다.");
            setIsIdChecked(false);
          } else {
            setIsIdChecked(true);
            Alert.alert("중복 확인", "사용 가능한 아이디입니다.");
          }
        } else {
          Alert.alert(
            "오류",
            response.message || "아이디 중복확인에 실패했습니다.",
          );
        }
      }
    } catch (error) {
      console.error("중복확인 API 에러:", error);
      Alert.alert("오류", "아이디 또는 비밀번호를 확인해주세요");
    }
  };

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    // 닉네임이 변경되면 중복확인 상태 초기화
    if (isNicknameChecked) {
      setIsNicknameChecked(false);
    }
  };

  const handleIdChange = (text: string) => {
    setId(text);
    // 아이디가 변경되면 중복확인 상태 초기화
    if (isIdChecked) {
      setIsIdChecked(false);
    }
  };

  const clearInput = (
    type: "nickname" | "id" | "password" | "confirmPassword",
  ) => {
    switch (type) {
      case "nickname":
        setNickname("");
        setIsNicknameChecked(false);
        break;
      case "id":
        setId("");
        setIsIdChecked(false);
        break;
      case "password":
        setPassword("");
        break;
      case "confirmPassword":
        setConfirmPassword("");
        break;
    }
  };

  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert("입력 오류", "모든 필수 항목을 올바르게 입력해주세요.");
      return;
    }

    try {
      // 현재 토큰 상태 확인
      const currentUserInfo = getUserInfo();
      console.log("현재 사용자 정보:", currentUserInfo);

      // 변경된 필드만 감지하여 요청 데이터 준비
      const changedFields: Partial<{
        username: string;
        nickname: string;
        password1: string;
        password2: string;
      }> = {};

      // 카카오 사용자와 일반 사용자 구분
      const isKakaoUser = userInfo?.loginType === "KAKAO";

      // 아이디 변경 확인 (카카오 사용자가 아닌 경우에만)
      if (!isKakaoUser && id !== userInfo?.userName) {
        changedFields.username = id;
      }

      // 닉네임 변경 확인 (모든 사용자)
      if (nickname !== userInfo?.nickName) {
        changedFields.nickname = nickname;
      }

      // 비밀번호 변경 확인 (카카오 사용자가 아닌 경우에만)
      if (!isKakaoUser && password && password !== "") {
        changedFields.password1 = password;
        changedFields.password2 = confirmPassword;
      }

      // 프로필 이미지 변경 확인
      const isProfileImageChanged = profileImage !== userInfo?.profileImageUrl;

      console.log("변경된 필드:", changedFields);
      console.log("프로필 이미지 변경됨:", isProfileImageChanged);
      console.log("프로필 이미지:", profileImage);

      // 변경된 필드가 없는 경우
      if (Object.keys(changedFields).length === 0 && !isProfileImageChanged) {
        Alert.alert("알림", "변경된 내용이 없습니다.");
        return;
      }

      // 디버깅을 위한 로그 추가
      console.log("🔍 변경된 필드 상세:", {
        isKakaoUser,
        changedFields,
        isProfileImageChanged,
        nicknameChanged: nickname !== userInfo?.nickName,
        idChanged: !isKakaoUser && id !== userInfo?.userName,
        passwordChanged: !isKakaoUser && password && password !== "",
        profileImageChanged: profileImage !== userInfo?.profileImageUrl,
      });

      // 프로필 수정 API 호출 (변경된 필드만 전송)
      const response = await updateProfileAPI(
        changedFields,
        isProfileImageChanged ? profileImage : undefined,
      );

      if (response.isSuccess) {
        // 성공 시 사용자 정보 업데이트
        if (userInfo) {
          const updatedUserInfo = {
            ...userInfo,
            nickName: changedFields.nickname || userInfo.nickName,
            userName: changedFields.username || userInfo.userName,
            profileImageUrl: isProfileImageChanged
              ? profileImage
              : userInfo.profileImageUrl,
          };
          setUserInfo(updatedUserInfo);
        }

        Alert.alert("수정 완료", "프로필이 성공적으로 수정되었습니다.", [
          {
            text: "확인",
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert(
          "수정 실패",
          response.message || "프로필 수정에 실패했습니다.",
        );
      }
    } catch (error) {
      console.error("프로필 수정 에러:", error);

      // 403 에러인 경우 특별한 메시지 표시
      if (error instanceof Error && error.message.includes("403")) {
        Alert.alert(
          "권한 오류",
          "로그인이 만료되었거나 권한이 없습니다. 다시 로그인해주세요.",
          [
            {
              text: "로그인 화면으로",
              onPress: () => router.push("/auth"),
            },
            {
              text: "취소",
              style: "cancel",
            },
          ],
        );
      } else {
        Alert.alert("수정 실패", "아이디 또는 비밀번호를 확인해주세요");
      }
    }
  };

  // 아이디 유효성 검사
  const validateId = (id: string) => {
    const minLength = 4;
    const maxLength = 12;

    return id.length >= minLength && id.length <= maxLength;
  };

  // 비밀번호 유효성 검사
  const validatePassword = (password: string) => {
    const minLength = 8;
    const maxLength = 20;
    const hasEnglish = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      password,
    );

    return (
      password.length >= minLength &&
      password.length <= maxLength &&
      hasEnglish &&
      hasNumber &&
      hasSpecialChar
    );
  };

  // 비밀번호 확인 일치 검사
  const validatePasswordConfirm = (
    password: string,
    confirmPassword: string,
  ) => {
    return password === confirmPassword && password.length > 0;
  };

  // 폼 유효성 검사 - 카카오 사용자와 일반 사용자 구분
  const isKakaoUser = userInfo?.loginType === "KAKAO";

  const hasChanges =
    nickname !== userInfo?.nickName ||
    (!isKakaoUser && id !== userInfo?.userName) ||
    (!isKakaoUser && password.length > 0) ||
    profileImage !== userInfo?.profileImageUrl;

  const isFormValid = isKakaoUser
    ? // 카카오 로그인 사용자: 닉네임만 검증
      nickname.trim() &&
      ((nickname !== userInfo?.nickName && isNicknameChecked) ||
        nickname === userInfo?.nickName) &&
      hasChanges
    : // 일반 사용자: 모든 필드 검증
      nickname.trim() &&
      id.trim() &&
      validateId(id) &&
      // 변경된 필드에 대해서만 중복확인 필요
      ((nickname !== userInfo?.nickName && isNicknameChecked) ||
        nickname === userInfo?.nickName) &&
      ((id !== userInfo?.userName && isIdChecked) ||
        id === userInfo?.userName) &&
      // 비밀번호가 입력된 경우에만 비밀번호 검증
      (password.length === 0 || validatePassword(password)) &&
      (password.length === 0 ||
        validatePasswordConfirm(password, confirmPassword)) &&
      // 변경사항이 있어야 함
      hasChanges;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle} allowFontScaling={false}>
            프로필 수정
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 프로필 이미지 섹션 */}
        <View style={styles.profileImageSection}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={pickImage}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <DefaultProfileIcon width={60} height={65} color="#9D9896" />
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <CameraEnhanceIcon />
            </View>
          </TouchableOpacity>
        </View>

        {/* 닉네임 입력 섹션 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel} allowFontScaling={false}>
            닉네임
          </Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={nickname}
                onChangeText={handleNicknameChange}
                placeholder="닉네임을 입력해주세요"
                placeholderTextColor="#9D9896"
                allowFontScaling={false}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.duplicateCheckButton,
                isNicknameChecked && styles.duplicateCheckButtonCompleted,
              ]}
              onPress={() => handleDuplicateCheck("nickname")}
            >
              <Text
                style={[
                  styles.duplicateCheckText,
                  isNicknameChecked && styles.duplicateCheckTextCompleted,
                ]}
                allowFontScaling={false}
              >
                {isNicknameChecked ? "확인완료" : "중복확인"}
              </Text>
            </TouchableOpacity>
          </View>
          {nickname.length > 0 && !isNicknameChecked && (
            <Text style={styles.validationText} allowFontScaling={false}>
              닉네임 중복확인이 필요합니다
            </Text>
          )}
          {isNicknameChecked && (
            <Text style={styles.validationTextSuccess} allowFontScaling={false}>
              사용 가능한 닉네임입니다
            </Text>
          )}
        </View>

        {/* 아이디 입력 섹션 - 카카오 로그인이 아닌 경우에만 표시 */}
        {userInfo?.loginType !== "KAKAO" && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel} allowFontScaling={false}>
              아이디
            </Text>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.textInput}
                  value={id}
                  onChangeText={handleIdChange}
                  placeholder="아이디를 입력해주세요"
                  placeholderTextColor="#9D9896"
                  allowFontScaling={false}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.duplicateCheckButton,
                  isIdChecked && styles.duplicateCheckButtonCompleted,
                ]}
                onPress={() => handleDuplicateCheck("id")}
              >
                <Text
                  style={[
                    styles.duplicateCheckText,
                    isIdChecked && styles.duplicateCheckTextCompleted,
                  ]}
                  allowFontScaling={false}
                >
                  {isIdChecked ? "확인완료" : "중복확인"}
                </Text>
              </TouchableOpacity>
            </View>
            {id.length > 0 && !validateId(id) && (
              <Text style={styles.validationText} allowFontScaling={false}>
                아이디는 4-12자로 입력해주세요
              </Text>
            )}
            {id.length > 0 && validateId(id) && !isIdChecked && (
              <Text style={styles.validationText} allowFontScaling={false}>
                아이디 중복확인이 필요합니다
              </Text>
            )}
            {isIdChecked && (
              <Text
                style={styles.validationTextSuccess}
                allowFontScaling={false}
              >
                사용 가능한 아이디입니다
              </Text>
            )}
          </View>
        )}

        {/* 비밀번호 입력 섹션 - 카카오 로그인이 아닌 경우에만 표시 */}
        {userInfo?.loginType !== "KAKAO" && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel} allowFontScaling={false}>
              비밀번호
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={setPassword}
                placeholder="영문, 숫자, 특수문자 포함 8-20자"
                placeholderTextColor="#9D9896"
                secureTextEntry={!showPassword}
                allowFontScaling={false}
              />

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <AntDesign name="eye" size={22} color="#9D9896" />
              </TouchableOpacity>
            </View>

            {password.length > 0 && (
              <Text
                style={[
                  styles.validationText,
                  validatePassword(password)
                    ? styles.validationTextSuccess
                    : styles.validationTextError,
                ]}
                allowFontScaling={false}
              >
                {validatePassword(password)
                  ? "✓ 비밀번호 조건을 만족합니다"
                  : "✗ 영문, 숫자, 특수문자 포함 8-20자 입력 필요"}
              </Text>
            )}
          </View>
        )}

        {/* 비밀번호 확인 입력 섹션 - 카카오 로그인이 아닌 경우에만 표시 */}
        {userInfo?.loginType !== "KAKAO" && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel} allowFontScaling={false}>
              비밀번호 확인
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="비밀번호를 다시 입력해주세요"
                placeholderTextColor="#9D9896"
                secureTextEntry={!showConfirmPassword}
                allowFontScaling={false}
              />

              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <AntDesign name="eye" size={22} color="#9D9896" />
              </TouchableOpacity>
            </View>
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <Text style={styles.validationTextError} allowFontScaling={false}>
                비밀번호가 일치하지 않습니다
              </Text>
            )}
            {confirmPassword.length > 0 &&
              password === confirmPassword &&
              password.length > 0 && (
                <Text
                  style={styles.validationTextSuccess}
                  allowFontScaling={false}
                >
                  비밀번호가 일치합니다
                </Text>
              )}
          </View>
        )}

        {/* 하단 여백 */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 수정 완료 버튼 */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid}
        >
          <Text style={styles.saveButtonText} allowFontScaling={false}>
            수정 완료
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4F2",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 300,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE9E6",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  headerSpacer: {
    width: 30,
  },
  profileImageSection: {
    alignItems: "center",
    paddingVertical: 40,
    paddingBottom: 30,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#DBD6D3",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImageText: {
    fontSize: 49,
  },
  cameraIconContainer: {
    position: "absolute",
    bottom: 5,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: "#9D9896",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4D4947",
  },
  cameraIcon: {
    fontSize: 17,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontFamily: "SUIT-700",
    color: "#000000",
    marginBottom: 7,
  },
  inputRow: {
    flexDirection: "row",
    gap: 15,
  },
  inputContainer: {
    flex: 1,
    position: "relative",
  },
  textInput: {
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#000000",
  },
  inputIcons: {
    position: "absolute",
    right: 15,
    top: 12,
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    position: "absolute",
    right: 16,
    top: 10,
  },
  clearButton: {
    backgroundColor: "#4D4947",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "SUIT-700",
  },
  duplicateCheckButton: {
    backgroundColor: "#302E2D",
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 85,
  },
  duplicateCheckButtonCompleted: {
    backgroundColor: "#9D9896",
  },
  duplicateCheckText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "SUIT-600",
  },
  duplicateCheckTextCompleted: {
    color: "#262423",
  },
  bottomPadding: {
    height: 20,
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#F8F4F2",
    borderTopWidth: 1,
    borderTopColor: "#DBD6D3",
  },
  saveButton: {
    backgroundColor: "#302E2D",
    borderRadius: 5,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: "#C5BFBB",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "SUIT-600",
  },
  validationText: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    marginTop: 8,
    marginLeft: 5,
  },
  validationTextSuccess: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#4D4947",
    marginTop: 8,
    marginLeft: 5,
  },
  validationTextError: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#FF6B6B",
    marginTop: 8,
    marginLeft: 5,
  },
});
