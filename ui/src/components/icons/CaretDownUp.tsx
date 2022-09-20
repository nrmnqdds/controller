import React from "react";
import { IconProps } from "@chakra-ui/react";
import Icon from "./Icon";

export function CaretDownUp({
  className,
  ...rest
}: IconProps & { className?: string }) {
  return (
    <Icon className={className} {...rest}>
      <path
        d="M18.6157 8.02375L13.0434 2.41207C12.7322 2.13587 12.3727 1.99997 12.0132 1.99997C11.6537 1.99997 11.295 2.13697 11.021 2.41098L5.44882 8.02265C5.00841 8.42271 4.88826 9.02771 5.10545 9.54942C5.32264 10.0711 5.83462 10.4175 6.40149 10.4175H17.5854C18.1527 10.4175 18.6648 10.0764 18.8822 9.55162C19.0997 9.02688 19.019 8.4227 18.6157 8.02375Z"
        fill="black"
      />
      <path
        d="M18.6157 16.8112L13.0434 22.4229C12.7322 22.6991 12.3727 22.835 12.0132 22.835C11.6537 22.835 11.295 22.698 11.021 22.424L5.44882 16.8123C5.00841 16.4123 4.88826 15.8072 5.10545 15.2855C5.32264 14.7638 5.83462 14.4175 6.40149 14.4175H17.5854C18.1527 14.4175 18.6648 14.7586 18.8822 15.2833C19.0997 15.8081 19.019 16.4123 18.6157 16.8112Z"
        fill="black"
      />
    </Icon>
  );
}

export default CaretDownUp;
