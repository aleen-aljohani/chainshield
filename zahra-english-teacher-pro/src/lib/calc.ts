import type { Gradebook, GradeCategory, AttendanceRecord, Rubric } from "./types";

// ---------------- Grades ----------------

export interface StudentGradeResult {
  percentage: number | null; // null when no scored categories
  letter: string;
  earnedWeighted: number;
  possibleWeighted: number;
}

/**
 * Weighted grade for one student.
 * - Each category contributes (score/maxMarks) * weight.
 * - Categories with a missing score ("") count as 0.
 * - Categories marked excused ("EX") are dropped and weights re-normalised.
 * - Percentage is out of the sum of INCLUDED weights.
 */
export function computeStudentGrade(
  categories: GradeCategory[],
  scores: Record<string, string>,
  boundaries: { grade: string; min: number }[]
): StudentGradeResult {
  let earned = 0;
  let includedWeight = 0;

  for (const cat of categories) {
    const raw = scores?.[cat.id];
    if (raw === "EX") continue; // excused: drop from calculation
    includedWeight += cat.weight;
    const numeric = raw === undefined || raw === "" ? 0 : Number(raw);
    const safeMax = cat.maxMarks > 0 ? cat.maxMarks : 1;
    const ratio = Math.max(0, Math.min(1, numeric / safeMax));
    earned += ratio * cat.weight;
  }

  if (includedWeight === 0) {
    return { percentage: null, letter: "—", earnedWeighted: 0, possibleWeighted: 0 };
  }

  const percentage = (earned / includedWeight) * 100;
  return {
    percentage: Math.round(percentage * 10) / 10,
    letter: letterForPercentage(percentage, boundaries),
    earnedWeighted: Math.round(earned * 10) / 10,
    possibleWeighted: includedWeight,
  };
}

export function letterForPercentage(pct: number, boundaries: { grade: string; min: number }[]): string {
  const sorted = [...boundaries].sort((a, b) => b.min - a.min);
  for (const b of sorted) {
    if (pct >= b.min) return b.grade;
  }
  return sorted[sorted.length - 1]?.grade ?? "—";
}

export function classAverage(
  book: Gradebook,
  studentIds: string[],
  boundaries: { grade: string; min: number }[]
): number | null {
  const results = studentIds
    .map((id) => computeStudentGrade(book.categories, book.scores[id] ?? {}, boundaries).percentage)
    .filter((p): p is number => p !== null);
  if (results.length === 0) return null;
  return Math.round((results.reduce((a, b) => a + b, 0) / results.length) * 10) / 10;
}

// ---------------- Attendance ----------------

export interface AttendanceSummary {
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
  rate: number; // % present+late+excused of total (attended in some form)
}

export function summariseAttendance(records: AttendanceRecord[], studentId?: string): AttendanceSummary {
  let present = 0, absent = 0, late = 0, excused = 0;
  for (const rec of records) {
    const entries = studentId ? (rec.entries[studentId] ? [rec.entries[studentId]] : []) : Object.values(rec.entries);
    for (const e of entries) {
      if (e.status === "present") present++;
      else if (e.status === "absent") absent++;
      else if (e.status === "late") late++;
      else if (e.status === "excused") excused++;
    }
  }
  const total = present + absent + late + excused;
  const attended = present + late; // excused neither counts against nor fully for
  const rate = total === 0 ? 0 : Math.round(((attended + excused) / total) * 1000) / 10;
  return { present, absent, late, excused, total, rate };
}

// ---------------- Rubric ----------------

export function rubricTotal(rubric: Rubric, scores: Record<string, number>): { earned: number; max: number; percentage: number } {
  let earned = 0;
  let max = 0;
  for (const c of rubric.criteria) {
    max += c.max;
    const v = scores[c.id] ?? 0;
    earned += Math.max(0, Math.min(c.max, v));
  }
  const percentage = max === 0 ? 0 : Math.round((earned / max) * 1000) / 10;
  return { earned: Math.round(earned * 10) / 10, max, percentage };
}
