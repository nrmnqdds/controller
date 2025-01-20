import { cva } from "class-variance-authority";

const base = "";

export const size = {
  xs: "h-4 w-4",
  sm: "h-5 w-5",
  default: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

export const iconVariants = cva(base, {
  variants: {
    size,
  },
  defaultVariants: {
    size: "default",
  },
});
