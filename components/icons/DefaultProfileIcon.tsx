import React from "react";
import Svg, { Circle, Ellipse } from "react-native-svg";

interface DefaultProfileIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function DefaultProfileIcon({
  width = 71,
  height = 77,
  color = "#C5BFBB",
}: DefaultProfileIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 71 77" fill="none">
      <Circle cx="35.5" cy="19.5" r="19.5" fill={color} />
      <Ellipse cx="35.5" cy="60.5" rx="35.5" ry="16.5" fill={color} />
    </Svg>
  );
}
