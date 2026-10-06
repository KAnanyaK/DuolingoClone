import React from "react";

export type ButtonVariant =
  | "primary"      // Feather Green (#58CC02)
  | "secondary"    // Sky Blue (#1CB0F6)
  | "danger"       // Incorrect Red (#FF4B4B)
  | "super"        // Premium Gold/Amber
  | "default"      // White neutral
  | "ghost"        // Transparent / subtle
  | "sidebar"      // Sidebar nav buttons
  | "sidebarActive";

export type ButtonSize = "sm" | "md" | "lg" | "rounded-full";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  disabled = false,
  children,
  ...props
}) => {
  // Base 3D styles
  const baseStyles =
    "relative inline-flex items-center justify-center font-extrabold uppercase tracking-wider select-none transition-all duration-100 ease-out active:translate-y-1 active:border-b-0 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0 disabled:active:border-b-4";

  // Variant styling with 3D bottom borders
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-[#58CC02] text-white border-b-4 border-[#46a302] hover:bg-[#52be02]",
    secondary:
      "bg-[#1CB0F6] text-white border-b-4 border-[#1899d6] hover:bg-[#18a2e2]",
    danger:
      "bg-[#FF4B4B] text-white border-b-4 border-[#ea2b2b] hover:bg-[#f53e3e]",
    super:
      "bg-[#FFC800] text-white border-b-4 border-[#e5a800] hover:bg-[#f2bd00]",
    default:
      "bg-white text-[#4B4B4B] border-2 border-[#e5e5e5] border-b-4 border-b-[#e5e5e5] hover:bg-[#f7f7f7]",
    ghost:
      "bg-transparent text-[#777777] border-0 hover:bg-[#f1f1f1] active:translate-y-0",
    sidebar:
      "bg-transparent text-[#777777] border-2 border-transparent hover:bg-[#f7f7f7] font-bold text-left justify-start normal-case tracking-normal rounded-2xl active:translate-y-0",
    sidebarActive:
      "bg-[#ddf4ff] text-[#1cb0f6] border-2 border-[#84d8ff] font-extrabold text-left justify-start normal-case tracking-normal rounded-2xl active:translate-y-0",
  };

  // Size styling
  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs rounded-xl",
    md: "px-5 py-3 text-sm rounded-2xl",
    lg: "px-8 py-4 text-base rounded-2xl",
    "rounded-full": "p-3 rounded-full",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
