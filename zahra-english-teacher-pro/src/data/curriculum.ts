/**
 * Mega Goal 3 — First Semester structured content map.
 *
 * IMPORTANT / SOURCE NOTE
 * -----------------------
 * The Mega Goal 3 Student Book PDF was NOT available in the build environment,
 * so no textbook text could be extracted directly. The structure below reflects
 * the *publicly known organisation* of Mega Goal 3 (Connect unit + Units 1–6,
 * Expansion/Review sections) as used in the Saudi first-semester syllabus.
 *
 * Every textbook-derived field carries `needsReview: true` at the unit level and
 * page references are marked approximate. No copyrighted passages, listening
 * scripts, or long reading texts are reproduced — only titles, objectives, skill
 * foci, grammar topic names, vocabulary *categories*, and short ORIGINAL summaries.
 *
 * Teachers should confirm page numbers and titles against their printed book and
 * clear the "Requires teacher review" flags in the Curriculum module.
 */

export type UnitStatus = "not-started" | "in-progress" | "completed";

export interface CurriculumUnit {
  id: string;
  number: number | string;
  title: string;
  /** Approximate textbook page range — confirm against the printed book. */
  pageRange: string;
  theme: string;
  objectives: string[];
  languageFunctions: string[];
  grammarTopics: string[];
  vocabularyCategories: string[];
  readingFocus: string;
  listeningFocus: string;
  speakingFocus: string;
  writingFocus: string;
  project: string;
  /** True when the item was inferred (no PDF) and a teacher should verify it. */
  needsReview: boolean;
}

export const SEMESTER_LABEL = "First Semester";
export const CURRICULUM_LABEL = "Mega Goal 3";

