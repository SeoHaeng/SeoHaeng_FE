import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface PreferenceBookstoreIconProps extends SvgProps {
  color?: string;
}

const PreferenceBookstoreIcon: React.FC<PreferenceBookstoreIconProps> = ({
  color = "#262423",
  ...props
}) => {
  return (
    <Svg width="14" height="18" viewBox="0 0 14 18" fill="none">
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.29479e-05 6.40869C2.32548e-05 2.89785 2.98566 1.00886e-06 6.66027 1.3301e-06C10.2775 1.64634e-06 13.2632 2.89785 13.2632 6.40869C13.2632 9.58327 10.4845 13.4796 8.09361 16.3415C7.35246 17.2286 5.98814 17.2112 5.24704 16.324C2.83718 13.4391 2.26573e-05 9.73269 2.29479e-05 6.40869Z"
        fill="white"
      />
      <Path
        d="M4.26318 6.86816H9.00003"
        stroke="#716C69"
        stroke-width="1.8"
        stroke-linecap="round"
      />
      <Path
        d="M6.63379 4.5L6.63379 9.23684"
        stroke="#716C69"
        stroke-width="1.8"
        stroke-linecap="round"
      />
    </Svg>
  );
};

export default PreferenceBookstoreIcon;
