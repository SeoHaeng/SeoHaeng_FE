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

interface TouristSpotInactiveIconProps {
  width?: number;
  height?: number;
}

export default function TouristSpotInactiveIcon({
  width = 38,
  height = 38,
}: TouristSpotInactiveIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 38 38" fill="none">
      <G filter="url(#filter0_d_540_12510)">
        <Circle cx="19" cy="18" r="13" fill="#FF9421" />
        <Circle cx="19" cy="18" r="13.5" stroke="#BC7426" />
      </G>
      <Path
        d="M24.7313 14.428C24.9984 13.7705 24.5146 13.0517 23.8048 13.0517H16.4211C16.0505 13.0517 15.7501 12.7512 15.7501 12.3807C15.7501 12.0101 15.4445 11.7097 15.0739 11.7097C14.6976 11.7097 14.3872 12.0148 14.3872 12.3912V24.4476C14.3872 24.824 14.6923 25.1291 15.0687 25.1291C15.445 25.1291 15.7501 24.824 15.7501 24.4476V20.7613C15.7501 20.209 16.1978 19.7613 16.7501 19.7613H23.8048C24.5146 19.7613 24.9984 19.0425 24.7313 18.385L24.0804 16.7829C23.9824 16.5415 23.9824 16.2715 24.0804 16.0301L24.7313 14.428ZM21.2017 16.4065C21.2017 17.1446 20.5884 17.7484 19.8388 17.7484C19.0892 17.7484 18.4759 17.1446 18.4759 16.4065C18.4759 15.6684 19.0892 15.0646 19.8388 15.0646C20.5884 15.0646 21.2017 15.6684 21.2017 16.4065Z"
        fill="#BC7426"
      />
      <Defs>
        <Filter
          id="filter0_d_540_12510"
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
            result="effect1_dropShadow_540_12510"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_540_12510"
            result="shape"
          />
        </Filter>
      </Defs>
    </Svg>
  );
}
