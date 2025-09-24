import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface BookStayIconProps extends SvgProps {
  color?: string;
  width?: number;
  height?: number;
}

const BookStayIcon: React.FC<BookStayIconProps> = ({
  color = "#716C69",
  width = 13,
  height = 13,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 13 13"
      fill="none"
      {...props}
    >
      <Path
        d="M7.0547 0.3698C6.7188 0.145867 6.2812 0.145867 5.9453 0.3698L0.4453 4.03647C0.167101 4.22193 0 4.53416 0 4.86852V12C0 12.5523 0.447715 13 1 13H3.0625C3.61478 13 4.0625 12.5523 4.0625 12V8.94444C4.0625 8.39216 4.51022 7.94444 5.0625 7.94444H7.9375C8.48978 7.94444 8.9375 8.39216 8.9375 8.94444V12C8.9375 12.5523 9.38521 13 9.9375 13H12C12.5523 13 13 12.5523 13 12V4.86852C13 4.53416 12.8329 4.22193 12.5547 4.03647L7.0547 0.3698Z"
        fill={color}
      />
    </Svg>
  );
};

export default BookStayIcon;
