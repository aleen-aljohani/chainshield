"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Badge, Input, Textarea, Label } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { seedWriting } from "@/data/skills";
import { curriculum } from "@/data/curriculum";
import { rubricTotal } from "@/lib/calc";
import { printHtml, docHeader, studentFields, escapeHtml } from "@/lib/print";
import { PenLine, Printer, AlertTriangle, Info } from "lucide-react";

export default function WritingPage() {
  const { state } = useStore();
  const [selected, setSelected] = useState(seedWriting[0]);
  const [draft, setDraft] = useState("");

  const printAssignment = () => {
    printHtml(selected.title, docHeader({ title: selected.title, header: state.settings.printHeader, teacher: state.profile.name, unit: curriculum.find((u) => u.id === selected.unitId)?.title }) + studentFields() + `<p><strong>Genre:</strong> ${escapeHtml(selected.genre)}</p><p><strong>Objective:</strong> ${escapeHtml(selected.objective)}</p><h2>Checklist</h2><ul>${selected.checklist.map((c) => `<li>☐ ${escapeHtml(c)}</li>`).join("")}</ul><h2>Your writing</h2><div style="border:1px solid #ccc;height:300px;border-radius:6px;"></div>`);
  };

  // Preliminary, rule-based writing hints (explicitly NOT authoritative).
  const hints = getWritingHints(draft);

  return (
    <div>
      <PageHeader title="Writing" description="Writing tasks by unit, a planning organiser, a draft area, and an editable 20-point rubric." breadcrumbs={[{ label: "Writing" }]} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Writing task" action={<Button size="sm" variant="outline" onClick={printAssignment}><Printer className="h-4 w-4" /> Print assignment</Button>} />
            <div className="p-5">
              <div className="mb-3 flex flex-wrap gap-2">
                {seedWriting.map((w) => (
                  <button key={w.id} onClick={() => setSelected(w)} className={`rounded-lg border px-3 py-1.5 text-sm ${selected.id === w.id ? "border-brand-500 bg-brand-50 dark:bg-brand-900/40" : "border-neutral-300 dark:border-neutral-600"}`}>{w.title}</button>
                ))}
              </div>
              <div className="flex items-center gap-2"><PenLine className="h-5 w-5 text-brand-600" /><h3 className="font-semibold">{selected.title}</h3><Badge color="blue">{selected.genre}</Badge></div>
              <p className="mt-1 text-xs text-neutral-400">{curriculum.find((u) => u.id === selected.unitId)?.title} · {selected.page}</p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300"><strong>Objective:</strong> {selected.objective}</p>
              <div className="mt-3">
                <h4 className="mb-1 text-sm font-semibold">Checklist</h4>
                <ul className="space-y-1 text-sm text-neutral-600 dark:text-neutral-300">{selected.checklist.map((c, i) => <li key={i} className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-brand-600" /> {c}</li>)}</ul>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Draft area" subtitle={`${draft.trim() ? draft.trim().split(/\s+/).length : 0} words`} />
            <div className="p-5">
              <Textarea className="min-h-[200px]" value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Students or the teacher can draft here…" />
              {draft.trim() && (
                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm dark:border-blue-900 dark:bg-blue-900/30">
                  <p className="mb-1 flex items-center gap-1 font-medium text-blue-700 dark:text-blue-200"><Info className="h-4 w-4" /> Preliminary suggestions (require teacher review)</p>
                  <ul className="list-inside list-disc text-blue-700 dark:text-blue-200">{hints.map((h, i) => <li key={i}>{h}</li>)}</ul>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1"><WritingRubric /></div>
      </div>
    </div>
  );
}

function getWritingHints(text: string): string[] {
  const hints: string[] = [];
  if (!text.trim()) return hints;
  const words = text.trim().split(/\s+/).length;
  if (words < 40) hints.push("The text is quite short — encourage the student to develop their ideas further.");
  if (/\bi\b/.test(text)) hints.push("Check that the pronoun “I” is always capitalised.");
  if (!/[.!?]\s*$/.test(text.trim())) hints.push("The final sentence may be missing end punctuation.");
  if (/\s{2,}/.test(text)) hints.push("There appear to be double spaces — consider tidying spacing.");
  if (/\bdont\b|\bcant\b|\bwont\b/i.test(text)) hints.push("Some contractions may be missing an apostrophe (e.g. don't, can't).");
  if (hints.length === 0) hints.push("No basic issues detected by the simple checker — please review for content and accuracy.");
  return hints;
}

function WritingRubric() {
  const { state, setState } = useStore();
  const { toast } = useToast();
  const rubric = state.writingRubric;
  const [scores, setScores] = useState<Record<string, number>>({});
  const [student, setStudent] = useState("");
  const [comment, setComment] = useState("");
  const result = rubricTotal(rubric, scores);

  const setMax = (id: string, max: number) => setState((s) => ({ ...s, writingRubric: { ...s.writingRubric, criteria: s.writingRubric.criteria.map((c) => c.id === id ? { ...c, max } : c) } }));

  const printReport = () => {
    const rows = rubric.criteria.map((c) => `<tr><td>${c.name}</td><td>${scores[c.id] ?? 0} / ${c.max}</td></tr>`).join("");
    printHtml("Writing Feedback", docHeader({ title: "Writing Feedback Report", header: state.settings.printHeader, teacher: state.profile.name, totalMarks: rubric.total }) + `<p><strong>Student:</strong> ${student || "________"}</p><table><thead><tr><th>Criterion</th><th>Score</th></tr></thead><tbody>${rows}<tr><th>Total</th><th>${result.earned} / ${result.max} (${result.percentage}%)</th></tr></tbody></table><p class="note">Comments: ${comment || ""}</p>`);
  };

  return (
    <Card>
      <CardHeader title="Writing rubric" subtitle={`Default total: ${result.max} points`} />
      <div className="space-y-3 p-5">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-2 text-xs text-amber-800 dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-200"><AlertTriangle className="me-1 inline h-3 w-3" />Automated checks are preliminary only. Final judgement is the teacher's.</div>
        <Input placeholder="Student name" value={student} onChange={(e) => setStudent(e.target.value)} />
        {rubric.criteria.map((c) => (
          <div key={c.id}>
            <div className="mb-1 flex items-center justify-between text-sm"><span>{c.name}</span><span className="text-neutral-400">/ <input type="number" value={c.max} min={1} onChange={(e) => setMax(c.id, Number(e.target.value))} className="w-12 rounded border border-neutral-300 bg-transparent px-1 text-center dark:border-neutral-600" /></span></div>
            <input type="range" min={0} max={c.max} value={scores[c.id] ?? 0} onChange={(e) => setScores((s) => ({ ...s, [c.id]: Number(e.target.value) }))} className="w-full accent-brand-600" />
            <span className="text-xs text-neutral-500">{scores[c.id] ?? 0} / {c.max}</span>
          </div>
        ))}
        <Textarea placeholder="Teacher comments…" value={comment} onChange={(e) => setComment(e.target.value)} />
        <div className="rounded-lg bg-brand-50 p-3 text-center dark:bg-brand-900/40"><p className="text-2xl font-bold text-brand-700 dark:text-brand-200">{result.earned} / {result.max}</p><p className="text-sm text-neutral-500">{result.percentage}%</p></div>
        <Button variant="outline" className="w-full" onClick={printReport}><Printer className="h-4 w-4" /> Print feedback</Button>
      </div>
    </Card>
  );
}
