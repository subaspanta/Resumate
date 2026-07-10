"use client";

import { useMemo, useRef, useState } from "react";
import { useAuth } from "@/src/features/auth";
import { toast } from "sonner";
import {
  getDashboardView,
  getSidebarOffset,
  type ResumeSummary,
} from "@/src/features/resume/types";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { TopNav } from "@/src/components/layout/TopNav";
import { DashboardFooter } from "@/src/components/layout/DashboardFooter";
import { FirstTimeDashboardContent } from "@/src/components/dashboard/FirstTimeDashboardContent";
import { DefaultDashboardContent } from "@/src/components/dashboard/DefaultDashboardContent";
import {
  ContinueWorkingHero,
  JobTargetCard,
  RecentResumesTable,
} from "@/src/components/dashboard/ActiveDashboardContent";

const MOCK_RESUMES: ResumeSummary[] = [
  // {
  //   id: "1",
  //   title: "Software Engineer Resume",
  //   lastEditedAt: "2 hours ago",
  //   atsScore: 91,
  //   fileName: "Software_Engineer_Subas.pdf",
  //   suggestionsCount: 2,
  //   targetJob: null,
  // },
  // {
  //   id: "2",
  //   title: "Product Manager Draft",
  //   lastEditedAt: "Yesterday",
  //   atsScore: 76,
  //   targetJob: "Google - PM",
  // },
  // {
  //   id: "3",
  //   title: "Marketing Lead CV",
  //   lastEditedAt: "3 days ago",
  //   atsScore: 48,
  //   targetJob: null,
  // },
];

const DEMO_RESUMES: ResumeSummary[] = MOCK_RESUMES;

export default function HomePage() {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [resumes, setResumes] = useState<ResumeSummary[]>(DEMO_RESUMES);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const view = useMemo(() => getDashboardView(resumes), [resumes]);
  const isFirstTime = view === "firstTime";
  const primaryResume = resumes[0];
  const totalSuggestions = useMemo(
    () => resumes.reduce((sum, r) => sum + (r.suggestionsCount ?? 0), 0),
    [resumes]
  );

  const sidebarOffset = getSidebarOffset(view, isSidebarCollapsed);

  const handleFileSelected = (file: File) => {
    const newResume: ResumeSummary = {
      id: crypto.randomUUID(),
      title: file.name.replace(/\.[^.]+$/, ""),
      lastEditedAt: "Just now",
      atsScore: 0,
      fileName: file.name,
      suggestionsCount: 0,
      targetJob: null,
    };

    setResumes((current) => [newResume, ...current]);
    toast.success(`"${file.name}" uploaded successfully.`);
  };

  const triggerUpload = () => uploadInputRef.current?.click();

  const handleUploadInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelected(file);
    e.target.value = "";
  };

  const handleOpenResume = (id: string) => {
    toast.success(`Opening workspace ${id}...`);
  };

  const handleViewAll = () => {
    toast.info("Viewing all files is not available yet.");
  };

  const handleSetTarget = () => {
    toast.info("Job target setup is not available yet.");
  };

  return (
    <div className="dashboard-shell">
      <input
        ref={uploadInputRef}
        type="file"
        accept=".pdf,.docx"
        className="hidden"
        onChange={handleUploadInputChange}
      />
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        userName={user?.name}
        view={view}
        onUploadClick={triggerUpload}
      />
      <TopNav isSidebarCollapsed={isSidebarCollapsed} view={view} />

      <main
        className={`dashboard-main ${
          isFirstTime ? "dashboard-main--first-time" : ""
        }`}
        style={{ marginLeft: sidebarOffset }}
      >
        {view === "firstTime" && (
          <FirstTimeDashboardContent onFileSelected={handleFileSelected} />
        )}

        {view === "default" && (
          <DefaultDashboardContent
            userName={user?.name}
            resumes={resumes}
            onFileSelected={handleFileSelected}
            onOpenResume={handleOpenResume}
            onViewAll={handleViewAll}
          />
        )}

        {view === "active" && (
          <div className="dashboard-main-inner dashboard-main-inner--active flex flex-col gap-xl">
            <ContinueWorkingHero
              resume={primaryResume}
              onOpenWorkspace={handleOpenResume}
              onUploadNew={triggerUpload}
            />
            <div className="dashboard-active-grid">
              <JobTargetCard onSetTarget={handleSetTarget} />
              <RecentResumesTable
                resumes={resumes}
                onOpenResume={handleOpenResume}
                suggestionsCount={totalSuggestions}
              />
            </div>
          </div>
        )}

        {isFirstTime ? (
          <DashboardFooter variant="inline" isSidebarCollapsed={false} />
        ) : (
          <DashboardFooter
            isSidebarCollapsed={isSidebarCollapsed}
            variant="fixed"
          />
        )}
      </main>
    </div>
  );
}
