import DatePickerModal from "@/components/DatePickerModal";
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

export default function WriteReview() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [imageCount, setImageCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Image
              source={require("@/assets/images/Star.png")}
              style={[
                styles.star,
                { tintColor: star <= rating ? "#FF9900" : "#C5BFBB" },
              ]}
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Image source={require("@/assets/images/Back.png")} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>후기 작성</Text>
        </View>

        {/* 서점 정보 */}
        <View style={styles.bookstoreInfo}>
          <View style={styles.bookstoreImage} />
          <View style={styles.bookstoreDetails}>
            <View style={styles.bookstoreHeader}>
              <Text style={styles.bookstoreName}>이스트씨네</Text>
              <View style={styles.badgeContainer}>
                <Image source={require("@/assets/images/bookStoreBadge.png")} />
                <Text style={styles.badgeText}>독립서점</Text>
              </View>
            </View>
            <View style={styles.locationContainer}>
              <Image
                source={require("@/assets/images/place.png")}
                style={{ width: 12, height: 12 }}
              />
              <Text style={styles.locationText}>
                강원 강릉시 강동면 현화로 973 1층
              </Text>
            </View>
          </View>
        </View>

        {/* 평점 섹션 */}
        <View style={styles.ratingSection}>
          {renderStars()}
          <View style={styles.ratingTooltip}>
            <Text style={styles.tooltipText}>공간에 만족하셨나요?</Text>
          </View>
        </View>

        {/* 이미지 업로드 섹션 */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>이미지를 추가해주세요</Text>
          <TouchableOpacity style={styles.imageUploadButton}>
            <View style={styles.uploadIcon}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
            <Text style={styles.imageCount}>{imageCount}/10</Text>
          </TouchableOpacity>
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
            <Image
              source={require("@/assets/images/three_dote.png")}
              style={{ width: 16, height: 16 }}
            />
          </TouchableOpacity>
        </View>

        {/* 후기 작성 섹션 */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>후기를 작성해주세요</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
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
        </View>

        {/* 작성 완료 버튼 */}
        <TouchableOpacity style={styles.completeButton}>
          <Text style={styles.completeButtonText}>작성 완료</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 달력 모달 */}
      <DatePickerModal
        visible={isDatePickerVisible}
        onClose={() => setIsDatePickerVisible(false)}
        onDateSelect={(date) => setSelectedDate(date)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
    backgroundColor: "#FFFFFF",
    marginBottom: 10,
  },
  bookstoreImage: {
    width: 80,
    height: 80,
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
    fontSize: 18,
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
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  ratingSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  star: {
    width: 40,
    height: 40,
  },
  ratingTooltip: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  tooltipText: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  imageSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: "SUIT-600",
    color: "#000000",
    marginBottom: 15,
  },
  imageUploadButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    height: 100,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E8E3E0",
    borderStyle: "dashed",
  },
  uploadIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#E8E3E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  plusIcon: {
    fontSize: 20,
    color: "#9D9896",
    fontWeight: "bold",
  },
  imageCount: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  dateSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 10,
  },
  dateInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  datePlaceholder: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  selectedDateText: {
    color: "#000000",
  },
  reviewSection: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 20,
  },
  textInputContainer: {
    position: "relative",
  },
  textInput: {
    height: 120,
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#000000",
    textAlignVertical: "top",
  },
  characterCount: {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  completeButton: {
    backgroundColor: "#E8E3E0",
    paddingVertical: 15,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 30,
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#716C69",
  },
});
