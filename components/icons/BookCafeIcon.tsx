import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface BookCafeIconProps extends SvgProps {
  color?: string;
}

const BookCafeIcon: React.FC<BookCafeIconProps> = ({
  color = "#716C69",
  ...props
}) => {
  return (
    <Svg width="16" height="13" viewBox="0 0 16 13" fill="none">
      <Path
        d="M12.5671 0H1.73339C0.780026 0 0 0.780026 0 1.73339V6.68223C0 10.0017 2.55675 12.9051 5.8762 13.0004C9.30831 13.1044 12.1337 10.3483 12.1337 6.93357V6.06687H12.5671C14.2398 6.06687 15.6005 4.70616 15.6005 3.03344C15.6005 1.36071 14.2398 0 12.5671 0ZM10.4004 1.73339V4.33348H1.73339V1.73339H10.4004ZM12.5671 4.33348H12.1337V1.73339H12.5671C13.2864 1.73339 13.8671 2.31408 13.8671 3.03344C13.8671 3.75279 13.2864 4.33348 12.5671 4.33348Z"
        fill="#716C69"
      />
    </Svg>
  );
};

export default BookCafeIcon;
