import BackIcon from "@/components/icons/BackIcon";
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
      presentationStyle="overFullScreen"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <BackIcon />
          </TouchableOpacity>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle} allowFontScaling={false}>
              방문 일자를{"\n"} 선택해주세요.
            </Text>
            <Text style={styles.selectedDateText} allowFontScaling={false}>
              {formatSelectedDate(selectedDate)}
            </Text>
          </View>

          {/* 달력 */}
          <Calendar
            current={new Date().toISOString().split("T")[0]}
            onDayPress={handleDateSelect}
            maxDate={new Date().toISOString().split("T")[0]} // 오늘까지만 선택 가능
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
              textDayFontSize: 17,
              textMonthFontSize: 19,
              textDayHeaderFontSize: 15,
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
            <Text style={styles.completeButtonText} allowFontScaling={false}>
              선택 완료
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 0,
    padding: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 30,
    paddingBottom: 30,
    minHeight: "75%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingBottom: 20,
    marginTop: 10,
  },
  backButton: {
    marginLeft: 20,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  backButtonText: {
    fontSize: 21,
    color: "#4D4947",
  },
  headerTitle: {
    flex: 1,
    fontSize: 23,
    fontFamily: "SUIT-700",
    color: "#000000",
    lineHeight: 30,
  },
  selectedDateText: {
    fontSize: 17,
    fontFamily: "SUIT-700",
    color: "#262423",
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
    fontSize: 17,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
});
