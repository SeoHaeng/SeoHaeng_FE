import React from "react";
import Svg, { Line, Mask, Path, Rect } from "react-native-svg";

const SpaceShareIcon = () => {
  return (
    <Svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <Path
        d="M25.1104 9.17773V25.1104H0.80957V9.17773L12.96 0.976562L25.1104 9.17773Z"
        stroke="black"
        strokeWidth="1.62"
      />
      <Line
        x1="13.1221"
        y1="1.2959"
        x2="13.1221"
        y2="9.0719"
        stroke="black"
        strokeWidth="1.62"
      />
      <Path
        d="M15.439 11.1777H10.8052L13.1216 9.16992L15.439 11.1777Z"
        stroke="black"
        strokeWidth="1.62"
      />
      <Path
        d="M18.7515 14.9434V16.8066H16.5308C16.1471 16.8066 15.8357 17.1173 15.8354 17.501V23.2861H10.0845V17.501C10.0843 17.1174 9.77292 16.8066 9.38916 16.8066H7.16846V14.9434H18.7515Z"
        stroke="black"
        strokeWidth="1.377"
      />
      <Path
        d="M3.78583 18.6699C3.95093 18.9466 4.20442 19.1602 4.5036 19.2783H3.88348L3.78583 18.6699Z"
        stroke="black"
        strokeWidth="1.62"
      />
      <Rect
        x="6.80398"
        y="19.115"
        width="0.648"
        height="4.536"
        rx="0.324"
        fill="#D9D9D9"
        stroke="black"
        strokeWidth="0.648"
      />
      <Rect
        x="3.86212"
        y="18.791"
        width="1.296"
        height="5.12712"
        rx="0.648"
        transform="rotate(10 3.86212 18.791)"
        fill="black"
      />
      <Path
        d="M22.1343 18.6699C21.9692 18.9466 21.7157 19.1602 21.4165 19.2783H22.0366L22.1343 18.6699Z"
        stroke="black"
        strokeWidth="1.62"
      />
      <Mask id="path-9-inside-1_1940_1736" fill="white">
        <Rect
          width="1.296"
          height="5.184"
          rx="0.648"
          transform="matrix(-1 0 0 1 19.4401 18.791)"
        />
      </Mask>
      <Rect
        width="1.296"
        height="5.184"
        rx="0.648"
        transform="matrix(-1 0 0 1 19.4401 18.791)"
        fill="#D9D9D9"
        stroke="black"
        strokeWidth="1.296"
        mask="url(#path-9-inside-1_1940_1736)"
      />
      <Rect
        width="1.296"
        height="5.12712"
        rx="0.648"
        transform="matrix(-0.984808 0.173648 0.173648 0.984808 22.058 18.791)"
        fill="black"
      />
    </Svg>
  );
};

export default SpaceShareIcon;
