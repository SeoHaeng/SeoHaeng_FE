import BackIcon from "@/components/icons/BackIcon";
import BookmarkTemplateMini from "@/components/icons/bookmarkTemplate/BookmarkTemplateMini";
import CameraEnhanceIcon from "@/components/icons/CameraEnhanceIcon";
import PlaceIcon from "@/components/icons/PlaceIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function MarkerRegister() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [bookTitle, setBookTitle] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [impressions, setImpressions] = useState("");

  const templates = [1, 2, 3, 4];

  const handleBack = () => {
    router.back();
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
            <Text style={styles.addressText}>강원 강릉시 행복로 514</Text>
          </View>
          <TouchableOpacity style={styles.changeAddressButton}>
            <Text style={styles.changeAddressText}>주소 변경하기</Text>
          </TouchableOpacity>
        </View>

        {/* 이미지 업로드 섹션 */}
        <View style={styles.imageSection}>
          <View style={styles.imageRow}>
            <TouchableOpacity style={styles.imageUploadButton}>
              <CameraEnhanceIcon width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageUploadButton}>
              <CameraEnhanceIcon width={24} height={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* 템플릿 선택 섹션 */}
        <View style={styles.templateSection}>
          <Text style={styles.sectionTitle}>템플릿 선택</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.templateContainer}
          >
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
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 도서 선택 섹션 */}
        <View style={styles.bookSection}>
          <Text style={styles.sectionTitle}>도서 선택</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="도서 검색해서 추가하기"
              placeholderTextColor="#9D9896"
              value={bookTitle}
              onChangeText={setBookTitle}
            />
            <TouchableOpacity style={styles.searchButton}>
              <SearchIcon width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>

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

        {/* 하단 여백 */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* 등록 버튼 */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>등록하기</Text>
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
  imageUploadButton: {
    width: 120,
    height: 120,
    backgroundColor: "#EEE9E6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  templateSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "SUIT-700",
    color: "#000000",
    marginBottom: 10,
  },
  templateContainer: {
    gap: 12,
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
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#000000",
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
  },
  bottomPadding: {
    height: 100,
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
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SUIT-600",
  },
});
