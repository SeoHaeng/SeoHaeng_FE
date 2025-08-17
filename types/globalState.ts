// 전역 변수로 선택된 책 정보를 저장
export interface BookData {
  id: string;
  title: string;
  author: string;
  cover: { uri: string };
}

// 받을 책 정보
export let receivedBookData: BookData | null = null;

// 줄 책 정보
export let giftBookData: BookData | null = null;

// 받을 책 정보 설정
export const setReceivedBookData = (book: BookData | null) => {
  receivedBookData = book;
};

// 줄 책 정보 설정
export const setGiftBookData = (book: BookData | null) => {
  giftBookData = book;
};

// 받을 책 정보 가져오기
export const getReceivedBookData = (): BookData | null => {
  return receivedBookData;
};

// 줄 책 정보 가져오기
export const getGiftBookData = (): BookData | null => {
  return giftBookData;
};

// 마커 등록용 도서 정보
export let markerBookData: BookData | null = null;

// 마커 등록용 도서 정보 설정
export const setMarkerBookData = (book: BookData | null) => {
  markerBookData = book;
};

// 마커 등록용 도서 정보 가져오기
export const getMarkerBookData = (): BookData | null => {
  return markerBookData;
};
