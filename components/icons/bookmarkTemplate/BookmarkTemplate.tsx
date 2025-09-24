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
  // templateId에 따른 완전한 SVG 렌더링
  const renderTemplate = () => {
    switch (templateId) {
      case 1:
        // 갈색 배경 + 5각별
        return (
          <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
          >
            <Rect width={width} height={height} rx="10" fill="#75615B" />
            <Rect
              x="0.5"
              y="0.5"
              width={width - 1}
              height={height - 1}
              rx="9.5"
              stroke="url(#paint0_linear_1992_1788)"
              strokeOpacity="0.33"
            />
            <Path
              d="M281.89 321.239L264.137 350L266.544 320.33L232.24 334.56L256.614 311.853L219 313.367L248.79 302.165L219 279.459L251.799 284.908V251L264.137 284.908L281.89 254.936L275.571 288.238L301.45 262.202L281.89 293.991L312.283 281.881L281.89 305.798H318L281.89 321.239Z"
              fill="#604F4A"
              transform={`scale(${width / 361})`}
            />
            <Defs>
              <LinearGradient
                id="paint0_linear_1992_1788"
                x1="35.5"
                y1="-1.01611e-05"
                x2="345.5"
                y2="425.5"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="white" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#999999" />
              </LinearGradient>
            </Defs>
          </Svg>
        );

      case 2:
        // 오렌지 배경 + 별
        return (
          <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
          >
            <Rect width={width} height={height} rx="10" fill="#FF5E29" />
            <Rect
              x="0.5"
              y="0.5"
              width={width - 1}
              height={height - 1}
              rx="9.5"
              stroke="url(#paint0_linear_1992_1728)"
              strokeOpacity="0.33"
            />
            <Rect
              x="0.5"
              y="0.5"
              width={width - 1}
              height={height - 1}
              rx="9.5"
              stroke="url(#paint1_linear_1992_1728)"
              strokeOpacity="0.33"
            />
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M236.18 302L218 291.545L231.4 268.455L249.59 278.891L249.6 258H276.4L276.41 278.891L294.6 268.455L308 291.545L289.82 302L308 312.455L294.6 335.545L276.41 325.109L276.4 346H249.6L249.59 325.109L231.4 335.545L218 312.455L236.18 302Z"
              fill="#D55227"
              transform={`scale(${width / 361})`}
            />
            <Defs>
              <LinearGradient
                id="paint0_linear_1992_1728"
                x1="35.5"
                y1="-1.01611e-05"
                x2="345.5"
                y2="425.5"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="white" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#999999" />
              </LinearGradient>
              <LinearGradient
                id="paint1_linear_1992_1728"
                x1="35.5"
                y1="-1.01611e-05"
                x2="345.5"
                y2="425.5"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="white" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#999999" />
              </LinearGradient>
            </Defs>
          </Svg>
        );

      case 3:
        // 보라 배경 + 책
        return (
          <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
          >
            <Rect width={width} height={height} rx="10" fill="#8A73FF" />
            <Rect
              x="0.5"
              y="0.5"
              width={width - 1}
              height={height - 1}
              rx="9.5"
              stroke="url(#paint0_linear_1992_1743)"
              strokeOpacity="0.33"
            />
            <Rect
              x="0.5"
              y="0.5"
              width={width - 1}
              height={height - 1}
              rx="9.5"
              stroke="url(#paint1_linear_1992_1743)"
              strokeOpacity="0.33"
            />
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M247.25 305.5L223 281V330L247.25 305.5ZM271.5 305.5L247.25 281V305.5V330L271.5 305.5ZM295.75 305.5L271.5 281V305.5V330L295.75 305.5ZM295.75 305.5V281L320 305.5L295.75 330V305.5Z"
              fill="#715CE0"
              transform={`scale(${width / 361})`}
            />
            <Defs>
              <LinearGradient
                id="paint0_linear_1992_1743"
                x1="35.5"
                y1="-1.01611e-05"
                x2="345.5"
                y2="425.5"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="white" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#999999" />
              </LinearGradient>
              <LinearGradient
                id="paint1_linear_1992_1743"
                x1="35.5"
                y1="-1.01611e-05"
                x2="345.5"
                y2="425.5"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="white" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#999999" />
              </LinearGradient>
            </Defs>
          </Svg>
        );

      case 4:
        // 핑크 배경 + 원들
        return (
          <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
          >
            <Rect width={width} height={height} rx="10" fill="#FF6161" />
            <Rect
              x="0.5"
              y="0.5"
              width={width - 1}
              height={height - 1}
              rx="9.5"
              stroke="url(#paint0_linear_1992_1758)"
              strokeOpacity="0.33"
            />
            <Rect
              x="0.5"
              y="0.5"
              width={width - 1}
              height={height - 1}
              rx="9.5"
              stroke="url(#paint1_linear_1992_1758)"
              strokeOpacity="0.33"
            />
            <Path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M275.006 257C284.032 257 291.349 264.313 291.349 273.333C291.349 282.353 284.032 289.666 275.006 289.666C265.979 289.666 258.662 282.353 258.662 273.333C258.662 264.313 265.979 257 275.006 257ZM247.702 340.879C240.4 335.578 238.781 325.363 244.087 318.065C249.392 310.768 259.612 309.15 266.915 314.452C274.217 319.754 275.836 329.968 270.531 337.266C265.225 344.564 255.004 346.182 247.702 340.879ZM305.977 318.065C311.283 325.363 309.664 335.578 302.362 340.879C295.06 346.182 284.839 344.564 279.534 337.266C274.228 329.968 275.847 319.754 283.149 314.452C290.452 309.15 300.672 310.768 305.977 318.065ZM230.804 289.014C233.594 280.435 242.814 275.741 251.398 278.528C259.982 281.315 264.68 290.53 261.891 299.109C259.102 307.688 249.882 312.383 241.297 309.595C232.713 306.808 228.015 297.594 230.804 289.014ZM298.602 278.528C307.187 275.741 316.406 280.435 319.196 289.014C321.985 297.594 317.287 306.808 308.703 309.595C300.118 312.383 290.898 307.688 288.109 299.109C285.32 290.53 290.018 281.315 298.602 278.528Z"
              fill="#E44848"
              transform={`scale(${width / 361})`}
            />
            <Defs>
              <LinearGradient
                id="paint0_linear_1992_1758"
                x1="35.5"
                y1="-1.01611e-05"
                x2="345.5"
                y2="425.5"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="white" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#999999" />
              </LinearGradient>
              <LinearGradient
                id="paint1_linear_1992_1758"
                x1="35.5"
                y1="-1.01611e-05"
                x2="345.5"
                y2="425.5"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="white" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#999999" />
              </LinearGradient>
            </Defs>
          </Svg>
        );

      default:
        // 기본값 (templateId = 1과 동일)
        return (
          <Svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
          >
            <Rect width={width} height={height} rx="5" fill="#75615B" />
            <Rect
              x="0.5"
              y="0.5"
              width={width - 1}
              height={height - 1}
              rx="4.5"
              stroke="url(#paint0_linear_1992_1788)"
              strokeOpacity="0.33"
            />
            <Path
              d="M281.89 321.239L264.137 350L266.544 320.33L232.24 334.56L256.614 311.853L219 313.367L248.79 302.165L219 279.459L251.799 284.908V251L264.137 284.908L281.89 254.936L275.571 288.238L301.45 262.202L281.89 293.991L312.283 281.881L281.89 305.798H318L281.89 321.239Z"
              fill="#604F4A"
              transform={`scale(${width / 361})`}
            />
            <Defs>
              <LinearGradient
                id="paint0_linear_1992_1788"
                x1="35.5"
                y1="-1.01611e-05"
                x2="345.5"
                y2="425.5"
                gradientUnits="userSpaceOnUse"
              >
                <Stop stopColor="white" stopOpacity="0.5" />
                <Stop offset="1" stopColor="#999999" />
              </LinearGradient>
            </Defs>
          </Svg>
        );
    }
  };

  return renderTemplate();
}
