import React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface MyLocationIconProps extends SvgProps {
  color?: string;
}

const MyLocationIcon: React.FC<MyLocationIconProps> = ({
  color = "#716C69",
  ...props
}) => {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <Circle cx="10" cy="10" r="8" stroke={color} strokeWidth="2" />
      <Circle cx="10" cy="10" r="3" fill={color} />
      <Path d="M10 2V4" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <Path
        d="M10 16V18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path
        d="M18 10H16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Path d="M4 10H2" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
};

export default MyLocationIcon;
