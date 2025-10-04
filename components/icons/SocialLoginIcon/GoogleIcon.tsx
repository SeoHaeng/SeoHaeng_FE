import React from "react";
import Svg, {
  ClipPath,
  Defs,
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeFlood,
  FeOffset,
  Filter,
  G,
  Path,
  Rect,
} from "react-native-svg";

const GoogleIcon = () => {
  return (
    <Svg width="60" height="60" viewBox="0 0 60 60" fill="none">
      <G>
        <Path
          d="M0 30C0 13.4315 13.4315 0 30 0C46.5685 0 60 13.4315 60 30C60 46.5685 46.5685 60 30 60C13.4315 60 0 46.5685 0 30Z"
          fill="white"
          shape-rendering="crispEdges"
        />
        <Path
          d="M30 0.5C46.2924 0.5 59.5 13.7076 59.5 30C59.5 46.2924 46.2924 59.5 30 59.5C13.7076 59.5 0.5 46.2924 0.5 30C0.5 13.7076 13.7076 0.5 30 0.5Z"
          stroke="#F7F7F7"
          shape-rendering="crispEdges"
        />
        <G clip-path="url(#clip0_2471_1534)">
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M39.6 30.2271C39.6 29.518 39.5364 28.8362 39.4182 28.1816H30V32.0498H35.3818C35.15 33.2998 34.4455 34.3589 33.3864 35.068V37.5771H36.6182C38.5091 35.8362 39.6 33.2725 39.6 30.2271Z"
            fill="#4285F4"
          />
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M29.9998 39.9999C32.6998 39.9999 34.9635 39.1044 36.618 37.5772L33.3862 35.0681C32.4907 35.6681 31.3453 36.0226 29.9998 36.0226C27.3953 36.0226 25.1907 34.2635 24.4044 31.8999H21.0635V34.4908C22.7089 37.759 26.0907 39.9999 29.9998 39.9999Z"
            fill="#34A853"
          />
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M24.4045 31.9002C24.2045 31.3002 24.0909 30.6593 24.0909 30.0002C24.0909 29.3411 24.2045 28.7002 24.4045 28.1002V25.5093H21.0636C20.3864 26.8593 20 28.3866 20 30.0002C20 31.6138 20.3864 33.1411 21.0636 34.4911L24.4045 31.9002Z"
            fill="#FBBC05"
          />
          <Path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M29.9998 23.9773C31.468 23.9773 32.7862 24.4818 33.8226 25.4727L36.6907 22.6045C34.9589 20.9909 32.6953 20 29.9998 20C26.0907 20 22.7089 22.2409 21.0635 25.5091L24.4044 28.1C25.1907 25.7364 27.3953 23.9773 29.9998 23.9773Z"
            fill="#EA4335"
          />
        </G>
      </G>
      <Defs>
        <Filter
          id="filter0_d_2471_1534"
          x="0"
          y="0"
          width="60"
          height="60"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <FeFlood flood-opacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0.0705882 0 0 0 0 0.0705882 0 0 0 0 0.0705882 0 0 0 0.05 0"
          />
          <FeBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_2471_1534"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_2471_1534"
            result="shape"
          />
        </Filter>
        <ClipPath id="clip0_2471_1534">
          <Rect
            width="20"
            height="20"
            fill="white"
            transform="translate(20 20)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export default GoogleIcon;
