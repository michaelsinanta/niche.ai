import { type ReactNode } from "react";

export interface ButtonProps {
  className?: string;
  // rightIcon?: any
  // leftIcon?: any
  variant: "primary" | "white" | "lightpurple";
  size: "md" | "lg";
  children?: ReactNode;
  disabled?: boolean;
  isLoading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}
