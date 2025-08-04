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
    <Svg width="11" height="14" viewBox="0 0 11 14" fill="none">
      <Path
        d="M0 1C0 0.447716 0.447715 0 1 0H10C10.5523 0 11 0.447715 11 1V12.36C11 13.1086 10.2076 13.5918 9.54204 13.2489L5.95796 11.4026C5.6706 11.2545 5.3294 11.2545 5.04204 11.4026L1.45796 13.2489C0.792421 13.5918 0 13.1086 0 12.36V1Z"
        fill="#716C69"
      />
    </Svg>
  );
};

export default SpaceBookmarkIcon;
