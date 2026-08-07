"use client";

import { CircleCheck } from "lucide-react";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_NUMBER_REGEX,
  PASSWORD_SYMBOL_REGEX,
  PASSWORD_UPPERCASE_REGEX,
} from "../auth.schemas";

interface PasswordStrengthChecklistProps {
  password: string;
}

export function PasswordStrengthChecklist({
  password,
}: PasswordStrengthChecklistProps) {
  const hasLength = password.length >= PASSWORD_MIN_LENGTH;
  const hasUpper = PASSWORD_UPPERCASE_REGEX.test(password);
  const hasNumber = PASSWORD_NUMBER_REGEX.test(password);
  const hasSymbol = PASSWORD_SYMBOL_REGEX.test(password);

  const items = [
    {
      id: "length",
      label: `${PASSWORD_MIN_LENGTH}+ characters`,
      met: hasLength,
    },
    { id: "upper", label: "Uppercase", met: hasUpper },
    { id: "number", label: "Number", met: hasNumber },
    { id: "symbol", label: "Symbol", met: hasSymbol },
  ];

  return (
    <div className="auth-password-check">
      {items.map((item) => (
        <div
          key={item.id}
          className={`auth-password-check-item ${
            item.met
              ? "auth-password-check-item--met"
              : "auth-password-check-item--unmet"
          }`}
          id={`v-${item.id}`}
        >
          <CircleCheck size={14} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
