"use client";

import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import Link from "next/link";
import type { RoleSummary } from "@/src/features/roles/types";

interface RoleOptionCardProps {
  role: RoleSummary;
}

// Uses bare Radix primitive (not shadcn's RadioGroupItem) so the entire card
// acts as the radio control. The Link is positioned separately via CSS since
// nesting <a> inside <button role="radio"> would be invalid HTML.
export function RoleOptionCard({ role }: RoleOptionCardProps) {
  return (
    <div className="role-option-wrapper">
      <RadioGroupPrimitive.Item value={role.slug} className="card role-option">
        <span className="role-option-radio" aria-hidden="true">
          <RadioGroupPrimitive.Indicator className="role-option-radio-dot" />
        </span>
        <span>
          <span className="entry-title role-option-title">{role.title}</span>
          <span className="body-copy body-copy--muted role-option-desc">
            {role.description}
          </span>
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
