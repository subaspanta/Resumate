"use client";

import { LoginForm } from "@/src/features/auth/components/LoginForm";
import { AuthCard } from "@/src/features/auth/components/AuthCard";
import { AuthFooterPrompt } from "@/src/features/auth/components/AuthFooterPrompt";

export default function LoginPage() {
  return (
    <div className="auth-page flex items-center justify-center p-md">
      <main className="auth-page-shell">
        <AuthCard variant="login">
          <div className="text-center mb-lg">
            <h1 className="font-headline-sm text-headline-sm font-semibold text-text-primary mb-xs">
              Welcome back
            </h1>
            <p className="font-body-md text-body-md text-text-body">
              Sign in to continue your career gap analysis.
            </p>
          </div>
          <LoginForm />
        </AuthCard>
        <AuthFooterPrompt
          promptText="Don't have an account?"
          linkText="Sign Up"
          href="/register"
          variant="login"
        />
      </main>
    </div>
  );
}
