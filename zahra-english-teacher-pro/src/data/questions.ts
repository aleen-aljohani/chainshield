/**
 * Seed question bank — a LIMITED set of ORIGINAL sample questions written for
 * this app and aligned with the Mega Goal 3 first-semester objectives. No long
 * textbook questions are copied verbatim. Page references are approximate.
 */

import type { Difficulty } from "./vocabulary";

export type QuestionType =
  | "multiple-choice"
  | "true-false"
  | "fill-blank"
  | "matching"
  | "short-answer"
  | "essay"
  | "error-correction"
  | "transformation";

export type Skill = "vocabulary" | "grammar" | "reading" | "listening" | "writing" | "speaking";

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  unitId: string;
  lesson: string;
  skill: Skill;
  difficulty: Difficulty;
  marks: number;
  answer: string;
  distractors: string[];
  explanation: string;
  page: string;
  tags: string[];
  notes: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
}

const now = "2026-01-01T00:00:00.000Z";

export const seedQuestions: Question[] = [
  {
    id: "q-1", text: "Choose the correct word: A person you can trust is ____.", type: "multiple-choice",
    unitId: "unit-1", lesson: "Lesson 1", skill: "vocabulary", difficulty: "easy", marks: 1,
    answer: "reliable", distractors: ["reliable", "lazy", "rude", "careless"],
    explanation: "'Reliable' means able to be trusted.", page: "p. 9", tags: ["personality"], notes: "", favorite: false, createdAt: now, updatedAt: now,
  },
  {
    id: "q-2", text: "We ____ to Riyadh last weekend.", type: "multiple-choice",
    unitId: "unit-2", lesson: "Lesson 1", skill: "grammar", difficulty: "easy", marks: 1,
    answer: "travelled", distractors: ["travelled", "have travelled", "travel", "are travelling"],
    explanation: "'last weekend' is a finished time → past simple.", page: "p. 25", tags: ["past-simple"], notes: "", favorite: false, createdAt: now, updatedAt: now,
  },
  {
    id: "q-3", text: "The present perfect is used for actions that happened at a specific finished time.", type: "true-false",
    unitId: "unit-2", lesson: "Lesson 1", skill: "grammar", difficulty: "medium", marks: 1,
    answer: "False", distractors: ["True", "False"],
    explanation: "Present perfect is for unspecified or unfinished time; specific finished time uses past simple.", page: "p. 25", tags: ["present-perfect"], notes: "", favorite: false, createdAt: now, updatedAt: now,
  },
  {
    id: "q-4", text: "Complete: Look at the sky. It ____ (rain) soon.", type: "fill-blank",
    unitId: "unit-3", lesson: "Lesson 2", skill: "grammar", difficulty: "medium", marks: 1,
    answer: "is going to rain", distractors: [],
    explanation: "Present evidence → 'going to' for prediction.", page: "p. 41", tags: ["future"], notes: "", favorite: false, createdAt: now, updatedAt: now,
  },
  {
    id: "q-5", text: "Correct the sentence: You should to eat more fruit.", type: "error-correction",
    unitId: "unit-4", lesson: "Lesson 1", skill: "grammar", difficulty: "medium", marks: 2,
    answer: "You should eat more fruit.", distractors: [],
    explanation: "No 'to' after the modal 'should'.", page: "p. 59", tags: ["modals"], notes: "", favorite: false, createdAt: now, updatedAt: now,
  },
  {
    id: "q-6", text: "Rewrite in the passive: 'They clean the classroom every day.'", type: "transformation",
    unitId: "unit-5", lesson: "Lesson 2", skill: "grammar", difficulty: "hard", marks: 2,
    answer: "The classroom is cleaned every day.", distractors: [],
    explanation: "Present passive: is + past participle.", page: "p. 73", tags: ["passive"], notes: "", favorite: false, createdAt: now, updatedAt: now,
  },
  {
    id: "q-7", text: "Choose the correct reported form: 'I am busy,' she said. → She said she ____ busy.", type: "multiple-choice",
    unitId: "unit-6", lesson: "Lesson 1", skill: "grammar", difficulty: "medium", marks: 1,
    answer: "was", distractors: ["was", "is", "will be", "has been"],
    explanation: "Present simple 'am' → past 'was' in reported speech.", page: "p. 87", tags: ["reported-speech"], notes: "", favorite: false, createdAt: now, updatedAt: now,
  },
  {
    id: "q-8", text: "What does 'sustainable' mean?", type: "short-answer",
    unitId: "unit-6", lesson: "Lesson 2", skill: "vocabulary", difficulty: "hard", marks: 1,
    answer: "Able to continue without harming the environment.", distractors: [],
    explanation: "Definition of 'sustainable'.", page: "p. 88", tags: ["environment"], notes: "", favorite: false, createdAt: now, updatedAt: now,
  },
  {
    id: "q-9", text: "Write a short paragraph (60–80 words) describing a person you admire.", type: "essay",
    unitId: "unit-1", lesson: "Lesson 3", skill: "writing", difficulty: "medium", marks: 5,
    answer: "Open answer — assess with the writing rubric.", distractors: [],
    explanation: "Look for varied personality adjectives and correct tenses.", page: "p. 16", tags: ["writing"], notes: "Use the writing rubric.", favorite: false, createdAt: now, updatedAt: now,
  },
  {
    id: "q-10", text: "A ____ is a well-known building that is easy to recognise.", type: "fill-blank",
    unitId: "unit-2", lesson: "Lesson 1", skill: "vocabulary", difficulty: "easy", marks: 1,
    answer: "landmark", distractors: [],
    explanation: "Definition of 'landmark'.", page: "p. 24", tags: ["travel"], notes: "", favorite: false, createdAt: now, updatedAt: now,
  },
  {
    id: "q-11", text: "Electric cars are more ____ than old petrol cars.", type: "multiple-choice",
    unitId: "unit-3", lesson: "Lesson 2", skill: "vocabulary", difficulty: "medium", marks: 1,
    answer: "efficient", distractors: ["efficient", "efficiency", "efficiently", "effect"],
    explanation: "An adjective is needed after 'more'.", page: "p. 40", tags: ["technology"], notes: "", favorite: false, createdAt: now, updatedAt: now,
  },
  {
    id: "q-12", text: "'You mustn't use your phone in the exam' means it is allowed.", type: "true-false",
    unitId: "unit-4", lesson: "Lesson 1", skill: "grammar", difficulty: "easy", marks: 1,
    answer: "False", distractors: ["True", "False"],
    explanation: "'mustn't' means it is prohibited, not allowed.", page: "p. 59", tags: ["modals"], notes: "", favorite: false, createdAt: now, updatedAt: now,
  },
];
