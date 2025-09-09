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
  onPress?: () => void;
}

export default function BookmarkCard({
  imageUrl,
  title,
  address,
  templateId,
  width = 177,
  height = 177,
  onPress,
}: BookmarkCardProps) {
  const content = (
    <View style={[styles.bookmarkCard, { width, height }]}>
      <BookmarkTemplate width={width} height={height} templateId={templateId} />

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.mainImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.mainTitle} allowFontScaling={false}>
          {title.length > 8 ? `${title.slice(0, 8)}...` : title}
        </Text>
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
    fontSize: 17,
    fontFamily: "Gangwon",
    color: "#FFFFFF",
    marginBottom: 4,
  },
});
