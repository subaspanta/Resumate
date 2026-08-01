"use client";

import { Check, X, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Suggestion } from "@/src/features/analysis/types";

interface SuggestionCardProps {
  suggestion: Suggestion;
  isMutating: boolean;
  onApply: (id: string) => void;
  onReject: (id: string) => void;
}

export function SuggestionCard({
  suggestion,
  isMutating,
  onApply,
  onReject,
}: SuggestionCardProps) {
  if (suggestion.status === "applied") {
    return (
      <Card className="border-emerald-500/30 bg-emerald-500/5 py-4">
        <CardContent className="flex items-start gap-3">
          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
            <Check className="size-3" />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white">Applied</Badge>
              {suggestion.section && (
                <span className="text-xs text-muted-foreground">
                  {suggestion.section}
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-through">
              {suggestion.original}
            </p>
            <p className="text-sm font-medium text-foreground">
              {suggestion.suggested}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestion.status === "rejected") {
    return (
      <Card className="border-dashed py-4">
        <CardContent className="flex items-center gap-3">
          <Badge variant="outline" className="text-muted-foreground">
            Skipped
          </Badge>
          <p className="truncate text-sm text-muted-foreground">
            {suggestion.original}
          </p>
        </CardContent>
      </Card>
    );
  }

  // pending
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        {suggestion.section && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Section
            </span>
            <Badge variant="outline">{suggestion.section}</Badge>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <DiffBlock label="Before" text={suggestion.original} tone="muted" />
          <div className="flex justify-center text-muted-foreground">
            <ArrowDown className="size-4" />
          </div>
          <DiffBlock label="After" text={suggestion.suggested} tone="accent" />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            disabled={isMutating}
            onClick={() => onApply(suggestion.id)}
          >
            <Check />
            Apply
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isMutating}
            onClick={() => onReject(suggestion.id)}
          >
            <X />
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DiffBlock({
  label,
  text,
  tone,
}: {
  label: string;
  text: string;
  tone: "muted" | "accent";
}) {
  return (
    <div
      className={
        tone === "accent"
          ? "rounded-md border border-primary/30 bg-primary/5 p-3"
          : "rounded-md border bg-muted/40 p-3"
      }
    >
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <p className="text-sm text-foreground">{text}</p>
    </div>
  );
}
