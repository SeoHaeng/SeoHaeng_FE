import BackIcon from "@/components/icons/BackIcon";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CommonHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
}) => {
  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon />
        </TouchableOpacity>
      )}
      <View style={styles.headerContent}>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        <Text style={styles.headerTitle} numberOfLines={0}>
          {title}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#EEE9E6",
    borderWidth: 1,
    borderColor: "#C5BFBB",
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "SUIT-700",
    color: "#262423",
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "SUIT-600",
    color: "#262423",
    marginTop: 2,
  },
});

export default CommonHeader;
