import BackIcon from "@/components/icons/BackIcon";
import {
  setGiftBookData,
  setMarkerBookData,
  setReceivedBookData,
} from "@/types/globalState";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookSearch() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const bookType = params.type as string; // "received" 또는 "gift"
  const [searchQuery, setSearchQuery] = useState("백엔드");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  const searchResults = [
    {
      id: "1",
      title: "주니어 백엔드 개발자가 반드시 알아야 할 실무 지식",
      author: "최범균",
      cover: {
        uri: "https://shopping-phinf.pstatic.net/main_5441999/54419996237.20250429093306.jpg",
      },
    },
    {
      id: "2",
      title: "백엔드 30일 완성",
      author: "Pedro Marquez-Soto",
      cover: {
        uri: "https://shopping-phinf.pstatic.net/main_4274357/42743575619.20230928091944.jpg",
      },
    },
    {
      id: "3",
      title: "아는 만큼 보이는 백엔드 개발",
      author: "정우현^이인^김보인",
      cover: {
        uri: "https://shopping-phinf.pstatic.net/main_4519670/45196700648.20240114070834.jpg",
      },
    },
    {
      id: "4",
      title: "LUVIT 실전 백엔드 러스트 Axum 프로그래밍",
      author: "윤인도",
      cover: {
        uri: "https://shopping-phinf.pstatic.net/main_5502358/55023589122.20250603080640.jpg",
      },
    },
    {
      id: "5",
      title: "깔끔한 파이썬 탄탄한 백엔드",
      author: "송은우",
      cover: {
        uri: "https://shopping-phinf.pstatic.net/main_3248337/32483376086.20250627083930.jpg",
      },
    },
    {
      id: "6",
      title: "Do it! Node.js 프로그래밍 입문",
      author: "고경희",
      cover: {
        uri: "https://shopping-phinf.pstatic.net/main_4390021/43900216622.20231119070940.jpg",
      },
    },
    {
      id: "7",
      title: "가장 빠른 풀스택을 위한 Flask & FastAPI",
      author: "Dave Lee",
      cover: {
        uri: "https://shopping-phinf.pstatic.net/main_4774721/47747212621.20240516071127.jpg",
      },
    },
    {
      id: "8",
      title: "백엔드 개발을 위한 핸즈온 장고",
      author: "김성렬",
      cover: {
        uri: "https://shopping-phinf.pstatic.net/main_4022957/40229572618.20230606104020.jpg",
      },
    },
    {
      id: "9",
      title: "백엔드를 위한 Go 프로그래밍",
      author: "탠메이 박시^바히어 카말",
      cover: {
        uri: "https://shopping-phinf.pstatic.net/main_3402722/34027227623.20230523090237.jpg",
      },
    },
    {
      id: "10",
      title: "Node.js 백엔드 개발자 되기",
      author: "박승규",
      cover: {
        uri: "https://shopping-phinf.pstatic.net/main_3929136/39291367622.20230502164420.jpg",
      },
    },
  ];

  const handleBookSelect = (bookId: string) => {
    setSelectedBook(selectedBook === bookId ? null : bookId);
  };

  const handleComplete = () => {
    if (selectedBook) {
      const selectedBookData = searchResults.find(
        (book) => book.id === selectedBook,
      );
      if (selectedBookData) {
        // 선택된 책 정보를 전역 변수에 저장
        if (bookType === "received") {
          setReceivedBookData(selectedBookData);
        } else if (bookType === "gift") {
          setGiftBookData(selectedBookData);
        } else if (bookType === "marker") {
          setMarkerBookData(selectedBookData);
        }

        // 이전 화면으로 돌아가기
        router.back();
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const formatAuthor = (author: string) => {
    return author.replace(/\^/g, ", ");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <BackIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>도서 검색</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 검색바 */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="도서명, 저자명으로 검색해보세요"
              placeholderTextColor="#9D9896"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Text style={styles.clearButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* 검색 결과 */}
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsCount}>총 {searchResults.length}개</Text>

          <View style={styles.booksGrid}>
            {searchResults.map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookItem}
                onPress={() => handleBookSelect(book.id)}
              >
                <View style={styles.bookCoverContainer}>
                  <Image source={book.cover} style={styles.bookCover} />
                  {selectedBook === book.id && (
                    <>
                      <View style={styles.overlay} />
                      <View style={styles.checkmarkContainer}>
                        <Text style={styles.checkmark}>✓</Text>
                      </View>
                    </>
                  )}
                </View>
                <Text style={styles.bookTitle} numberOfLines={2}>
                  {book.title}
                </Text>
                <Text style={styles.bookAuthor}>
                  {formatAuthor(book.author)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 직접 등록하기 링크 */}
        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>찾는 도서가 없으신가요? </Text>
          <TouchableOpacity
            onPress={() => router.push(`/maru/bookRegister?type=${bookType}`)}
          >
            <Text style={styles.registerLink}>직접 등록하기 &gt;</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 도서 선택 완료 버튼 */}
      <View style={styles.fixedButtonContainer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            !selectedBook && styles.completeButtonDisabled,
          ]}
          onPress={handleComplete}
          disabled={!selectedBook}
        >
          <Text style={styles.completeButtonText}>도서 선택 완료</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F4F2",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  headerSpacer: {
    width: 30,
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  searchInputContainer: {
    position: "relative",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderRadius: 5,
  },
  searchInput: {
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#000000",
  },
  clearButton: {
    position: "absolute",
    right: 15,
    top: 12,
    backgroundColor: "#4D4947",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SUIT-700",
  },
  resultsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  resultsCount: {
    fontSize: 12,
    fontFamily: "SUIT-600",
    color: "#9D9896",
    marginBottom: 10,
  },
  booksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    justifyContent: "space-between",
  },
  bookItem: {
    width: "30%",
    alignItems: "flex-start",
  },
  bookCoverContainer: {
    position: "relative",
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#DBD6D3",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 5,
  },
  bookCover: {
    width: 111,
    height: 173,
    borderRadius: 5,
  },
  checkmarkContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    backgroundColor: "#EEE9E6",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  checkmark: {
    color: "#4D4947",
    fontSize: 16,
    fontFamily: "SUIT-700",
  },
  bookTitle: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#000000",
    marginBottom: 4,
    lineHeight: 16,
  },
  bookAuthor: {
    fontSize: 11,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    textAlign: "left",
  },
  registerContainer: {
    padding: 20,
    paddingTop: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 1,
    alignSelf: "center",
  },
  registerText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  registerLink: {
    color: "#262423",
    fontFamily: "SUIT-600",
    textDecorationLine: "underline",
  },
  fixedButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#EEE9E6",
  },
  completeButton: {
    backgroundColor: "#302E2D",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  completeButtonDisabled: {
    backgroundColor: "#C5BFBB",
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SUIT-600",
  },
});
