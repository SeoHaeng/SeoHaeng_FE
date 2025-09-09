import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface CommonButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: any;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[styles.buttonText, disabled && styles.buttonTextDisabled]}
        allowFontScaling={false}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#302E2D",
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 17,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#C5BFBB",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SUIT-600",
  },
  buttonTextDisabled: {
    color: "#9D9896",
  },
});

export default CommonButton;
