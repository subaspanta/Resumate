export function FeaturePreviewSection() {
  return (
    <section className="dashboard-feature-row">
      <div className="dashboard-feature-card">
        <span className="material-symbols-outlined text-text-body mb-sm">
          monitor_heart
        </span>
        <h3 className="dashboard-feature-card-title">ATS Analysis</h3>
      </div>
      <span className="material-symbols-outlined dashboard-feature-arrow">
        arrow_forward
      </span>
      <div className="dashboard-feature-card dashboard-feature-card--ai">
        <span className="material-symbols-outlined text-primary mb-sm">
          auto_awesome
        </span>
        <h3 className="dashboard-feature-card-title dashboard-feature-card-title--ai">
          AI Suggestions
        </h3>
      </div>
      <span className="material-symbols-outlined dashboard-feature-arrow">
        arrow_forward
      </span>
      <div className="dashboard-feature-card">
        <span className="material-symbols-outlined text-text-body mb-sm">
          work
        </span>
        <h3 className="dashboard-feature-card-title">Job Tailoring</h3>
      </div>
    </section>
  );
}
