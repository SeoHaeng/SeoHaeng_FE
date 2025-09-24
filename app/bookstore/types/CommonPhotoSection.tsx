import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface CommonPhotoSectionProps {
  placeImageUrls: string[];
  placeName: string;
}

const { width } = Dimensions.get("window");

export default function CommonPhotoSection({
  placeImageUrls,
  placeName,
}: CommonPhotoSectionProps) {
  if (!placeImageUrls || placeImageUrls.length === 0) {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>사진</Text>
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>등록된 사진이 없습니다.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>사진</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.photoContainer}
      >
        {placeImageUrls.map((imageUrl, index) => (
          <Image
            key={index}
            source={{ uri: imageUrl }}
            style={styles.photo}
            resizeMode="cover"
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 15,
  },
  photoContainer: {
    paddingRight: 20,
  },
  photo: {
    width: width * 0.6,
    height: 200,
    borderRadius: 12,
    marginRight: 15,
  },
  noImageContainer: {
    alignItems: "center",
    padding: 40,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  noImageText: {
    fontSize: 17,
    color: "#999999",
  },
});