export const curriculum: CurriculumUnit[] = [
  {
    id: "connect",
    number: "Connect",
    title: "Connect (Warm-up / Getting Started)",
    pageRange: "pp. 2–7 (approx.)",
    theme: "Re-activating prior knowledge and classroom language",
    objectives: [
      "Reactivate vocabulary and structures from the previous level.",
      "Talk about personal information, routines, and interests.",
      "Establish classroom language and learning goals for the semester.",
    ],
    languageFunctions: [
      "Introducing and describing yourself",
      "Asking for and giving personal information",
      "Talking about likes, dislikes, and routines",
    ],
    grammarTopics: [
      "Review: present simple vs. present continuous",
      "Review: question forms",
    ],
    vocabularyCategories: ["Personal information", "Everyday routines", "Classroom language"],
    readingFocus: "Skimming a short introductory text for gist",
    listeningFocus: "Listening for personal details",
    speakingFocus: "Short introductions and interviews",
    writingFocus: "A short self-introduction paragraph",
    project: "Create a personal profile card to share with the class.",
    needsReview: true,
  },
  {
    id: "unit-1",
    number: 1,
    title: "Unit 1",
    pageRange: "pp. 8–21 (approx.)",
    theme: "Personality, character, and describing people",
    objectives: [
      "Describe personality traits and character.",
      "Use adjectives and modifiers accurately to describe people.",
      "Read and identify main ideas and supporting details in a descriptive text.",
    ],
    languageFunctions: [
      "Describing people's character and appearance",
      "Expressing and justifying opinions about people",
    ],
    grammarTopics: [
      "Review of verb tenses (simple / continuous / perfect)",
      "Stative vs. dynamic verbs",
    ],
    vocabularyCategories: ["Personality adjectives", "Character traits", "Collocations with make/do"],
    readingFocus: "Identifying main idea and supporting detail",
    listeningFocus: "Listening for specific descriptive information",
    speakingFocus: "Describing and comparing people you know",
    writingFocus: "A descriptive paragraph about a person",
    project: "Prepare a short profile of a person you admire.",
    needsReview: true,
  },
  {
    id: "unit-2",
    number: 2,
    title: "Unit 2",
    pageRange: "pp. 22–35 (approx.)",
    theme: "Travel, places, and experiences",
    objectives: [
      "Talk about travel experiences and places visited.",
      "Use the present perfect to describe experiences.",
      "Distinguish finished and unfinished time expressions.",
    ],
    languageFunctions: [
      "Describing past experiences",
      "Asking about travel and giving recommendations",
    ],
    grammarTopics: [
      "Present perfect vs. past simple",
      "for / since / already / yet / just",
    ],
    vocabularyCategories: ["Travel and tourism", "Geography and places", "Adjectives to describe places"],
    readingFocus: "Scanning for specific information",
    listeningFocus: "Listening for gist and detail in a travel context",
    speakingFocus: "Talking about a memorable trip",
    writingFocus: "A short account of a travel experience",
    project: "Design a simple travel brochure for a place you know.",
    needsReview: true,
  },
  {
    id: "unit-3",
    number: 3,
    title: "Unit 3",
    pageRange: "pp. 36–49 (approx.)",
    theme: "Science, technology, and the future",
    objectives: [
      "Discuss technology and its effects on daily life.",
      "Make predictions about the future.",
      "Understand cause-and-effect relationships in a text.",
    ],
    languageFunctions: [
      "Making predictions",
      "Expressing certainty and possibility about the future",
    ],
    grammarTopics: [
      "Future forms: will / going to / present continuous for future",
      "First conditional",
    ],
    vocabularyCategories: ["Technology and devices", "Science", "Prediction and probability phrases"],
    readingFocus: "Recognising cause and effect",
    listeningFocus: "Listening for predictions and opinions",
    speakingFocus: "Discussing future changes in technology",
    writingFocus: "A short opinion paragraph about future technology",
    project: "Present a prediction about technology in the next 10 years.",
    needsReview: true,
  },
  {
    id: "expansion-1",
    number: "Expansion 1",
    title: "Expansion / Review (Units 1–3)",
    pageRange: "pp. 50–55 (approx.)",
    theme: "Consolidation of Units 1–3",
    objectives: [
      "Consolidate vocabulary and grammar from Units 1–3.",
      "Integrate reading, listening, speaking, and writing skills.",
    ],
    languageFunctions: ["Reviewing and recycling target language"],
    grammarTopics: ["Mixed tense review", "First conditional review"],
    vocabularyCategories: ["Recycled vocabulary from Units 1–3"],
    readingFocus: "Integrated reading review",
    listeningFocus: "Integrated listening review",
    speakingFocus: "Review discussion tasks",
    writingFocus: "A consolidation writing task",
    project: "Mini-review project combining Units 1–3 themes.",
    needsReview: true,
  },
  {
    id: "unit-4",
    number: 4,
    title: "Unit 4",
    pageRange: "pp. 56–69 (approx.)",
    theme: "Health, lifestyle, and habits",
    objectives: [
      "Discuss healthy and unhealthy habits.",
      "Give and respond to advice.",
      "Use modals to talk about obligation and recommendation.",
    ],
    languageFunctions: [
      "Giving advice and making recommendations",
      "Expressing obligation and prohibition",
    ],
    grammarTopics: [
      "Modals: should / must / have to / ought to",
      "Zero conditional for general truths",
    ],
    vocabularyCategories: ["Health and fitness", "Food and nutrition", "Lifestyle habits"],
    readingFocus: "Distinguishing fact from opinion",
    listeningFocus: "Listening for advice and instructions",
    speakingFocus: "Giving health advice in role-play",
    writingFocus: "An advice leaflet or short guide",
    project: "Create a healthy-lifestyle poster.",
    needsReview: true,
  },
  {
    id: "unit-5",
    number: 5,
    title: "Unit 5",
    pageRange: "pp. 70–83 (approx.)",
    theme: "Work, careers, and ambitions",
    objectives: [
      "Talk about jobs, skills, and career plans.",
      "Describe abilities and qualifications.",
      "Understand and use the passive voice in context.",
    ],
    languageFunctions: [
      "Talking about ambitions and plans",
      "Describing job requirements and skills",
    ],
    grammarTopics: [
      "The passive voice (present and past)",
      "Relative clauses (defining)",
    ],
    vocabularyCategories: ["Jobs and professions", "Workplace skills", "Qualities of a good employee"],
    readingFocus: "Inferring meaning from context",
    listeningFocus: "Listening to interviews for detail",
    speakingFocus: "A mock job interview role-play",
    writingFocus: "A short formal email or application",
    project: "Prepare a simple CV or job-role profile.",
    needsReview: true,
  },
  {
    id: "unit-6",
    number: 6,
    title: "Unit 6",
    pageRange: "pp. 84–97 (approx.)",
    theme: "Environment and society",
    objectives: [
      "Discuss environmental issues and solutions.",
      "Report what others have said.",
      "Argue for and against a position in a structured way.",
    ],
    languageFunctions: [
      "Reporting information and opinions",
      "Agreeing and disagreeing politely",
    ],
    grammarTopics: [
      "Reported speech (statements and questions)",
      "Second conditional",
    ],
    vocabularyCategories: ["Environment", "Society and community", "Problem/solution language"],
    readingFocus: "Summarising a text",
    listeningFocus: "Listening for opinions and arguments",
    speakingFocus: "A short debate on an environmental topic",
    writingFocus: "A for-and-against (opinion) essay",
    project: "Propose a local environmental initiative.",
    needsReview: true,
  },
  {
    id: "expansion-2",
    number: "Expansion 2",
    title: "Expansion / Review (Units 4–6)",
    pageRange: "pp. 98–103 (approx.)",
    theme: "Consolidation of Units 4–6",
    objectives: [
      "Consolidate vocabulary and grammar from Units 4–6.",
      "Prepare for end-of-semester assessment.",
    ],
    languageFunctions: ["Reviewing and recycling target language"],
    grammarTopics: ["Passive review", "Reported speech review", "Conditionals review"],
    vocabularyCategories: ["Recycled vocabulary from Units 4–6"],
    readingFocus: "Integrated reading review",
    listeningFocus: "Integrated listening review",
    speakingFocus: "Review discussion and presentation tasks",
    writingFocus: "An exam-style writing task",
    project: "End-of-semester review project.",
    needsReview: true,
  },
];

export function getUnit(id: string): CurriculumUnit | undefined {
  return curriculum.find((u) => u.id === id);
}

/** Units that carry teachable content (excludes Connect/Expansion for pickers where useful). */
export const teachableUnits = curriculum.filter((u) => typeof u.number === "number");
