import React from "react";
import Svg, { ClipPath, Defs, G, Mask, Path, Rect } from "react-native-svg";

const KakaoLoginIcon = () => {
  return (
    <Svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <G clip-path="url(#clip0_2471_1526)">
        <Path
          d="M60 30C60 13.4315 46.5685 0 30 0C13.4315 0 0 13.4315 0 30C0 46.5685 13.4315 60 30 60C46.5685 60 60 46.5685 60 30Z"
          fill="#FFEC00"
        />
        <Mask
          id="mask0_2471_1526"
          maskUnits="userSpaceOnUse"
          x="18"
          y="18"
          width="24"
          height="24"
        >
          <Path d="M42 18H18V42H42V18Z" fill="white" />
        </Mask>
        <G mask="url(#mask0_2471_1526)">
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M30.0001 18.7998C23.3723 18.7998 18 22.9504 18 28.0695C18 31.2532 20.0779 34.0597 23.2421 35.7291L21.9107 40.5924C21.7931 41.0222 22.2846 41.3647 22.662 41.1157L28.4978 37.2641C28.9903 37.3116 29.4908 37.3393 30.0001 37.3393C36.6274 37.3393 42 33.1889 42 28.0695C42 22.9504 36.6274 18.7998 30.0001 18.7998Z"
            fill="black"
          />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_2471_1526">
          <Rect width="60" height="60" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default KakaoLoginIcon;
