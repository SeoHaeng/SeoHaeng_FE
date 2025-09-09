import { StyleSheet, Text, View } from "react-native";

interface StatusBadgeProps {
  isOpen: boolean;
}

export default function StatusBadge({ isOpen }: StatusBadgeProps) {
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.statusText,
          isOpen ? styles.openText : styles.closedText,
        ]}
      >
        {isOpen ? "영업중" : "영업종료"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(56, 113, 224, 0.3)",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
  },
  openText: {
    color: "#3871E0",
  },
  closedText: {
    color: "#C5BFBB",
  },
});
