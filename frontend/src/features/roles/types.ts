export type SkillImportance = "critical" | "important" | "nice_to_have";

export interface RoleSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
}

export interface RoleRequirementDetail {
  skillId: string;
  slug: string;
  name: string;
  aliases: string[];
  category: string | null;
  importance: SkillImportance;
  rationale: string;
}

export interface RoleDetail extends RoleSummary {
  seedVersion: string;
  requirements: RoleRequirementDetail[];
}
