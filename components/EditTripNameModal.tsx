import React from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface EditTripNameModalProps {
  isVisible: boolean;
  tripName: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export default function EditTripNameModal({
  isVisible,
  tripName,
  onSave,
  onCancel,
}: EditTripNameModalProps) {
  const [editTripName, setEditTripName] = React.useState(tripName);

  React.useEffect(() => {
    if (isVisible) {
      setEditTripName(tripName);
    }
  }, [isVisible, tripName]);

  const handleSave = () => {
    if (editTripName.trim()) {
      onSave(editTripName.trim());
    }
  };

  const handleCancel = () => {
    setEditTripName(tripName);
    onCancel();
  };

  if (!isVisible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>여행 이름을 수정해주세요</Text>
        <Text style={styles.modalSubtitle}>언제든지 수정할 수 있어요</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={editTripName}
            onChangeText={setEditTripName}
            placeholder="여행 이름을 입력하세요"
            maxLength={12}
          />
          <Text style={styles.characterCount}>{editTripName.length}/12</Text>
        </View>

        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={handleSave}>
            <Text style={styles.confirmButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 24,
    paddingBottom: 10,
    width: "85%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: "SUIT-500",
    color: "#9D9896",
    marginBottom: 24,
  },
  inputContainer: {
    position: "relative",
    marginBottom: 24,
  },
  textInput: {
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: "SUIT-500",
    color: "#262423",
    borderWidth: 1,
    borderColor: "#DBD6D3",
  },
  characterCount: {
    position: "absolute",
    bottom: 8,
    right: 8,
    fontSize: 12,
    fontFamily: "SUIT-500",
    color: "#9D9896",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#9D9896",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 17,
    fontFamily: "SUIT-600",
    color: "#262423",
  },
});
