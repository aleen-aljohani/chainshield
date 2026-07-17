/**
 * Seed content for Reading, Listening, Speaking and Writing modules.
 *
 * For textbook reading/listening items we store ONLY the title, unit, page
 * reference, skill focus, and a short ORIGINAL summary — never the full
 * copyrighted passage or listening script. Teacher-added texts are stored
 * separately by the app at runtime.
 */

// ---------- Reading ----------
export interface ReadingItem {
  id: string;
  title: string;
  unitId: string;
  page: string;
  skillFocus: string;
  summary: string; // short original summary, NOT the passage
  keyVocab: string[];
  teacherNotes: string;
  needsReview: boolean;
}

export const seedReading: ReadingItem[] = [
  { id: "r-u1", title: "A Person Who Inspires Me", unitId: "unit-1", page: "p. 10", skillFocus: "Main idea & supporting detail", summary: "A short descriptive text about admirable character traits. (Summary only — full passage is in the textbook.)", keyVocab: ["reliable", "ambitious", "generous"], teacherNotes: "Pre-teach personality adjectives before reading.", needsReview: true },
  { id: "r-u2", title: "An Unforgettable Trip", unitId: "unit-2", page: "p. 24", skillFocus: "Scanning for specific information", summary: "A travel narrative describing a memorable destination and journey. (Summary only.)", keyVocab: ["destination", "landmark", "journey"], teacherNotes: "Set scanning questions before students read.", needsReview: true },
  { id: "r-u3", title: "Technology That Changed Our Lives", unitId: "unit-3", page: "p. 38", skillFocus: "Cause and effect", summary: "An informational text about how devices affect daily life. (Summary only.)", keyVocab: ["device", "innovation", "efficient"], teacherNotes: "Highlight cause/effect linking words.", needsReview: true },
  { id: "r-u4", title: "Living a Healthy Life", unitId: "unit-4", page: "p. 58", skillFocus: "Fact vs. opinion", summary: "An advice text about healthy habits and nutrition. (Summary only.)", keyVocab: ["nutrition", "habit", "prevent"], teacherNotes: "Ask students to underline opinions.", needsReview: true },
  { id: "r-u5", title: "Choosing a Career", unitId: "unit-5", page: "p. 72", skillFocus: "Inference", summary: "A text about jobs, skills, and career choices. (Summary only.)", keyVocab: ["qualification", "apply", "responsible"], teacherNotes: "Practise inferring meaning from context.", needsReview: true },
  { id: "r-u6", title: "Protecting Our Environment", unitId: "unit-6", page: "p. 86", skillFocus: "Summarising", summary: "A problem/solution text about environmental issues. (Summary only.)", keyVocab: ["pollution", "recycle", "sustainable"], teacherNotes: "Model a one-sentence summary.", needsReview: true },
];

// ---------- Listening ----------
export interface ListeningItem {
  id: string;
  title: string;
  unitId: string;
  page: string;
  objective: string;
  questionTypes: string[];
  teacherNotes: string;
  hasAudio: false; // no bundled audio; teacher can attach a local file at runtime
  needsReview: boolean;
}

export const seedListening: ListeningItem[] = [
  { id: "l-u1", title: "Describing People (Listening)", unitId: "unit-1", page: "p. 13", objective: "Listen for specific descriptive detail", questionTypes: ["Multiple choice", "True/False"], teacherNotes: "Audio is on the official course CD/portal — attach a local file to play in-app.", hasAudio: false, needsReview: true },
  { id: "l-u2", title: "Travel Plans (Listening)", unitId: "unit-2", page: "p. 27", objective: "Listen for gist and detail", questionTypes: ["Complete the notes", "Short answer"], teacherNotes: "No audio bundled with this app.", hasAudio: false, needsReview: true },
  { id: "l-u3", title: "Future Predictions (Listening)", unitId: "unit-3", page: "p. 43", objective: "Listen for opinions and predictions", questionTypes: ["Multiple choice", "Sequencing"], teacherNotes: "No audio bundled with this app.", hasAudio: false, needsReview: true },
  { id: "l-u4", title: "Health Advice (Listening)", unitId: "unit-4", page: "p. 61", objective: "Listen for advice and instructions", questionTypes: ["True/False", "Complete the notes"], teacherNotes: "No audio bundled with this app.", hasAudio: false, needsReview: true },
  { id: "l-u5", title: "A Job Interview (Listening)", unitId: "unit-5", page: "p. 75", objective: "Listen to an interview for detail", questionTypes: ["Multiple choice", "Short answer"], teacherNotes: "No audio bundled with this app.", hasAudio: false, needsReview: true },
  { id: "l-u6", title: "Environmental Opinions (Listening)", unitId: "unit-6", page: "p. 89", objective: "Listen for opinions and arguments", questionTypes: ["Multiple choice", "Sequencing"], teacherNotes: "No audio bundled with this app.", hasAudio: false, needsReview: true },
];

