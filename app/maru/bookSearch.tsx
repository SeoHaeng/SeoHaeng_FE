import BackIcon from "@/components/icons/BackIcon";
import { BookSearchResult, searchBooksAPI } from "@/types/api";
import {
  setGiftBookData,
  setMarkerBookData,
  setReceivedBookData,
} from "@/types/globalState";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<string | null>(null);

  // API 연동을 위한 상태
  const [books, setBooks] = useState<BookSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // 책 검색 API 호출 함수
  const searchBooks = useCallback(
    async (query: string, page: number = 1, append: boolean = false) => {
      if (!query.trim()) return;

      try {
        setIsLoading(true);
        const response = await searchBooksAPI(query, "sim", page);

        if (response.isSuccess && response.result?.bookSearchResults) {
          const newBooks = response.result.bookSearchResults;

          if (append) {
            setBooks((prev) => [...prev, ...newBooks]);
          } else {
            setBooks(newBooks);
          }

          // 더 불러올 데이터가 있는지 확인 (API 응답에 따라 조정 필요)
          setHasMore(newBooks.length > 0);
          setCurrentPage(page);
        }
      } catch (error) {
        console.error("책 검색 실패:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // 무한 스크롤을 위한 추가 데이터 로드
  const loadMoreBooks = useCallback(() => {
    if (!isLoading && hasMore && searchQuery.trim()) {
      searchBooks(searchQuery, currentPage + 1, true);
    }
  }, [isLoading, hasMore, currentPage, searchQuery, searchBooks]);

  // 검색어 변경 시 검색 실행
  useEffect(() => {
    if (searchPerformed && searchQuery.trim()) {
      searchBooks(searchQuery, 1, false);
    }
  }, [searchQuery, searchPerformed, searchBooks]);

  const handleBookSelect = (bookIndex: number) => {
    setSelectedBook(
      selectedBook === bookIndex.toString() ? null : bookIndex.toString(),
    );
  };

  const handleComplete = () => {
    if (selectedBook) {
      const selectedBookIndex = parseInt(selectedBook);
      const selectedBookData = books[selectedBookIndex];
      if (selectedBookData) {
        // API 응답 구조를 전역 상태 구조에 맞게 변환
        const bookData = {
          id: selectedBookIndex.toString(),
          title: selectedBookData.title,
          author: selectedBookData.author,
          cover: { uri: selectedBookData.bookImage },
          pubDate: selectedBookData.pubDate || "", // 출판일 저장 (API에 있다면)
        };

        // 선택된 책 정보를 전역 변수에 저장
        if (bookType === "received") {
          setReceivedBookData(bookData);
        } else if (bookType === "gift") {
          setGiftBookData(bookData);
        } else if (bookType === "marker") {
          setMarkerBookData(bookData);
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
              onSubmitEditing={() => {
                setSearchPerformed(true);
                searchBooks(searchQuery, 1, false);
              }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Feather name="x" size={15} color="white" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              setSearchPerformed(true);
              searchBooks(searchQuery, 1, false);
            }}
          >
            <Text style={styles.searchButtonText}>검색</Text>
          </TouchableOpacity>
        </View>

        {/* 검색 결과 */}
        <View style={styles.resultsContainer}>
          {searchPerformed && !isLoading && (
            <Text style={styles.resultsCount}>총 {books.length}개</Text>
          )}

          {/* 로딩 중일 때 */}
          {isLoading && books.length === 0 && (
            <View style={styles.initialLoadingContainer}>
              <ActivityIndicator size="large" color="#E60A34" />
              <Text style={styles.initialLoadingText}>
                도서를 검색하는 중...
              </Text>
            </View>
          )}

          {/* 검색 결과가 있을 때 */}
          {!isLoading && books.length > 0 && (
            <View style={styles.booksGrid}>
              {books.map((book, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.bookItem}
                  onPress={() => handleBookSelect(index)}
                >
                  <View style={styles.bookCoverContainer}>
                    <Image
                      source={{ uri: book.bookImage }}
                      style={styles.bookCover}
                    />
                    {selectedBook === index.toString() && (
                      <>
                        <View style={styles.overlay} />
                        <View style={styles.checkmarkContainer}>
                          <Entypo name="check" size={18} color="black" />
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
          )}

          {/* 검색 결과가 없을 때 */}
          {searchPerformed && !isLoading && books.length === 0 && (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>검색 결과가 없습니다</Text>
              <Text style={styles.noResultsSubText}>
                다른 검색어로 시도해보세요
              </Text>
            </View>
          )}

          {/* 무한 스크롤 로딩 인디케이터 */}
          {isLoading && books.length > 0 && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#E60A34" />
              <Text style={styles.loadingText}>책을 불러오는 중...</Text>
            </View>
          )}

          {/* 더 불러올 데이터가 있는 경우 로드 더 버튼 */}
          {!isLoading && hasMore && books.length > 0 && (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={loadMoreBooks}
            >
              <Text style={styles.loadMoreButtonText}>더 보기</Text>
            </TouchableOpacity>
          )}
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
    fontSize: 17,
    fontFamily: "SUIT-700",
    color: "#000000",
  },
  headerSpacer: {
    width: 30,
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    position: "relative",
    borderWidth: 1,
    borderColor: "#DBD6D3",
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: "#302E2D",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "SUIT-600",
  },
  searchInput: {
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
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

  resultsContainer: {
    padding: 20,
    paddingTop: 10,
  },
  resultsCount: {
    fontSize: 13,
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
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  checkmark: {
    color: "#4D4947",
    fontSize: 17,
    fontFamily: "SUIT-700",
  },
  bookTitle: {
    fontSize: 14,
    fontFamily: "SUIT-600",
    color: "#000000",
    marginBottom: 4,
    lineHeight: 16,
  },
  bookAuthor: {
    fontSize: 12,
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
    fontSize: 15,
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
    fontSize: 17,
    fontFamily: "SUIT-600",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  loadMoreButton: {
    backgroundColor: "#F0F0F0",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  loadMoreButtonText: {
    fontSize: 15,
    fontFamily: "SUIT-600",
    color: "#302E2D",
  },
  initialLoadingContainer: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 15,
  },
  initialLoadingText: {
    fontSize: 17,
    fontFamily: "SUIT-500",
    color: "#716C69",
  },
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 60,
    gap: 10,
  },
  noResultsText: {
    fontSize: 17,
    fontFamily: "SUIT-600",
    color: "#716C69",
  },
  noResultsSubText: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
});
