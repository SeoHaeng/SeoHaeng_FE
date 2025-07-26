import React from "react";
import { Image, StyleSheet, View } from "react-native";

export default function MapView() {
  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapImageContainer}>
        {/* 강원도 지도 이미지 */}
        <Image
          source={require("@/assets/images/gangwondo/gangwon_map.png")}
          style={styles.gangwonMap}
          resizeMode="contain"
        />

        {/* 수집된 지역 이미지 오버레이 */}
        <View style={styles.mapOverlay}>
          {/* 춘천 선택된 이미지 */}
          <View style={[styles.collectedRegionImage, styles.chuncheon]}>
            <Image
              source={require("@/assets/images/gangwondo/춘천.png")}
              resizeMode="contain"
            />
          </View>

          {/* 동해 선택된 이미지 */}
          <View style={[styles.collectedRegionImage, styles.donghae]}>
            <Image
              source={require("@/assets/images/gangwondo/동해.png")}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  mapImageContainer: {
    backgroundColor: "#EEE9E6",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    position: "relative",
    height: 400,
    borderWidth: 1,
    borderColor: "#DBD6D3",
  },
  gangwonMap: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  mapOverlay: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    zIndex: 1,
  },
  collectedRegionImage: {
    position: "absolute",
    borderRadius: 8,
    overflow: "hidden",
  },
  chuncheon: {
    top: "28%",
    left: "18%",
    width: "20%",
    height: "16%",
  },
  donghae: {
    top: "52%",
    left: "38%",
    width: "16%",
    height: "14%",
  },
});
