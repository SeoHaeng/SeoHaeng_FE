// components/BookStoreItem.tsx
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BookStoreItemProps {
  name: string;
  location: string;
  imageSource?: any;
  onPress?: () => void;
}

export default function BookStoreItem({
  name,
  location,
  imageSource,
  onPress,
}: BookStoreItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={imageSource || require("@/assets/images/북챌린지 사진.png")}
      />
      <Text style={styles.storeName}>{name}</Text>
      <View style={styles.locationButton}>
        <Text style={styles.locationText}>{location}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    gap: 7,
    height: 140,
  },
  storeName: {
    fontFamily: "SUIT-700",
  },
  locationButton: {
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    width: 41,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  locationText: {
    fontFamily: "SUIT-500",
    fontSize: 11,
    color: "#9D9896",
  },
});
