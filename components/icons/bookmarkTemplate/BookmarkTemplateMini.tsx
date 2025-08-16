import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

interface BookmarkTemplateMiniProps {
  templateId: number;
}

export default function BookmarkTemplateMini({
  templateId,
}: BookmarkTemplateMiniProps) {
  const getBackgroundColor = (id: number): string => {
    switch (id) {
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

  const getStarColor = (id: number): string => {
    switch (id) {
      case 1:
        return "#D55227";
      case 2:
        return "#8BC34A";
      case 3:
        return "#604F4A";
      case 4:
        return "#6A5ACD";
      case 5:
        return "#E65100";
      default:
        return "#E65100";
    }
  };

  return (
    <Svg width={65} height={65} viewBox="0 0 65 65" fill="none">
      <Rect
        width={65}
        height={65}
        rx={5}
        fill={getBackgroundColor(templateId)}
      />
      <Path
        d="M39.3981 43.1835L30.2523 58L31.4923 42.7155L13.8207 50.046L26.3769 38.3487L7 39.1284L22.3465 33.3578L7 21.6606L23.8966 24.4679V7L30.2523 24.4679L39.3981 9.02752L36.1429 26.1835L49.4742 12.7706L39.3981 29.1467L55.0547 22.9083L39.3981 35.2293H58L39.3981 43.1835Z"
        fill={getStarColor(templateId)}
      />
    </Svg>
  );
}
