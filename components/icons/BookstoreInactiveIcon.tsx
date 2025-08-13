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
  Path,
} from "react-native-svg";

interface BookstoreInactiveIconProps {
  width?: number;
  height?: number;
}

export default function BookstoreInactiveIcon({
  width = 36,
  height = 37,
}: BookstoreInactiveIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 36 37" fill="none">
      <g filter="url(#filter0_d_68_1380)">
        <Circle cx="17.8656" cy="17.8656" r="12.8656" fill="#08A758" />
        <Circle
          cx="17.8656"
          cy="17.8656"
          r="13.2806"
          stroke="#0D7E46"
          strokeWidth="0.83004"
        />
      </g>
      <Path
        d="M13.5283 23.2609C13.1875 23.2609 12.8958 23.1346 12.6533 22.882C12.4105 22.6289 12.289 22.3248 12.289 21.9698V16.8374C12.0515 16.6114 11.8683 16.3209 11.7394 15.9658C11.6101 15.6107 11.6074 15.2234 11.7314 14.8038L12.382 12.6088C12.4646 12.329 12.6118 12.0977 12.8237 11.9148C13.0352 11.7318 13.2804 11.6404 13.5592 11.6404H22.172C22.4508 11.6404 22.6935 11.729 22.9 11.9064C23.1066 12.0841 23.2563 12.3182 23.3493 12.6088L23.9999 14.8038C24.1238 15.2234 24.1213 15.6054 23.9924 15.9497C23.8631 16.294 23.6797 16.5899 23.4422 16.8374V21.9698C23.4422 22.3248 23.321 22.6289 23.0785 22.882C22.8356 23.1346 22.5437 23.2609 22.203 23.2609H13.5283ZM19.2288 16.1595C19.5076 16.1595 19.7193 16.0598 19.8639 15.8606C20.0085 15.6617 20.0653 15.4386 20.0343 15.1911L19.6935 12.9316H18.4852V15.3202C18.4852 15.5462 18.5575 15.7427 18.7021 15.9096C18.8467 16.0762 19.0222 16.1595 19.2288 16.1595ZM16.4405 16.1595C16.678 16.1595 16.8717 16.0762 17.0217 15.9096C17.1712 15.7427 17.246 15.5462 17.246 15.3202V12.9316H16.0377L15.6969 15.1911C15.6556 15.4493 15.7099 15.6753 15.8599 15.869C16.0094 16.0626 16.203 16.1595 16.4405 16.1595ZM13.6832 16.1595C13.869 16.1595 14.0316 16.0895 14.1708 15.9497C14.3104 15.8098 14.3957 15.6323 14.4267 15.4171L14.7675 12.9316H13.5592L12.9396 15.0943C12.8777 15.3095 12.9111 15.5408 13.04 15.7883C13.1693 16.0357 13.3837 16.1595 13.6832 16.1595ZM22.048 16.1595C22.3475 16.1595 22.5644 16.0357 22.6986 15.7883C22.8329 15.5408 22.8639 15.3095 22.7916 15.0943L22.141 12.9316H20.9637L21.3045 15.4171C21.3355 15.6323 21.4208 15.8098 21.5604 15.9497C21.6996 16.0895 21.8622 16.1595 22.048 16.1595Z"
        fill="#0D7E46"
      />
      <Defs>
        <Filter
          id="filter0_d_68_1380"
          x="0.0197244"
          y="0.849764"
          width="35.6918"
          height="35.6918"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="0.83004" />
          <FeGaussianBlur stdDeviation="2.0751" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.15 0"
          />
          <FeBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_68_1380"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_68_1380"
            result="shape"
          />
        </Filter>
      </Defs>
    </Svg>
  );
}
