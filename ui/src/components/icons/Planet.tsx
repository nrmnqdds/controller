import React from "react";
import { Icon, useStyleConfig } from "@chakra-ui/react";

const Coin = (props: any) => {
  const { variant, size, ...rest } = props;
  const styles = useStyleConfig("Icon", { variant, size });

  return (
    <Icon viewBox="0 0 12 12" fill="currentColor" __css={styles} {...rest}>
      <path d="M11.6611 0.31505C11.1479 -0.198229 10.1853 -0.0845572 8.79943 0.657705C8.61716 0.755064 8.54841 0.982079 8.64643 1.16512C8.74379 1.34815 8.97221 1.41708 9.15385 1.31812C10.2556 0.727971 10.9431 0.654846 11.132 0.845158C11.2864 1.00036 11.3362 1.6357 10.5397 3.03843C10.4382 3.21728 10.3256 3.40101 10.2067 3.58757C9.36619 2.11968 7.78792 1.1243 5.97855 1.1243C3.29262 1.1243 1.12467 3.31194 1.12467 5.97818C1.12467 7.78732 2.11935 9.36489 3.58794 10.2063C3.40159 10.3253 3.21786 10.4379 3.03903 10.5393C1.63865 11.3357 1.00021 11.286 0.84576 11.1316C0.655425 10.942 0.727894 10.2567 1.31873 9.15348C1.41681 8.97046 1.348 8.74356 1.16573 8.64606C0.984908 8.5465 0.756511 8.61679 0.658308 8.79906C-0.0839545 10.1849 -0.199032 11.1475 0.315653 11.6608C0.504934 11.8945 0.790401 12 1.14899 12C1.71571 12 2.46383 11.7373 3.38609 11.213C3.7032 11.0327 4.0332 10.8241 4.34937 10.594C4.85327 10.7708 5.3928 10.8743 5.95624 10.8743C8.64216 10.8743 10.8101 8.68665 10.8101 6.02042C10.8101 5.45698 10.7069 4.91698 10.53 4.41308C10.7603 4.07582 10.9688 3.74605 11.149 3.4498C12.0268 1.90012 12.2049 0.859736 11.6611 0.31505ZM1.85399 5.97893C1.85399 3.70574 3.7039 1.85629 5.97663 1.85629C7.64045 1.85629 9.07505 2.84957 9.72427 4.27269C9.04365 5.22214 8.18303 6.22924 7.20475 7.20705C6.226 8.1858 5.2189 9.04642 4.27039 9.72657C2.84633 9.09611 1.85399 7.64299 1.85399 5.97893ZM10.1002 5.97893C10.1002 8.25213 8.25029 10.1016 5.97757 10.1016C5.69093 10.1016 5.41108 10.0718 5.14085 10.0159C5.9935 9.36805 6.87709 8.59602 7.73537 7.73681C8.59365 6.87759 9.36638 5.99424 10.0142 5.14229C10.0697 5.43284 10.1002 5.71175 10.1002 5.97893Z" />
    </Icon>
  );
};

export default Coin;
