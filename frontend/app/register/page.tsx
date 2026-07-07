"use client";

import { AuthTopNav } from "@/src/features/auth/components/AuthTopNav";
import { AuthCard } from "@/src/features/auth/components/AuthCard";
import { RegisterForm } from "@/src/features/auth/components/RegisterForm";
import { AuthPageFooter } from "@/src/features/auth/components/AuthPageFooter";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col font-body-md text-text-body bg-canvas">
      <AuthTopNav />

      <main className="flex-grow flex items-center justify-center pt-[92px] pb-xl px-md">
        <div className="w-full max-w-[440px]">
          <div className="mb-lg text-center">
            <h1 className="font-display-md text-[30px] leading-10 font-bold text-text-primary mb-md">
              Create account
            </h1>
            <p className="font-body-md text-body-md text-text-muted">
              Start building your professional future today.
            </p>
          </div>

          <AuthCard>
            <RegisterForm />
          </AuthCard>
        </div>
      </main>

      <AuthPageFooter />
    </div>
  );
}
