import BackIcon from "@/components/icons/BackIcon";
import CameraEnhanceIcon from "@/components/icons/CameraEnhanceIcon";
import DefaultProfileIcon from "@/components/icons/DefaultProfileIcon";
import EyeIcon from "@/components/icons/EyeIcon";
import { updateProfileAPI } from "@/types/api";
import { getUserInfo, setUserInfo } from "@/types/globalState";
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
  const [id, setId] = useState(""); // 아이디는 API에서 제공되지 않으므로 빈 문자열로 유지
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(
    userInfo?.profileImageUrl || null,
  );
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isIdChecked, setIsIdChecked] = useState(false);

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

  const handleDuplicateCheck = (type: "nickname" | "id") => {
    // 실제 중복확인 API 호출 대신 모의 응답
    if (type === "nickname") {
      setIsNicknameChecked(true);
    } else {
      setIsIdChecked(true);
    }
  };

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    if (isNicknameChecked) {
      setIsNicknameChecked(false);
    }
  };

  const handleIdChange = (text: string) => {
    setId(text);
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

      // API 요청 데이터 준비
      const requestData = {
        username: id,
        nickname: nickname,
        password1: password || "", // 비밀번호가 비어있으면 빈 문자열
        password2: confirmPassword || "", // 비밀번호 확인이 비어있으면 빈 문자열
      };

      console.log("프로필 수정 요청 데이터:", requestData);
      console.log("프로필 이미지:", profileImage);

      // 프로필 수정 API 호출
      const response = await updateProfileAPI(requestData, profileImage);

      if (response.isSuccess) {
        // 성공 시 사용자 정보 업데이트
        if (userInfo) {
          const updatedUserInfo = {
            ...userInfo,
            nickName: nickname,
            profileImageUrl: profileImage,
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
        Alert.alert(
          "수정 실패",
          "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
        );
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

  // 폼 유효성 검사
  const isFormValid =
    nickname.trim() &&
    id.trim() &&
    validateId(id) &&
    isNicknameChecked &&
    isIdChecked &&
    (password.length === 0 || validatePassword(password)) &&
    (password.length === 0 ||
      validatePasswordConfirm(password, confirmPassword));

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
          <Text style={styles.headerTitle}>프로필 수정</Text>
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
          <Text style={styles.inputLabel}>닉네임</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={nickname}
                onChangeText={handleNicknameChange}
                placeholder="닉네임을 입력해주세요"
                placeholderTextColor="#9D9896"
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
              >
                {isNicknameChecked ? "확인완료" : "중복확인"}
              </Text>
            </TouchableOpacity>
          </View>
          {nickname.length > 0 && !isNicknameChecked && (
            <Text style={styles.validationText}>
              닉네임 중복확인이 필요합니다
            </Text>
          )}
          {isNicknameChecked && (
            <Text style={styles.validationTextSuccess}>
              사용 가능한 닉네임입니다
            </Text>
          )}
        </View>

        {/* 아이디 입력 섹션 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>아이디</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={id}
                onChangeText={handleIdChange}
                placeholder="아이디를 입력해주세요"
                placeholderTextColor="#9D9896"
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
              >
                {isIdChecked ? "확인완료" : "중복확인"}
              </Text>
            </TouchableOpacity>
          </View>
          {id.length > 0 && !validateId(id) && (
            <Text style={styles.validationText}>
              아이디는 4-12자로 입력해주세요
            </Text>
          )}
          {id.length > 0 && validateId(id) && !isIdChecked && (
            <Text style={styles.validationText}>
              아이디 중복확인이 필요합니다
            </Text>
          )}
          {isIdChecked && (
            <Text style={styles.validationTextSuccess}>
              사용 가능한 아이디입니다
            </Text>
          )}
        </View>

        {/* 비밀번호 입력 섹션 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>비밀번호</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              placeholder="영문, 숫자, 특수문자 포함 8-20자"
              placeholderTextColor="#9D9896"
              secureTextEntry={!showPassword}
            />
            <View style={styles.inputIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <EyeIcon width={22} height={15} color="#9D9896" />
              </TouchableOpacity>
            </View>
          </View>
          {password.length > 0 && (
            <Text
              style={[
                styles.validationText,
                validatePassword(password)
                  ? styles.validationTextSuccess
                  : styles.validationTextError,
              ]}
            >
              {validatePassword(password)
                ? "✓ 비밀번호 조건을 만족합니다"
                : "✗ 영문, 숫자, 특수문자 포함 8-20자 입력 필요"}
            </Text>
          )}
        </View>

        {/* 비밀번호 확인 입력 섹션 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>비밀번호 확인</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="비밀번호를 다시 입력해주세요"
              placeholderTextColor="#9D9896"
              secureTextEntry={!showConfirmPassword}
            />
            <View style={styles.inputIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <EyeIcon width={22} height={15} color="#9D9896" />
              </TouchableOpacity>
            </View>
          </View>
          {confirmPassword.length > 0 && password !== confirmPassword && (
            <Text style={styles.validationTextError}>
              비밀번호가 일치하지 않습니다
            </Text>
          )}
          {confirmPassword.length > 0 &&
            password === confirmPassword &&
            password.length > 0 && (
              <Text style={styles.validationTextSuccess}>
                비밀번호가 일치합니다
              </Text>
            )}
        </View>

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
          <Text style={styles.saveButtonText}>수정 완료</Text>
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
    fontSize: 16,
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
    fontSize: 48,
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
    fontSize: 16,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
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
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#000000",
    paddingRight: 90,
  },
  inputIcons: {
    position: "absolute",
    right: 15,
    top: 12,
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 2,
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
    fontSize: 16,
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
    fontSize: 14,
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
    fontSize: 16,
    fontFamily: "SUIT-600",
  },
  validationText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    marginTop: 8,
    marginLeft: 5,
  },
  validationTextSuccess: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#4D4947",
    marginTop: 8,
    marginLeft: 5,
  },
  validationTextError: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#FF6B6B",
    marginTop: 8,
    marginLeft: 5,
  },
});
