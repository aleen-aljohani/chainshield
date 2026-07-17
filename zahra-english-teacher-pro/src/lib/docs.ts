import type { Question } from "@/data/questions";
import { escapeHtml } from "./print";
import { quizTotalMarks, markDistribution } from "./selection";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/** Render a single question to print HTML. `withAnswers` shows the key. */
export function renderQuestion(q: Question, index: number, withAnswers: boolean): string {
  let inner = `<div>${escapeHtml(q.text)} <span class="marks">[${q.marks} mark${q.marks === 1 ? "" : "s"}]</span></div>`;

  if (q.type === "multiple-choice" && q.distractors.length > 0) {
    inner += `<ol class="choices">${q.distractors
      .map((d) => `<li${withAnswers && d === q.answer ? ' class="answer"' : ""}>${escapeHtml(d)}${withAnswers && d === q.answer ? " ✓" : ""}</li>`)
      .join("")}</ol>`;
  } else if (q.type === "true-false") {
    inner += `<div class="choices">${withAnswers ? `<span class="answer">Answer: ${escapeHtml(q.answer)}</span>` : "True &nbsp;/&nbsp; False"}</div>`;
  } else if (["fill-blank", "short-answer", "error-correction", "transformation", "essay"].includes(q.type)) {
    if (withAnswers) {
      inner += `<div class="answer">Answer: ${escapeHtml(q.answer)}</div>`;
    } else {
      inner += `<div style="border-bottom:1px solid #999; height:${q.type === "essay" ? "80px" : "24px"}; margin-top:6px;"></div>`;
    }
  }
  if (withAnswers && q.explanation) {
    inner += `<div class="note">Explanation: ${escapeHtml(q.explanation)}</div>`;
  }
  return `<li>${inner}</li>`;
}

export function renderQuestionList(questions: Question[], withAnswers: boolean): string {
  return `<ol class="questions">${questions.map((q, i) => renderQuestion(q, i, withAnswers)).join("")}</ol>`;
}

export function renderMarkSummary(questions: Question[]): string {
  const dist = markDistribution(questions);
  const rows = Object.entries(dist)
    .map(([skill, d]) => `<tr><td>${escapeHtml(skill)}</td><td>${d.count}</td><td>${d.marks}</td></tr>`)
    .join("");
  return `<h2>Mark distribution</h2><table><thead><tr><th>Skill</th><th>Questions</th><th>Marks</th></tr></thead><tbody>${rows}<tr><th>Total</th><th>${questions.length}</th><th>${quizTotalMarks(questions)}</th></tr></tbody></table>`;
}

export function renderAnswerSheet(count: number): string {
  const rows = Array.from({ length: count }, (_, i) => {
    const opts = LETTERS.slice(0, 4).map((l) => `<span style="display:inline-block;border:1px solid #999;border-radius:50%;width:20px;height:20px;text-align:center;margin:0 3px;">${l}</span>`).join("");
    return `<tr><td style="width:40px;">${i + 1}.</td><td>${opts}</td></tr>`;
  }).join("");
  return `<h2 class="page-break">Answer sheet</h2><table style="border:none;"><tbody>${rows}</tbody></table>`;
}
