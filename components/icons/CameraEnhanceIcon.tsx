import React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from "react-native-svg";

interface CameraEnhanceIconProps extends SvgProps {
  color?: string;
}

const CameraEnhanceIcon: React.FC<CameraEnhanceIconProps> = ({
  color = "#9D9896",
  ...props
}) => {
  return (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <G clipPath="url(#clip0_29_2567)">
        <Path
          d="M9 3L7.17 5H4C2.9 5 2 5.9 2 7V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V7C22 5.9 21.1 5 20 5H16.83L15 3H9ZM12 18C9.24 18 7 15.76 7 13C7 10.24 9.24 8 12 8C14.76 8 17 10.24 17 13C17 15.76 14.76 18 12 18Z"
          fill="#716C69"
        />
        <Path
          d="M12 17L13.25 14.25L16 13L13.25 11.75L12 9L10.75 11.75L8 13L10.75 14.25L12 17Z"
          fill="#716C69"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_29_2567">
          <Rect width="24" height="24" rx="5" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default CameraEnhanceIcon;
