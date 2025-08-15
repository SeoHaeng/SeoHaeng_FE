import React from "react";
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";

interface BookmarkTemplateProps {
  width?: number;
  height?: number;
  templateId?: number;
}

export default function BookmarkTemplate({
  width = 178,
  height = 178,
  templateId = 1,
}: BookmarkTemplateProps) {
  // templateId에 따른 색상 설정
  const getBackgroundColor = () => {
    switch (templateId) {
      case 1:
        return "#FF5E29"; // 오렌지색
      case 2:
        return "#B9FF66"; // 연한 초록색
      case 3:
        return "#75615B"; // 갈색
      case 4:
        return "#8A73FF"; // 보라색
      default:
        return "#FF6B35"; // 기본 색상
    }
  };

  const backgroundColor = getBackgroundColor();

  return (
    <Svg width={width} height={height} viewBox="0 0 178 178" fill="none">
      <Rect
        width="177.363"
        height="177.363"
        rx="7.36967"
        fill={backgroundColor}
      />
      <Rect
        x="0.245656"
        y="0.245656"
        width="176.872"
        height="176.872"
        rx="7.12401"
        stroke="url(#paint0_linear_272_10378)"
        strokeOpacity="0.33"
        strokeWidth="0.491311"
      />
      <Path
        d="M138.495 157.828L129.773 171.959L130.956 157.381L114.102 164.373L126.077 153.217L107.597 153.96L122.233 148.457L107.597 137.301L123.711 139.978V123.319L129.773 139.978L138.495 125.253L135.391 141.615L148.105 128.822L138.495 144.441L153.427 138.491L138.495 150.242H156.236L138.495 157.828Z"
        fill="rgba(0,0,0,0.2)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_272_10378"
          x1="17.4416"
          y1="-4.99226e-06"
          x2="169.748"
          y2="209.053"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="white" stopOpacity="0.5" />
          <Stop offset="1" stopColor="#999999" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
