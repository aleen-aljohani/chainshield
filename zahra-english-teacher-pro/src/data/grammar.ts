/**
 * Seed grammar topics — ORIGINAL explanations and examples aligned with the
 * Mega Goal 3 unit grammar syllabus. Nothing here is copied from the textbook;
 * explanations were written fresh for this app. Page references are approximate
 * and should be confirmed by the teacher.
 */

export interface GrammarExercise {
  id: string;
  type: "multiple-choice" | "error-correction" | "completion" | "transformation" | "ordering";
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  unitId: string;
  page: string;
  explanation: string;
  structure: string;
  examples: string[];
  commonMistakes: string[];
  teacherNotes: string;
  exercises: GrammarExercise[];
  needsReview: boolean;
}

export const seedGrammar: GrammarTopic[] = [
  {
    id: "g-present-perfect",
    title: "Present Perfect vs. Past Simple",
    unitId: "unit-2",
    page: "p. 25",
    explanation:
      "Use the present perfect to talk about experiences or actions when the exact time is not important, or when the action still connects to now. Use the past simple for finished actions at a definite past time.",
    structure: "have/has + past participle  •  vs.  •  verb + -ed / irregular past form",
    examples: [
      "I have visited three countries. (experience — time not stated)",
      "I visited Jeddah last summer. (finished time)",
      "She has just finished her homework. (recent, connects to now)",
    ],
    commonMistakes: [
      "Using present perfect with a finished-time word: ✗ I have seen him yesterday. ✓ I saw him yesterday.",
      "Forgetting the past participle: ✗ I have go there. ✓ I have gone there.",
    ],
    teacherNotes: "Contrast 'for/since' (present perfect) with 'ago' (past simple).",
    exercises: [
      { id: "g-pp-1", type: "multiple-choice", prompt: "We ____ our project last week.", options: ["have finished", "finished", "finish", "are finishing"], answer: "finished", explanation: "'last week' is a finished time, so use the past simple." },
      { id: "g-pp-2", type: "multiple-choice", prompt: "I ____ this film before, so let's watch another one.", options: ["saw", "have seen", "see", "was seeing"], answer: "have seen", explanation: "Experience with no stated time → present perfect." },
      { id: "g-pp-3", type: "error-correction", prompt: "Correct: She has bought a new phone two days ago.", answer: "She bought a new phone two days ago.", explanation: "'ago' signals a finished time → past simple." },
    ],
    needsReview: true,
  },
  {
    id: "g-future-forms",
    title: "Future Forms: will / going to / present continuous",
    unitId: "unit-3",
    page: "p. 41",
    explanation:
      "Use 'will' for predictions and instant decisions, 'going to' for plans and intentions or evidence-based predictions, and the present continuous for fixed future arrangements.",
    structure: "will + base verb  •  am/is/are going to + base verb  •  am/is/are + verb-ing",
    examples: [
      "I think robots will do many jobs in the future. (prediction)",
      "We are going to start a science project next month. (plan)",
      "I am meeting my teacher at 4 p.m. tomorrow. (arrangement)",
    ],
    commonMistakes: [
      "Using 'will' for a clear plan you already made: ✗ I will visit my uncle tomorrow (already arranged). ✓ I'm going to / I'm visiting.",
      "Double future: ✗ will going to.",
    ],
    teacherNotes: "Let students justify their choice; several answers can be acceptable with context.",
    exercises: [
      { id: "g-ff-1", type: "multiple-choice", prompt: "Look at those clouds! It ____ rain.", options: ["will", "is going to", "rains", "is raining"], answer: "is going to", explanation: "Present evidence → 'going to' prediction." },
      { id: "g-ff-2", type: "multiple-choice", prompt: "The phone is ringing. I ____ answer it.", options: ["am going to", "will", "answer", "am answering"], answer: "will", explanation: "Instant decision → 'will'." },
      { id: "g-ff-3", type: "completion", prompt: "Complete with the present continuous: We ____ (fly) to Riyadh next Friday.", answer: "are flying", explanation: "Fixed arrangement → present continuous." },
    ],
    needsReview: true,
  },
  {
    id: "g-modals-advice",
    title: "Modals of Advice and Obligation",
    unitId: "unit-4",
    page: "p. 59",
    explanation:
      "Use 'should/ought to' for advice, 'must/have to' for strong obligation, and 'mustn't' for prohibition. 'don't have to' means there is no obligation (it is optional).",
    structure: "should / ought to / must / have to / mustn't + base verb",
    examples: [
      "You should drink more water. (advice)",
      "Students must arrive on time. (obligation)",
      "You mustn't use your phone during the exam. (prohibition)",
      "You don't have to finish it today. (no obligation)",
    ],
    commonMistakes: [
      "Confusing 'mustn't' (prohibition) with 'don't have to' (optional).",
      "Adding 'to' after 'should': ✗ You should to rest. ✓ You should rest.",
    ],
    teacherNotes: "Use classroom rules as a natural context for practice.",
    exercises: [
      { id: "g-md-1", type: "multiple-choice", prompt: "You look tired. You ____ take a break.", options: ["mustn't", "should", "don't have to", "can't"], answer: "should", explanation: "Giving advice → 'should'." },
      { id: "g-md-2", type: "multiple-choice", prompt: "It's a free day, so we ____ wear the uniform.", options: ["mustn't", "must", "don't have to", "should"], answer: "don't have to", explanation: "No obligation → 'don't have to'." },
      { id: "g-md-3", type: "error-correction", prompt: "Correct: You should to eat more vegetables.", answer: "You should eat more vegetables.", explanation: "No 'to' after 'should'." },
    ],
    needsReview: true,
  },
  {
    id: "g-passive",
    title: "The Passive Voice",
    unitId: "unit-5",
    page: "p. 73",
    explanation:
      "Use the passive when the action is more important than who does it, or when the doer is unknown. Form it with the verb 'be' + past participle.",
    structure: "subject + be (am/is/are/was/were) + past participle (+ by + agent)",
    examples: [
      "The report is written every month. (present)",
      "The building was designed by a famous architect. (past)",
      "English is spoken in many countries. (agent unknown/unimportant)",
    ],
    commonMistakes: [
      "Forgetting 'be': ✗ The letter written yesterday. ✓ The letter was written yesterday.",
      "Wrong participle: ✗ The song was sang. ✓ The song was sung.",
    ],
    teacherNotes: "Practise changing active sentences to passive and back.",
    exercises: [
      { id: "g-pv-1", type: "multiple-choice", prompt: "The homework ____ by the students every day.", options: ["is done", "does", "is doing", "done"], answer: "is done", explanation: "Present passive: is + past participle." },
      { id: "g-pv-2", type: "transformation", prompt: "Make passive: 'They built the school in 2010.'", answer: "The school was built in 2010.", explanation: "Past passive: was + built." },
      { id: "g-pv-3", type: "multiple-choice", prompt: "This song ____ by millions of people.", options: ["was heard", "heard", "is hearing", "hears"], answer: "was heard", explanation: "Passive with irregular participle 'heard'." },
    ],
    needsReview: true,
  },
  {
    id: "g-reported-speech",
    title: "Reported Speech",
    unitId: "unit-6",
    page: "p. 87",
    explanation:
      "Reported speech tells what someone said without the exact words. Verbs usually move one tense back, and pronouns and time words may change.",
    structure: "said (that) + subject + verb (one tense back)",
    examples: [
      "Direct: 'I am tired.' → Reported: He said he was tired.",
      "Direct: 'We will help.' → Reported: They said they would help.",
      "Direct: 'I have finished.' → Reported: She said she had finished.",
    ],
    commonMistakes: [
      "Forgetting to change the tense back: ✗ He said he is tired.",
      "Confusing 'say' and 'tell' (tell + person).",
    ],
    teacherNotes: "Focus first on statements before moving to questions.",
    exercises: [
      { id: "g-rs-1", type: "multiple-choice", prompt: "'I like music.' → She said she ____ music.", options: ["likes", "liked", "like", "was liking"], answer: "liked", explanation: "Present simple → past simple in reported speech." },
      { id: "g-rs-2", type: "transformation", prompt: "Report: 'We will travel tomorrow,' they said.", answer: "They said (that) they would travel the next day.", explanation: "will → would; tomorrow → the next day." },
      { id: "g-rs-3", type: "error-correction", prompt: "Correct: He told that he was busy.", answer: "He said that he was busy. (or: He told me that he was busy.)", explanation: "'tell' needs an object; 'say' does not." },
    ],
    needsReview: true,
  },
];
