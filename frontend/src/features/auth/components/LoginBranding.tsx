"use client";

export function LoginBranding() {
  return (
    <div className="auth-branding">
      <div className="auth-branding-icon">
        <span
          className="material-symbols-outlined text-primary text-[28px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          description
        </span>
      </div>
      <h2 className="auth-branding-title">ResumeForge</h2>
      <h1 className="auth-branding-headline">
        Build resumes recruiters want to read.
      </h1>
      <p className="auth-branding-subtitle">
        AI-powered resume optimization built for modern job seekers.
      </p>
    </div>
  );
}
