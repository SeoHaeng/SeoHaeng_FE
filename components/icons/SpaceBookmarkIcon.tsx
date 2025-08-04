import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface SpaceBookmarkIconProps extends SvgProps {
  color?: string;
}

const SpaceBookmarkIcon: React.FC<SpaceBookmarkIconProps> = ({
  color = "#716C69",
  ...props
}) => {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        d="M4 2H16C17.1046 2 18 2.89543 18 4V16C18 17.1046 17.1046 18 16 18H4C2.89543 18 2 17.1046 2 16V4C2 2.89543 2.89543 2 4 2Z"
        fill={color}
      />
      <Path
        d="M6 6H14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M6 9H14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M6 12H12"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M8 15L10 13L12 15"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SpaceBookmarkIcon;
