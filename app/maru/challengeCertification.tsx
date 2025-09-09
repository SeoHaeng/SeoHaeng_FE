import BackIcon from "@/components/icons/BackIcon";
import CameraEnhanceIcon from "@/components/icons/CameraEnhanceIcon";
import PlaceIcon from "@/components/icons/PlaceIcon";
import GiftBook from "@/components/maruChallenge/detail/giftBook";
import { createBookChallengeProofAPI } from "@/types/api";
import { getGiftBookData, getReceivedBookData } from "@/types/globalState";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChallengeCertification() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [giftMessage, setGiftMessage] = useState("");
  const [challengeReview, setChallengeReview] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [receivedBook, setReceivedBook] = useState<{
    id: string;
    title: string;
    author: string;
    cover: { uri: string };
  } | null>({
    id: "",
    title: (params.receivedBookTitle as string) || "",
    author: (params.receivedBookAuthor as string) || "어떤 책을 받았나요?",
    cover: { uri: (params.receivedBookImage as string) || "" },
  });
  const [giftBook, setGiftBook] = useState<{
    id: string;
    title: string;
    author: string;
    cover: { uri: string };
  } | null>({
    id: "",
    title: (params.givenBookTitle as string) || "",
    author: (params.givenBookAuthor as string) || "어떤 책을 선물할까요?",
    cover: { uri: (params.givenBookImage as string) || "" },
  });

  // 등록하기 버튼 활성화 조건
  const isFormValid =
    receivedBook &&
    receivedBook.title &&
    giftBook &&
    giftBook.title &&
    giftMessage.trim() &&
    challengeReview.trim();

  // 도서 검색 화면에서 선택된 책 정보를 전역 변수에서 가져오는 로직
  useFocusEffect(
    useCallback(() => {
      console.log("북챌린지 인증하기 화면 포커스됨 - 전역변수 확인 중...");

      // 전역 변수에서 받을 책 정보 가져오기
      const receivedData = getReceivedBookData();
      console.log("전역변수에서 받을 책 정보:", receivedData);
      if (receivedData) {
        setReceivedBook(receivedData);
        console.log("받을 책 상태 업데이트됨:", receivedData);
      }

      // 전역 변수에서 줄 책 정보 가져오기
      const giftData = getGiftBookData();
      console.log("전역변수에서 줄 책 정보:", giftData);
      if (giftData) {
        setGiftBook(giftData);
        console.log("줄 책 상태 업데이트됨:", giftData);
      }

      console.log(
        "현재 상태 - receivedBook:",
        receivedBook,
        "giftBook:",
        giftBook,
      );
    }, []),
  );

  const pickImage = async () => {
    if (selectedImages.length >= 10) {
      alert("최대 10장까지 선택할 수 있습니다.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setSelectedImages((prev) => [...prev, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      console.log("북챌린지 인증 등록 시작:", {
        bookChallengeId: params.bookChallengeId,
        giftMessage,
        challengeReview,
        selectedImages,
      });

      if (!params.bookChallengeId) {
        alert("북챌린지 ID가 없습니다.");
        return;
      }

      const bookChallengeId = parseInt(params.bookChallengeId as string);

      const response = await createBookChallengeProofAPI(
        bookChallengeId,
        giftMessage,
        challengeReview,
        selectedImages,
      );

      if (response.isSuccess) {
        alert("북챌린지 인증이 성공적으로 등록되었습니다!");
        // 성공 후 이전 화면으로 이동
        router.push("/(tabs)/maru/challenge");
      } else {
        alert(`인증 등록 실패: ${response.message}`);
      }
    } catch (error) {
      console.error("북챌린지 인증 등록 실패:", error);
      alert("인증 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/maru/challenge")}
              style={styles.backButton}
            >
              <BackIcon />
            </TouchableOpacity>
            <Text style={styles.headerTitle} allowFontScaling={false}>
              북챌린지 인증하기
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* 책 선택 섹션 */}
          <View style={styles.bookSection}>
            <View style={styles.locationContainer}>
              <View style={styles.locationInfo}>
                <PlaceIcon width={17} height={20} color="#716C69" />
                <Text style={styles.locationText} allowFontScaling={false}>
                  {params.bookStoreName as string}
                </Text>
              </View>
            </View>

            <View style={styles.bookCardsContainer}>
              <GiftBook
                title={receivedBook?.title || ""}
                author={receivedBook?.author || ""}
                status="선물받은 책"
                bookImage={receivedBook?.cover}
              />

              <GiftBook
                title={giftBook?.title || ""}
                author={giftBook?.author || ""}
                status="선물할 책"
                bookImage={giftBook?.cover}
              />
            </View>
          </View>

          {/* 선물 메시지 섹션 */}
          <View style={styles.messageSection}>
            <Text style={styles.sectionTitle} allowFontScaling={false}>
              선물 메시지 남기기
            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={giftMessage}
                onChangeText={setGiftMessage}
                placeholder="ex) 이 책은 어떤 책이에요. 저는 이러한 마음으로 읽었어요. 자유롭게 남겨주세요"
                placeholderTextColor="#9D9896"
                multiline
                textAlignVertical="top"
                allowFontScaling={false}
              />
            </View>
          </View>

          {/* 인증샷 추가 섹션 */}
          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle} allowFontScaling={false}>
              인증샷 추가
            </Text>
            <View style={styles.imagesContainer}>
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={pickImage}
              >
                <CameraEnhanceIcon width={24} height={24} color="#9D9896" />
                <Text style={styles.imageCount} allowFontScaling={false}>
                  {selectedImages.length}/10
                </Text>
              </TouchableOpacity>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.selectedImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Feather name="x" size={13} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* 챌린지 소감 섹션 */}
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle} allowFontScaling={false}>
              챌린지 소감 남기기
            </Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                value={challengeReview}
                onChangeText={setChallengeReview}
                placeholder="ex) 이 책을 받고 어떠한 기분을 느꼈어요."
                placeholderTextColor="#9D9896"
                multiline
                textAlignVertical="top"
                allowFontScaling={false}
              />
            </View>
          </View>

          {/* 하단 여백 */}
          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* 고정된 하단 버튼 */}
        <View style={styles.fixedButtonContainer}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              !isFormValid && styles.completeButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <Text
              style={[
                styles.completeButtonText,
                !isFormValid && styles.completeButtonTextDisabled,
              ]}
              allowFontScaling={false}
            >
              인증 등록하기
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {},
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
  bookSection: {
    padding: 20,
    paddingBottom: 10,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 17,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginLeft: 8,
  },
  changeAddressButton: {
    backgroundColor: "#EEE9E6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#DBD6D3",
  },
  changeAddressText: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  bookCardsContainer: {
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
  },
  bookCardTouchable: {
    // TouchableOpacity를 위한 스타일
  },
  moreButton: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  moreButtonText: {
    fontSize: 17,
    color: "#9D9896",
    fontFamily: "SUIT-700",
  },
  messageSection: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "SUIT-700",
    color: "#000000",
    marginBottom: 15,
  },
  textInputContainer: {
    position: "relative",
  },
  textInput: {
    minHeight: 120,
    padding: 15,
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderRadius: 8,
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#000000",
    textAlignVertical: "top",
  },
  photoSection: {
    padding: 20,
    paddingBottom: 10,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageContainer: {
    position: "relative",
  },
  selectedImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: "#EEE9E6",
  },
  removeImageButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#4D4947",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffffff",
    zIndex: 1,
    padding: 0,
  },

  imageUploadButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    backgroundColor: "#EEE9E6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DBD6D3",
  },
  imageCount: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#9D9896",
    marginTop: 2,
  },
  reviewSection: {
    padding: 20,
    marginBottom: 20,
  },
  completeButton: {
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "#302E2D",
  },
  completeButtonDisabled: {
    backgroundColor: "#C5BFBB",
  },
  completeButtonText: {
    fontSize: 17,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
  completeButtonTextDisabled: {
    color: "#FFFFFF",
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 5,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE9E6",
  },
  bottomPadding: {
    height: 70,
  },
});
