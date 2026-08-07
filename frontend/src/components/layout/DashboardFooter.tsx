"use client";

// Renders inside <main>, which already carries the sidebar offset, so the
// footer needs no offset of its own — the previous inline marginLeft applied
// it a second time and animated a layout property on every collapse.
export function DashboardFooter() {
  return (
    <footer className="dashboard-footer">
      <div className="dashboard-footer-inner">
        <span className="dashboard-footer-copy">© 2026 ResuMate</span>
      </div>
    </footer>
  );
}
