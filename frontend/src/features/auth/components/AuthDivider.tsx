"use client";

export function AuthDivider() {
  return (
    <div className="relative flex items-center py-md">
      <div className="flex-grow border-t border-border-base"></div>
      <span className="flex-shrink mx-md font-mono-label text-mono-label text-text-muted uppercase tracking-widest">
        OR
      </span>
      <div className="flex-grow border-t border-border-base"></div>
    </div>
  );
}
