import React from "react";
import { Icon, useStyleConfig } from "@chakra-ui/react";

const Transfer = (props: any) => {
  const { variant, size, ...rest } = props;
  const styles = useStyleConfig("Icon", { variant, size });

  return (
    <Icon viewBox="0 0 14 12" fill="currentColor" __css={styles} {...rest}>
      <path d="M0.333374 3.79174V3.37508C0.333374 3.02989 0.613192 2.75008 0.958374 2.75008H10.9055L10.1121 2.02799C9.8565 1.78609 9.8509 1.38096 10.0998 1.13211L10.382 0.849814C10.6261 0.605726 11.0218 0.605726 11.2659 0.849814L13.4226 2.99416C13.7481 3.31961 13.7481 3.84724 13.4226 4.17268L11.2659 6.31703C11.0218 6.56112 10.6261 6.56112 10.382 6.31703L10.0998 6.03474C9.8509 5.78588 9.8565 5.38073 10.1121 5.13885L10.9055 4.41674H0.958374C0.613192 4.41674 0.333374 4.13692 0.333374 3.79174ZM13.0417 7.75008H3.09457L3.88798 7.02799C4.14358 6.78609 4.14918 6.38096 3.90033 6.13211L3.61804 5.84982C3.37395 5.60573 2.97824 5.60573 2.73416 5.84982L0.577463 7.99416C0.25202 8.31961 0.25202 8.84724 0.577463 9.17268L2.73416 11.317C2.97824 11.5611 3.37397 11.5611 3.61804 11.317L3.90033 11.0347C4.14918 10.7859 4.14358 10.3808 3.88798 10.1389L3.09457 9.41674H13.0417C13.3869 9.41674 13.6667 9.13693 13.6667 8.79174V8.37508C13.6667 8.02989 13.3869 7.75008 13.0417 7.75008Z" />
    </Icon>
  );
};

export default Transfer;
