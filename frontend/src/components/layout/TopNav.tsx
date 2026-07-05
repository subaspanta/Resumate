"use client";

interface TopNavProps {
  isSidebarCollapsed: boolean;
}

export function TopNav({ isSidebarCollapsed }: TopNavProps) {
  return (
    <header
      className="fixed top-0 right-0 h-top-nav-height bg-surface border-b border-border-base flex justify-between items-center px-lg z-40 transition-all duration-200"
      style={{
        width: isSidebarCollapsed ? "calc(100% - 80px)" : "calc(100% - var(--spacing-sidebar-width))",
      }}
    >
      <div className="flex items-center gap-sm" />

      <div className="flex items-center gap-xl">
        <div className="relative group">
          <label htmlFor="resume-search" className="sr-only">
            Search resumes
          </label>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">
            search
          </span>
          <input
            id="resume-search"
            className="pl-10 pr-md py-sm bg-surface border border-border-input rounded-lg focus:ring-1 focus:ring-primary focus:border-primary text-body-md w-64 outline-none transition-all"
            placeholder="Search resumes..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-md">
          <button
            className="text-text-body hover:text-primary transition-all bg-transparent border-0 cursor-pointer"
            aria-label="Notifications"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            className="text-text-body hover:text-primary transition-all bg-transparent border-0 cursor-pointer"
            aria-label="Help"
          >
            <span className="material-symbols-outlined">help</span>
          </button>
          <button className="px-md py-sm border border-border-base rounded-lg font-label-std text-label-std hover:bg-canvas transition-all cursor-pointer font-medium bg-surface text-text-primary">
            Upgrade
          </button>
        </div>
      </div>
    </header>
  );
}