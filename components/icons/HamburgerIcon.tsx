import React from "react";
import Svg, { Path } from "react-native-svg";

interface HamburgerIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function HamburgerIcon({
  width = 20,
  height = 17,
  color = "#9D9896",
}: HamburgerIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 17" fill="none">
      <Path
        d="M1.2793 1H19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M1.2793 8.18164H19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M1.2793 15.3633H19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}
