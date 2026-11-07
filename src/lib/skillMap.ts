import { projects, roles, skills, type Project, type Role, type SkillId } from "../data/content";

/** How each skill tile is recognised inside a role's tool list or bullet text. */
const matchers: Record<SkillId, RegExp> = {
  powerbi: /power ?bi/i,
  domo: /\bdomo\b/i,
  excel: /excel/i,
  sql: /\bsql\b/i,
  python: /python/i,
  javascript: /javascript/i,
  git: /\bgit\b/i,
  api: /\bapi\b/i,
};

export function roleUsesSkill(role: Role, id: SkillId): boolean {
  const re = matchers[id];
  return role.tools.some((t) => re.test(t)) || role.bullets.some((b) => re.test(b));
}

/** Skill tiles a tool name belongs to (e.g. "Microsoft Excel" → excel), or null if none. */
export function skillIdForTool(tool: string): SkillId | null {
  return skills.find((s) => matchers[s.id].test(tool))?.id ?? null;
}

export function skillsForRole(role: Role): SkillId[] {
  return skills.filter((s) => roleUsesSkill(role, s.id)).map((s) => s.id);
}

export function rolesForSkill(id: SkillId): Role[] {
  return roles.filter((r) => roleUsesSkill(r, id));
}

export function projectsForSkill(id: SkillId): Project[] {
  return projects.filter((p) => p.tags.includes(id));
}
