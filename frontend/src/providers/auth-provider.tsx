"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/features/auth";

const GUEST_ROUTES = ["/login", "/register"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isGuestRoute = GUEST_ROUTES.includes(pathname);

    if (isAuthenticated && isGuestRoute) {
      router.replace("/");
    } else if (!isAuthenticated && !isGuestRoute) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Prevent flash of protected/guest screens by showing a premium loading view
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-surface border border-border-base animate-pulse">
            <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              description
            </span>
          </div>
          <span className="text-xl font-semibold text-primary tracking-tight animate-pulse">
            ResumeForge
          </span>
          <div className="mt-2 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-[3px] border-border-input border-t-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
