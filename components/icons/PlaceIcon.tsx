import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface PlaceIconProps extends SvgProps {
  color?: string;
}

const PlaceIcon: React.FC<PlaceIconProps> = ({
  color = "#716C69",
  ...props
}) => {
  return (
    <Svg width="11" height="16" viewBox="0 0 11 16" fill="none" {...props}>
      <Path
        d="M5.52344 0C8.52347 -2.62271e-07 11 2.45214 11 5.42285C10.9997 8.67638 7.61862 12.8257 5.52344 15.2305C3.4283 12.6842 0.000269106 8.81773 0 5.42285C-2.59699e-07 2.45225 2.476 0.00018272 5.52344 0ZM5.5 3.38477C4.33182 3.38485 3.38485 4.33182 3.38477 5.5C3.38481 6.66821 4.3318 7.61515 5.5 7.61523C6.66823 7.61519 7.61519 6.66823 7.61523 5.5C7.61515 4.3318 6.66821 3.38481 5.5 3.38477Z"
        fill={color}
      />
    </Svg>
  );
};

export default PlaceIcon;
