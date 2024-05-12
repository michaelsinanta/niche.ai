import React from "react";
import { type ButtonProps } from "./interface";

export const Button: React.FC<ButtonProps> = ({
  className,
  children,
  variant,
  onClick,
  // leftIcon,
  // rightIcon,
  disabled,
  isLoading,
  type,
}) => {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled || isLoading}
        type={type}
        className={`
          ${className} flex items-center rounded-[15px] px-[20px] py-[12px] hover:bg-violet-900
          ${
            variant === "primary"
              ? "bg-primary  text-white active:bg-[#603994]"
              : ""
          }
          ${
            variant === "white"
              ? "border  border-primary bg-white text-primary active:bg-gray-100"
              : ""
          }
        `}
      >
        {children}
      </button>
    </>
  );
};
