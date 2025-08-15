import BookmarkTemplate from "@/components/icons/bookmarkTemplate/BookmarkTemplate";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BookmarkCardProps {
  imageUrl: string;
  title: string;
  address: string;
  templateId: number;
  width?: number;
  height?: number;
  backgroundColor?: string;
  onPress?: () => void;
}

export default function BookmarkCard({
  imageUrl,
  title,
  address,
  templateId,
  width = 177,
  height = 177,
  backgroundColor,
  onPress,
}: BookmarkCardProps) {
  // templateId에 따른 배경색 설정
  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor; // 사용자가 직접 지정한 색상 우선

    switch (templateId) {
      case 1:
        return "#FF5E29"; // 오렌지색
      case 2:
        return "#B9FF66"; // 연한 초록색
      case 3:
        return "#75615B"; // 갈색
      case 4:
        return "#8A73FF"; // 보라색
      default:
        return "#FF6B35"; // 기본 색상
    }
  };

  const finalBackgroundColor = getBackgroundColor();

  const content = (
    <View style={[styles.bookmarkCard, { width, height }]}>
      <BookmarkTemplate
        width={width}
        height={height}
        color={finalBackgroundColor}
      />

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.mainTitle}>{title}</Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  bookmarkCard: {
    position: "relative",
  },
  imageContainer: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    height: 120,
    borderRadius: 8,
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  textContainer: {
    position: "absolute",
    bottom: 15,
    left: 13,
  },
  mainTitle: {
    fontSize: 19,
    fontFamily: "Gangwon",
    color: "#FFFFFF",
    marginBottom: 4,
  },
});
