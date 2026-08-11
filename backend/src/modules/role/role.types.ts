import { SkillImportance } from "../../generated/client/index.js";

export type RoleSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
};

export type RoleRequirementDetail = {
  skillId: string;
  slug: string;
  name: string;
  aliases: string[];
  category: string | null;
  importance: SkillImportance;
  rationale: string;
};

export type RoleDetail = RoleSummary & {
  seedVersion: string;
  requirements: RoleRequirementDetail[];
};
