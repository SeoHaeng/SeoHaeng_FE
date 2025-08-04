import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface TouristSpotIconProps extends SvgProps {
  color?: string;
}

const TouristSpotIcon: React.FC<TouristSpotIconProps> = ({
  color = "#716C69",
  ...props
}) => {
  return (
    <Svg width="11" height="14" viewBox="0 0 11 14" fill="none">
      <Path
        d="M11 1.4H1.375V0H0V14H1.375V8.4H11L9.625 4.9L11 1.4ZM6.875 4.9C6.875 5.67 6.25625 6.3 5.5 6.3C4.74375 6.3 4.125 5.67 4.125 4.9C4.125 4.13 4.74375 3.5 5.5 3.5C6.25625 3.5 6.875 4.13 6.875 4.9Z"
        fill={color}
      />
    </Svg>
  );
};

export default TouristSpotIcon;
