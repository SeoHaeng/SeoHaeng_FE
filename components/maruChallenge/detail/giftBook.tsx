// components/GiftBook.tsx
import EmptyBookIcon from "@/components/icons/EmptyBookIcon";
import { StyleSheet, Text, View } from "react-native";

type BookStatus = "선물받은 책" | "선물할 책";

interface GiftBookProps {
  title?: string;
  author?: string;
  status: BookStatus;
  icon?: React.ReactNode;
}

export default function GiftBook({
  title,
  author,
  status,
  icon,
}: GiftBookProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <EmptyBookIcon width={63} height={90} style={styles.bookImage} />
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{title}</Text>
          <Text style={styles.bookAuthor}>{author}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{status}</Text>
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
    gap: 20,
  },
  bookImage: {
    width: 63,
    height: 90,
    position: "absolute",
    top: -18,
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
    fontSize: 13,
    fontFamily: "SUIT-700",
  },
  bookAuthor: {
    fontSize: 12,
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
    fontSize: 12,
    fontFamily: "SUIT-700",
  },
});
