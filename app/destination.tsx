import CommonButton from "@/components/CommonButton";
import BackIcon from "@/components/icons/BackIcon";
import { useGlobalState } from "@/types/globalState";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 이미지들을 직접 import
import 강릉 from "@/assets/images/gangwondo/강릉.jpg";
import 고성 from "@/assets/images/gangwondo/고성.jpg";
import 동해 from "@/assets/images/gangwondo/동해.jpg";
import 삼척 from "@/assets/images/gangwondo/삼척.jpg";
import 속초 from "@/assets/images/gangwondo/속초.jpg";
import 양구 from "@/assets/images/gangwondo/양구.jpg";
import 양양 from "@/assets/images/gangwondo/양양.jpg";
import 영월 from "@/assets/images/gangwondo/영월.jpg";
import 원주 from "@/assets/images/gangwondo/원주.jpg";
import 인제 from "@/assets/images/gangwondo/인제.jpg";
import 정선 from "@/assets/images/gangwondo/정선.jpg";
import 철원 from "@/assets/images/gangwondo/철원.jpg";
import 춘천 from "@/assets/images/gangwondo/춘천.jpg";
import 태백 from "@/assets/images/gangwondo/태백.jpg";
import 평창 from "@/assets/images/gangwondo/평창.jpg";
import 홍천 from "@/assets/images/gangwondo/홍천.jpg";
import 화천 from "@/assets/images/gangwondo/화천.jpg";
import 횡성 from "@/assets/images/gangwondo/횡성.jpg";

// destinations 배열 제거 - 각 지역을 직접 코딩

