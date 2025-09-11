import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface PhotoTabProps {
  placeImageUrls?: string[];
}

export default function PhotoTab({ placeImageUrls }: PhotoTabProps) {
  return (
    <View style={styles.tabContent}>
      <Text style={styles.tabTitle} allowFontScaling={false}>
        장소 사진
      </Text>
      <View style={styles.photoGrid}>
        {placeImageUrls && placeImageUrls.length > 0 ? (
          placeImageUrls.map((imageUrl, index) => (
            <Image
              key={index}
              source={{ uri: imageUrl }}
              style={styles.photoItem}
            />
          ))
        ) : (
          <Text style={styles.noPhotos} allowFontScaling={false}>
            사진이 없습니다.
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    minHeight: 400,
  },
  tabTitle: {
    fontSize: 14,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 15,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoItem: {
    width: "48%",
    height: 150,
    borderRadius: 8,
  },
  noPhotos: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    textAlign: "center",
    marginTop: 20,
  },
});
