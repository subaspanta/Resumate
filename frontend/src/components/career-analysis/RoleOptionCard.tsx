"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import type { RoleSummary } from "@/src/features/roles/types";

interface RoleOptionCardProps {
  role: RoleSummary;
}

// Built on the bare Radix primitive rather than the small-checkbox-style
// RadioGroupItem in components/ui: this card IS the radio control (the
// whole row is the hit target and carries data-state=checked), not a radio
// dot next to separate label text.
export function RoleOptionCard({ role }: RoleOptionCardProps) {
  return (
    <RadioGroupPrimitive.Item value={role.slug} className="role-option">
      <span className="role-option-radio" aria-hidden="true">
        <RadioGroupPrimitive.Indicator className="role-option-radio-dot" />
      </span>
      <span>
        <span className="role-option-title">{role.title}</span>
        <span className="role-option-desc">{role.description}</span>
      </span>
    </RadioGroupPrimitive.Item>
  );
}
