"use client";

import { useState } from "react";
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
}: AuthFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    showPasswordToggle && showPassword ? "text" : type || "text";

  return (
    <div
      className={cn(
        "auth-field",
        variant === "login" ? "auth-field--login" : "auth-field--register"
      )}
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
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && <p className="auth-error">{error}</p>}

      {footer}
    </div>
  );
}
