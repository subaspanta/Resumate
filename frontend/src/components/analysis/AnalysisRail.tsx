"use client";

import { memo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { SuggestionsList } from "@/src/components/analysis/SuggestionsList";
import { JobDescriptionPanel } from "@/src/components/analysis/JobDescriptionPanel";
import { ScoreBreakdownPanel } from "@/src/components/analysis/ScoreBreakdownPanel";
import type {
  Analysis,
  ParsedJob,
  Suggestion,
} from "@/src/features/analysis/types";

interface AnalysisRailProps {
  suggestions: Suggestion[];
  parsedJob?: ParsedJob;
  skillsMatch: Analysis["skillsMatch"] | undefined;
  scores: NonNullable<Analysis["analysisResult"]>["scores"] | undefined;
  isLoading: boolean;
  mutatingId: string | null;
  onApply: (id: string) => void;
  onReject: (id: string) => void;
}

/**
 * The review rail reads none of the document-viewer state, but it used to
 * re-render on every zoom click and every Show-changes toggle because it was
 * inline in the page. Memoized and lifted out so those controls only re-render
 * the preview they actually affect.
 */
export const AnalysisRail = memo(function AnalysisRail({
  suggestions,
  parsedJob,
  skillsMatch,
  scores,
  isLoading,
  mutatingId,
  onApply,
  onReject,
}: AnalysisRailProps) {
  return (
    <aside className="analysis-rail" aria-label="Review panel">
      <Tabs defaultValue="suggestions" className="analysis-rail-tabs">
        <TabsList>
          <TabsTrigger value="suggestions">
            Suggestions
            {suggestions.length > 0 ? (
              <span className="analysis-tab-count">{suggestions.length}</span>
            ) : null}
          </TabsTrigger>
          <TabsTrigger value="job-description">Job</TabsTrigger>
          <TabsTrigger value="score">Score</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="analysis-rail-content">
          <SuggestionsList
            suggestions={suggestions}
            isLoading={isLoading}
            mutatingId={mutatingId}
            onApply={onApply}
            onReject={onReject}
          />
        </TabsContent>

        <TabsContent value="job-description" className="analysis-rail-content">
          <JobDescriptionPanel
            parsedJob={parsedJob}
            skillsMatch={skillsMatch}
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="score" className="analysis-rail-content">
          <ScoreBreakdownPanel
            scores={scores}
            skillsMatch={skillsMatch}
            jobSkills={parsedJob?.skills}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </aside>
  );
});
