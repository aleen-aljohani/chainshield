import { AppState, SCHEMA_VERSION } from "./types";
import { seedQuestions } from "@/data/questions";
import { sampleClasses, sampleStudents } from "@/data/sampleStudents";

export function defaultWritingRubric() {
  return {
    id: "rubric-writing",
    name: "Writing Rubric",
    criteria: [
      { id: "content", name: "Content", max: 4 },
      { id: "organization", name: "Organization", max: 4 },
      { id: "grammar", name: "Grammar", max: 4 },
      { id: "vocabulary", name: "Vocabulary", max: 4 },
      { id: "mechanics", name: "Spelling & Mechanics", max: 4 },
    ],
    total: 20,
  };
}

export function defaultSpeakingRubric() {
  return {
    id: "rubric-speaking",
    name: "Speaking Rubric",
    criteria: [
      { id: "fluency", name: "Fluency", max: 4 },
      { id: "accuracy", name: "Accuracy", max: 4 },
      { id: "vocabulary", name: "Vocabulary", max: 4 },
      { id: "pronunciation", name: "Pronunciation", max: 4 },
      { id: "interaction", name: "Interaction", max: 2 },
      { id: "task", name: "Task Completion", max: 2 },
    ],
    total: 20,
  };
}

export function createDefaultState(withSamples = true): AppState {
  return {
    version: SCHEMA_VERSION,
    backupDate: null,
    profile: {
      name: "Zahra Aljehani",
      school: "",
      academicYear: "1447 / 1448",
      semester: "First Semester",
      classNames: "12-A, 12-B",
      weeklySchedule: "",
      notes: "",
    },
    settings: {
      language: "en",
      theme: "light",
      printHeader: "Zahra Aljehani – English Teacher Pro",
      defaultQuizInstructions:
        "Read each question carefully. Write your answers clearly. You have the full class time to complete this quiz.",
      gradeBoundaries: [
        { grade: "A", min: 90 },
        { grade: "B", min: 80 },
        { grade: "C", min: 70 },
        { grade: "D", min: 60 },
        { grade: "F", min: 0 },
      ],
      soundEffects: true,
      animations: true,
      reducedMotion: false,
    },
    classes: withSamples ? sampleClasses.map((c) => ({ ...c })) : [],
    students: withSamples ? sampleStudents.map((s) => ({ ...s })) : [],
    attendance: [],
    gradebooks: [],
    unitProgress: {},
    customVocab: [],
    vocabMastery: {},
    questions: seedQuestions.map((q) => ({ ...q })),
    quizzes: [],
    worksheets: [],
    homework: [],
    lessonPlans: [],
    readingTexts: [],
    writingRubric: defaultWritingRubric(),
    speakingRubric: defaultSpeakingRubric(),
    flashcardProgress: {},
    gameSetups: [],
    printables: [],
    activity: [],
  };
}
