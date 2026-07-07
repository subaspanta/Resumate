"use client";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <section
      className={cn(
        "bg-surface border border-border-base rounded-xxl p-xl shadow-none p-8 mt-6",
        className
      )}
    >
      {children}
    </section>
  );
}
