// 독립서점, 북카페, 북스테이, 책갈피 데이터를 통합
import { bookCafeData } from "./bookCafeData";
import { bookStayData } from "./bookStayData";
import { bookmarkData } from "./bookmarkData";
import { independentBookstoreData } from "./independentBookstoreData";

// 모든 서점 관련 데이터를 하나로 합치기
export const bookstoreData = [
  ...independentBookstoreData,
  ...bookCafeData,
  ...bookStayData,
  ...bookmarkData,
];

// 개별 데이터도 export (필요시 사용)
export { bookCafeData, bookmarkData, bookStayData, independentBookstoreData };
