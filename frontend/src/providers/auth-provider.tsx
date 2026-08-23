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

  const isGuestRoute = GUEST_ROUTES.includes(pathname);
  // The session and the current route disagree, so a redirect is owed. The
  // effect below can only fire after a paint, so this same condition also
  // gates rendering — otherwise the wrong page shows for one frame first.
  const isRedirecting =
    !isLoading && isAuthenticated === isGuestRoute;

  useEffect(() => {
    if (!isRedirecting) return;

    if (isAuthenticated) {
      router.replace("/");
    } else {
      router.replace(
        pathname === "/"
          ? "/welcome"
          : `/login?next=${encodeURIComponent(pathname)}`,
      );
    }
  }, [isRedirecting, isAuthenticated, pathname, router]);

  if (isLoading || isRedirecting) {
    return <AuthLoading />;
  }

  if (isError) {
    return <AuthError onRetry={() => refetchMe()} />;
  }

  return <>{children}</>;
}
