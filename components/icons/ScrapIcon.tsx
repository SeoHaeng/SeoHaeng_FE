import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface ScrapIconProps extends SvgProps {
  size?: number;
  color?: string;
}

const ScrapIcon: React.FC<ScrapIconProps> = ({
  size = 14,
  color = "#262423",
  ...props
}) => {
  const height = (size * 22) / 14; // 원본 비율 유지
  return (
    <Svg
      width={size}
      height={height}
      viewBox="0 0 14 22"
      fill="none"
      {...props}
    >
      <Path
        d="M0 1C0 0.447716 0.447715 0 1 0H13C13.5523 0 14 0.447715 14 1V20.1788C14 20.9678 13.129 21.446 12.4633 21.0226L7.53669 17.889C7.20921 17.6807 6.79079 17.6807 6.46331 17.889L1.53669 21.0226C0.870956 21.446 0 20.9678 0 20.1788V1Z"
        fill={color}
      />
    </Svg>
  );
};

export default ScrapIcon;
