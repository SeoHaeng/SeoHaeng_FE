import React from "react";
import Svg, {
  Circle,
  Defs,
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeFlood,
  FeGaussianBlur,
  FeOffset,
  Filter,
  G,
  Path,
} from "react-native-svg";

interface FestivalInactiveIconProps {
  width?: number;
  height?: number;
}

export default function FestivalInactiveIcon({
  width = 38,
  height = 38,
}: FestivalInactiveIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 38 38" fill="none">
      <G filter="url(#filter0_d_540_12845)">
        <Circle cx="19" cy="18" r="13" fill="#FF9421" />
        <Circle cx="19" cy="18" r="13.5" stroke="#BC7426" />
      </G>
      <Path
        d="M19.222 19.4773L17.5653 21.1028C17.1298 21.5384 16.8887 22.1062 16.8887 22.7128C16.8887 23.9728 17.9387 24.9995 19.222 24.9995C20.5053 24.9995 21.5553 23.9728 21.5553 22.7128C21.5553 22.1062 21.3142 21.5306 20.8787 21.1028L19.222 19.4773Z"
        fill="#BC7426"
      />
      <Path
        d="M22.3333 14.1111L21.9911 14.5389C21.0733 15.6822 19.2222 15.0367 19.2222 13.5667V11C19.2222 11 13 14.1111 13 19.5555C13 21.8267 14.2133 23.81 16.0256 24.8911C15.59 24.2766 15.3333 23.5222 15.3333 22.7133C15.3333 21.6867 15.7378 20.7222 16.4767 19.9911L19.2222 17.3L21.9678 19.9989C22.7067 20.7222 23.1111 21.6867 23.1111 22.7211C23.1111 23.5144 22.87 24.2455 22.45 24.86C23.92 23.9655 25.0089 22.48 25.3355 20.7378C25.8489 17.9767 24.5033 15.3711 22.3333 14.1111Z"
        fill="#BC7426"
      />
      <Defs>
        <Filter
          id="filter0_d_540_12845"
          x="0"
          y="0"
          width="38"
          height="38"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="1" />
          <FeGaussianBlur stdDeviation="2.5" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <FeBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_540_12845"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_540_12845"
            result="shape"
          />
        </Filter>
      </Defs>
    </Svg>
  );
}
