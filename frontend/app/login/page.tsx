"use client";

import { LoginBranding } from "@/src/features/auth/components/LoginBranding";
import { LoginForm } from "@/src/features/auth/components/LoginForm";
import { AuthCard } from "@/src/features/auth/components/AuthCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-md bg-canvas font-body-md text-text-body">
      <main className="w-full max-w-[480px]">
        <LoginBranding />
        <AuthCard>
          <LoginForm />
        </AuthCard>
      </main>
    </div>
  );
}