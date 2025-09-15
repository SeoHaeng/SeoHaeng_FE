// app/maru/_layout.tsx
import Foundation from "@expo/vector-icons/Foundation";
import { Stack, usePathname, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 상단 탭 컴포넌트
function CustomHeader() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.header}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => router.push("/maru/bookmark")}
        >
          <Text
            style={[
              styles.tabText,
              (pathname === "/maru/bookmark" || pathname === "/maru") &&
                styles.activeTabText,
            ]}
            allowFontScaling={false}
          >
            공간책갈피
          </Text>
          {(pathname === "/maru/bookmark" || pathname === "/maru") && (
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
            allowFontScaling={false}
          >
            북챌린지
          </Text>
          {pathname === "/maru/challenge" && (
            <View style={styles.activeIndicator} />
          )}
        </TouchableOpacity>
      </View>
      {pathname === "/maru/challenge" && (
        <TouchableOpacity
          style={styles.infoButton}
          onPress={() => router.push("/maru/challengeInfo")}
        >
          <Foundation name="info" size={32} color="#716C69" />
        </TouchableOpacity>
      )}
    </View>
  );
}

// 메인 레이아웃
export default function MaruLayout() {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F8F4F2" }}
      edges={["top"]}
    >
      <CustomHeader />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F8F4F2" },
          animation: "none",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="bookmark" />
        <Stack.Screen name="challenge" />
        <Stack.Screen name="challengeInfo" />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F4F2",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    position: "relative",
    height: 50,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 18,
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
  infoButton: {
    marginRight: 5,
    padding: 5,
  },
});
