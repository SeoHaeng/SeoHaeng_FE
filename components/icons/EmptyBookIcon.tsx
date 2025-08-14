import React from "react";
import Svg, { Path, Rect, SvgProps } from "react-native-svg";

interface EmptyBookIconProps extends SvgProps {
  color?: string;
  width?: number;
  height?: number;
}

const EmptyBookIcon: React.FC<EmptyBookIconProps> = ({
  color = "#C5BFBB",
  width = 79,
  height = 107,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 79 107"
      fill="none"
      {...props}
    >
      <Path
        d="M1 1H73C75.7614 1 78 3.23858 78 6V101C78 103.761 75.7614 106 73 106H1V1Z"
        fill="#EEE9E6"
        stroke={color}
        strokeLinecap="round"
        strokeDasharray="3 3"
      />
      <Rect x="7" y="1" width="5" height="105" fill="#E3DDD9" />
      <Path
        d="M40.048 58.208C39.568 58.208 39.232 57.872 39.232 57.392C39.232 56.928 39.568 56.608 40.048 56.608C40.512 56.608 40.832 56.928 40.832 57.392C40.832 57.872 40.512 58.208 40.048 58.208ZM39.456 55.232C39.44 53.68 39.872 52.752 41.008 51.92C42.224 51.008 42.544 50.384 42.592 49.648C42.656 48.368 41.712 47.472 40.32 47.472C39.312 47.472 38.336 48.192 37.936 49.232L36.816 48.816C37.376 47.328 38.816 46.288 40.32 46.288C42.448 46.288 43.872 47.696 43.776 49.712C43.728 50.752 43.184 51.776 41.712 52.88C40.864 53.504 40.624 53.984 40.64 55.232H39.456Z"
        fill={color}
      />
    </Svg>
  );
};

export default EmptyBookIcon;
