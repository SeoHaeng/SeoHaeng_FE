import BackIcon from "@/components/icons/BackIcon";
import BookUploadIcon from "@/components/icons/BookUploadIcon";
import {
  getGiftBookData,
  getMarkerBookData,
  getReceivedBookData,
  setGiftBookData,
  setMarkerBookData,
  setReceivedBookData,
} from "@/types/globalState";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookRegister() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const bookType = params.type as string; // "received" 또는 "gift"
  const [bookImage, setBookImage] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookPubDate, setBookPubDate] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled) {
      setBookImage(result.assets[0].uri);
    }
  };

  const handleRegister = () => {
    if (bookImage && bookTitle.trim()) {
      // 사용자가 등록한 책 정보를 전역변수에 저장
      const registeredBook = {
        id: `custom_${Date.now()}`, // 고유 ID 생성
        title: bookTitle.trim(),
        author: bookAuthor.trim(),
        cover: { uri: bookImage },
      };

      // bookType에 따라 적절한 전역변수에 저장
      console.log("bookType 확인:", bookType);
      if (bookType === "received") {
        setReceivedBookData(registeredBook);
        console.log(
          "선물받은 책 등록 완료 - 전역변수에 저장됨:",
          registeredBook,
        );
        console.log("전역변수 확인:", getReceivedBookData());
        // 북챌린지 인증하기 화면으로 이동
        router.push("/maru/challengeCertification");
      } else if (bookType === "gift") {
        setGiftBookData(registeredBook);
        console.log("선물할 책 등록 완료 - 전역변수에 저장됨:", registeredBook);
        console.log("전역변수 확인:", getGiftBookData());
        // 북챌린지 인증하기 화면으로 이동
        router.push("/maru/challengeCertification");
      } else if (bookType === "marker") {
        setMarkerBookData(registeredBook);
        console.log(
          "마커 등록용 책 등록 완료 - 전역변수에 저장됨:",
          registeredBook,
        );
        console.log("전역변수 확인:", getMarkerBookData());
        // 마커 등록 화면으로 돌아가기
        router.back();
      } else {
        console.log("알 수 없는 bookType:", bookType);
      }
    }
  };

  const isFormValid =
    bookImage && bookTitle.trim() && bookAuthor.trim() && bookPubDate.trim();

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
          <Text style={styles.headerTitle}>도서 직접 등록</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 책 이미지 업로드 섹션 */}
        <View style={styles.imageSection}>
          <TouchableOpacity
            style={styles.imageUploadContainer}
            onPress={pickImage}
          >
            {bookImage ? (
              <Image source={{ uri: bookImage }} style={styles.uploadedImage} />
            ) : (
              <Text style={styles.plusText}>+</Text>
            )}
          </TouchableOpacity>
          <BookUploadIcon width={180} height={60} />
        </View>
        {/* 도서 제목 입력 섹션 */}
        <View style={styles.titleSection}>
          <Text style={styles.sectionTitle}>도서 제목</Text>
          <TextInput
            style={styles.titleInput}
            value={bookTitle}
            onChangeText={setBookTitle}
            placeholder="도서 제목을 적어주세요."
            placeholderTextColor="#9D9896"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* 저자 입력 섹션 */}
        <View style={styles.authorSection}>
          <Text style={styles.sectionTitle}>저자</Text>
          <TextInput
            style={styles.authorInput}
            value={bookAuthor}
            onChangeText={setBookAuthor}
            placeholder="저자 이름을 적어주세요."
            placeholderTextColor="#9D9896"
          />
        </View>

        {/* 출판년도 입력 섹션 */}
        <View style={styles.pubDateSection}>
          <Text style={styles.sectionTitle}>출판년도</Text>
          <TextInput
            style={styles.pubDateInput}
            value={bookPubDate}
            onChangeText={setBookPubDate}
            placeholder="출판년도를 적어주세요."
            placeholderTextColor="#9D9896"
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
      </ScrollView>

      {/* 도서 등록하기 버튼 */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={[
            styles.registerButton,
            !isFormValid && styles.registerButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={!isFormValid}
        >
          <Text style={styles.registerButtonText}>도서 등록하기</Text>
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  headerSpacer: {
    width: 30,
  },
  imageSection: {
    marginTop: 0,
    padding: 20,
    alignItems: "center",
    gap: 5,
  },
  imageUploadContainer: {
    width: 150,
    height: 214,
    borderWidth: 2,
    borderColor: "#DBD6D3",
    borderStyle: "dashed",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  plusText: {
    fontSize: 48,
    color: "#9D9896",
    fontFamily: "SUIT-700",
  },
  uploadText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
    textAlign: "center",
    lineHeight: 20,
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 6,
  },
  titleSection: {
    padding: 20,
    paddingTop: 0,
  },
  authorSection: {
    padding: 20,
    paddingTop: 0,
  },
  pubDateSection: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "SUIT-700",
    color: "#000000",
    marginBottom: 15,
  },
  titleInput: {
    minHeight: 52,
    padding: 15,
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderRadius: 5,
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#000000",
    textAlignVertical: "top",
  },
  authorInput: {
    height: 52,
    padding: 15,
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderRadius: 5,
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#000000",
  },
  pubDateInput: {
    height: 52,
    padding: 15,
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderRadius: 5,
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#000000",
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
});
