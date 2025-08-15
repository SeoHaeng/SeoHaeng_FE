import { Image, StyleSheet, Text, View } from "react-native";

interface PopularChallengeItemProps {
  userName: string;
  date: string;
  text: string;
  imageSource?: any;
  color?: string;
}

export default function ChallengeComment({
  userName,
  date,
  text,
  color,
}: PopularChallengeItemProps) {
  return (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Image
          source={require("@/assets/images/인기챌린지 사진.png")}
          style={styles.commentAvatar}
        />
        <View style={styles.commentInfo}>
          <Text style={[styles.commentUsername, color && { color }]}>
            {userName}
          </Text>
          <Text style={styles.commentDate}>{date}</Text>
        </View>
      </View>
      <Text style={[styles.description, color && { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  commentContainer: {
    flexDirection: "column",
    gap: 10,
  },
  commentHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  commentAvatar: {
    width: 35,
    height: 35,
  },
  commentInfo: {
    flexDirection: "column",
    gap: 3,
  },
  commentUsername: {
    fontSize: 13,
    fontFamily: "SUIT-700",
  },
  commentDate: {
    fontSize: 11,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  description: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    lineHeight: 20,
  },
});
