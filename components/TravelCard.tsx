import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TravelCardProps {
  image: any;
  title: string;
  dates: string;
  duration: string;
  tags: string[];
  icon?: string;
  onPress?: () => void;
}

const TravelCard: React.FC<TravelCardProps> = ({
  image,
  title,
  dates,
  duration,
  tags,
  icon,
  onPress,
}) => (
  <TouchableOpacity style={styles.travelCard} onPress={onPress}>
    <Image source={image} style={styles.travelCardImage} />
    <View style={styles.travelCardContent}>
      <View style={styles.titleRow}>
        <Text style={styles.travelCardTitle}>{title}</Text>
      </View>
      <View style={styles.travelCardDateContainer}>
        <Text style={styles.travelCardDates}>{dates}</Text>
        <Text style={styles.travelCardDuration}>{duration}</Text>
      </View>
      <View style={styles.travelCardTags}>
        {tags.map((tag, index) => (
          <View key={index} style={styles.travelCardTag}>
            <Text style={styles.travelCardTagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  travelCard: {
    width: 300,
    height: 295,
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  travelCardImage: {
    width: "100%",
    height: 171,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    resizeMode: "cover",
  },
  travelCardContent: {
    padding: 20,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  travelCardTitle: {
    fontSize: 20,
    fontFamily: "SUIT-700",
    color: "#262423",
    flex: 1,
    marginRight: 10,
  },
  menuButton: {
    padding: 5,
  },
  menuIcon: {
    fontSize: 20,
    color: "#9D9896",
    fontFamily: "SUIT-700",
  },
  travelCardDates: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  travelCardDuration: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#4D4947",
  },
  travelCardDateContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 13,
  },
  travelCardTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  travelCardTag: {
    backgroundColor: "#C5BFBB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  travelCardTagText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#EEE9E6",
  },
});

export default TravelCard;
