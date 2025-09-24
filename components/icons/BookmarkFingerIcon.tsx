import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface BookmarkFingerIconProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function BookmarkFingerIcon({
  width = 19,
  height = 26,
  color = "#DBD6D3",
}: BookmarkFingerIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 19 26" fill="none">
      <Path
        d="M6.84301 0.644531C7.8306 0.644531 8.63193 1.44506 8.63207 2.43262V7.7793C8.64198 6.80013 9.43865 6.00977 10.4202 6.00977C11.4077 6.00994 12.2082 6.81028 12.2082 7.79785V7.80078C12.5344 7.36541 13.053 7.08301 13.6389 7.08301C14.6266 7.08304 15.427 7.88344 15.427 8.87109V9.23047C15.7261 9.00545 16.0972 8.87113 16.5002 8.87109C17.4879 8.87109 18.2883 9.67156 18.2883 10.6592V17.9658C18.2883 18.5729 18.1665 19.1738 17.9289 19.7324L16.8391 22.2939L16.6789 23.5352H6.84301L6.50805 21.2793L0.442621 14.1387C-0.184915 13.4 -0.14022 12.3026 0.545161 11.6172C1.27186 10.8905 2.45024 10.8906 3.177 11.6172L5.05493 13.4951V2.43262C5.05507 1.44518 5.85559 0.644729 6.84301 0.644531Z"
        fill={color}
      />
      <Rect
        x="6.12744"
        y="23.1777"
        width="11.4455"
        height="2.50369"
        rx="1.25185"
        fill="#716C69"
      />
    </Svg>
  );
}
