"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import Link from "next/link";
import type { RoleSummary } from "@/src/features/roles/types";

interface RoleOptionCardProps {
  role: RoleSummary;
}

// Built on the bare Radix primitive rather than the small-checkbox-style
// RadioGroupItem in components/ui: this card IS the radio control (the
// whole row is the hit target and carries data-state=checked), not a radio
// dot next to separate label text.
//
// The "View details" link is a sibling of the Item, not nested inside it —
// Item renders as a native <button role="radio">, and a <button><a> pair is
// invalid HTML (interactive-in-interactive), so the wrapper positions the
// link at the same visual corner via CSS instead.
export function RoleOptionCard({ role }: RoleOptionCardProps) {
  return (
    <div className="role-option-wrapper">
      <RadioGroupPrimitive.Item value={role.slug} className="card role-option">
        <span className="role-option-radio" aria-hidden="true">
          <RadioGroupPrimitive.Indicator className="role-option-radio-dot" />
        </span>
        <span>
          <span className="entry-title role-option-title">{role.title}</span>
          <span className="body-copy body-copy--muted role-option-desc">{role.description}</span>
        </span>
      </RadioGroupPrimitive.Item>
      <Link
        href={`/roles/${role.slug}`}
        className="role-option-details-link"
        onClick={(e) => e.stopPropagation()}
      >
        View details
      </Link>
    </div>
  );
}
