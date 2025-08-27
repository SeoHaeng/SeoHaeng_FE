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
    <Svg width="23" height="23" viewBox="0 0 23 23" fill="none">
      <Path
        d="M2.60449 11.5L20.3952 11.5"
        stroke="#212328"
        strokeWidth="3.55814"
        strokeLinecap="round"
      />
      <Path
        d="M11.5 2.60449L11.5 20.3952"
        stroke="#212328"
        strokeWidth="3.55814"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default BookCafeIcon;