// ---------- Speaking ----------
export interface SpeakingCard {
  id: string;
  unitId: string;
  type: "pair" | "group" | "role-play" | "presentation";
  prompt: string;
  page: string;
}

export const seedSpeaking: SpeakingCard[] = [
  { id: "s-u1-1", unitId: "unit-1", type: "pair", prompt: "Describe a family member's personality to your partner using at least three adjectives.", page: "p. 14" },
  { id: "s-u1-2", unitId: "unit-1", type: "group", prompt: "In your group, agree on the three most important qualities of a good friend.", page: "p. 14" },
  { id: "s-u2-1", unitId: "unit-2", type: "presentation", prompt: "Give a one-minute talk about the best place you have ever visited.", page: "p. 28" },
  { id: "s-u2-2", unitId: "unit-2", type: "role-play", prompt: "Role-play: a tourist asks a local for directions to a famous landmark.", page: "p. 28" },
  { id: "s-u3-1", unitId: "unit-3", type: "group", prompt: "Discuss: Which technology will change classrooms the most in the next ten years?", page: "p. 44" },
  { id: "s-u4-1", unitId: "unit-4", type: "role-play", prompt: "Role-play: a doctor gives a patient advice about a healthier lifestyle.", page: "p. 62" },
  { id: "s-u5-1", unitId: "unit-5", type: "role-play", prompt: "Role-play a short job interview: one interviewer, one candidate.", page: "p. 76" },
  { id: "s-u6-1", unitId: "unit-6", type: "group", prompt: "Debate: Should single-use plastic be banned in schools?", page: "p. 90" },
];

// ---------- Writing ----------
export interface WritingTask {
  id: string;
  title: string;
  unitId: string;
  page: string;
  genre: string;
  objective: string;
  checklist: string[];
  needsReview: boolean;
}

export const seedWriting: WritingTask[] = [
  { id: "w-u1", title: "A Description of a Person", unitId: "unit-1", page: "p. 16", genre: "Descriptive paragraph", objective: "Describe a person's character using varied adjectives.", checklist: ["Clear topic sentence", "At least three personality adjectives", "One supporting example", "Correct use of verb tenses"], needsReview: true },
  { id: "w-u2", title: "A Travel Experience", unitId: "unit-2", page: "p. 30", genre: "Narrative", objective: "Recount a travel experience in a clear sequence.", checklist: ["Past tenses used correctly", "Time sequencers (first, then, finally)", "A concluding sentence"], needsReview: true },
  { id: "w-u3", title: "Technology in the Future", unitId: "unit-3", page: "p. 46", genre: "Opinion paragraph", objective: "Give and support an opinion about future technology.", checklist: ["Clear opinion statement", "Two reasons", "Future forms used correctly"], needsReview: true },
  { id: "w-u4", title: "A Healthy-Living Guide", unitId: "unit-4", page: "p. 64", genre: "Advice text", objective: "Give practical advice using modals.", checklist: ["Modals of advice (should/must)", "Clear tips", "Logical order"], needsReview: true },
  { id: "w-u5", title: "A Formal Application", unitId: "unit-5", page: "p. 78", genre: "Formal email/letter", objective: "Write a short formal application.", checklist: ["Formal greeting and closing", "Clear purpose", "Polite tone"], needsReview: true },
  { id: "w-u6", title: "For and Against: Protecting the Environment", unitId: "unit-6", page: "p. 92", genre: "Opinion essay", objective: "Present arguments for and against a position.", checklist: ["Balanced arguments", "Linking words", "Clear conclusion"], needsReview: true },
];
