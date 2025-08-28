import React from "react";
import Svg, { Mask, Rect } from "react-native-svg";

export default function CreditIcon() {
  return (
    <Svg width="24" height="20" viewBox="0 0 24 20" fill="none">
      <Rect
        x="1"
        y="1"
        width="22"
        height="17.5"
        rx="2"
        stroke="black"
        strokeWidth="2"
      />
      <Rect x="0.75" y="4.64258" width="22.5" height="1.85714" fill="black" />
      <Rect x="0.75" y="7.42773" width="22.5" height="1.85714" fill="black" />
      <Rect
        x="2.25"
        y="10.2148"
        width="3.75"
        height="1.85714"
        rx="0.928571"
        fill="black"
      />
      <Mask id="path-5-inside-1_1919_139" fill="white">
        <Rect x="17.25" y="13.9287" width="4.5" height="2.78571" rx="1" />
      </Mask>
      <Rect
        x="17.25"
        y="13.9287"
        width="4.5"
        height="2.78571"
        rx="1"
        stroke="black"
        strokeWidth="2.78571"
        mask="url(#path-5-inside-1_1919_139)"
      />
    </Svg>
  );
}
