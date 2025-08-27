import React from "react";
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

interface DeleteUserConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteUserConfirmModal({
  visible,
  onClose,
  onConfirm,
}: DeleteUserConfirmModalProps) {
  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>정말 탈퇴하시겠어요?</Text>
            <Text style={styles.message}>
              탈퇴할 경우 작성한 내용은 모두 삭제됩니다.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={onConfirm}
              >
                <Text style={styles.confirmButtonText}>탈퇴</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: width * 0.8,
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontFamily: "SUIT-700",
    color: "#262423",
    marginBottom: 16,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    fontFamily: "SUIT-500",
    color: "#716C69",
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#DBD6D3",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#716C69",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 13,
    fontFamily: "SUIT-600",
    color: "#FFFFFF",
  },
});
