// components/challenge/PopularChallengeBase.tsx
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface PopularChallengeProps {
  id: number;
  userName: string;
  date: string;
  text: string;
  bookName: string;
  bookAuthor: string;
  year: string;
  variant?: "default" | "total";
  onPress?: () => void;
}

export default function PopularChallengeBase({
  id,
  userName,
  date,
  text,
  bookName,
  bookAuthor,
  year,
  variant = "default",
  onPress,
}: PopularChallengeProps) {
  const isTotal = variant === "total";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, isTotal && styles.totalContainer]}
    >
      {!isTotal && <View style={styles.profileImage} />}

      <View style={styles.contentContainer}>
        <View style={styles.userInfoContainer}>
          <View
            style={{ flexDirection: "column", justifyContent: "space-between" }}
          >
            <View style={[styles.userInfo, isTotal && styles.userInfoTotal]}>
              {isTotal && <View style={styles.totalProfileImage} />}
              <View style={styles.userHeader}>
                <Text style={styles.username} allowFontScaling={false}>
                  {userName}
                </Text>
                <Text style={styles.timeStamp} allowFontScaling={false}>
                  {date}일 전
                </Text>
              </View>
            </View>
            <Text style={styles.description} allowFontScaling={false}>
              {text}
            </Text>
          </View>
          <View style={styles.bookImage} />
        </View>

        <View style={styles.bookInfoContainer}>
          <View style={styles.bookDetails}>
            <View style={styles.receivedBookImage} />
            <View style={styles.bookTextContainer}>
              <Text style={styles.bookTitle} allowFontScaling={false}>
                {bookName}
              </Text>
              <Text style={styles.bookAuthor} allowFontScaling={false}>
                {bookAuthor}
              </Text>
              <View style={styles.tagContainer}>
                <View style={styles.yearTag}>
                  <Text style={styles.tagText} allowFontScaling={false}>
                    {year}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 334,
    height: 236,
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    padding: 20,
    position: "relative",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  totalContainer: {
    width: 356,
  },
  profileImage: {
    position: "absolute",
    top: -40,
    zIndex: 100,
    left: 15,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#C5BFBB",
  },
  totalProfileImage: {
    width: 43,
    height: 43,
    borderRadius: 21.5,
    backgroundColor: "#C5BFBB",
  },
  contentContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    height: "100%",
  },
  userInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  userInfoTotal: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userHeader: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },
  username: {
    fontSize: 15,
    fontFamily: "SUIT-700",
  },
  timeStamp: {
    fontSize: 11,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  description: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#716C69",
    width: 190,
    lineHeight: 15,
  },
  bookImage: {
    width: 87,
    height: 87,
    backgroundColor: "#C5BFBB",
    borderRadius: 5,
  },
  receivedBookImage: {
    width: 50,
    height: 70,
    borderRadius: 3,
    marginRight: 10,
    backgroundColor: "#C5BFBB",
  },
  bookInfoContainer: {
    width: "100%",
    height: 92,
    backgroundColor: "#DBD6D3",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#C5BFBB",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookDetails: {
    flexDirection: "row",
    gap: 5,
  },
  bookTextContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  bookTitle: {
    fontSize: 13,
    fontFamily: "SUIT-500",
  },
  bookAuthor: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  tagContainer: {
    flexDirection: "row",
    gap: 5,
  },
  yearTag: {
    width: 42,
    height: 22,
    backgroundColor: "#C5BFBB",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  scrapButton: {
    width: 25,
    height: 22,
    backgroundColor: "#C5BFBB",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  tagText: {
    color: "white",
    fontFamily: "SUIT-500",
    fontSize: 12,
  },
  menuIcon: {
    margin: 5,
  },
});
