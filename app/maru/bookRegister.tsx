import BackIcon from "@/components/icons/BackIcon";
import BookUploadIcon from "@/components/icons/BookUploadIcon";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
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
  const [bookImage, setBookImage] = useState<string | null>(null);
  const [bookTitle, setBookTitle] = useState("");

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
      console.log("도서 등록:", { bookImage, bookTitle });
      router.back();
    }
  };

  const isFormValid = bookImage && bookTitle.trim();

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
            placeholder="나만의 장소 이름을 적어주세요. ex) 해변 앞 구불구불길"
            placeholderTextColor="#9D9896"
            multiline
            textAlignVertical="top"
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
    paddingHorizontal: 20,
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
    marginTop: 50,
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
  sectionTitle: {
    fontSize: 16,
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
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#000000",
    textAlignVertical: "top",
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
