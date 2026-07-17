"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Select, Input, Badge } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { curriculum, getUnit } from "@/data/curriculum";
import { seedGrammar } from "@/data/grammar";
import { seedWriting, seedSpeaking } from "@/data/skills";
import { filterQuestions, selectBalanced, selectRandom } from "@/lib/selection";
import { printHtml, docHeader, studentFields, escapeHtml } from "@/lib/print";
import { renderQuestionList } from "@/lib/docs";
import { Sparkles, Info } from "lucide-react";

type Action = { id: string; label: string; run: (unitId: string, ctx: Ctx) => string; title: string };
interface Ctx {
  questions: ReturnType<typeof filterQuestions>;
  header: string;
  teacher: string;
}

const ACTIONS: Action[] = [
  { id: "quick-quiz", label: "Quick quiz", title: "Quick Quiz", run: (u, c) => renderQuestionList(selectBalanced(c.questions, 5), false) },
  { id: "unit-review", label: "Unit review", title: "Unit Review", run: (u, c) => renderQuestionList(selectBalanced(c.questions, 10), false) },
  { id: "exam-review", label: "Exam review", title: "Exam Review", run: (u, c) => renderQuestionList(selectBalanced(c.questions, 15), false) },
  { id: "worksheet", label: "Worksheet", title: "Worksheet", run: (u, c) => renderQuestionList(selectRandom(c.questions, 8), false) },
  { id: "homework", label: "Homework", title: "Homework", run: (u, c) => renderQuestionList(selectRandom(c.questions, 6), false) },
  { id: "monthly-test", label: "Monthly-test draft", title: "Monthly Test", run: (u, c) => renderQuestionList(selectBalanced(c.questions, 12), false) },
  { id: "final-review", label: "Final-review draft", title: "Final Review", run: (u, c) => renderQuestionList(selectBalanced(c.questions, 20), false) },
  { id: "vocab-review", label: "Vocabulary review", title: "Vocabulary Review", run: (u, c) => renderQuestionList(selectRandom(c.questions.filter((q) => q.skill === "vocabulary"), 8), false) },
  { id: "grammar-review", label: "Grammar review", title: "Grammar Review", run: (u) => {
    const g = seedGrammar.find((x) => x.unitId === u) ?? seedGrammar[0];
    return `<p>${escapeHtml(g.explanation)}</p><p><strong>Structure:</strong> ${escapeHtml(g.structure)}</p><ol class="questions">${g.exercises.map((e) => `<li>${escapeHtml(e.prompt)}<div style="border-bottom:1px solid #999;height:22px;margin-top:6px;"></div></li>`).join("")}</ol>`;
  } },
  { id: "speaking-cards", label: "Speaking cards", title: "Speaking Cards", run: (u) => {
    const cards = seedSpeaking.filter((s) => s.unitId === u);
    const list = (cards.length ? cards : seedSpeaking).slice(0, 6);
    return `<ol class="questions">${list.map((s) => `<li><span class="badge">${escapeHtml(s.type)}</span> ${escapeHtml(s.prompt)}</li>`).join("")}</ol>`;
  } },
  { id: "writing-task", label: "Writing task", title: "Writing Task", run: (u) => {
    const w = seedWriting.find((x) => x.unitId === u) ?? seedWriting[0];
    return `<p><strong>${escapeHtml(w.title)}</strong> (${escapeHtml(w.genre)})</p><p>${escapeHtml(w.objective)}</p><h3>Checklist</h3><ul>${w.checklist.map((c) => `<li>☐ ${escapeHtml(c)}</li>`).join("")}</ul><div style="border:1px solid #ccc;height:200px;border-radius:6px;"></div>`;
  } },
  { id: "lesson-structure", label: "Lesson structure", title: "Lesson Structure", run: (u) => {
    const unit = getUnit(u)!;
    const stages: [string, string][] = [["Warm-up (5 min)", `Discuss "${unit.theme}"`], ["Presentation (10 min)", `${unit.grammarTopics[0] ?? "Target grammar"} + key vocabulary`], ["Guided practice (10 min)", unit.readingFocus], ["Independent practice (10 min)", unit.speakingFocus], ["Assessment (5 min)", "Exit question / quick check"], ["Homework", unit.writingFocus]];
    return `<ol class="questions">${stages.map(([k, v]) => `<li><strong>${escapeHtml(k)}:</strong> ${escapeHtml(v)}</li>`).join("")}</ol>`;
  } },
];

export default function AssistantPage() {
  const { state } = useStore();
  const { toast } = useToast();
  const [unitId, setUnitId] = useState("unit-1");

  const generate = (action: Action) => {
    const questions = filterQuestions(state.questions, { unitIds: [unitId] });
    const ctx: Ctx = { questions, header: state.settings.printHeader, teacher: state.profile.name };
    const body = action.run(unitId, ctx);
    printHtml(action.title, docHeader({ title: `${action.title} — Draft for teacher review`, header: state.settings.printHeader, teacher: state.profile.name, unit: getUnit(unitId)?.title }) + studentFields() + `<p class="note">⚠ Draft for teacher review — generated locally from your content using templates and selection rules (no AI).</p>` + body);
    toast(`"${action.title}" draft opened for printing`);
  };

  return (
    <div>
      <PageHeader title="Teacher Assistant" description="Local, rule-based resource generator. Builds drafts from your textbook metadata and question bank." breadcrumbs={[{ label: "Teacher Assistant" }]} />

      <Card className="mb-4 border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/30">
        <p className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200"><Info className="mt-0.5 h-4 w-4 shrink-0" /><span>This is <strong>not a live AI service</strong>. Every output is assembled locally from your own content using structured templates and controlled random selection, and is labelled <strong>“Draft for teacher review.”</strong></span></p>
      </Card>

      <Card className="mb-4 p-4"><div className="flex items-center gap-3"><span className="text-sm font-medium">Unit:</span><Select value={unitId} onChange={(e) => setUnitId(e.target.value)} className="w-48">{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select></div></Card>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ACTIONS.map((a) => (
          <button key={a.id} onClick={() => generate(a)} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 text-start transition-colors hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-brand-900/30">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40"><Sparkles className="h-5 w-5" /></span>
            <div><p className="font-medium">Create a {a.label.toLowerCase()}</p><p className="text-xs text-neutral-400">Draft for teacher review</p></div>
          </button>
        ))}
      </div>
    </div>
  );
}
