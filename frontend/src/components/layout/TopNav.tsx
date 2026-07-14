"use client";

import { toast } from "sonner";

interface TopNavProps {
  mode: "placeholder" | "search";
  sidebarOffset: string;
}

export function TopNav({ mode, sidebarOffset }: TopNavProps) {
  const isFirstTime = mode === "placeholder";

  const handleUpgrade = () => toast.info("Upgrade is not available yet.");

  return (
    <header
      className="dashboard-topnav"
      style={{ width: `calc(100% - ${sidebarOffset})` }}
    >
      {isFirstTime ? (
        <div className="flex-1 max-w-md">
          <div className="dashboard-search-placeholder">
            <span className="material-symbols-outlined mr-sm text-text-muted">
              search
            </span>
            <span className="font-body-md text-body-md">Search...</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-sm" />
      )}

      <div
        className={`dashboard-topnav-actions ${
          !isFirstTime ? "dashboard-topnav-actions--spaced" : ""
        }`}
      >
        {!isFirstTime && (
          <div className="dashboard-search">
            <label htmlFor="resume-search" className="sr-only">
              Search resumes
            </label>
            <span className="material-symbols-outlined dashboard-search-icon">
              search
            </span>
            <input
              id="resume-search"
              className="dashboard-search-input"
              placeholder="Search resumes..."
              type="text"
            />
          </div>
        )}

        {isFirstTime ? (
          <button
            type="button"
            className="dashboard-upgrade-btn"
            onClick={handleUpgrade}
          >
            Upgrade
          </button>
        ) : (
          <button
            type="button"
            className="dashboard-upgrade-btn"
            onClick={handleUpgrade}
          >
            Upgrade
          </button>
        )}

        <button
          type="button"
          className="dashboard-icon-btn"
          aria-label="Notifications"
          onClick={() => toast.info("Notifications are not available yet.")}
        >
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button
          type="button"
          className="dashboard-icon-btn"
          aria-label="Help"
          onClick={() => toast.info("Help center is not available yet.")}
        >
          <span className="material-symbols-outlined">help</span>
        </button>
      </div>
    </header>
  );
}
