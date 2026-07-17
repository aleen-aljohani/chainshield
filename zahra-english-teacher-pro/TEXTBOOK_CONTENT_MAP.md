# Textbook Content Map — Mega Goal 3, First Semester

This document explains how the textbook-derived content in **Zahra Aljehani – English Teacher Pro** was assembled, what is included, what is intentionally excluded, and what still requires the teacher's review.

---

## ⚠️ Important source note (read first)

The **Mega Goal 3 Student Book PDF was not present** in the project or the build
environment when this application was created. A filesystem-wide search found no
`Mega Goal`, `goal`, or matching PDF file.

Because content rule #2 forbids inventing textbook content, the structured map
below is **not** a transcription of the book. Instead it reflects the
**publicly known organisation** of Mega Goal 3 as used in the Saudi
first-semester syllabus (the Connect unit, Units 1–6, and two Expansion/Review
sections), expressed only at the level of:

- unit numbers and working titles,
- unit **themes**,
- **learning objectives** (paraphrased, original wording),
- **language functions**,
- **grammar topic names**,
- **vocabulary categories** (not full word lists),
- skill **foci** (reading / listening / speaking / writing),
- projects, and
- **approximate** page ranges.

Every unit in `src/data/curriculum.ts` carries `needsReview: true`, and the
Curriculum and Units pages display a **"Requires teacher review"** banner and
badge. Page numbers are labelled *(approx.)* and must be confirmed against the
printed book.

No reading passages, listening scripts, or long copyrighted sections are
reproduced anywhere in the app (content rules #3 and #5). Where the real book
has a reading or listening text, the app stores only a **title, page reference,
skill focus, and a short original summary**.

---

## Detected / assumed structure (First Semester)

| Order | Item | Theme (working) | Grammar focus | Page range (approx.) |
|------|------|-----------------|---------------|----------------------|
| 0 | Connect | Getting started / review | Present simple vs. continuous; question forms | pp. 2–7 |
| 1 | Unit 1 | Personality & describing people | Tense review; stative vs. dynamic verbs | pp. 8–21 |
| 2 | Unit 2 | Travel & experiences | Present perfect vs. past simple; for/since/yet | pp. 22–35 |
| 3 | Unit 3 | Science, technology & the future | Future forms; first conditional | pp. 36–49 |
| — | Expansion / Review 1 | Consolidation of Units 1–3 | Mixed review | pp. 50–55 |
| 4 | Unit 4 | Health, lifestyle & habits | Modals of advice/obligation; zero conditional | pp. 56–69 |
| 5 | Unit 5 | Work, careers & ambitions | Passive voice; defining relative clauses | pp. 70–83 |
| 6 | Unit 6 | Environment & society | Reported speech; second conditional | pp. 84–97 |
| — | Expansion / Review 2 | Consolidation of Units 4–6 | Passive / reported speech / conditionals review | pp. 98–103 |

The full structured data lives in [`src/data/curriculum.ts`](src/data/curriculum.ts).

---

## Included content

- **Units:** Connect + Units 1–6 + two Expansion/Review sections (first-semester scope).
- **Per unit:** objectives, language functions, grammar topics, vocabulary categories, reading/listening/speaking/writing foci, project, page range.
- **Vocabulary** (`src/data/vocabulary.ts`): a small set of **original** sample words per unit, with original definitions and example sentences, an Arabic gloss field, difficulty and page reference.
- **Grammar** (`src/data/grammar.ts`): original explanations, structures, examples, common mistakes and auto-checked practice exercises for the main first-semester grammar points.
- **Reading / Listening / Speaking / Writing** (`src/data/skills.ts`): reference metadata + short original summaries only.
- **Question bank** (`src/data/questions.ts`): a limited set of original sample questions aligned to the objectives.

## Excluded content (by design)

- **All second-semester units** (typically Units 7–12 and their Expansion/Review). They are not part of this build's scope.
- **Full reading passages and listening transcripts** — never reproduced (copyright).
- **Audio files** — none are bundled. The Listening module lets the teacher attach a local audio file at runtime; it is never uploaded or stored.
- **Exact textbook wording** for objectives/questions — everything is paraphrased or original.

## Content that could not be extracted reliably

Because no PDF was available, the following could **not** be verified and are flagged for teacher review:

1. **Exact unit titles** — the book's marketing/section titles. The app uses neutral working titles ("Unit 1", etc.) plus a theme.
2. **Exact page numbers** — all page references are approximate.
3. **Precise vocabulary lists** per lesson — the app seeds representative original samples only.
4. **Arabic meanings** of seeded vocabulary — provided as a helpful gloss; each seeded item is marked "Review AR".

## Teacher-review checklist

- [ ] Confirm each unit's real title and page range, then edit `src/data/curriculum.ts` and clear `needsReview`.
- [ ] Verify/replace the seeded vocabulary and Arabic meanings in the Vocabulary module.
- [ ] Confirm grammar page references.
- [ ] Add the real listening audio files locally where needed.
- [ ] Review and expand the sample question bank for assessments.

Once verified, the "Requires teacher review" banners can be removed by setting
`needsReview: false` on the corresponding data entries.
