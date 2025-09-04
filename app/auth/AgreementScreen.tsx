import { postUserAgreementAPI } from "@/types/api";
import Entypo from "@expo/vector-icons/Entypo";

import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const AgreementScreen = () => {
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    locationService: false,
  });

  const allAgreed =
    agreements.termsOfService &&
    agreements.privacyPolicy &&
    agreements.locationService;

  const toggleAgreement = (type: keyof typeof agreements) => {
    setAgreements((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const toggleAllAgreements = () => {
    const newValue = !allAgreed;
    setAgreements({
      termsOfService: newValue,
      privacyPolicy: newValue,
      locationService: newValue,
    });
  };

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

  const handleContinue = async () => {
    if (!allAgreed) {
      Alert.alert("알림", "모든 필수 약관에 동의해주세요.");
      return;
    }

    try {
      const response = await postUserAgreementAPI({
        termsOfServiceAgreed: agreements.termsOfService,
        privacyPolicyAgreed: agreements.privacyPolicy,
        locationServiceAgreed: agreements.locationService,
      });

      if (response.isSuccess) {
        console.log("약관 동의 성공:", response.result);
        // 메인 화면으로 이동
        router.replace("/(tabs)");
      } else {
        Alert.alert("오류", response.message || "약관 동의에 실패했습니다.");
      }
    } catch (error) {
      console.error("약관 동의 API 호출 실패:", error);
      Alert.alert("오류", "약관 동의 중 오류가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>약관에 동의해주세요</Text>

        {/* 모두 동의 */}
        <TouchableOpacity
          style={styles.allAgreeSection}
          onPress={toggleAllAgreements}
        >
          <View style={[styles.checkbox, allAgreed && styles.checkboxChecked]}>
            <Entypo name="check" size={15} color="white" />
          </View>
          <Text style={styles.allAgreeText}>모두 동의</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        {/* 개별 약관 */}
        <TouchableOpacity
          style={styles.agreementItem}
          onPress={() => toggleAgreement("termsOfService")}
        >
          <View
            style={[
              styles.checkbox,
              agreements.termsOfService && styles.checkboxChecked,
            ]}
          >
            {agreements.termsOfService && (
              <Entypo name="check" size={15} color="white" />
            )}
          </View>
          <Text style={styles.agreementText}>(필수) 이용약관에 동의</Text>
          <TouchableOpacity style={styles.detailLink} onPress={handleTermsLink}>
            <Text style={styles.detailLinkText}>자세히 보기 &gt;</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.agreementItem}
          onPress={() => toggleAgreement("privacyPolicy")}
        >
          <View
            style={[
              styles.checkbox,
              agreements.privacyPolicy && styles.checkboxChecked,
            ]}
          >
            {agreements.privacyPolicy && (
              <Entypo name="check" size={15} color="white" />
            )}
          </View>
          <Text style={styles.agreementText}>
            (필수) 개인정보 수집 및 이용에 동의
          </Text>
          <TouchableOpacity
            style={styles.detailLink}
            onPress={handlePrivacyLink}
          >
            <Text style={styles.detailLinkText}>자세히 보기 &gt;</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.agreementItem}
          onPress={() => toggleAgreement("locationService")}
        >
          <View
            style={[
              styles.checkbox,
              agreements.locationService && styles.checkboxChecked,
            ]}
          >
            {agreements.locationService && (
              <Entypo name="check" size={15} color="white" />
            )}
          </View>
          <Text style={styles.agreementText}>
            (필수) 위치 기반 서비스 이용약관 동의
          </Text>
          <TouchableOpacity
            style={styles.detailLink}
            onPress={handleLocationServiceLink}
          >
            <Text style={styles.detailLinkText}>자세히 보기 &gt;</Text>
          </TouchableOpacity>
        </TouchableOpacity>

        {/* 계속하기 버튼 */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            allAgreed && styles.continueButtonActive,
          ]}
          onPress={handleContinue}
          disabled={!allAgreed}
        >
          <Text style={styles.continueButtonText}>계속하기</Text>
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
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 40,
    fontFamily: "SUIT-700",
  },
  allAgreeSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  allAgreeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginLeft: 12,
    fontFamily: "SUIT-600",
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },
  agreementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: "#4A4A4A",
    borderColor: "#4A4A4A",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  agreementText: {
    flex: 1,
    fontSize: 12,
    color: "#000000",
    marginLeft: 12,
    fontFamily: "SUIT-400",
  },
  detailLink: {
    marginLeft: 8,
  },
  detailLinkText: {
    fontSize: 11,
    textDecorationLine: "underline",
    color: "#666666",
    fontFamily: "SUIT-400",
  },
  continueButton: {
    backgroundColor: "#CCCCCC",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 40,
  },
  continueButtonActive: {
    backgroundColor: "#4A4A4A",
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "SUIT-600",
  },
});

export default AgreementScreen;
