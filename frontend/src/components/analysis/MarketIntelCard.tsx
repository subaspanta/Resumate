"use client";

import { useState } from "react";
import { ChevronDown, Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { MarketIntel } from "@/src/features/analysis/types";

interface MarketIntelCardProps {
  marketIntel?: MarketIntel;
  isLoading?: boolean;
}

function formatSalaryNPR(min: number, max: number): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NP", { maximumFractionDigits: 0 }).format(n);
  return `NPR ${fmt(min)} – ${fmt(max)}`;
}

export function MarketIntelCard({
  marketIntel,
  isLoading,
}: MarketIntelCardProps) {
  const [contextOpen, setContextOpen] = useState(false);

  if (isLoading) {
    return <MarketIntelSkeleton />;
  }

  if (!marketIntel) return null;

  const {
    company,
    industry,
    techStack,
    experienceLevel,
    salaryRangeNPR,
    atsKeywords,
    commonRequirements,
    nepaliContext,
  } = marketIntel;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Market Intelligence
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label="About market intelligence"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Info className="size-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                AI-generated snapshot of the target role: typical employer,
                stack, pay band, and what applicant tracking systems scan for.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-2xl font-semibold tracking-tight text-foreground">
            {company}
          </span>
          {industry && <Badge variant="secondary">{industry}</Badge>}
        </div>

        {techStack.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Tech Stack
            </span>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-2 pb-2">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="outline" className="shrink-0">
                    {tech}
                  </Badge>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <IntelStat label="Expected Level" value={experienceLevel} />
          <IntelStat
            label="Salary Range"
            value={formatSalaryNPR(salaryRangeNPR.min, salaryRangeNPR.max)}
          />
          <IntelStat
            label="Common Requirements"
            value={
              commonRequirements.length > 0
                ? `${commonRequirements.length} listed`
                : "—"
            }
          />
        </div>

        {commonRequirements.length > 0 && (
          <ul className="flex flex-col gap-1.5 text-sm text-foreground/80">
            {commonRequirements.map((req) => (
              <li key={req} className="flex gap-2">
                <span className="text-muted-foreground">•</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        )}

        {atsKeywords.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              ATS Keywords
            </span>
            <div className="flex flex-wrap gap-2">
              {atsKeywords.map((keyword) => (
                <Badge key={keyword} variant="secondary">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {nepaliContext && (
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setContextOpen((open) => !open)}
              className="flex w-full items-center justify-between text-sm font-medium text-foreground"
              aria-expanded={contextOpen}
            >
              Nepali Market Context
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform ${
                  contextOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {contextOpen && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {nepaliContext}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function IntelStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function MarketIntelSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Skeleton className="h-8 w-56" />
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-16 rounded-full" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
        <Skeleton className="h-16 w-full" />
      </CardContent>
    </Card>
  );
}
