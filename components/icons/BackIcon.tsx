import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface BackIconProps extends SvgProps {
  color?: string;
  width?: number;
  height?: number;
}

const BackIcon: React.FC<BackIconProps> = ({
  color = "#A9A9A9",
  width = 12,
  height = 21,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 12 21"
      fill="none"
      {...props}
    >
      <Path
        d="M11 1L1.23503 9.78847C1.10728 9.90345 1.10205 10.1021 1.22359 10.2236L11 20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default BackIcon;
