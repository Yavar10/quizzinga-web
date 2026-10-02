import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const baseClass = `btn-${variant}`;
  return (
    <button className={`${baseClass} ${className}`} {...props} />
  );
}
