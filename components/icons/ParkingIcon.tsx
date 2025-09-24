import React from "react";
import Svg, { Path } from "react-native-svg";

const ParkingIcon = () => {
  return (
    <Svg width="22" height="23" viewBox="0 0 22 23" fill="none">
      <Path
        d="M8 16.5V6.5H12C12.7956 6.5 13.5587 6.81607 14.1213 7.37868C14.6839 7.94129 15 8.70435 15 9.5C15 10.2956 14.6839 11.0587 14.1213 11.6213C13.5587 12.1839 12.7956 12.5 12 12.5H8M21 11.5C21 17.0228 16.5228 21.5 11 21.5C5.47715 21.5 1 17.0228 1 11.5C1 5.97715 5.47715 1.5 11 1.5C16.5228 1.5 21 5.97715 21 11.5Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ParkingIcon;
