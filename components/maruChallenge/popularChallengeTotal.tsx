import ScrapIcon from "@/components/icons/ScrapIcon";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PopularChallengeItemProps {
  userName: string;
  date: string;
  text: string;
  imageSource?: any;
  bookImageSource?: string;
  receivedBookImage?: string;
  profileImageUrl?: string;
  bookName: string;
  bookAuthor: string;
  year: string;
  likedByMe?: boolean;
  onPress?: () => void;
}

export default function PopularChallengeTotal({
  userName,
  date,
  text,
  bookImageSource,
  receivedBookImage,
  profileImageUrl,
  bookName,
  bookAuthor,
  year,
  likedByMe,
  onPress,
}: PopularChallengeItemProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <View style={styles.userInfoContainer}>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <View style={styles.userInfo}>
                <Image
                  source={
                    profileImageUrl
                      ? { uri: profileImageUrl }
                      : require("@/assets/images/인기챌린지 사진.png")
                  }
                  style={styles.profileImage}
                />
                <View style={styles.userHeader}>
                  <Text style={styles.username}>{userName}</Text>
                  <Text style={styles.timeStamp}>{date}</Text>
                </View>
              </View>

              <Text style={styles.description}>
                {text.length > 40 ? `${text.slice(0, 40)}...` : text}
              </Text>
            </View>
            <Image
              source={
                bookImageSource
                  ? { uri: bookImageSource }
                  : require("@/assets/images/인기챌린지 책.png")
              }
              style={styles.bookImage}
            />
          </View>

          <View style={styles.bookInfoContainer}>
            <View style={styles.bookDetails}>
              <Image
                source={
                  receivedBookImage
                    ? { uri: receivedBookImage }
                    : require("@/assets/images/물고기는 존재하지 않는다.png")
                }
                style={styles.receivedBookImage}
              />
              <View style={styles.bookTextContainer}>
                <Text style={styles.bookTitle}>{bookName}</Text>
                <Text style={styles.bookAuthor}>{bookAuthor}</Text>
                <View style={styles.tagContainer}>
                  <View style={styles.yearTag}>
                    <Text style={styles.tagText}>{year}</Text>
                  </View>
                  <View style={styles.scrapButton}>
                    <ScrapIcon
                      size={9}
                      color={likedByMe ? "#302E2D" : "#716C69"}
                    />
                  </View>
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
    width: 356,
    height: 236,
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#DBD6D3",
    padding: 17,
    position: "relative",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  profileImage: {
    width: 43,
    height: 43,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userHeader: {
    flexDirection: "column",
    gap: 5,
  },
  username: {
    fontSize: 14,
    fontFamily: "SUIT-700",
  },
  timeStamp: {
    fontSize: 10,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  description: {
    fontSize: 11,
    fontFamily: "SUIT-500",
    color: "#716C69",
    width: 190,
    lineHeight: 15,
  },
  bookImage: {
    width: 87,
    height: 87,
    borderRadius: 5,
  },
  receivedBookImage: {
    width: 50,
    height: 70,
    borderRadius: 3,
    marginRight: 10,
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
    fontSize: 12,
    fontFamily: "SUIT-500",
  },
  bookAuthor: {
    fontSize: 11,
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
    fontSize: 11,
  },
  menuIcon: {
    margin: 5,
  },
});
