import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";

// 한국어 로케일 설정
LocaleConfig.locales["ko"] = {
  monthNames: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthNamesShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  dayNames: ["일", "월", "화", "수", "목", "금", "토"],
  dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
};

LocaleConfig.defaultLocale = "ko";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
}

export default function DatePickerModal({
  visible,
  onClose,
  onDateSelect,
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const router = useRouter();

  const handleDateSelect = (date: any) => {
    setSelectedDate(date.dateString);
  };

  const handleComplete = () => {
    if (selectedDate) {
      onDateSelect(selectedDate);
      onClose();
    }
  };

  const formatSelectedDate = (dateString: string) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

    return `${year}.${month}.${day}(${dayOfWeek})`;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              매장 방문 일자를 선택해주세요.
            </Text>
            <Text style={styles.selectedDateText}>
              {formatSelectedDate(selectedDate)}
            </Text>
          </View>

          {/* 달력 */}
          <Calendar
            current="2025-06-13"
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: "#4D4947",
              },
            }}
            theme={{
              backgroundColor: "#FFFFFF",
              calendarBackground: "#FFFFFF",
              textSectionTitleColor: "#000000",
              selectedDayBackgroundColor: "#4D4947",
              selectedDayTextColor: "#FFFFFF",
              todayTextColor: "#4D4947",
              dayTextColor: "#000000",
              textDisabledColor: "#C5BFBB",
              dotColor: "#4D4947",
              selectedDotColor: "#FFFFFF",
              arrowColor: "#4D4947",
              monthTextColor: "#000000",
              indicatorColor: "#4D4947",
              textDayFontFamily: "SUIT-500",
              textMonthFontFamily: "SUIT-600",
              textDayHeaderFontFamily: "SUIT-500",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
            style={styles.calendar}
          />

          {/* 선택 완료 버튼 */}
          <TouchableOpacity
            style={[
              styles.completeButton,
              !selectedDate && styles.completeButtonDisabled,
            ]}
            onPress={handleComplete}
            disabled={!selectedDate}
          >
            <Text style={styles.completeButtonText}>선택 완료</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    minHeight: "70%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: "#4D4947",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#000000",
    textAlign: "center",
  },
  selectedDateText: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#4D4947",
  },
  calendar: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  completeButton: {
    backgroundColor: "#4D4947",
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonDisabled: {
    backgroundColor: "#C5BFBB",
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
});
