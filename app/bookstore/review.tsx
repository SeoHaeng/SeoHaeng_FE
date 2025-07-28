import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ReviewTab() {
  const reviews = [
    {
      id: 1,
      username: "유딘딘",
      date: "2025.05.13 토",
      rating: 5,
      text: "너무너무 좋았어요!!!\n다음에 또 올게욤~ 그때까지 망하지 말아주세요 ㅎㅎ",
      images: [require("@/assets/images/인기챌린지 사진.png")],
    },
    {
      id: 2,
      username: "독서광",
      date: "2025.05.12 금",
      rating: 4,
      text: "분위기가 정말 좋아요! 책도 많고 커피도 맛있어요.\n다음에 친구들과 함께 올 예정입니다.",
      images: [
        require("@/assets/images/인기챌린지 사진.png"),
        require("@/assets/images/북챌린지 사진.png"),
        require("@/assets/images/인기챌린지 책.png"),
      ],
    },
    {
      id: 3,
      username: "책벌레123",
      date: "2025.05.10 수",
      rating: 5,
      text: "북챌린지 이벤트도 진행하고 있어서 더욱 특별한 경험이었어요.\n정말 추천합니다!",
      images: [require("@/assets/images/북챌린지 사진.png")],
    },
  ];

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Image
            key={star}
            source={require("@/assets/images/Star.png")}
            style={[
              styles.star,
              { tintColor: star <= rating ? "#FF9900 " : "#C5BFBB" },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 리뷰 요약 */}
      <View style={styles.reviewSummary}>
        <Text style={styles.reviewCount}>리뷰 212</Text>
        <View style={styles.ratingContainer}>
          <Image
            source={require("@/assets/images/Star.png")}
            style={[styles.star, { tintColor: "#FFD700" }]}
          />
          <Text style={styles.ratingText}>4.2</Text>
        </View>
      </View>

      {/* 후기 남기기 버튼 */}
      <TouchableOpacity style={styles.writeReviewButton}>
        <Text style={styles.writeReviewText}>나도 후기 남기기</Text>
        <Image
          source={require("@/assets/images/서점 리뷰 더보기 화살표.png")}
          style={{ tintColor: "#4D4947" }}
        />
      </TouchableOpacity>

      {/* 개별 리뷰들 */}
      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewItem}>
          {/* 사용자 정보 */}
          <View style={styles.reviewHeader}>
            <View style={styles.userInfo}>
              <View style={styles.userAvatar} />
              <Text style={styles.username}>{review.username}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
            <View style={styles.reviewMeta}>{renderStars(review.rating)}</View>
          </View>

          {/* 리뷰 텍스트 */}
          <Text style={styles.reviewText}>{review.text}</Text>

          {/* 리뷰 이미지들 */}
          {review.images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imagesContainer}
            >
              {review.images.map((image, index) => (
                <Image
                  key={index}
                  source={image}
                  style={[
                    styles.reviewImage,
                    review.images.length === 1
                      ? styles.singleImage
                      : styles.multipleImage,
                  ]}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  reviewSummary: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  reviewCount: {
    fontSize: 13,
    fontFamily: "SUIT-700",
    color: "#262423",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  ratingText: {
    fontSize: 13,
    fontFamily: "SUIT-8 00",
    color: "#000000",
  },
  star: {
    width: 16,
    height: 16,
  },
  writeReviewButton: {
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
  },
  writeReviewText: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#4D4947",
  },
  reviewItem: {
    marginBottom: 10,
    paddingBottom: 20,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userAvatar: {
    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: "#9D9896",
  },
  username: {
    fontSize: 14,
    fontFamily: "SUIT-700",
    color: "#716C69",
  },
  reviewMeta: {
    alignItems: "flex-end",
    gap: 5,
  },
  reviewDate: {
    fontSize: 11,
    fontFamily: "SUIT-500",
    color: "#C5BFBB",
  },
  starsContainer: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#000000",
    lineHeight: 20,
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  reviewImage: {
    borderRadius: 8,
  },
  singleImage: {
    width: 200,
    height: 150,
  },
  multipleImage: {
    width: 150,
    height: 150,
  },
});
