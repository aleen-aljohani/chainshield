import { describe, it, expect } from "vitest";
import { shuffle, filterQuestions, selectRandom, selectBalanced, pickNoRepeat, quizTotalMarks } from "./selection";
import type { Question } from "@/data/questions";

function q(id: string, skill: Question["skill"], unitId = "unit-1", marks = 1): Question {
  return {
    id, text: `Q ${id}`, type: "multiple-choice", unitId, lesson: "", skill,
    difficulty: "easy", marks, answer: "a", distractors: ["a", "b"], explanation: "",
    page: "", tags: [], notes: "", favorite: false, createdAt: "", updatedAt: "",
  };
}

const pool: Question[] = [
  q("1", "grammar"), q("2", "grammar"), q("3", "vocabulary"),
  q("4", "vocabulary"), q("5", "reading"), q("6", "reading"),
];

// deterministic rng
function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

describe("shuffle", () => {
  it("keeps the same elements", () => {
    const out = shuffle([1, 2, 3, 4, 5], seededRng(1));
    expect(out.sort()).toEqual([1, 2, 3, 4, 5]);
  });
  it("does not mutate the input", () => {
    const input = [1, 2, 3];
    shuffle(input, seededRng(2));
    expect(input).toEqual([1, 2, 3]);
  });
});

describe("filterQuestions", () => {
  it("filters by unit and skill", () => {
    expect(filterQuestions(pool, { skills: ["grammar"] })).toHaveLength(2);
    expect(filterQuestions(pool, { unitIds: ["unit-1"] })).toHaveLength(6);
    expect(filterQuestions(pool, { unitIds: ["unit-9"] })).toHaveLength(0);
  });
});

describe("selectRandom", () => {
  it("returns the requested count without repeats", () => {
    const out = selectRandom(pool, 3, seededRng(5));
    expect(out).toHaveLength(3);
    expect(new Set(out.map((x) => x.id)).size).toBe(3);
  });
  it("never returns more than the pool", () => {
    expect(selectRandom(pool, 100)).toHaveLength(6);
  });
});

describe("selectBalanced", () => {
  it("spreads across skills", () => {
    const out = selectBalanced(pool, 3, seededRng(7));
    const skills = new Set(out.map((x) => x.skill));
    // 3 skills present, 1 each expected
    expect(out).toHaveLength(3);
    expect(skills.size).toBe(3);
  });
  it("returns everything when count >= pool", () => {
    expect(selectBalanced(pool, 10)).toHaveLength(6);
  });
});

describe("pickNoRepeat", () => {
  it("does not repeat until the pool is exhausted, then cycles", () => {
    const items = ["a", "b", "c"];
    let used: string[] = [];
    const seen: string[] = [];
    for (let i = 0; i < 3; i++) {
      const r = pickNoRepeat(items, used, seededRng(i + 1));
      expect(used).not.toContain(r.picked);
      seen.push(r.picked!);
      used = r.nextUsed;
    }
    expect(new Set(seen).size).toBe(3); // all three unique

    // fourth pick must cycle
    const r4 = pickNoRepeat(items, used, seededRng(9));
    expect(r4.cycled).toBe(true);
    expect(r4.nextUsed).toHaveLength(1);
  });

  it("handles an empty pool", () => {
    const r = pickNoRepeat<string>([], []);
    expect(r.picked).toBeNull();
  });
});

describe("quizTotalMarks", () => {
  it("sums marks", () => {
    expect(quizTotalMarks([q("1", "grammar", "unit-1", 2), q("2", "reading", "unit-1", 3)])).toBe(5);
  });
});
