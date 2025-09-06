import BookstoreBadge from "@/components/BookstoreBadge";
import DatePickerModal from "@/components/DatePickerModal";
import BackIcon from "@/components/icons/BackIcon";
import CalendarIcon from "@/components/icons/CalendarIcon";
import CameraEnhanceIcon from "@/components/icons/CameraEnhanceIcon";
import PlaceIcon from "@/components/icons/PlaceIcon";
import StarIcon from "@/components/icons/StarIcon";
import { createReviewAPI, getPlaceDetailAPI } from "@/types/api";
import Feather from "@expo/vector-icons/Feather";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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

export default function WriteReview() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placeInfo, setPlaceInfo] = useState<any>(null);

  // 장소 정보 조회
  useEffect(() => {
    const fetchPlaceInfo = async () => {
      const placeId = Number(params.placeId || params.id);
      if (placeId) {
        try {
          const response = await getPlaceDetailAPI(placeId);
          if (response.isSuccess) {
            setPlaceInfo(response.result);
          }
        } catch (error) {
          console.error("장소 정보 조회 실패:", error);
        }
      }
    };

    fetchPlaceInfo();
  }, [params.placeId, params.id]);

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

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <StarIcon
              size={34}
              color={star <= rating ? "#FF9900" : "#C5BFBB"}
              style={styles.star}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const formatSelectedDate = (dateString: string) => {
    if (!dateString) return "달력을 클릭해 방문일을 선택해주세요.";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

    return `${year}.${month}.${day}(${dayOfWeek})`;
  };

  const handleSubmitReview = async () => {
    if (!rating || !selectedDate || reviewText.length < 10) {
      return;
    }

    setIsSubmitting(true);
    try {
      const placeId = Number(params.placeId || params.id);
      if (!placeId) {
        alert("장소 정보를 찾을 수 없습니다.");
        return;
      }

      const request = {
        rating,
        visitedDate: selectedDate,
        content: reviewText,
      };

      const response = await createReviewAPI(placeId, request, selectedImages);

      if (response.isSuccess) {
        alert("리뷰가 성공적으로 작성되었습니다!");
        router.back();
      } else {
        alert(`리뷰 작성 실패: ${response.message}`);
      }
    } catch (error) {
      console.error("리뷰 작성 에러:", error);
      alert("리뷰 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
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
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <BackIcon />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>후기 작성</Text>
            </View>

            {/* 서점 정보 */}
            <View style={styles.bookstoreInfo}>
              {placeInfo?.placeImageUrls &&
              placeInfo.placeImageUrls.length > 0 ? (
                <Image
                  source={{ uri: placeInfo.placeImageUrls[0] }}
                  style={styles.bookstoreImage}
                />
              ) : (
                <View style={styles.bookstoreImage} />
              )}
              <View style={styles.bookstoreDetails}>
                <View style={styles.bookstoreHeader}>
                  <Text style={styles.bookstoreName}>
                    {placeInfo?.name || "장소명"}
                  </Text>
                  <BookstoreBadge placeType={placeInfo?.placeType} />
                </View>
                <View style={styles.locationContainer}>
                  <PlaceIcon width={11} height={15} />
                  <Text style={styles.locationText}>
                    {placeInfo?.address || "주소 정보 없음"}
                  </Text>
                </View>
              </View>
            </View>

            {/* 평점 섹션 */}
            <View style={styles.ratingSection}>
              {renderStars()}
              <View style={styles.ratingTooltip}>
                <View style={styles.tooltipTriangle} />
                <Text style={styles.tooltipText}>공간에 만족하셨나요?</Text>
              </View>
            </View>

            {/* 이미지 업로드 섹션 */}
            <View style={styles.imageSection}>
              <Text style={styles.sectionTitle}>이미지를 추가해주세요</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageScrollContainer}
              >
                {selectedImages.length < 10 && (
                  <TouchableOpacity
                    style={styles.imageUploadButton}
                    onPress={pickImage}
                  >
                    <CameraEnhanceIcon />
                    <Text style={styles.imageCount}>
                      {selectedImages.length}/10
                    </Text>
                  </TouchableOpacity>
                )}
                {selectedImages.map((uri, index) => (
                  <View key={index} style={styles.selectedImageWrapper}>
                    <View style={styles.selectedImageContainer}>
                      <Image source={{ uri }} style={styles.selectedImage} />
                      <Text style={styles.representativeText}>대표사진</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <Feather name="x" size={13} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* 방문 날짜 섹션 */}
            <View style={styles.dateSection}>
              <Text style={styles.sectionTitle}>언제 방문했나요?</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setIsDatePickerVisible(true)}
              >
                <Text
                  style={[
                    styles.datePlaceholder,
                    selectedDate && styles.selectedDateText,
                  ]}
                >
                  {formatSelectedDate(selectedDate)}
                </Text>
                <CalendarIcon width={20} height={20} />
              </TouchableOpacity>
            </View>

            {/* 후기 작성 섹션 */}
            <View style={styles.reviewSection}>
              <Text style={styles.sectionTitle}>후기를 작성해주세요</Text>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    reviewText.length > 0 &&
                      reviewText.length < 10 &&
                      styles.textInputError,
                  ]}
                  placeholder="책을 읽고 느꼈던 생각이나, 장소에 대한 감정을 간단히 적어보세요. 책과 여행의 여운이 더 오래 남을 거예요."
                  placeholderTextColor="#9D9896"
                  multiline
                  value={reviewText}
                  onChangeText={setReviewText}
                  maxLength={200}
                />
                <Text style={styles.characterCount}>
                  {reviewText.length}/200 자
                </Text>
              </View>
              {reviewText.length > 0 && reviewText.length < 10 && (
                <Text style={styles.errorMessage}>
                  최소 10자 이상 입력해주세요.
                </Text>
              )}
            </View>

            {/* 스크롤 끝에 여백 추가 */}
            <View style={styles.bottomPadding} />
          </ScrollView>

          {/* 작성 완료 버튼 - 고정 */}
          <View style={styles.fixedButtonContainer}>
            <TouchableOpacity
              style={[
                styles.completeButton,
                rating > 0 && selectedDate && reviewText.length >= 10
                  ? styles.completeButtonActive
                  : styles.completeButtonDisabled,
              ]}
              disabled={
                !(rating > 0 && selectedDate && reviewText.length >= 10) ||
                isSubmitting
              }
              onPress={handleSubmitReview}
            >
              <Text style={[styles.completeButtonText]}>
                {isSubmitting ? "작성 중..." : "작성 완료"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* 달력 모달 - SafeAreaView 밖에 위치 */}
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onDateSelect={(date) => setSelectedDate(date)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 5,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  bookstoreInfo: {
    flexDirection: "row",
    padding: 20,
    marginBottom: 10,
  },
  bookstoreImage: {
    width: 52,
    height: 52,
    backgroundColor: "#E8E3E0",
    borderRadius: 8,
    marginRight: 15,
  },
  bookstoreDetails: {
    flex: 1,
    justifyContent: "center",
  },
  bookstoreHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bookstoreName: {
    maxWidth: "80%",
    fontSize: 16,
    fontFamily: "SUIT-700",
    color: "#000000",
    marginRight: 10,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DBD6D3",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginLeft: 3,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  locationText: {
    fontSize: 12,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  ratingSection: {
    padding: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  star: {
    width: 35,
    height: 35,
  },
  ratingTooltip: {
    backgroundColor: "#8A8582",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    position: "relative",
  },
  tooltipTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 6,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#8A8582",
    position: "absolute",
    top: -6,
  },
  tooltipText: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
  imageSection: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#000000",
    marginBottom: 12,
  },
  imageScrollContainer: {
    // Add any specific styles for the ScrollView if needed
  },
  selectedImageWrapper: {
    position: "relative",
    marginRight: 8,
    paddingTop: 7,
    paddingRight: 7,
  },
  selectedImageContainer: {
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
    top: 0,
    right: 0,
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

  representativeText: {
    position: "absolute",
    bottom: -15,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 10,
    fontFamily: "SUIT-500",
    color: "#9D9896",
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
    marginRight: 8,
    marginTop: 7,
  },
  imageCount: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#9D9896",
    marginTop: 2,
  },
  dateSection: {
    padding: 20,
    paddingBottom: 10,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderRadius: 8,
    backgroundColor: "#EEE9E6",
  },
  datePlaceholder: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  selectedDateText: {
    color: "#000000",
  },
  reviewSection: {
    padding: 20,
    marginBottom: 20,
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
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#000000",
    textAlignVertical: "top",
  },
  characterCount: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 11,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  textInputError: {
    borderColor: "#FF0000",
  },
  errorMessage: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#FF0000",
    marginTop: 5,
  },
  completeButton: {
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  completeButtonActive: {
    backgroundColor: "#4D4947",
  },
  completeButtonDisabled: {
    backgroundColor: "#C5BFBB",
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#ffffff",
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
    height: 100, // Adjust as needed to push content to top
  },
});
