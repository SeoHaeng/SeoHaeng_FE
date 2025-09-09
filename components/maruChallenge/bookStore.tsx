// components/BookStoreItem.tsx
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BookStoreItemProps {
  name: string;
  location: string;
  imageUrl?: string;
  onPress?: () => void;
}

export default function BookStoreItem({
  name,
  location,
  imageUrl,
  onPress,
}: BookStoreItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.storeImage} />
      ) : (
        <View style={styles.storeImage} />
      )}
      <Text style={styles.storeName} allowFontScaling={false}>
        {name.length > 6 ? `${name.slice(0, 6)}...` : name}
      </Text>
      <View style={styles.locationButton}>
        <Text style={styles.locationText} allowFontScaling={false}>
          {location}
        </Text>
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
  storeImage: {
    width: 82,
    height: 82,
    borderRadius: 50,
    backgroundColor: "#C5BFBB",
  },
  storeName: {
    fontFamily: "SUIT-700",
    fontSize: 14,
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
    fontSize: 13,
    color: "#9D9896",
  },
});
