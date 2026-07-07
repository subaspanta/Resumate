"use client";

import { useState } from "react";
import { FieldValues, UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
}: AuthFormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType =
    showPasswordToggle && showPassword ? "text" : type || "text";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label
          htmlFor={id}
          className="font-label-std text-label-std font-bold text-text-primary"
        >
          {label}
        </Label>
        {labelAction && <div>{labelAction}</div>}
      </div>

      <div className="relative">
        <Input
          {...registration}
          disabled={disabled}
          id={id}
          placeholder={placeholder}
          type={inputType}
          className={cn(
            "w-full h-12 px-4 py-3 rounded-lg border bg-white font-body-md text-body-md text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 transition-all placeholder:text-slate-400",
            error
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-slate-300 focus-visible:border-indigo-500"
          )}
        />
        {showPasswordToggle && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-500 hover:text-slate-700 transition-all bg-transparent border-0 cursor-pointer font-medium"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        )}
      </div>

      {error && (
        <p className="font-label-std text-[11px] text-danger mt-1 px-2 py-1">
          {error}
        </p>
      )}

      {footer && <div className="mt-2">{footer}</div>}
    </div>
  );
}
