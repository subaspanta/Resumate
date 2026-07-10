"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type AuthSubmitButtonProps = React.ComponentProps<"button"> & {
  isLoading: boolean;
  loadingText: string;
  children: React.ReactNode;
  variant?: "login" | "register";
};

export function AuthSubmitButton({
  isLoading,
  loadingText,
  children,
  className,
  disabled,
  variant = "login",
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || disabled}
      className={cn(
        "auth-btn-primary",
        variant === "login"
          ? "auth-btn-primary--login"
          : "auth-btn-primary--register",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
