import type { VocabItem, Mastery } from "@/data/vocabulary";
import type { Question } from "@/data/questions";
import type { UnitStatus } from "@/data/curriculum";

export const SCHEMA_VERSION = 1;

export interface TeacherProfile {
  name: string;
  school: string;
  academicYear: string;
  semester: string;
  classNames: string;
  weeklySchedule: string;
  notes: string;
}

export interface Settings {
  language: "en" | "ar";
  theme: "light" | "dark";
  printHeader: string;
  defaultQuizInstructions: string;
  gradeBoundaries: { grade: string; min: number }[];
  soundEffects: boolean;
  animations: boolean;
  reducedMotion: boolean;
}

export interface ClassRecord {
  id: string;
  name: string;
  section: string;
  year: string;
  notes: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  number: string;
  classId: string;
  status: "active" | "archived";
  notes: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: string; // `${classId}:${date}`
  classId: string;
  date: string;
  entries: Record<string, { status: AttendanceStatus; note: string }>; // studentId -> status
}

export interface GradeCategory {
  id: string;
  name: string;
  weight: number;
  maxMarks: number;
}

export interface GradeEntry {
  // studentId -> categoryId -> score ("" = missing, "EX" = excused)
  [studentId: string]: Record<string, string>;
}

export interface Gradebook {
  classId: string;
  categories: GradeCategory[];
  scores: GradeEntry;
  comments: Record<string, string>;
}

export interface UnitProgress {
  status: UnitStatus;
  notes: string;
  lessonDate: string;
  pinned: string[];
}

export interface LessonPlan {
  id: string;
  title: string;
  classId: string;
  date: string;
  unitId: string;
  lesson: string;
  duration: string;
  objectives: string;
  vocabulary: string;
  grammar: string;
  strategy: string;
  warmUp: string;
  presentation: string;
  guidedPractice: string;
  independentPractice: string;
  assessment: string;
  homework: string;
  resources: string;
  differentiation: string;
  reflection: string;
  completed: boolean;
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  classId: string;
  unitIds: string[];
  instructions: string;
  timeLimit: string;
  shuffleQuestions: boolean;
  shuffleChoices: boolean;
  questionIds: string[];
  createdAt: string;
}

export interface Worksheet {
  id: string;
  title: string;
  type: string;
  unitId: string;
  instructions: string;
  questionIds: string[];
  createdAt: string;
}

export interface Homework {
  id: string;
  title: string;
  unitId: string;
  lesson: string;
  dueDate: string;
  instructions: string;
  questionIds: string[];
  estimatedTime: string;
  notes: string;
  completed: boolean;
  createdAt: string;
}

export interface ReadingText {
  id: string;
  title: string;
  unitId: string;
  body: string; // teacher-authored text
  questions: { q: string; a: string; type: string }[];
  createdAt: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  max: number;
}

export interface Rubric {
  id: string;
  name: string;
  criteria: RubricCriterion[];
  total: number;
}

export interface FlashcardProgress {
  // cardId -> status
  [cardId: string]: "known" | "review" | "difficult";
}

export interface GameSetup {
  id: string;
  game: string;
  name: string;
  unitId: string;
  classId: string;
  createdAt: string;
}

export interface PrintableResource {
  id: string;
  name: string;
  kind: string;
  refId: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  message: string;
  at: string;
}

export interface AppState {
  version: number;
  backupDate: string | null;
  profile: TeacherProfile;
  settings: Settings;
  classes: ClassRecord[];
  students: StudentRecord[];
  attendance: AttendanceRecord[];
  gradebooks: Gradebook[];
  unitProgress: Record<string, UnitProgress>;
  customVocab: VocabItem[];
  vocabMastery: Record<string, Mastery>;
  questions: Question[];
  quizzes: Quiz[];
  worksheets: Worksheet[];
  homework: Homework[];
  lessonPlans: LessonPlan[];
  readingTexts: ReadingText[];
  writingRubric: Rubric;
  speakingRubric: Rubric;
  flashcardProgress: FlashcardProgress;
  gameSetups: GameSetup[];
  printables: PrintableResource[];
  activity: ActivityLog[];
}
