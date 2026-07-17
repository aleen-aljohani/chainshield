import { describe, it, expect } from "vitest";
import { computeStudentGrade, letterForPercentage, classAverage, summariseAttendance, rubricTotal } from "./calc";
import type { GradeCategory, Gradebook, AttendanceRecord, Rubric } from "./types";

const boundaries = [
  { grade: "A", min: 90 },
  { grade: "B", min: 80 },
  { grade: "C", min: 70 },
  { grade: "D", min: 60 },
  { grade: "F", min: 0 },
];

const cats: GradeCategory[] = [
  { id: "q", name: "Quizzes", weight: 50, maxMarks: 20 },
  { id: "f", name: "Final", weight: 50, maxMarks: 40 },
];

describe("computeStudentGrade", () => {
  it("computes a weighted percentage", () => {
    // 20/20 (full) * 50 + 20/40 (half) * 50 = 50 + 25 = 75 / 100
    const r = computeStudentGrade(cats, { q: "20", f: "20" }, boundaries);
    expect(r.percentage).toBe(75);
    expect(r.letter).toBe("C");
  });

  it("treats missing (blank) scores as zero", () => {
    const r = computeStudentGrade(cats, { q: "20" }, boundaries);
    // 50 + 0 = 50 / 100
    expect(r.percentage).toBe(50);
    expect(r.letter).toBe("F");
  });

  it("drops excused categories and re-normalises weights", () => {
    const r = computeStudentGrade(cats, { q: "20", f: "EX" }, boundaries);
    // only quizzes count: 20/20 -> 100%
    expect(r.percentage).toBe(100);
    expect(r.letter).toBe("A");
  });

  it("returns null percentage when everything is excused", () => {
    const r = computeStudentGrade(cats, { q: "EX", f: "EX" }, boundaries);
    expect(r.percentage).toBeNull();
    expect(r.letter).toBe("—");
  });

  it("clamps over-max scores to 100%", () => {
    const r = computeStudentGrade([{ id: "q", name: "Q", weight: 100, maxMarks: 10 }], { q: "15" }, boundaries);
    expect(r.percentage).toBe(100);
  });
});

describe("letterForPercentage", () => {
  it("maps to the right band", () => {
    expect(letterForPercentage(95, boundaries)).toBe("A");
    expect(letterForPercentage(85, boundaries)).toBe("B");
    expect(letterForPercentage(0, boundaries)).toBe("F");
  });
});

describe("classAverage", () => {
  it("averages only students with a percentage", () => {
    const book: Gradebook = {
      classId: "c", categories: cats,
      scores: { s1: { q: "20", f: "40" }, s2: { q: "10", f: "20" }, s3: { q: "EX", f: "EX" } },
      comments: {},
    };
    // s1 = 100, s2 = 50, s3 excluded -> avg 75
    expect(classAverage(book, ["s1", "s2", "s3"], boundaries)).toBe(75);
  });

  it("returns null with no gradable students", () => {
    const book: Gradebook = { classId: "c", categories: cats, scores: {}, comments: {} };
    expect(classAverage(book, [], boundaries)).toBeNull();
  });
});

describe("summariseAttendance", () => {
  const records: AttendanceRecord[] = [
    { id: "c:1", classId: "c", date: "2026-01-01", entries: { a: { status: "present", note: "" }, b: { status: "absent", note: "" } } },
    { id: "c:2", classId: "c", date: "2026-01-02", entries: { a: { status: "late", note: "" }, b: { status: "excused", note: "" } } },
  ];

  it("summarises all students", () => {
    const s = summariseAttendance(records);
    expect(s.present).toBe(1);
    expect(s.absent).toBe(1);
    expect(s.late).toBe(1);
    expect(s.excused).toBe(1);
    expect(s.total).toBe(4);
  });

  it("filters by a single student", () => {
    const s = summariseAttendance(records, "a");
    expect(s.present).toBe(1);
    expect(s.late).toBe(1);
    expect(s.absent).toBe(0);
    expect(s.total).toBe(2);
  });
});

describe("rubricTotal", () => {
  const rubric: Rubric = {
    id: "r", name: "Writing", total: 8,
    criteria: [{ id: "c", name: "Content", max: 4 }, { id: "o", name: "Org", max: 4 }],
  };

  it("sums and clamps criterion scores", () => {
    const r = rubricTotal(rubric, { c: 4, o: 2 });
    expect(r.earned).toBe(6);
    expect(r.max).toBe(8);
    expect(r.percentage).toBe(75);
  });

  it("clamps scores above the max", () => {
    const r = rubricTotal(rubric, { c: 10, o: 4 });
    expect(r.earned).toBe(8);
    expect(r.percentage).toBe(100);
  });
});
