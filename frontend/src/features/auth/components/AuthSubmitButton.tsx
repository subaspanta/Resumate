"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthSubmitButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "children"
> & {
  isLoading: boolean;
  loadingText: string;
  children: React.ReactNode;
};

export function AuthSubmitButton({
  isLoading,
  loadingText,
  children,
  className,
  disabled,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <Button
      variant="auth"
      disabled={isLoading || disabled}
      className={cn(
        "w-full h-12 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed font-semibold",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </Button>
  );
}