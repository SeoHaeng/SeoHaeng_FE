import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Linking,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TermsScreen = () => {
  // 이용약관 보기 링크 처리
  const handleTermsLink = async () => {
    const url =
      "https://dog-sweatpants-971.notion.site/25d1744decc880798dabc486a20344f4";

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("오류", "링크를 열 수 없습니다.");
      }
    } catch (error) {
      console.error("링크 열기 실패:", error);
      Alert.alert("오류", "링크를 열 수 없습니다.");
    }
  };

  // 개인정보 수집 및 이용 보기 링크 처리
  const handlePrivacyLink = async () => {
    const url =
      "https://dog-sweatpants-971.notion.site/25d1744decc88082824ec60209d2dcf5";

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("오류", "링크를 열 수 없습니다.");
      }
    } catch (error) {
      console.error("링크 열기 실패:", error);
      Alert.alert("오류", "링크를 열 수 없습니다.");
    }
  };

  // 위치 기반 서비스 이용약관 보기 링크 처리
  const handleLocationServiceLink = async () => {
    const url =
      "https://dog-sweatpants-971.notion.site/25d1744decc880529587ea2423c0b015?source=copy_link";

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("오류", "링크를 열 수 없습니다.");
      }
    } catch (error) {
      console.error("링크 열기 실패:", error);
      Alert.alert("오류", "링크를 열 수 없습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          이용약관
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Terms Menu Items */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={handleTermsLink}>
          <View style={styles.menuItemContent}>
            <View style={styles.iconContainer}>
              <AntDesign name="infocirlceo" size={20} color="#666666" />
            </View>
            <Text style={styles.menuItemText} allowFontScaling={false}>
              이용약관 보기
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handlePrivacyLink}>
          <View style={styles.menuItemContent}>
            <View style={styles.iconContainer}>
              <AntDesign name="infocirlceo" size={20} color="#666666" />
            </View>
            <Text style={styles.menuItemText} allowFontScaling={false}>
              개인정보 수집 및 이용약관 보기
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleLocationServiceLink}
        >
          <View style={styles.menuItemContent}>
            <View style={styles.iconContainer}>
              <AntDesign name="infocirlceo" size={20} color="#666666" />
            </View>
            <Text style={styles.menuItemText} allowFontScaling={false}>
              위치 기반 서비스 이용약관 보기
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 19,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  placeholder: {
    width: 40,
  },
  menuContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuItem: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 17,
    fontFamily: "SUIT-500",
    color: "#333333",
    flex: 1,
  },
});

export default TermsScreen;
