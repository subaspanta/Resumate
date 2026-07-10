"use client";

import { AuthTopNav } from "@/src/features/auth/components/AuthTopNav";
import { AuthCard } from "@/src/features/auth/components/AuthCard";
import { RegisterForm } from "@/src/features/auth/components/RegisterForm";
import { AuthPageFooter } from "@/src/features/auth/components/AuthPageFooter";

export default function RegisterPage() {
  return (
    <div className="auth-page flex flex-col">
      <AuthTopNav />

      <main className="flex-grow flex items-center justify-center pt-top-nav-height pb-xl px-md">
        <AuthCard variant="register">
          <div className="auth-register-header">
            <h1 className="font-display-md text-display-md text-text-primary mb-sm">
              Create account
            </h1>
            <p className="font-body-md text-body-md text-text-muted">
              Start building your professional future today.
            </p>
          </div>

          <RegisterForm />
        </AuthCard>
      </main>

      <AuthPageFooter />
    </div>
  );
}
