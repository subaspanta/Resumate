"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/src/features/auth/auth.hooks";
import { AuthLoading } from "./auth-loading";
import { AuthError } from "./auth-error";

const GUEST_ROUTES = ["/login", "/register", "/welcome"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, isError, refetchMe } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    const isGuestRoute = GUEST_ROUTES.includes(pathname);

    if (isAuthenticated && isGuestRoute) {
      router.replace("/");
    } else if (!isAuthenticated && !isGuestRoute) {
      router.replace(
        pathname === "/"
          ? "/welcome"
          : `/login?next=${encodeURIComponent(pathname)}`,
      );
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return <AuthLoading />;
  }

  if (isError) {
    return <AuthError onRetry={() => refetchMe()} />;
  }

  return <>{children}</>;
}
