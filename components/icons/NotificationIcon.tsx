import React from "react";
import Svg, { Path } from "react-native-svg";

interface NotificationIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function NotificationIcon({
  width = 23,
  height = 23,
  color = "#9D9896",
}: NotificationIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 23 23" fill="none">
      <Path
        d="M13.1579 20.1243C12.9894 20.4148 12.7476 20.6559 12.4566 20.8235C12.1657 20.9911 11.8358 21.0793 11.5 21.0793C11.1642 21.0793 10.8343 20.9911 10.5434 20.8235C10.2524 20.6559 10.0106 20.4148 9.84208 20.1243M17.25 7.66602C17.25 6.14102 16.6442 4.67849 15.5659 3.60015C14.4875 2.52182 13.025 1.91602 11.5 1.91602C9.97501 1.91602 8.51247 2.52182 7.43414 3.60015C6.3558 4.67849 5.75 6.14102 5.75 7.66602C5.75 14.3743 2.875 16.291 2.875 16.291H20.125C20.125 16.291 17.25 14.3743 17.25 7.66602Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
