import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface RestaurantIconProps extends SvgProps {
  color?: string;
}

const RestaurantIcon: React.FC<RestaurantIconProps> = ({
  color = "#716C69",
  ...props
}) => {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <Path
        d="M14 7C14 3.136 10.864 0 7 0C3.136 0 0 3.136 0 7C0 9.583 1.729 11.802 4.2 12.775V14H9.8V12.775C12.271 11.802 14 9.583 14 7ZM12.6 7H9.8V2.156C11.473 3.129 12.6 4.935 12.6 7ZM8.4 1.582V7H5.6V1.582C6.048 1.47 6.517 1.4 7 1.4C7.483 1.4 7.952 1.47 8.4 1.582ZM1.4 7C1.4 4.935 2.527 3.129 4.2 2.156V7H1.4Z"
        fill={color}
      />
    </Svg>
  );
};

export default RestaurantIcon;
