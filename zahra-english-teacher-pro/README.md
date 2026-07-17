# Zahra Aljehani – English Teacher Pro

A polished, **local-first** teaching platform for English (**Mega Goal 3, First
Semester**, Grade 12 / Third Secondary, Saudi Arabia). It helps teacher **Zahra
Aljehani** plan lessons, generate quizzes and worksheets, organise textbook
content, manage students, track attendance and grades, run revision games, and
produce printable teaching materials.

Everything runs in the browser — **no backend, no login, no database server, no
paid APIs, and no internet connection required after install.**

---

## ✨ Features

- **Dashboard** with live stats, charts (unit progress, attendance, grades), quick actions and recent activity.
- **Curriculum & Units** explorer with per-unit progress, notes, lesson dates and pinning.
- **Lesson Planner** with a local rule-based structure suggester, templates, print & PDF export, and a weekly view.
- **Vocabulary** with flashcards, multiple-choice, spelling and word-scramble practice, and browser speech synthesis (with graceful fallback).
- **Grammar** with original explanations and auto-checked practice.
- **Reading / Listening / Speaking / Writing** modules (summaries + teacher-added content; local audio for listening; editable rubrics for speaking & writing).
- **Flashcards** with decks, shuffle, known/review/difficult tracking, and printable sheets.
- **Question Bank** — full CRUD, filters, import/export, favourites, bulk delete.
- **Quiz Generator** — random / balanced / manual selection, student & teacher versions, answer sheet, answer key, and mark distribution, all print/PDF-ready.
- **Worksheet & Homework builders** with templates and answer keys.
- **Revision Games** — Quick-fire, Team Challenge, Spin Wheel, Word Scramble, Hangman, Memory Match and a Jeopardy board.
- **Students, Attendance, Gradebook, Random Picker, Reports.**
- **Teacher Assistant** — a clearly-labelled **local** (non-AI) draft generator.
- **Printable Resources** library, **Backup & Restore**, and **Settings**.
- **Light/Dark themes**, **English/Arabic** interface with proper **RTL**, responsive on desktop/tablet/mobile, and accessibility features throughout.

## 🧱 Technology stack

- [Next.js 14](https://nextjs.org/) (App Router) + React 18
- TypeScript (strict)
- Tailwind CSS (green/white/neutral palette, dark mode)
- [lucide-react](https://lucide.dev/) icons
- [Recharts](https://recharts.org/) for charts
- [Framer Motion](https://www.framer.com/motion/) (light usage) and CSS animations
- [Vitest](https://vitest.dev/) for unit tests
- Local persistence via **localStorage** with a versioned, self-healing schema
- Printing / **PDF export** via the browser's native print pipeline ("Save as PDF")

## 🚀 Installation & commands

```bash
# from this folder: zahra-english-teacher-pro/
npm install          # install dependencies

npm run dev          # start the dev server at http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check (tsc --noEmit)
npm run test         # run unit tests (Vitest)
```

Open **http://localhost:3000**. There is **no login** — the app opens straight
to the dashboard.

## 💾 How local data works

All teacher-created data (profile, classes, students, attendance, grades,
questions, quizzes, worksheets, homework, lesson plans, custom vocabulary,
flashcard progress, settings, etc.) is stored in your browser's **localStorage**
under the key `zahra-english-teacher-pro:v1`.

- The storage layer is **versioned** and **self-healing**: corrupted data is
  detected, a copy is kept under `…:corrupted-backup`, and the app resets to
  safe defaults instead of crashing.
- Loaded data is reconciled against the current schema, so upgrades never leave
  missing fields.
- Data **never leaves your device**. Because it lives in one browser, clearing
  browser data or switching devices will lose it **unless you back up**.

### How to back up data
1. Go to **Backup & Restore**.
2. Click **Download backup** — a single `.json` file is saved to your device.

### How to restore data
1. Go to **Backup & Restore** → **Choose backup file**.
2. Select your `.json` backup and confirm. *(Restoring overwrites current data — export first if unsure.)*

You can also export/import the **question bank** separately from the Question
Bank page, and export CSVs from Students, Attendance and Grades.

## 📚 How to add textbook content

Structured content lives in [`src/data/`](src/data):

- `curriculum.ts` — units, objectives, grammar topics, page ranges.
- `vocabulary.ts` — seeded vocabulary.
- `grammar.ts` — grammar explanations & exercises.
- `skills.ts` — reading/listening/speaking/writing metadata.
- `questions.ts` — sample question bank.

Edit these files to correct titles/page numbers (see
[`TEXTBOOK_CONTENT_MAP.md`](TEXTBOOK_CONTENT_MAP.md)) and set `needsReview: false`
once verified. Custom vocabulary, questions, and reading texts can also be added
**inside the app** without touching code.

## 🎧 How to add audio files

No audio is bundled. In the **Listening** module, click **Choose audio file** to
select an audio file from your device. It plays locally in the browser via an
`<audio>` element and is **not** uploaded or stored anywhere. (Reload clears it —
re-select the file next lesson.)

## ⚠️ Known limitations

- **No Mega Goal 3 PDF was available at build time**, so unit titles and page
  numbers are approximate and marked "Requires teacher review". See
  [`TEXTBOOK_CONTENT_MAP.md`](TEXTBOOK_CONTENT_MAP.md).
- **PDF export** uses the browser's *Print → Save as PDF* dialog (reliable and
  fully local) rather than a bundled PDF engine.
- **Automatic crossword/word-search generation is intentionally omitted** to
  avoid broken puzzles; Word Scramble, Hangman and printable vocab/flashcard
  sheets cover word-play revision instead. This is documented in the Games page.
- **Audio is session-only** (not persisted), by design.
- The **Teacher Assistant** and quiz generator are **rule-based and local** — they
  do **not** use any AI service, and generated materials are labelled
  *"Draft for teacher review."*

## 🔒 Privacy

Student data is stored only in the local browser and is never transmitted. Sample
students are **fictional**. A privacy notice is shown in the Students module.
Please keep exported backups secure.

## 📄 Documentation

- [`USER_GUIDE.md`](USER_GUIDE.md) — step-by-step guide for everyday tasks.
- [`TEXTBOOK_CONTENT_MAP.md`](TEXTBOOK_CONTENT_MAP.md) — content sourcing & review notes.
