import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface ReviewMoreArrowIconProps extends SvgProps {
  color?: string;
}

const ReviewMoreArrowIcon: React.FC<ReviewMoreArrowIconProps> = ({
  color = "#A9A9A9",
  ...props
}) => {
  return (
    <Svg width="5" height="8" viewBox="0 0 5 8" fill="none" {...props}>
      <Path
        d="M1 7L3.78191 4.3645C3.90231 4.25044 3.90732 4.06033 3.79309 3.94009L1 1"
        stroke={color}
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default ReviewMoreArrowIcon;
