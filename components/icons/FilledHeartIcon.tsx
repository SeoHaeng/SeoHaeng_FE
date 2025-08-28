import React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

interface FilledHeartIconProps extends SvgProps {
  color?: string;
  isActive?: boolean;
}

const FilledHeartIcon: React.FC<FilledHeartIconProps> = ({
  color = "#E55E5E",
  isActive = false,
  ...props
}) => {
  const iconColor = isActive ? color : "#C5BFBB"; // 활성화되지 않았을 때는 회색

  return (
    <Svg width="21" height="20" viewBox="0 0 21 20" fill="none" {...props}>
      <Path
        d="M19.3807 1.76815C18.8676 1.20759 18.2583 0.762921 17.5878 0.459537C16.9172 0.156152 16.1985 0 15.4727 0C14.7468 0 14.0281 0.156152 13.3576 0.459537C12.687 0.762921 12.0778 1.20759 11.5646 1.76815L11.2372 2.12569C10.8408 2.55851 10.1587 2.55851 9.76227 2.12569L9.43482 1.76815C8.39834 0.636397 6.99258 0.000586625 5.52679 0.000586637C4.06099 0.000586649 2.65523 0.636397 1.61876 1.76815C0.582285 2.89989 1.0921e-08 4.43487 0 6.03541C-1.0921e-08 7.63594 0.582285 9.17092 1.61876 10.3027L9.76226 19.1947C10.1586 19.6276 10.8408 19.6276 11.2372 19.1947L19.3807 10.3027C19.8941 9.74238 20.3013 9.07714 20.5791 8.34495C20.857 7.61276 21 6.82796 21 6.03541C21 5.24285 20.857 4.45806 20.5791 3.72587C20.3013 2.99368 19.8941 2.32844 19.3807 1.76815Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default FilledHeartIcon;
