"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Badge, Input, EmptyState } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { seedGrammar, GrammarTopic, GrammarExercise } from "@/data/grammar";
import { curriculum } from "@/data/curriculum";
import { printHtml, docHeader, escapeHtml } from "@/lib/print";
import { PencilRuler, Printer, CheckCircle2, AlertTriangle, RotateCcw } from "lucide-react";

export default function GrammarPage() {
  const { state } = useStore();
  const [openId, setOpenId] = useState<string | null>(seedGrammar[0]?.id ?? null);

  return (
    <div>
      <PageHeader title="Grammar" description="Concise original explanations and auto-checked practice for each unit's grammar." breadcrumbs={[{ label: "Grammar" }]} />
      <div className="space-y-3">
        {seedGrammar.map((topic) => (
          <GrammarCard key={topic.id} topic={topic} open={openId === topic.id} onToggle={() => setOpenId((x) => (x === topic.id ? null : topic.id))} printHeader={state.settings.printHeader} teacher={state.profile.name} />
        ))}
      </div>
    </div>
  );
}

function GrammarCard({ topic, open, onToggle, printHeader, teacher }: { topic: GrammarTopic; open: boolean; onToggle: () => void; printHeader: string; teacher: string }) {
  const unit = curriculum.find((u) => u.id === topic.unitId);
  const printSheet = (withKey: boolean) => {
    const items = topic.exercises.map((ex, i) => {
      let body = `<div>${escapeHtml(ex.prompt)}</div>`;
      if (ex.options) body += `<ol class="choices">${ex.options.map((o) => `<li${withKey && o === ex.answer ? ' class="answer"' : ""}>${escapeHtml(o)}</li>`).join("")}</ol>`;
      else body += withKey ? `<div class="answer">Answer: ${escapeHtml(ex.answer)}</div>` : `<div style="border-bottom:1px solid #999;height:24px;margin-top:6px;"></div>`;
      if (withKey && ex.explanation) body += `<div class="note">${escapeHtml(ex.explanation)}</div>`;
      return `<li>${body}</li>`;
    }).join("");
    printHtml(topic.title, docHeader({ title: `${topic.title}${withKey ? " — Answer Key" : ""}`, header: printHeader, teacher, unit: unit?.title }) + `<p>${escapeHtml(topic.explanation)}</p><p><strong>Structure:</strong> ${escapeHtml(topic.structure)}</p><ol class="questions">${items}</ol>`);
  };

  return (
    <Card>
      <button onClick={onToggle} className="flex w-full items-center justify-between px-5 py-4 text-start">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40"><PencilRuler className="h-5 w-5" /></span>
          <div><h3 className="font-semibold">{topic.title}</h3><p className="text-xs text-neutral-400">{unit?.title} · {topic.page}</p></div>
        </div>
        {topic.needsReview && <Badge color="amber">Review</Badge>}
      </button>
      {open && (
        <div className="border-t border-neutral-100 p-5 dark:border-neutral-700">
          <p className="text-sm text-neutral-700 dark:text-neutral-200">{topic.explanation}</p>
          <div className="mt-3 rounded-lg bg-neutral-50 p-3 text-sm dark:bg-neutral-900"><strong>Structure:</strong> {topic.structure}</div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div><h4 className="mb-1 text-sm font-semibold">Examples</h4><ul className="list-inside list-disc space-y-1 text-sm text-neutral-600 dark:text-neutral-300">{topic.examples.map((e, i) => <li key={i}>{e}</li>)}</ul></div>
            <div><h4 className="mb-1 text-sm font-semibold text-red-600">Common mistakes</h4><ul className="list-inside list-disc space-y-1 text-sm text-neutral-600 dark:text-neutral-300">{topic.commonMistakes.map((e, i) => <li key={i}>{e}</li>)}</ul></div>
          </div>
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-200"><strong>Teacher note:</strong> {topic.teacherNotes}</div>

          <GrammarPractice exercises={topic.exercises} />

          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => printSheet(false)}><Printer className="h-4 w-4" /> Practice sheet</Button>
            <Button variant="outline" size="sm" onClick={() => printSheet(true)}><CheckCircle2 className="h-4 w-4" /> Answer key</Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function GrammarPractice({ exercises }: { exercises: GrammarExercise[] }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!]$/, "");
  const isCorrect = (ex: GrammarExercise) => norm(answers[ex.id] ?? "") === norm(ex.answer);
  const score = exercises.filter(isCorrect).length;

  return (
    <div className="mt-5 rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
      <h4 className="mb-3 text-sm font-semibold">Practice ({exercises.length} questions)</h4>
      <ol className="space-y-3">
        {exercises.map((ex, i) => (
          <li key={ex.id} className="text-sm">
            <p className="mb-1">{i + 1}. {ex.prompt}</p>
            {ex.options ? (
              <div className="flex flex-wrap gap-2">
                {ex.options.map((o) => (
                  <button key={o} onClick={() => setAnswers((a) => ({ ...a, [ex.id]: o }))} className={`rounded-lg border px-3 py-1.5 ${answers[ex.id] === o ? "border-brand-500 bg-brand-50 dark:bg-brand-900/40" : "border-neutral-300 dark:border-neutral-600"}`}>{o}</button>
                ))}
              </div>
            ) : (
              <Input value={answers[ex.id] ?? ""} onChange={(e) => setAnswers((a) => ({ ...a, [ex.id]: e.target.value }))} placeholder="Type your answer…" />
            )}
            {checked && (
              <p className={`mt-1 flex items-center gap-1 ${isCorrect(ex) ? "text-brand-600" : "text-red-500"}`}>
                {isCorrect(ex) ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                {isCorrect(ex) ? "Correct" : `Answer: ${ex.answer}`} — <span className="text-neutral-500">{ex.explanation}</span>
              </p>
            )}
          </li>
        ))}
      </ol>
      <div className="mt-4 flex items-center gap-3">
        {!checked ? (
          <Button size="sm" onClick={() => setChecked(true)}>Check answers</Button>
        ) : (
          <>
            <Badge color={score === exercises.length ? "green" : "amber"}>Score: {score}/{exercises.length}</Badge>
            <Button size="sm" variant="ghost" onClick={() => { setChecked(false); setAnswers({}); }}><RotateCcw className="h-4 w-4" /> Retry</Button>
          </>
        )}
      </div>
    </div>
  );
}
