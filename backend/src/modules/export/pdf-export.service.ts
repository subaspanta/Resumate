import pdfmake from "pdfmake";
import type {
  Content,
  TDocumentDefinitions,
  TFontDictionary,
} from "pdfmake/interfaces.js";
import { StructuredResume } from "../parsing/parsing.types.js";

// pdfmake 0.3 does not auto-register the standard AFM fonts on the server, so we
// declare the built-in Helvetica family once. No font files are shipped — pdfkit
// resolves these standard PDF font names internally.
const FONTS: TFontDictionary = {
  Helvetica: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
};
pdfmake.setFonts(FONTS);

// Formats an experience entry's date range, tolerating missing endpoints.
function formatDateRange(startDate?: string, endDate?: string): string {
  if (startDate && endDate) return `${startDate} – ${endDate}`;
  return startDate || endDate || "";
}

// Builds an ATS-friendly pdfmake document definition from a structured resume.
// Single column, Helvetica (built-in), no tables/images/graphics. Any section
// whose data is absent or empty is skipped entirely — no orphan headings.
export function buildResumeDefinition(
  resume: StructuredResume,
): TDocumentDefinitions {
  const content: Content[] = [];

  if (resume.name) {
    content.push({
      text: resume.name,
      fontSize: 22,
      bold: true,
      margin: [0, 0, 0, 4],
    });
  }

  const contactLine = [
    resume.contact?.email,
    resume.contact?.phone,
    resume.contact?.location,
  ]
    .filter(Boolean)
    .join(" | ");
  if (contactLine) {
    content.push({
      text: contactLine,
      fontSize: 10,
      color: "#333333",
      margin: [0, 0, 0, 16],
    });
  }

  if (resume.summary) {
    content.push({ text: "SUMMARY", style: "sectionHeader" });
    content.push({ text: resume.summary, margin: [0, 0, 0, 12] });
  }

  if (resume.skills?.length) {
    content.push({ text: "SKILLS", style: "sectionHeader" });
    content.push({ text: resume.skills.join(" • "), margin: [0, 0, 0, 12] });
  }

  if (resume.experience?.length) {
    content.push({ text: "EXPERIENCE", style: "sectionHeader" });
    for (const exp of resume.experience) {
      const heading = exp.company
        ? `${exp.title} — ${exp.company}`
        : exp.title;
      content.push({
        columns: [
          { text: heading, bold: true, width: "*" },
          {
            text: formatDateRange(exp.startDate, exp.endDate),
            width: "auto",
            alignment: "right",
            color: "#555555",
          },
        ],
        margin: [0, 8, 0, 2],
      });
      if (exp.description) {
        content.push({ text: exp.description, margin: [12, 1, 0, 1] });
      }
    }
  }

  if (resume.education?.length) {
    content.push({ text: "EDUCATION", style: "sectionHeader" });
    for (const edu of resume.education) {
      content.push({
        columns: [
          { text: `${edu.degree} — ${edu.institution}`, width: "*" },
          {
            text: edu.year ?? "",
            width: "auto",
            alignment: "right",
            color: "#555555",
          },
        ],
        margin: [0, 4, 0, 2],
      });
    }
  }

  return {
    pageSize: "A4",
    pageMargins: [50, 50, 50, 50],
    // pdfmake 0.3 does not auto-register the standard AFM fonts on the server;
    // the built-in Helvetica family must be declared explicitly. No font files
    // are needed — pdfkit resolves these standard names internally.
    defaultStyle: { font: "Helvetica", fontSize: 11, lineHeight: 1.4 },
    styles: {
      sectionHeader: {
        fontSize: 12,
        bold: true,
        color: "#222222",
        margin: [0, 14, 0, 4],
        characterSpacing: 0.5,
      },
    },
    content,
  };
}

export async function generateResumePDF(
  resume: StructuredResume,
): Promise<Buffer> {
  return pdfmake.createPdf(buildResumeDefinition(resume)).getBuffer();
}
