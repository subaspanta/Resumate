"use client";

export function LoginBranding() {
  return (
    <div className="flex flex-col items-center mb-lg text-center">
      <div className="mb-md flex items-center justify-center w-12 h-12 rounded-lg bg-surface border border-border-base">
        <span
          className="material-symbols-outlined text-primary text-[28px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          description
        </span>
      </div>
      <h2 className="font-headline-lg text-headline-lg font-bold text-primary tracking-tight mb-md">
        ResumeForge
      </h2>
      <h1 className="font-display-md text-display-md text-text-primary mb-md px-md leading-10 font-bold">
        Build resumes recruiters want to read.
      </h1>
      <p className="font-body-lg text-body-lg text-text-body max-w-[360px]">
        AI-powered resume optimization built for modern job seekers.
      </p>
    </div>
  );
}
