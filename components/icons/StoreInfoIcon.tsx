import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface StoreInfoIconProps extends SvgProps {
  color?: string;
}

const StoreInfoIcon: React.FC<StoreInfoIconProps> = ({
  color = "#9D9896",
  ...props
}) => {
  return (
    <Svg width="14" height="16" viewBox="0 0 14 16" fill="none" {...props}>
      <Path
        d="M7.60604 0.461747C7.24805 0.188989 6.75195 0.188989 6.39396 0.461747L0.393957 5.03318C0.145708 5.22232 0 5.51651 0 5.82861V15C0 15.5523 0.447715 16 1 16H3.375C3.92728 16 4.375 15.5523 4.375 15V10.7778C4.375 10.2255 4.82272 9.77778 5.375 9.77778H8.625C9.17729 9.77778 9.625 10.2255 9.625 10.7778V15C9.625 15.5523 10.0727 16 10.625 16H13C13.5523 16 14 15.5523 14 15V5.82861C14 5.51652 13.8543 5.22232 13.606 5.03318L7.60604 0.461747Z"
        fill={color}
      />
    </Svg>
  );
};

export default StoreInfoIcon;
