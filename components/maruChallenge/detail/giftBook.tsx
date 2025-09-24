// components/GiftBook.tsx
import EmptyBookIcon from "@/components/icons/EmptyBookIcon";
import { Image, StyleSheet, Text, View } from "react-native";

type BookStatus = "선물받은 책" | "선물할 책";

interface GiftBookProps {
  title?: string;
  author?: string;
  status: BookStatus;
  icon?: React.ReactNode;
  bookImage?: { uri: string };
}

export default function GiftBook({
  title,
  author,
  status,
  icon,
  bookImage,
}: GiftBookProps) {
  // 저자명의 ^를 ,로 변환하는 함수
  const formatAuthor = (authorName: string) => {
    return authorName.replace(/\^/g, ", ");
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {bookImage && bookImage.uri ? (
          <Image source={bookImage} style={styles.bookImage} />
        ) : (
          <EmptyBookIcon width={63} height={90} style={styles.bookImage} />
        )}
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <View style={styles.bookInfo}>
          <Text
            style={styles.bookTitle}
            numberOfLines={1}
            allowFontScaling={false}
          >
            {title && title.length > 11 ? `${title.slice(0, 11)}...` : title}
          </Text>
          <Text style={styles.bookAuthor} allowFontScaling={false}>
            {formatAuthor(author || "")}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText} allowFontScaling={false}>
            {status}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
    marginBottom: 5,
  },
  container: {
    width: 170,
    height: 187,
    borderRadius: 5,
    borderWidth: 1,
    backgroundColor: "#EEE9E6",
    borderColor: "#DBD6D3",
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    gap: 15,
  },
  bookImage: {
    width: 63,
    height: 90,
    position: "absolute",
    top: -18,
    borderRadius: 3,
  },
  iconContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  menuIcon: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  bookInfo: {
    flexDirection: "column",
    alignItems: "center",
    gap: 5,
  },
  bookTitle: {
    fontSize: 14,
    fontFamily: "SUIT-700",
  },
  bookAuthor: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  badge: {
    backgroundColor: "#DBD6D3",
    borderRadius: 44,
    width: 93,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 13,
    fontFamily: "SUIT-700",
  },
});
