"use client";

import { UseFormRegisterReturn } from "react-hook-form";

interface RememberMeCheckboxProps {
  registration: UseFormRegisterReturn;
  disabled?: boolean;
}

export function RememberMeCheckbox({
  registration,
  disabled,
}: RememberMeCheckboxProps) {
  return (
    <div className="flex items-center gap-sm pt-sm">
      <input
        {...registration}
        disabled={disabled}
        className="w-4 h-4 rounded border-border-input text-primary focus:ring-primary cursor-pointer"
        id="remember"
        type="checkbox"
      />
      <label
        className="font-body-md text-body-md text-text-body cursor-pointer select-none"
        htmlFor="remember"
      >
        Remember me for 30 days
      </label>
    </div>
  );
}
