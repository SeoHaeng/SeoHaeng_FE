// app/popularity.tsx
import PopularChallengeTotal from "@/components/maruChallenge/popularChallengeTotal";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Popularity() {
  const router = useRouter();
  const challenges = [
    {
      id: 1,
      userName: "유딘딘",
      date: "1",
      text: "대박 이 책을 받을 줄은 몰았어요!ㅎ ㅎㅎ 잘 읽겠습니다!! 강릉 여행와서..",
      bookName: "물고기는 존재하지 않는다",
      bookAuthor: "룰루 밀러 / 정지인",
      year: "2022",
    },
    {
      id: 2,
      userName: "채영",
      date: "2",
      text: "오늘도 새로운 책과 함께하는 독서 시간! 이번에는 특별한 책을..",
      bookName: "물고기는 존재하지 않는다",
      bookAuthor: "룰루 밀러 / 정지인",
      year: "2022",
    },
    {
      id: 3,
      userName: "수빈",
      date: "3",
      text: "주말 아침 카페에서 독서하기! 오늘의 책은..",
      bookName: "물고기는 존재하지 않는다",
      bookAuthor: "룰루 밀러 / 정지인",
      year: "2022",
    },
  ];

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/maru/challenge")}>
          <Image source={require("@/assets/images/Back.png")} />
        </TouchableOpacity>
        <Text style={styles.title}>인기 챌린지 인증</Text>
        <TouchableOpacity>
          <Image source={require("@/assets/images/Search.png")} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <Text
            style={{ fontSize: 13, color: "#716C69", fontFamily: "SUIT-500" }}
          >
            총 1583개
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
            <Text
              style={{ fontSize: 13, color: "#716C69", fontFamily: "SUIT-500" }}
            >
              최신순
            </Text>
            <Image source={require("@/assets/images/DropdownArrow.png")} />
          </View>
        </View>
        {challenges.map((challenge) => (
          <PopularChallengeTotal
            key={challenge.id}
            {...challenge}
            onPress={() =>
              router.push({
                pathname: "/popularity/[id]",
                params: { id: challenge.id },
              })
            }
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 25,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 0.5,
    borderColor: "#C5BFBB",
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 16,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    padding: 20,
    gap: 20,
  },
});
