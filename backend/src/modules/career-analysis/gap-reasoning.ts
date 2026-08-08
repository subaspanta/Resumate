// Builds the explanation shown under each skill gap.
//
// Deterministic on purpose. The AI observes evidence; the application judges
// it and says why. Model-authored commentary would be the one piece of text
// reaching the user that the grounding validator cannot verify — it could
// assert things no quote supports, in the same confident voice as the parts
// that were checked.
//
// Every sentence here is assembled from facts we already trust:
//   - the derived GapStatus (application judgement)
//   - the strength and provenance of evidence that survived grounding
//   - the hand-authored RoleSkillRequirement.rationale (seed data)
//
// Pure module: no Prisma, no Express, no AI.
import { GapStatus, SkillImportance } from "../../generated/client/index.js";
import { GroundedEvidenceItem } from "./career-analysis.types.js";

const IMPORTANCE_PHRASE: Record<SkillImportance, string> = {
  critical: "is a core requirement for",
  important: "is commonly expected for",
  nice_to_have: "strengthens an application for",
};

// Describes what the surviving evidence actually was, in the application's
// voice rather than the model's.
function describeEvidence(evidence: GroundedEvidenceItem[]): string {
  if (evidence.length === 0) return "";

  const strongest = evidence.reduce((best, current) => {
    const rank = { experience_backed: 3, project_backed: 2, mentioned: 1 };
    return rank[current.strength] > rank[best.strength] ? current : best;
  });

  switch (strongest.strength) {
    case "experience_backed":
      return `Your resume shows this in work experience (${strongest.sourceLabel}).`;
    case "project_backed":
      return `Your resume shows this in a project (${strongest.sourceLabel}).`;
    case "mentioned":
      return `Your resume lists this under ${strongest.sourceLabel}, but without describing what you did with it.`;
  }
}

function describeStatus(status: GapStatus, skillName: string): string {
  switch (status) {
    case "strong":
      return `You have demonstrated ${skillName} through hands-on work.`;
    case "developing":
      return `You have practical exposure to ${skillName}, but not yet in a professional setting.`;
    case "weak_evidence":
      return `${skillName} appears on your resume, but nothing shows how you have applied it.`;
    case "missing":
      return `No evidence of ${skillName} was found on your resume.`;
  }
}

function describeNextStep(status: GapStatus, skillName: string): string {
  switch (status) {
    case "strong":
      return "";
    case "developing":
      return `Deepening ${skillName} in a more substantial project would strengthen this.`;
    case "weak_evidence":
      return `Showing what you built with ${skillName} would turn this into real evidence.`;
    case "missing":
      return `Building something that uses ${skillName} would close this gap.`;
  }
}

export function buildGapReasoning(input: {
  skillName: string;
  status: GapStatus;
  importance: SkillImportance;
  roleTitle: string;
  // Hand-authored in seed-data.ts — the only external prose here, and it is
  // reviewed and version-controlled rather than generated.
  rationale: string;
  evidence: GroundedEvidenceItem[];
}): string {
  const sentences = [
    describeStatus(input.status, input.skillName),
    describeEvidence(input.evidence),
    `It ${IMPORTANCE_PHRASE[input.importance]} ${input.roleTitle}: ${lowerFirst(input.rationale)}`,
    describeNextStep(input.status, input.skillName),
  ];

  return sentences.filter(Boolean).join(" ");
}

// The rationale is authored as a standalone sentence; here it continues one
// after a colon.
function lowerFirst(text: string): string {
  if (!text) return text;
  // Leave acronyms and proper nouns alone — "REST APIs are..." must not
  // become "rEST APIs are...".
  if (text.length > 1 && text[1] === text[1].toUpperCase() && /[A-Za-z]/.test(text[1])) {
    return text;
  }
  return text[0].toLowerCase() + text.slice(1);
}
