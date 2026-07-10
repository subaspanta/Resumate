"use client";

import { LoginBranding } from "@/src/features/auth/components/LoginBranding";
import { LoginForm } from "@/src/features/auth/components/LoginForm";
import { AuthCard } from "@/src/features/auth/components/AuthCard";
import { AuthFooterPrompt } from "@/src/features/auth/components/AuthFooterPrompt";

export default function LoginPage() {
  return (
    <div className="auth-page flex items-center justify-center p-md">
      <main className="auth-page-shell">
        <LoginBranding />
        <AuthCard variant="login">
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
