import BackIcon from "@/components/icons/BackIcon";
import BookmarkTemplateMini from "@/components/icons/bookmarkTemplate/BookmarkTemplateMini";
import CameraEnhanceIcon from "@/components/icons/CameraEnhanceIcon";
import PlaceIcon from "@/components/icons/PlaceIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import { getMarkerBookData, setMarkerBookData } from "@/types/globalState";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function MarkerRegister() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [bookTitle, setBookTitle] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [impressions, setImpressions] = useState("");
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState(false);

  // URL 파라미터에서 위치 정보 가져오기
  const address = (params.address as string) || "주소를 불러올 수 없습니다";
  const latitude = parseFloat(params.latitude as string) || 0;
  const longitude = parseFloat(params.longitude as string) || 0;

  // 주소 정보 콘솔 출력
  console.log("마커 등록 화면 - 주소 정보:", {
    address,
    latitude,
    longitude,
  });

  const templates = [1, 2, 3, 4];

  // 마커 등록 화면 진입 시 초기화
  useEffect(() => {
    // 전역변수에서 선택된 도서 정보 가져오기
    const selectedBook = getMarkerBookData();
    if (selectedBook) {
      setBookTitle(selectedBook.title);
    }

    // 마커 등록 화면 진입 시 책 정보 초기화
    setMarkerBookData(null);
  }, []);

  // 도서가 선택되었는지 확인
  const isBookSelected = bookTitle && bookTitle.trim() !== "";

  // 등록하기 버튼 활성화 조건
  const isFormValid =
    address &&
    address !== "주소를 불러올 수 없습니다" &&
    selectedTemplate &&
    isBookSelected &&
    placeName &&
    placeName.trim() !== "" &&
    impressions &&
    impressions.trim() !== "" &&
    selectedImages.length > 0;

  const handleBack = () => {
    router.back();
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>마커 등록</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 주소 섹션 */}
        <View style={styles.addressSection}>
          <View style={styles.addressInfo}>
            <PlaceIcon width={20} height={20} />
            <Text style={styles.addressText}>{address}</Text>
          </View>
        </View>

        {/* 템플릿 선택 섹션 */}
        <View style={styles.templateSection}>
          <Text style={styles.sectionTitle}>템플릿 선택</Text>
          <View style={styles.templateContainer}>
            {templates.map((templateId) => (
              <TouchableOpacity
                key={templateId}
                style={[
                  styles.templateButton,
                  selectedTemplate === templateId && styles.selectedTemplate,
                ]}
                onPress={() => setSelectedTemplate(templateId)}
              >
                <BookmarkTemplateMini templateId={templateId} />
                {selectedTemplate === templateId && (
                  <View style={styles.selectedIndicator}>
                    <Text style={styles.selectedIndicatorText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 도서 선택 섹션 */}
        <TouchableOpacity
          style={styles.bookSection}
          onPress={() => {
            // 도서 선택 화면으로 이동
            router.push("/maru/bookSearch?type=marker");
          }}
        >
          <Text style={styles.sectionTitle}>도서 선택</Text>
          <View style={styles.searchContainer}>
            <Text
              style={[
                styles.searchPlaceholder,
                isBookSelected && styles.selectedBookText,
              ]}
            >
              {bookTitle || "도서 검색해서 추가하기"}
            </Text>
            <SearchIcon width={20} height={20} />
          </View>
        </TouchableOpacity>

        {/* 장소 이름 섹션 */}
        <View style={styles.placeSection}>
          <Text style={styles.sectionTitle}>장소 이름</Text>
          <TextInput
            style={styles.textInput}
            placeholder="나만의 장소 이름을 적어주세요. ex) 해변 앞 구불구불길"
            placeholderTextColor="#9D9896"
            value={placeName}
            onChangeText={setPlaceName}
          />
        </View>

        {/* 감상 입력 섹션 */}
        <View style={styles.impressionsSection}>
          <Text style={styles.sectionTitle}>나의 감상</Text>
          <TextInput
            style={styles.impressionsInput}
            placeholder="책을 읽고 느꼈던 생각이나, 장소에 대한 감정을 간단히 적어보세요. 책과 여행의 여운이 더 오래 남을 거예요."
            placeholderTextColor="#9D9896"
            multiline
            value={impressions}
            onChangeText={setImpressions}
            textAlignVertical="top"
          />
        </View>

        {/* 이미지 추가 섹션 */}
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>이미지 추가</Text>
          <View style={styles.imagesContainer}>
            <TouchableOpacity
              style={styles.imageUploadButton}
              onPress={pickImage}
            >
              <CameraEnhanceIcon width={24} height={24} color="#9D9896" />
              <Text style={styles.imageCount}>{selectedImages.length}/10</Text>
            </TouchableOpacity>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.selectedImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* 공개 여부 섹션 */}
        <View style={styles.publicSection}>
          <View style={styles.publicHeader}>
            <Text style={styles.sectionTitle}>공개 여부</Text>
            <Text style={styles.publicDescription}>
              공개 설정 시 다른 사용자와 장소를 공유할 수 있어요
            </Text>
          </View>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>
              마커를 다른 유저들에게 공개할래요.
            </Text>
            <Switch
              value={isPublic}
              onValueChange={setIsPublic}
              trackColor={{ false: "#DBD6D3", true: "#4A90E2" }}
              thumbColor={isPublic ? "#FFFFFF" : "#F0F0F0"}
            />
          </View>
        </View>

        {/* 하단 여백 */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 등록 버튼 */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={[
            styles.registerButton,
            !isFormValid && styles.registerButtonDisabled,
          ]}
          onPress={() => {
            // 등록 로직 구현
            console.log("마커 등록:", {
              address,
              selectedTemplate,
              bookTitle,
              placeName,
              impressions,
              selectedImages: selectedImages.length,
              isPublic,
            });
          }}
          disabled={!isFormValid}
        >
          <Text
            style={[
              styles.registerButtonText,
              !isFormValid && styles.registerButtonTextDisabled,
            ]}
          >
            등록하기
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
  addressSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  addressInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  addressText: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#262423",
    marginLeft: 8,
  },
  changeAddressButton: {
    backgroundColor: "#EEE9E6",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#DBD6D3",
  },
  changeAddressText: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  imageSection: {
    padding: 20,
  },
  imageRow: {
    flexDirection: "row",
    gap: 16,
  },

  templateSection: {
    padding: 20,
    paddingTop: 0,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  templateContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  templateButton: {
    width: 65,
    height: 65,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedTemplate: {
    borderColor: "#000000",
    backgroundColor: "#F0F0F0",
  },
  selectedIndicator: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    backgroundColor: "#4A90E2",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  selectedIndicatorText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  bookSection: {
    padding: 20,
    paddingTop: 0,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEE9E6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#000000",
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  selectedBookText: {
    color: "#262423",
    fontFamily: "SUIT-600",
  },
  searchButton: {
    padding: 5,
  },
  placeSection: {
    padding: 20,
    paddingTop: 0,
  },
  textInput: {
    backgroundColor: "#EEE9E6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#000000",
    marginTop: 12,
  },
  impressionsSection: {
    padding: 20,
    paddingTop: 0,
  },
  impressionsInput: {
    backgroundColor: "#EEE9E6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#000000",
    minHeight: 120,
    textAlignVertical: "top",
    marginTop: 12,
  },
  bottomPadding: {
    height: 100,
  },
  photoSection: {
    padding: 20,
    paddingTop: 0,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
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
  removeImageText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "SUIT-700",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
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
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#9D9896",
    marginTop: 2,
  },
  publicSection: {
    padding: 20,
    paddingTop: 0,
  },
  publicHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  publicDescription: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    lineHeight: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EEE9E6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  toggleLabel: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#262423",
    flex: 1,
    marginRight: 15,
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
  registerButton: {
    backgroundColor: "#302E2D",
    borderRadius: 5,
    paddingVertical: 16,
    alignItems: "center",
  },
  registerButtonDisabled: {
    backgroundColor: "#C5BFBB",
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SUIT-600",
  },
  registerButtonTextDisabled: {
    color: "#FFFFFF",
  },
});
