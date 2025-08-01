// app/milestone.tsx
import KakaoMap from "@/components/KakaoMap";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Milestone() {
  return (
    <View style={styles.container}>
      {/* 카카오맵 컴포넌트 */}
      <KakaoMap latitude={37.5665} longitude={126.978} />

      {/* 상단 검색바 */}
      <View style={styles.searchBar}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.searchTitle}>북스테이</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Image
            source={require("@/assets/images/Search.png")}
            style={styles.searchIcon}
          />
        </TouchableOpacity>
      </View>

      {/* 재검색 버튼 */}
      <View style={styles.reSearchContainer}>
        <TouchableOpacity style={styles.reSearchButton}>
          <Text style={styles.reSearchIcon}>↻</Text>
          <Text style={styles.reSearchText}>이 지역에서 재검색</Text>
        </TouchableOpacity>
      </View>

      {/* 하단 위치 리스트 */}
      <View style={styles.locationCard}>
        <View style={styles.cardHandle} />
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>총 2곳</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchBar: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    marginRight: 10,
  },
  backIcon: {
    fontSize: 24,
    color: "#000000",
  },
  searchTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#000000",
  },
  searchButton: {
    marginLeft: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  reSearchContainer: {
    position: "absolute",
    top: 120,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  reSearchButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  reSearchIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  reSearchText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
  locationCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDDDDD",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 15,
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#000000",
  },
  locationList: {
    flex: 1,
  },
  locationItem: {
    flexDirection: "row",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  locationImage: {
    width: 80,
    height: 80,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    marginRight: 15,
  },
  locationInfo: {
    flex: 1,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  locationName: {
    flex: 1,
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#000000",
    marginRight: 10,
  },
  bookmarkButton: {
    padding: 5,
  },
  bookmarkIcon: {
    width: 16,
    height: 16,
  },
  locationDetails: {
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#666666",
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    fontFamily: "SUIT-400",
    color: "#999999",
  },
  statusContainer: {
    alignItems: "flex-start",
  },
  statusButton: {
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#666666",
  },
});