export default function Destination() {
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(
    [],
  );
  const { travelScheduleList, setSelectedRegions } = useGlobalState();

  const toggleDestination = (id: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(id) ? prev.filter((dest) => dest !== id) : [...prev, id],
    );
  };

  const handleComplete = () => {
    // Navigate to itinerary page with selected destinations
    const destinationNames: { [key: string]: string } = {
      "1": "강릉",
      "2": "속초",
      "3": "춘천",
      "4": "원주",
      "5": "동해",
      "6": "태백",
      "7": "삼척",
      "8": "홍천",
      "9": "횡성",
      "10": "영월",
      "11": "평창",
      "12": "정선",
      "13": "철원",
      "14": "화천",
      "15": "양구",
      "16": "인제",
      "17": "고성",
      "18": "양양",
    };
    const selectedDestinationNames = selectedDestinations.map(
      (id) => destinationNames[id] || "",
    );

    // 전역 상태에 선택된 지역 저장
    setSelectedRegions(selectedDestinationNames);

    // 전역 상태에서 날짜 정보 가져오기
    if (!travelScheduleList || !Array.isArray(travelScheduleList)) {
      console.log(
        "⚠️ travelScheduleList가 undefined이거나 배열이 아닙니다:",
        travelScheduleList,
      );
      return;
    }

    const travelDates = travelScheduleList
      .filter((item) => item && item.day) // 유효한 날짜만 필터링
      .map((item) => item.day)
      .sort(); // 날짜 순으로 정렬

    let dateRange = "";
    if (travelDates.length > 0) {
      const startDate = travelDates[0];
      const endDate = travelDates[travelDates.length - 1];

      // YYYY-MM-DD 형식을 MM.DD 형식으로 변환
      const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return `${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
      };

      dateRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    console.log("🌍 선택된 지역:", selectedDestinationNames);
    console.log("📅 여행 날짜:", dateRange);
    console.log("📊 전역 스케줄 상태:", travelScheduleList);

    router.push({
      pathname: "/itinerary",
      params: {
        regions: selectedDestinationNames.join(","),
        dateRange: dateRange || "날짜 미정",
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/plan")}>
          <BackIcon />
        </TouchableOpacity>
        <Text style={styles.headerSubtitle} allowFontScaling={false}>
          {travelScheduleList.length > 0
            ? `${travelScheduleList[0]?.day?.slice(5, 7)}.${travelScheduleList[0]?.day?.slice(8, 10)} - ${travelScheduleList[travelScheduleList.length - 1]?.day?.slice(5, 7)}.${travelScheduleList[travelScheduleList.length - 1]?.day?.slice(8, 10)}`
            : "날짜 미정"}
        </Text>
        <Text style={styles.headerTitle} allowFontScaling={false}>
          어디로{"\n"}여행을 떠날까요?
        </Text>
      </View>

      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 첫 번째 행 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("1") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("1")}
            >
              <Image
                source={강릉}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("1") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                강릉
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("2") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("2")}
            >
              <Image
                source={속초}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("2") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                속초
              </Text>
            </TouchableOpacity>
          </View>

          {/* 두 번째 행 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("3") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("3")}
            >
              <Image
                source={춘천}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("3") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                춘천
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("4") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("4")}
            >
              <Image
                source={원주}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("4") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                원주
              </Text>
            </TouchableOpacity>
          </View>

          {/* 세 번째 행 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("5") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("5")}
            >
              <Image
                source={동해}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("5") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                동해
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("6") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("6")}
            >
              <Image
                source={태백}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("6") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                태백
              </Text>
            </TouchableOpacity>
          </View>

          {/* 네 번째 행 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("7") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("7")}
            >
              <Image
                source={삼척}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("7") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                삼척
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("8") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("8")}
            >
              <Image
                source={홍천}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("8") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                홍천
              </Text>
            </TouchableOpacity>
          </View>

          {/* 다섯 번째 행 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("9") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("9")}
            >
              <Image
                source={횡성}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("9") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                횡성
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("10") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("10")}
            >
              <Image
                source={영월}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("10") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                영월
              </Text>
            </TouchableOpacity>
          </View>

          {/* 여섯 번째 행 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("11") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("11")}
            >
              <Image
                source={평창}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("11") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                평창
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("12") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("12")}
            >
              <Image
                source={정선}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("12") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                정선
              </Text>
            </TouchableOpacity>
          </View>

          {/* 일곱 번째 행 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("13") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("13")}
            >
              <Image
                source={철원}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("13") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                철원
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("14") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("14")}
            >
              <Image
                source={화천}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("14") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                화천
              </Text>
            </TouchableOpacity>
          </View>

          {/* 여덟 번째 행 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("15") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("15")}
            >
              <Image
                source={양구}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("15") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                양구
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("16") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("16")}
            >
              <Image
                source={인제}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("16") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                인제
              </Text>
            </TouchableOpacity>
          </View>

          {/* 아홉 번째 행 */}
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("17") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("17")}
            >
              <Image
                source={고성}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("17") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                고성
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.destinationItem,
                selectedDestinations.includes("18") &&
                  styles.selectedDestination,
              ]}
              onPress={() => toggleDestination("18")}
            >
              <Image
                source={양양}
                style={styles.destinationImage}
                resizeMode="cover"
              />
              <Text
                style={[
                  styles.destinationName,
                  selectedDestinations.includes("18") &&
                    styles.selectedDestinationName,
                ]}
                allowFontScaling={false}
              >
                양양
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {selectedDestinations.length > 0 && (
        <View style={styles.selectedContainer}>
          <View style={styles.selectedTags}>
            {selectedDestinations.map((id) => {
              const destinationNames: { [key: string]: string } = {
                "1": "강릉",
                "2": "속초",
                "3": "춘천",
                "4": "원주",
                "5": "동해",
                "6": "태백",
                "7": "삼척",
                "8": "홍천",
                "9": "횡성",
                "10": "영월",
                "11": "평창",
                "12": "정선",
                "13": "철원",
                "14": "화천",
                "15": "양구",
                "16": "인제",
                "17": "고성",
                "18": "양양",
              };
              return (
                <View key={id} style={styles.tag}>
                  <Text style={styles.tagText} allowFontScaling={false}>
                    {destinationNames[id]}
                  </Text>
                  <TouchableOpacity onPress={() => toggleDestination(id)}>
                    <Feather name="x" size={18} color="#9D9896" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}

      <CommonButton
        title={`총 ${selectedDestinations.length}곳 선택 완료`}
        onPress={handleComplete}
        disabled={selectedDestinations.length === 0}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "column",
    gap: 15,
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#C5BFBB",
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 25,
    fontFamily: "SUIT-700",
    color: "#262423",
  },
  headerSubtitle: {
    fontSize: 17,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginTop: 2,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 7,
    marginTop: 5,
    justifyContent: "center",
  },
  destinationItem: {
    width: "48%",
    height: 84,
    backgroundColor: "#F8F8F8",
    borderRadius: 5,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
    borderWidth: 1,
    borderColor: "#DBD6D3",
  },
  selectedDestination: {
    backgroundColor: "#716C69",
  },
  destinationImage: {
    width: 58,
    height: 58,
    borderRadius: 30,
    marginRight: 25,
  },
  destinationName: {
    fontSize: 17,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  selectedDestinationName: {
    color: "#FFFFFF",
  },
  selectedContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#EEE9E6",
  },
  selectedTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C5BFBB",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 5,
    gap: 8,
  },
  tagText: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
});
