import React from "react";
import Svg, { Circle, Path, SvgProps } from "react-native-svg";

interface PreferenceBookstoreIconProps extends SvgProps {
  color?: string;
}

const PreferenceBookstoreIcon: React.FC<PreferenceBookstoreIconProps> = ({
  color = "#262423",
  ...props
}) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...props}>
      <Path d="M4 6L12 4L20 6V18H4V6Z" fill="white" />
      <Path d="M4 6H20" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <Path
        d="M8 10H16"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M8 13H14"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M8 16H12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="17" cy="10" r="1" fill={color} />
      <Path
        d="M12 20L14 18L16 20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PreferenceBookstoreIcon;
