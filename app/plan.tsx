import BackIcon from "@/components/icons/BackIcon";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Plan() {
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

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
      // Navigate back with selected dates
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              여행 일자를{"\n"}선택해주세요.
            </Text>
            {selectedStartDate && selectedEndDate && (
              <Text style={styles.dateRange}>{formatDateRange()}</Text>
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
          style={styles.calendarScrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* June 2025 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2025.06</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2025, 5)}</View>
          </View>

          {/* July 2025 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2025.07</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2025, 6)}</View>
          </View>

          {/* August 2025 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2025.08</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2025, 7)}</View>
          </View>

          {/* September 2025 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2025.09</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2025, 8)}</View>
          </View>

          {/* October 2025 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2025.10</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2025, 9)}</View>
          </View>

          {/* November 2025 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2025.11</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2025, 10)}</View>
          </View>

          {/* December 2025 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2025.12</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2025, 11)}</View>
          </View>

          {/* January 2026 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2026.01</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2026, 0)}</View>
          </View>

          {/* February 2026 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2026.02</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2026, 1)}</View>
          </View>

          {/* March 2026 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2026.03</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2026, 2)}</View>
          </View>

          {/* April 2026 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2026.04</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2026, 3)}</View>
          </View>

          {/* May 2026 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2026.05</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2026, 4)}</View>
          </View>

          {/* June 2026 */}
          <View style={styles.monthSection}>
            <Text style={styles.monthTitle}>2026.06</Text>
            <View style={styles.calendarGrid}>{renderCalendar(2026, 5)}</View>
          </View>
        </ScrollView>
      </View>

      {/* Complete Button */}
      {selectedStartDate && selectedEndDate && (
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
        >
          <Text style={styles.completeButtonText}>선택 완료</Text>
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
    fontSize: 24,
    fontFamily: "SUIT-700",
    color: "#262423",
    lineHeight: 32,
  },
  dateRange: {
    fontSize: 18,
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
    fontSize: 14,
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
    fontSize: 16,
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
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#262423",
  },
  selectedDay: {
    backgroundColor: "#302E2D",
  },
  startDate: {
    backgroundColor: "#302E2D",
    borderRadius: 20,
  },
  endDate: {
    backgroundColor: "#302E2D",
    borderRadius: 20,
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
    fontSize: 16,
    fontFamily: "SUIT-600",
  },
});
