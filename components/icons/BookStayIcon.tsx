import React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface BookStayIconProps extends SvgProps {
  color?: string;
}

const BookStayIcon: React.FC<BookStayIconProps> = ({
  color = "#716C69",
  ...props
}) => {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M3 5C3 3.89543 3.89543 3 5 3H15C16.1046 3 17 3.89543 17 5V15C17 16.1046 16.1046 17 15 17H5C3.89543 17 3 16.1046 3 15V5Z"
        fill={color}
      />
      <Path
        d="M6 7H14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M6 10H14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M6 13H10"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="13" cy="13" r="1" fill="white" />
    </Svg>
  );
};

export default BookStayIcon;
