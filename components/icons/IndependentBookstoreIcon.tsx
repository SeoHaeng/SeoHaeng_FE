import React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface IndependentBookstoreIconProps extends SvgProps {
  color?: string;
}

const IndependentBookstoreIcon: React.FC<IndependentBookstoreIconProps> = ({
  color = "#716C69",
  ...props
}) => {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <Path d="M2 4L10 2L18 4V16H2V4Z" fill={color} />
      <Path d="M2 4H18" stroke="white" strokeWidth="1" strokeLinecap="round" />
      <Path d="M6 8H14" stroke="white" strokeWidth="1" strokeLinecap="round" />
      <Path d="M6 11H12" stroke="white" strokeWidth="1" strokeLinecap="round" />
      <Path d="M6 14H10" stroke="white" strokeWidth="1" strokeLinecap="round" />
      <Circle cx="15" cy="8" r="1" fill="white" />
    </Svg>
  );
};

export default IndependentBookstoreIcon;
