import React from "react";
import { Icon, useStyleConfig } from "@chakra-ui/react";

const Starknet = (props: any) => {
  const { variant, size, ...rest } = props;
  const styles = useStyleConfig("Icon", { variant, size });

  return (
    <Icon viewBox="0 0 12 12" fill="currentColor" __css={styles} {...rest}>
      <path d="M6.00009 0C9.31378 0 12 2.68622 12 5.99991C12 9.31361 9.31378 11.9998 6.00009 11.9998C2.6864 11.9998 0 9.31361 0 5.99991C0 2.68622 2.6864 0 6.00009 0ZM3.28662 3.35117C2.50639 3.40008 1.80325 3.76919 1.35316 4.248C0.900758 4.73141 0.618473 5.29934 0.545643 5.90484C0.688262 5.90972 0.810928 5.93127 0.930294 5.96744L1.01655 5.99437C1.12306 6.02893 1.22337 6.07022 1.3186 6.11412C1.54223 6.22009 1.73946 6.3397 1.93066 6.4687C2.22861 6.66808 2.506 6.89153 2.78079 7.11987L2.85568 7.18225L3.0054 7.3074C3.15561 7.42512 3.3031 7.56366 3.45365 7.68811L3.52921 7.74899L3.792 7.97918L3.85571 8.03279C3.88653 8.05854 3.91663 8.08339 3.94984 8.1103L4.01186 8.16009L4.0819 8.21539C4.54334 8.57706 5.06396 8.90471 5.66645 9.15403C6.26664 9.39981 6.97208 9.5632 7.71368 9.51305C8.43947 9.47002 9.1527 9.18896 9.67984 8.78367L9.75788 8.72275C10.2742 8.3132 10.6318 7.81358 10.8909 7.30173C11.1511 6.76888 11.3176 6.21707 11.3697 5.62858C11.0857 5.75351 10.8259 5.8795 10.5757 5.98512L10.4688 6.02872C10.2745 6.1074 10.0895 6.17807 9.91069 6.22369L9.82219 6.24524C9.38647 6.34828 9.05417 6.31915 8.78947 6.21424C8.51428 6.11518 8.22615 5.94613 7.88787 5.7147C7.63376 5.53947 7.36385 5.33622 7.08255 5.1163L6.95193 5.01366L6.8103 4.90134L6.22499 4.43955L5.85003 4.15567C5.70933 4.06122 5.5681 3.96766 5.41713 3.88207C5.115 3.71178 4.77973 3.56718 4.42196 3.46795C4.06259 3.36836 3.67168 3.32548 3.28662 3.35117ZM2.61911 8.70282C2.43996 8.70282 2.29483 8.84813 2.29483 9.02728C2.29483 9.20643 2.43996 9.35174 2.61911 9.35174C2.79826 9.35174 2.94357 9.20643 2.94357 9.02728C2.94357 8.84813 2.79826 8.70282 2.61911 8.70282ZM8.9124 2.61512C8.89227 2.55288 8.80707 2.55069 8.78196 2.6075L8.77879 2.61601L8.63331 3.08967C8.60545 3.18023 8.53773 3.25259 8.45008 3.28664L8.43342 3.29257L7.96188 3.44514C7.89981 3.46527 7.89747 3.55047 7.95441 3.57559L7.96295 3.57875L8.43661 3.72441C8.52717 3.7521 8.59952 3.81981 8.63358 3.90761L8.63951 3.9243L8.79208 4.39566C8.81221 4.45791 8.89741 4.46009 8.92252 4.40313L8.92569 4.3946L9.07117 3.92111C9.09903 3.83055 9.16675 3.75804 9.2544 3.72397L9.27106 3.71803L9.7426 3.56546C9.80484 3.54533 9.80703 3.4603 9.75007 3.43504L9.74153 3.43185L9.26787 3.28637C9.17731 3.25852 9.10496 3.19079 9.0709 3.10315L9.06497 3.08648L8.9124 2.61512Z" />
    </Icon>
  );
};

export default Starknet;
