"use client";

import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "login" | "register";
}

export function AuthCard({
  children,
  className,
  variant = "login",
}: AuthCardProps) {
  return (
    <section
      className={cn(
        "auth-card",
        variant === "login" ? "auth-card--login" : "auth-card--register",
        className,
      )}
    >
      {children}
    </section>
  );
}
