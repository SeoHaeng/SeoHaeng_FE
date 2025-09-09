import BackIcon from "@/components/icons/BackIcon";
import { useGlobalState } from "@/types/globalState";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Plan() {
  const params = useLocalSearchParams();
  const fromHome = params.from === "home";
  const fromPreference = params.from === "preference";
  const {
    addTravelSchedule,
    clearTravelSchedule,
    clearSelectedRegions,
    clearViewport,
    clearUserLocation,
  } = useGlobalState();

  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Scroll to current month when component mounts
  useEffect(() => {
    // Calculate the position of current month (3 months before + current month)
    const currentMonthIndex = 3; // Current month is at index 3 (after 3 previous months)
    const monthHeight = 200; // Approximate height of each month section
    const scrollPosition = currentMonthIndex * monthHeight;

    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: scrollPosition,
        animated: true,
      });
    }, 100);
  }, []);

  // Generate months dynamically (3 months before + current month + 12 months after)
  const generateMonths = () => {
    const months = [];
    for (let i = -3; i <= 12; i++) {
      const year = currentYear + Math.floor((currentMonth + i) / 12);
      const month = (currentMonth + i + 12) % 12; // Add 12 to handle negative months
      months.push({ year, month });
    }
    return months;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateOnly = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const startDateOnly = selectedStartDate
        ? new Date(
            selectedStartDate.getFullYear(),
            selectedStartDate.getMonth(),
            selectedStartDate.getDate(),
          )
        : null;
      const endDateOnly = selectedEndDate
        ? new Date(
            selectedEndDate.getFullYear(),
            selectedEndDate.getMonth(),
            selectedEndDate.getDate(),
          )
        : null;

      const isStartDate =
        startDateOnly && dateOnly.getTime() === startDateOnly.getTime();
      const isEndDate =
        endDateOnly && dateOnly.getTime() === endDateOnly.getTime();
      const isInRange =
        startDateOnly &&
        endDateOnly &&
        dateOnly > startDateOnly &&
        dateOnly < endDateOnly;
      const isSunday = date.getDay() === 0;
      const isSaturday = date.getDay() === 6;

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isStartDate && styles.startDate,
            isEndDate && styles.endDate,
            isInRange && styles.inRangeDate,
          ]}
          onPress={() => handleDateSelect(date)}
        >
          <Text
            style={[
              styles.dayText,
              isSunday && styles.sundayText,
              isSaturday && styles.saturdayText,
              (isStartDate || isEndDate) && styles.selectedDayText,
            ]}
            allowFontScaling={false}
          >
            {day}
          </Text>
        </TouchableOpacity>,
      );
    }

    return days;
  };

  const handleDateSelect = (date: Date) => {
    // Normalize the date to remove time information
    const normalizedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(normalizedDate);
      setSelectedEndDate(null);
    } else {
      const normalizedStartDate = new Date(
        selectedStartDate.getFullYear(),
        selectedStartDate.getMonth(),
        selectedStartDate.getDate(),
      );

      if (normalizedDate >= normalizedStartDate) {
        setSelectedEndDate(normalizedDate);
      } else {
        setSelectedStartDate(normalizedDate);
        setSelectedEndDate(null);
      }
    }
  };

  const formatDateRange = () => {
    if (selectedStartDate && selectedEndDate) {
      // Add one day to the start date for display
      const startDatePlusOne = new Date(selectedStartDate);
      startDatePlusOne.setDate(startDatePlusOne.getDate() + 1);
      const start = startDatePlusOne
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, ".");

      // Add one day to the end date for display
      const endDatePlusOne = new Date(selectedEndDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      const end = endDatePlusOne.toISOString().slice(0, 10).replace(/-/g, ".");

      return `${start}-${end.slice(5)}`;
    }
    return "";
  };

  const handleComplete = () => {
    if (selectedStartDate && selectedEndDate) {
      // 🗑️ 기존 여행 정보 완전 초기화
      console.log("🧹 새로운 여행 시작 - 기존 정보 초기화");

      // 여행 관련 정보 초기화
      clearTravelSchedule(); // 여행 일정 초기화
      clearSelectedRegions(); // 선택된 지역 초기화

      // 지도 관련 정보 초기화 (선택사항)
      clearViewport(); // 지도 뷰포트 초기화
      clearUserLocation(); // 사용자 위치 초기화

      // 선택된 날짜 범위를 전역으로 저장
      const startDate = new Date(selectedStartDate);
      const endDate = new Date(selectedEndDate);

      // 날짜 범위 내의 모든 날짜를 전역 상태에 저장
      const currentDate = new Date(startDate);
      let dayCount = 1;

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().slice(0, 10);

        // 각 날짜를 전역 상태에 저장 (빈 스케줄로)
        addTravelSchedule({
          day: dateString,
          placeId: 0, // 아직 장소가 선택되지 않음
        });

        currentDate.setDate(currentDate.getDate() + 1);
        dayCount++;
      }

      console.log("📅 여행 일정 전역 저장 완료:", {
        startDate: startDate.toISOString().slice(0, 10),
        endDate: endDate.toISOString().slice(0, 10),
        totalDays: dayCount - 1,
      });

      // Navigate to destination selection screen
      router.push("/destination");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (fromHome) {
              router.push("/(tabs)");
            } else if (fromPreference) {
              router.push("/(tabs)/preference");
            } else {
              router.push("/(tabs)/milestone");
            }
          }}
        >
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle} allowFontScaling={false}>
              여행 일자를{"\n"}선택해주세요.
            </Text>

            {selectedStartDate && selectedEndDate && (
              <Text style={styles.dateRange} allowFontScaling={false}>
                {formatDateRange()}
              </Text>
            )}
          </View>
          {/* Days of week - Fixed */}
          <View style={styles.weekDays}>
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <View key={day} style={styles.weekDay}>
                <Text
                  style={[
                    styles.weekDayText,
                    day === "일" && styles.sundayText,
                    day === "토" && styles.saturdayText,
                  ]}
                  allowFontScaling={false}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        {/* Scrollable Calendar Months */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.calendarScrollView}
          showsVerticalScrollIndicator={false}
        >
          {generateMonths().map(({ year, month }, index) => (
            <View key={`${year}-${month}`} style={styles.monthSection}>
              <Text style={styles.monthTitle} allowFontScaling={false}>
                {year}.{String(month + 1).padStart(2, "0")}
              </Text>
              <View style={styles.calendarGrid}>
                {renderCalendar(year, month)}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Complete Button */}
      {selectedStartDate && selectedEndDate && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText} allowFontScaling={false}>
            선택 완료
          </Text>
        </TouchableOpacity>
      )}
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
    height: 210,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#C5BFBB",
    paddingTop: 40,
  },
  headerContent: {
    flex: 1,
    width: "100%",
  },
  headerTextContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 15,
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 25,
    fontFamily: "SUIT-700",
    color: "#262423",
    lineHeight: 32,
  },
  fromHomeText: {
    fontSize: 13,
    fontFamily: "SUIT-500",
    color: "#716C69",
    marginTop: 8,
  },
  dateRange: {
    fontSize: 17,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  calendarScrollView: {
    flex: 1,
  },
  weekDays: {
    flexDirection: "row",
  },
  weekDay: {
    flex: 1,
    alignItems: "center",
  },
  weekDayText: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  sundayText: {
    color: "#E55E5E",
  },
  saturdayText: {
    color: "#5E90E5",
  },
  monthSection: {
    marginBottom: 30,
  },
  monthTitle: {
    fontSize: 17,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 15,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dayText: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
  selectedDay: {
    backgroundColor: "#302E2D",
  },
  startDate: {
    backgroundColor: "#302E2D",
    borderRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  endDate: {
    backgroundColor: "#302E2D",
    borderRadius: 20,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  selectedDayText: {
    color: "#FFFFFF",
  },
  inRangeDate: {
    backgroundColor: "#DBD6D3",
  },
  completeButton: {
    backgroundColor: "#302E2D",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 17,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: "SUIT-600",
  },
});
