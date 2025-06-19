// app/maru/_layout.tsx
import { Stack, usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

// 상단 탭 컴포넌트
function CustomHeader() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push("/maru/bookmark")}
      >
        <Text
          style={[
            styles.tabText,
            pathname === "/maru/bookmark" && styles.activeTabText,
          ]}
        >
          공간책갈피
        </Text>
        {pathname === "/maru/bookmark" && (
          <View style={styles.activeIndicator} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tab}
        onPress={() => router.push("/maru/challenge")}
      >
        <Text
          style={[
            styles.tabText,
            pathname === "/maru/challenge" && styles.activeTabText,
          ]}
        >
          북챌린지
        </Text>
        {pathname === "/maru/challenge" && (
          <View style={styles.activeIndicator} />
        )}
      </TouchableOpacity>
    </View>
  );
}

// 메인 레이아웃
export default function MaruLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <CustomHeader />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#FFFFFF" },
          animation: "none",
        }}
      >
        <Stack.Screen name="bookmark" />
        <Stack.Screen name="challenge" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  tab: {
    position: "relative",
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 17,
    color: "#716C69",
    fontFamily: "SUIT-700",
  },
  activeTabText: {
    color: "#000000",
    fontFamily: "SUIT-700",
  },
  activeIndicator: {
    marginTop: 5,
    height: 2,
    width: "50%",
    backgroundColor: "#000000",
    alignSelf: "center",
    borderRadius: 5,
  },
});
