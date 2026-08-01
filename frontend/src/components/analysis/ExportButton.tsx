"use client";

import { ArrowRight, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useExportPDF } from "@/src/features/analysis/analysis.hooks";

interface ExportButtonProps {
  resumeId: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  label?: string;
}

export function ExportButton({
  resumeId,
  disabled,
  variant = "secondary",
  label,
}: ExportButtonProps) {
  const exportPDF = useExportPDF(resumeId);

  const handleExport = () => {
    exportPDF.mutate(undefined, {
      onError: () => {
        toast.error("Failed to generate PDF. Try again.");
      },
    });
  };

  const isPrimary = variant === "primary";
  const text = label ?? (isPrimary ? "Export Improved Resume" : "Export PDF");

  return (
    <Button
      type="button"
      variant={isPrimary ? "default" : "outline"}
      size={isPrimary ? "lg" : "default"}
      disabled={disabled || exportPDF.isPending}
      onClick={handleExport}
    >
      {exportPDF.isPending ? (
        <>
          <Loader2 className="animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          {isPrimary ? null : <Download />}
          {text}
          {isPrimary ? <ArrowRight /> : null}
        </>
      )}
    </Button>
  );
}
