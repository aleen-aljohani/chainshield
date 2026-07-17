import type { Question, Skill } from "@/data/questions";
import type { Difficulty } from "@/data/vocabulary";

/** Deterministic-friendly shuffle (Fisher–Yates). Pass a custom rng for tests. */
export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export interface QuizFilter {
  unitIds?: string[];
  skills?: Skill[];
  types?: string[];
  difficulty?: Difficulty | "any";
}

export function filterQuestions(questions: Question[], filter: QuizFilter): Question[] {
  return questions.filter((q) => {
    if (filter.unitIds && filter.unitIds.length > 0 && !filter.unitIds.includes(q.unitId)) return false;
    if (filter.skills && filter.skills.length > 0 && !filter.skills.includes(q.skill)) return false;
    if (filter.types && filter.types.length > 0 && !filter.types.includes(q.type)) return false;
    if (filter.difficulty && filter.difficulty !== "any" && q.difficulty !== filter.difficulty) return false;
    return true;
  });
}

/** Random selection with no repeats, using local deterministic rules (no AI). */
export function selectRandom(pool: Question[], count: number, rng: () => number = Math.random): Question[] {
  return shuffle(pool, rng).slice(0, Math.max(0, count));
}

/**
 * Balanced selection: spread the requested count as evenly as possible across
 * the skills present in the pool, then fill any shortfall from the remainder.
 */
export function selectBalanced(pool: Question[], count: number, rng: () => number = Math.random): Question[] {
  if (count >= pool.length) return shuffle(pool, rng);
  const bySkill = new Map<string, Question[]>();
  for (const q of pool) {
    if (!bySkill.has(q.skill)) bySkill.set(q.skill, []);
    bySkill.get(q.skill)!.push(q);
  }
  const skills = [...bySkill.keys()];
  const perSkill = Math.floor(count / skills.length);
  const chosen: Question[] = [];
  const leftovers: Question[] = [];

  for (const skill of skills) {
    const shuffled = shuffle(bySkill.get(skill)!, rng);
    chosen.push(...shuffled.slice(0, perSkill));
    leftovers.push(...shuffled.slice(perSkill));
  }
  const remaining = count - chosen.length;
  if (remaining > 0) chosen.push(...shuffle(leftovers, rng).slice(0, remaining));
  return shuffle(chosen, rng);
}

/**
 * No-repeat random picker for the classroom student picker / games.
 * Given a list of used ids and the full pool, returns the next id, resetting
 * the used set automatically when the pool is exhausted.
 */
export function pickNoRepeat<T>(
  pool: T[],
  used: T[],
  rng: () => number = Math.random
): { picked: T | null; nextUsed: T[]; cycled: boolean } {
  if (pool.length === 0) return { picked: null, nextUsed: used, cycled: false };
  let remaining = pool.filter((x) => !used.includes(x));
  let cycled = false;
  if (remaining.length === 0) {
    remaining = [...pool];
    used = [];
    cycled = true;
  }
  const picked = remaining[Math.floor(rng() * remaining.length)];
  return { picked, nextUsed: [...used, picked], cycled };
}

export function quizTotalMarks(questions: Question[]): number {
  return questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);
}

export function markDistribution(questions: Question[]): Record<string, { count: number; marks: number }> {
  const dist: Record<string, { count: number; marks: number }> = {};
  for (const q of questions) {
    if (!dist[q.skill]) dist[q.skill] = { count: 0, marks: 0 };
    dist[q.skill].count++;
    dist[q.skill].marks += Number(q.marks) || 0;
  }
  return dist;
}
