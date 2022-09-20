import React from "react";
import { IconProps } from "@chakra-ui/react";
import Icon from "./Icon";

export function Collapse({
  className,
  ...rest
}: IconProps & { className?: string }) {
  return (
    <Icon className={className} {...rest}>
      <path
        d="M12.0004 14.6571C12.2197 14.6571 12.4391 14.7408 12.6063 14.9082L17.7489 20.0508C18.0837 20.3856 18.0837 20.928 17.7489 21.2628C17.4141 21.5976 16.8717 21.5976 16.5369 21.2628L12.0004 16.7248L7.4631 21.2621C7.1283 21.5969 6.58591 21.5969 6.25111 21.2621C5.9163 20.9273 5.9163 20.3849 6.25111 20.0501L11.3937 14.9075C11.5611 14.7401 11.7808 14.6571 12.0004 14.6571Z"
        fill="black"
      />
      <path
        d="M11.9996 9.85684C11.7803 9.85684 11.5609 9.77314 11.3937 9.60573L6.2511 4.4631C5.9163 4.1283 5.9163 3.58591 6.2511 3.2511C6.58591 2.9163 7.1283 2.9163 7.4631 3.2511L11.9996 7.78907L16.5369 3.25177C16.8717 2.91697 17.4141 2.91697 17.7489 3.25177C18.0837 3.58658 18.0837 4.12897 17.7489 4.46377L12.6063 9.6064C12.4389 9.77381 12.2192 9.85684 11.9996 9.85684Z"
        fill="black"
      />
    </Icon>
  );
}

export default Collapse;
