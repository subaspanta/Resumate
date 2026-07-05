"use client";

import { useState } from "react";
import { useAuth } from "@/src/features/auth";
import { toast } from "sonner";
import type { ResumeSummary } from "@/src/features/resume/types";
import { UploadDropzone } from "@/src/components/UploadDropZone";
import { RecentResumesSection } from "@/src/components/RecentResumeSection";
import { Sidebar } from "@/src/components/layout/Sidebar";
import { TopNav } from "@/src/components/layout/TopNav";

// TEMP: replace with `useResumes()` (TanStack Query) once the Resume module's
// list endpoint exists. Kept here, typed, so the swap is a one-line change.
const MOCK_RESUMES: ResumeSummary[] = [
  // { id: "1", title: "Software Engineer Resume", lastEditedAt: "2 hours ago", atsScore: 94 },
  // { id: "2", title: "Product Manager Draft", lastEditedAt: "Yesterday", atsScore: 76 },
  // { id: "3", title: "Marketing Lead CV", lastEditedAt: "3 days ago", atsScore: 48 },
];

export default function HomePage() {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleFileSelected = (file: File) => {
    // TODO: wire to useUploadResume() mutation once Storage/Parsing endpoint exists
    toast.success(`"${file.name}" ready — upload wiring pending.`);
  };

  return (
    <div className="bg-canvas text-text-primary overflow-x-hidden min-h-screen font-sans ">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed((prev) => !prev)}
        userName={user?.name}
      />
      <TopNav isSidebarCollapsed={isSidebarCollapsed} />

      <main
        className="pt-top-nav-height min-h-screen transition-all duration-200"
        style={{ marginLeft: isSidebarCollapsed ? "80px" : "var(--spacing-sidebar-width)" }}
      >
        <div className="max-w-max-content mx-auto px-xxl py-xxl">
          <section className="mb-xxl">
            <h1 className="font-display-md text-3xl font-bold text-text-primary mb-sm">
              Welcome back, {user?.name || "User"}!
            </h1>
            <p className="font-body-lg text-body-lg text-text-body">
              Continue improving your resume or start a new workspace from scratch.
            </p>
          </section>

          <UploadDropzone onFileSelected={handleFileSelected} />

          <RecentResumesSection
            resumes={MOCK_RESUMES}
            onOpenResume={(id) => toast.success(`Opening workspace ${id}...`)}
            onViewAll={() => toast.info("Viewing all files is simulated.")}
          />
        </div>
      </main>
    </div>
  );
}