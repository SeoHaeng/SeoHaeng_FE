import BackIcon from "@/components/icons/BackIcon";
import PlaceIcon from "@/components/icons/PlaceIcon";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const [searchText, setSearchText] = useState("");
  const [recentSearches] = useState(["행복 서점", "강릉 책방", "강릉 책방"]);
  const [fromScreen, setFromScreen] = useState<string>("");
  const [dayIndex, setDayIndex] = useState<string>("");

  // 파라미터에서 화면 정보 가져오기
  useEffect(() => {
    if (params.from) {
      setFromScreen(params.from as string);
      console.log("🔍 검색 화면 진입 - 출발 화면:", params.from);
    }
    if (params.dayIndex) {
      setDayIndex(params.dayIndex as string);
      console.log("📅 선택된 날짜 인덱스:", params.dayIndex);
    }
  }, [params.from, params.dayIndex]);

  const [searchSuggestions] = useState([
    { text: "강릉", type: "search" },
    { text: "강릉시", type: "search" },
    { text: "강릉서점", type: "search" },
    { text: "강릉독립서점", type: "search" },
    {
      text: "이스트쓰네",
      type: "search",
      tag: "독립서점",
      address: "강릉시 강동면 현화로 973 1층",
    },
    {
      text: "이스트쓰네",
      type: "search",
      tag: "독립서점",
      address: "강릉시 강동면 현화로 973 1층",
    },
  ]);

  const handleBack = () => {
    if (fromScreen === "itinerary") {
      // 일정짜기에서 온 경우 - itinerary 화면으로 이동
      router.push("/itinerary");
    } else if (fromScreen === "milestone") {
      // 이정표에서 온 경우 - milestone 화면으로 이동
      router.push("/(tabs)/milestone");
    } else {
      // 기본 뒤로가기
      router.back();
    }
  };

  const handleClearSearch = () => {
    setSearchText("");
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
  };

  const handleSelectLocation = (location: any) => {
    console.log("Selected location:", location);

    if (fromScreen === "itinerary") {
      // 일정짜기에서 온 경우 - 일정에 추가
      console.log("📅 일정짜기에서 장소 선택됨 - 날짜:", dayIndex);
      // TODO: 선택된 장소를 일정에 추가하는 로직
      router.back(); // 일정짜기 화면으로 돌아가기
    } else {
      // 이정표에서 온 경우 - 기존 로직
      console.log("🗺️ 이정표에서 장소 선택됨");
      router.push({
        pathname: "/(tabs)/milestone",
        params: { selectedLocation: JSON.stringify(location) },
      });
    }
  };

  const handleRemoveRecent = (index: number) => {
    // Remove recent search logic
    console.log("Remove recent search at index:", index);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 검색바 */}
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <BackIcon style={styles.backIcon} />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="공간을 검색해보세요"
          placeholderTextColor="#999999"
          value={searchText}
          onChangeText={handleSearch}
          autoFocus
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch}>
            <Text style={styles.clearButton}>×</Text>
          </TouchableOpacity>
        )}
        {searchText.length === 0 && (
          <TouchableOpacity style={styles.searchButton}>
            <Image
              source={require("@/assets/images/Search.png")}
              style={styles.searchIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content}>
        {searchText.length === 0 ? (
          /* 최근 검색어 */
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>최근 검색어</Text>
            <View style={styles.recentContainer}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => handleSearch(search)}
                >
                  <Text style={styles.recentText}>{search}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveRecent(index)}
                    style={styles.removeButton}
                  >
                    <Text style={styles.removeIcon}>×</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          /* 검색 결과 */
          <View style={styles.suggestionsSection}>
            {searchSuggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSelectLocation(item)}
              >
                <View style={styles.suggestionContent}>
                  {item.type === "location" ? (
                    <PlaceIcon style={styles.suggestionIcon} />
                  ) : (
                    <Image
                      source={require("@/assets/images/Search.png")}
                      style={styles.suggestionIcon}
                    />
                  )}
                  <View style={styles.suggestionTextContainer}>
                    <View style={styles.nameAndTagContainer}>
                      <Text style={styles.suggestionText}>{item.text}</Text>
                      {item.tag && (
                        <View style={styles.tagContainer}>
                          <Text style={styles.tagText}>{item.tag}</Text>
                        </View>
                      )}
                    </View>
                    {item.address && (
                      <View style={styles.addressContainer}>
                        <PlaceIcon style={styles.addressIcon} />
                        <Text style={styles.addressText}>{item.address}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingLeft: 5,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  backButton: {
    marginRight: 15,
    minWidth: 44,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "SUIT-400",
    color: "#262423",
    paddingVertical: 10,
  },
  searchButton: {
    marginLeft: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  clearButton: {
    fontSize: 18,
    color: "#999999",
    marginLeft: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recentSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginBottom: 15,
  },
  recentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  recentItem: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  recentText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#666666",
    marginRight: 8,
  },
  removeButton: {
    padding: 2,
  },
  removeIcon: {
    fontSize: 14,
    color: "#999999",
  },
  suggestionsSection: {
    marginTop: 10,
  },
  suggestionItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  suggestionContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
    tintColor: "#666666",
  },
  suggestionTextContainer: {
    flex: 1,
    gap: 4,
  },
  suggestionText: {
    fontSize: 16,
    fontFamily: "SUIT-400",
    color: "#262423",
  },
  tagContainer: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  tagText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#666666",
  },

  nameAndTagContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  addressIcon: {
    width: 12,
    height: 12,
    marginRight: 4,
    tintColor: "#999999",
  },
  addressText: {
    fontSize: 12,
    fontFamily: "SUIT-400",
    color: "#999999",
  },
  fromScreenIndicator: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  fromScreenText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
});
