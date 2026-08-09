"use client";

import * as React from "react";
import { motion } from "motion/react";
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
      <motion.div
        initial={false}
        animate={{ opacity: isLoading ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex items-center justify-center gap-2 pointer-events-none"
      >
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <span>{loadingText}</span>
      </motion.div>
      <motion.div
        initial={false}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </button>
  );
}
