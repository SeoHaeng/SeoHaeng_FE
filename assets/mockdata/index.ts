// 모든 데이터를 import하여 통합 export
import { bookstoreData } from "./bookstoreData";
import { festivalData } from "./festivalData";
import { restaurantData } from "./restaurantData";
import { touristData } from "./touristData";

// 모든 데이터를 하나로 합치기
const mockData = [
  ...bookstoreData,
  ...touristData,
  ...festivalData,
  ...restaurantData,
];

export default mockData;

// 개별 데이터도 export (필요시 사용)
export { bookstoreData, festivalData, restaurantData, touristData };
