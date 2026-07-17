/**
 * Seed vocabulary — ORIGINAL, teacher-authored sample items aligned with the
 * Mega Goal 3 unit themes. Definitions and example sentences are original and
 * were not copied from the textbook. Arabic meanings are provided as a helpful
 * gloss and should be verified by the teacher. Page references are approximate.
 */

export type Difficulty = "easy" | "medium" | "hard";
export type Mastery = "new" | "learning" | "mastered";

export interface VocabItem {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  arabic: string;
  example: string;
  unitId: string;
  lesson: string;
  page: string;
  difficulty: Difficulty;
  tags: string[];
  mastery: Mastery;
  custom: boolean;
  needsReview?: boolean;
}

export const seedVocabulary: VocabItem[] = [
  // Unit 1 — Personality
  { id: "v-u1-1", word: "reliable", partOfSpeech: "adjective", definition: "Able to be trusted to do what is expected.", arabic: "موثوق", example: "She is a reliable student who always finishes her work on time.", unitId: "unit-1", lesson: "Lesson 1", page: "p. 9", difficulty: "medium", tags: ["personality"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u1-2", word: "ambitious", partOfSpeech: "adjective", definition: "Having a strong desire to succeed.", arabic: "طموح", example: "He is ambitious and wants to become an engineer.", unitId: "unit-1", lesson: "Lesson 1", page: "p. 9", difficulty: "medium", tags: ["personality"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u1-3", word: "generous", partOfSpeech: "adjective", definition: "Willing to give time or things to others.", arabic: "كريم", example: "It was generous of her to share her notes.", unitId: "unit-1", lesson: "Lesson 2", page: "p. 11", difficulty: "easy", tags: ["personality"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u1-4", word: "stubborn", partOfSpeech: "adjective", definition: "Not willing to change your mind.", arabic: "عنيد", example: "He can be stubborn when he thinks he is right.", unitId: "unit-1", lesson: "Lesson 2", page: "p. 12", difficulty: "medium", tags: ["personality"], mastery: "new", custom: false, needsReview: true },

  // Unit 2 — Travel
  { id: "v-u2-1", word: "destination", partOfSpeech: "noun", definition: "The place someone is travelling to.", arabic: "وجهة", example: "Our final destination was a small coastal town.", unitId: "unit-2", lesson: "Lesson 1", page: "p. 23", difficulty: "medium", tags: ["travel"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u2-2", word: "landmark", partOfSpeech: "noun", definition: "A well-known building or feature that is easy to recognise.", arabic: "معلم", example: "The tower is the most famous landmark in the city.", unitId: "unit-2", lesson: "Lesson 1", page: "p. 24", difficulty: "medium", tags: ["travel"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u2-3", word: "journey", partOfSpeech: "noun", definition: "An act of travelling from one place to another.", arabic: "رحلة", example: "The journey took almost six hours by bus.", unitId: "unit-2", lesson: "Lesson 2", page: "p. 26", difficulty: "easy", tags: ["travel"], mastery: "new", custom: false, needsReview: true },

  // Unit 3 — Technology
  { id: "v-u3-1", word: "device", partOfSpeech: "noun", definition: "A piece of equipment made for a particular purpose.", arabic: "جهاز", example: "This device can measure your heart rate.", unitId: "unit-3", lesson: "Lesson 1", page: "p. 37", difficulty: "easy", tags: ["technology"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u3-2", word: "innovation", partOfSpeech: "noun", definition: "A new idea, method, or invention.", arabic: "ابتكار", example: "The company is known for its innovation in clean energy.", unitId: "unit-3", lesson: "Lesson 2", page: "p. 39", difficulty: "hard", tags: ["technology"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u3-3", word: "efficient", partOfSpeech: "adjective", definition: "Working well without wasting time or energy.", arabic: "فعّال", example: "Electric trains are more efficient than old diesel ones.", unitId: "unit-3", lesson: "Lesson 2", page: "p. 40", difficulty: "medium", tags: ["technology"], mastery: "new", custom: false, needsReview: true },

  // Unit 4 — Health
  { id: "v-u4-1", word: "nutrition", partOfSpeech: "noun", definition: "The process of getting the food needed for health.", arabic: "تغذية", example: "Good nutrition helps students concentrate in class.", unitId: "unit-4", lesson: "Lesson 1", page: "p. 57", difficulty: "medium", tags: ["health"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u4-2", word: "habit", partOfSpeech: "noun", definition: "Something you do regularly, often without thinking.", arabic: "عادة", example: "Reading before bed is a good habit.", unitId: "unit-4", lesson: "Lesson 1", page: "p. 58", difficulty: "easy", tags: ["health"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u4-3", word: "prevent", partOfSpeech: "verb", definition: "To stop something from happening.", arabic: "يمنع", example: "Washing your hands can prevent many illnesses.", unitId: "unit-4", lesson: "Lesson 2", page: "p. 60", difficulty: "medium", tags: ["health"], mastery: "new", custom: false, needsReview: true },

  // Unit 5 — Work
  { id: "v-u5-1", word: "qualification", partOfSpeech: "noun", definition: "An official record showing you have finished training or study.", arabic: "مؤهل", example: "This job requires a university qualification.", unitId: "unit-5", lesson: "Lesson 1", page: "p. 71", difficulty: "hard", tags: ["work"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u5-2", word: "apply", partOfSpeech: "verb", definition: "To make a formal request, usually in writing.", arabic: "يتقدّم بطلب", example: "She decided to apply for the teaching position.", unitId: "unit-5", lesson: "Lesson 1", page: "p. 72", difficulty: "easy", tags: ["work"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u5-3", word: "responsible", partOfSpeech: "adjective", definition: "Having the duty to deal with something.", arabic: "مسؤول", example: "A manager is responsible for the whole team.", unitId: "unit-5", lesson: "Lesson 2", page: "p. 74", difficulty: "medium", tags: ["work"], mastery: "new", custom: false, needsReview: true },

  // Unit 6 — Environment
  { id: "v-u6-1", word: "pollution", partOfSpeech: "noun", definition: "Harmful substances that damage air, water, or land.", arabic: "تلوّث", example: "Air pollution is a serious problem in big cities.", unitId: "unit-6", lesson: "Lesson 1", page: "p. 85", difficulty: "medium", tags: ["environment"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u6-2", word: "recycle", partOfSpeech: "verb", definition: "To treat used materials so they can be used again.", arabic: "يعيد التدوير", example: "We should recycle paper and plastic at school.", unitId: "unit-6", lesson: "Lesson 1", page: "p. 86", difficulty: "easy", tags: ["environment"], mastery: "new", custom: false, needsReview: true },
  { id: "v-u6-3", word: "sustainable", partOfSpeech: "adjective", definition: "Able to continue without harming the environment.", arabic: "مستدام", example: "Solar power is a sustainable source of energy.", unitId: "unit-6", lesson: "Lesson 2", page: "p. 88", difficulty: "hard", tags: ["environment"], mastery: "new", custom: false, needsReview: true },
];
