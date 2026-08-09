"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";

interface AuthFormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  disabled?: boolean;
  labelAction?: React.ReactNode;
  showPasswordToggle?: boolean;
  footer?: React.ReactNode;
  variant?: "login" | "register";
  index?: number;
}

export function AuthFormField({
  id,
  label,
  type = "text",
  placeholder,
  registration,
  error,
  disabled,
  labelAction,
  showPasswordToggle,
  footer,
  variant = "login",
  index = 0,
}: AuthFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    showPasswordToggle && showPassword ? "text" : type || "text";

  return (
    <motion.div
      className={cn(
        "auth-field",
        variant === "login" ? "auth-field--login" : "auth-field--register"
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="auth-label">
          {label}
        </label>
        {labelAction}
      </div>

      <div className="relative">
        <input
          {...registration}
          disabled={disabled}
          id={id}
          placeholder={placeholder}
          type={inputType}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "auth-input",
            variant === "register" && "auth-input--register",
            showPasswordToggle && "auth-input--password",
            error && "auth-input--error"
          )}
        />
        {showPasswordToggle && (
          <button
            className="auth-input-toggle"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            aria-label={showPassword ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="auth-error" role="alert">
          {error}
        </p>
      )}

      {footer}
    </motion.div>
  );
}
