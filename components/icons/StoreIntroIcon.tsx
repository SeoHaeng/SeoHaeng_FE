import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface StoreIntroIconProps extends SvgProps {
  color?: string;
}

const StoreIntroIcon: React.FC<StoreIntroIconProps> = ({
  color = "#9D9896",
  ...props
}) => {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none" {...props}>
      <Path
        d="M12.6 0H1.4C0.63 0 0.00699999 0.63 0.00699999 1.4L0 14L2.8 11.2H12.6C13.37 11.2 14 10.57 14 9.8V1.4C14 0.63 13.37 0 12.6 0ZM4.9 6.3H3.5V4.9H4.9V6.3ZM7.7 6.3H6.3V4.9H7.7V6.3ZM10.5 6.3H9.1V4.9H10.5V6.3Z"
        fill={color}
      />
    </Svg>
  );
};

export default StoreIntroIcon;
