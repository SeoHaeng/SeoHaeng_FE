import React from "react";
import Svg, { Circle, SvgProps } from "react-native-svg";

interface ThreeDotsIconProps extends SvgProps {
  color?: string;
}

const ThreeDotsIcon: React.FC<ThreeDotsIconProps> = ({
  color = "#302E2D",
  ...props
}) => {
  return (
    <Svg width="13" height="3" viewBox="0 0 13 3" fill="none" {...props}>
      <Circle cx="1.26609" cy="1.26609" r="1.26609" fill={color} />
      <Circle cx="6.33049" cy="1.26609" r="1.26609" fill={color} />
      <Circle cx="11.3948" cy="1.26609" r="1.26609" fill={color} />
    </Svg>
  );
};

export default ThreeDotsIcon;
