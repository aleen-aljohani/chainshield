"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Input, Select, Textarea, Label, Badge, EmptyState } from "@/components/ui";
import { SelectedList, AvailableList } from "@/components/QuestionSelector";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { curriculum } from "@/data/curriculum";
import type { Question } from "@/data/questions";
import { filterQuestions, selectRandom } from "@/lib/selection";
import { printHtml, docHeader, studentFields, escapeHtml } from "@/lib/print";
import { renderQuestionList } from "@/lib/docs";
import { uid, todayISO, formatDate } from "@/lib/cn";
import { Printer, FileCheck2, Save, Wand2, Copy, Trash2 } from "lucide-react";

const TEMPLATES = [
  { id: "quick", name: "Quick Practice", count: 5, type: "Quick Practice" },
  { id: "full", name: "Full Lesson Practice", count: 10, type: "Full Lesson Practice" },
  { id: "review", name: "Unit Review", count: 12, type: "Unit Review" },
  { id: "remedial", name: "Remedial Practice", count: 6, type: "Remedial Practice" },
  { id: "challenge", name: "Challenge Practice", count: 8, type: "Challenge Practice" },
];

function WorksheetBuilder() {
  const { state, setState, logActivity } = useStore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const presetUnit = searchParams.get("unit");

  const [title, setTitle] = useState("Vocabulary & Grammar Practice");
  const [type, setType] = useState("Mixed review");
  const [unitId, setUnitId] = useState(presetUnit || "unit-1");
  const [instructions, setInstructions] = useState("Complete all the tasks below. Write clearly.");
  const [count, setCount] = useState(6);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const pool = useMemo(() => filterQuestions(state.questions, { unitIds: [unitId] }), [state.questions, unitId]);
  const selected = useMemo(() => selectedIds.map((id) => state.questions.find((q) => q.id === id)).filter(Boolean) as Question[], [selectedIds, state.questions]);

  const applyTemplate = (tpl: (typeof TEMPLATES)[number]) => {
    setType(tpl.type);
    setCount(tpl.count);
    setSelectedIds(selectRandom(pool, tpl.count).map((q) => q.id));
    toast(`"${tpl.name}" template applied`);
  };

  const autoFill = () => {
    if (!pool.length) return toast("No questions for this unit", "error");
    setSelectedIds(selectRandom(pool, count).map((q) => q.id));
    toast("Questions selected");
  };

  const move = (id: string, dir: -1 | 1) => setSelectedIds((ids) => {
    const i = ids.indexOf(id); const j = i + dir;
    if (j < 0 || j >= ids.length) return ids;
    const n = [...ids]; [n[i], n[j]] = [n[j], n[i]]; return n;
  });

  const unitLabel = curriculum.find((u) => u.id === unitId)?.title;
  const buildDoc = (withAnswers: boolean) =>
    docHeader({ title: `${title}${withAnswers ? " — Answer Key" : ""}`, header: state.settings.printHeader, teacher: state.profile.name, school: state.profile.school, unit: unitLabel, date: todayISO() }) +
    (withAnswers ? "" : studentFields()) +
    `<p><strong>Instructions:</strong> ${escapeHtml(instructions)}</p>` +
    renderQuestionList(selected, withAnswers);

  const printStudent = () => { if (!selected.length) return toast("Add questions first", "error"); printHtml(title, buildDoc(false)); };
  const printKey = () => { if (!selected.length) return toast("Add questions first", "error"); printHtml(title + " (Key)", buildDoc(true)); };

  const saveWorksheet = () => {
    if (!selected.length) return toast("Add questions first", "error");
    const ws = { id: uid("ws"), title, type, unitId, instructions, questionIds: selectedIds, createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, worksheets: [ws, ...s.worksheets], printables: [{ id: uid("pr"), name: title, kind: "Worksheet", refId: ws.id, createdAt: ws.createdAt }, ...s.printables] }));
    logActivity(`Created worksheet "${title}"`);
    toast("Worksheet saved");
  };

  return (
    <div>
      <PageHeader title="Worksheet Builder" description="Create printable worksheets from your question bank, with student and answer-key versions." breadcrumbs={[{ label: "Worksheets" }]} actions={<Button onClick={saveWorksheet}><Save className="h-4 w-4" /> Save</Button>} />

      <div className="mb-4 flex flex-wrap gap-2">
        {TEMPLATES.map((tpl) => (
          <button key={tpl.id} onClick={() => applyTemplate(tpl)} className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-brand-900/30">
            <Wand2 className="me-1 inline h-4 w-4 text-brand-600" />{tpl.name}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Settings" />
          <div className="space-y-3 p-5">
            <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
            <div><Label>Type</Label><Select value={type} onChange={(e) => setType(e.target.value)}>{["Vocabulary","Grammar","Reading","Writing","Mixed review","Unit review","Exam preparation"].map((t) => <option key={t}>{t}</option>)}</Select></div>
            <div><Label>Unit</Label><Select value={unitId} onChange={(e) => setUnitId(e.target.value)}>{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select></div>
            <div className="grid grid-cols-2 gap-3"><div><Label>Questions</Label><Input type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} /></div><div className="flex items-end"><Button variant="secondary" className="w-full" onClick={autoFill}>Auto-select</Button></div></div>
            <div><Label>Instructions</Label><Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} /></div>
            <p className="text-xs text-neutral-400">{pool.length} question(s) available for this unit.</p>
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Worksheet items" />
            <div className="p-5"><SelectedList questions={selected} onRemove={(id) => setSelectedIds((ids) => ids.filter((x) => x !== id))} onMove={move} /></div>
          </Card>
          <Card>
            <CardHeader title="Add questions" />
            <div className="p-5">
              {pool.length === 0 ? <EmptyState title="No questions for this unit" hint="Add questions in the Question Bank first." /> : <AvailableList pool={pool} selectedIds={selectedIds} onAdd={(q) => setSelectedIds((ids) => [...ids, q.id])} />}
            </div>
          </Card>
          <Card>
            <CardHeader title="Print & export" />
            <div className="flex flex-wrap gap-2 p-5">
              <Button variant="outline" onClick={printStudent}><Printer className="h-4 w-4" /> Student worksheet</Button>
              <Button variant="outline" onClick={printKey}><FileCheck2 className="h-4 w-4" /> Answer key</Button>
            </div>
          </Card>
        </div>
      </div>

      {state.worksheets.length > 0 && (
        <Card className="mt-6">
          <CardHeader title="Saved worksheets" subtitle={`${state.worksheets.length} saved`} />
          <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
            {state.worksheets.map((w) => (
              <div key={w.id} className="flex items-center justify-between px-5 py-3 text-sm">
                <div><p className="font-medium">{w.title}</p><p className="text-xs text-neutral-400">{w.type} · {w.questionIds.length} items · {formatDate(w.createdAt)}</p></div>
                <div className="flex gap-1">
                  <Badge color="green">{w.type}</Badge>
                  <button onClick={() => { setSelectedIds(w.questionIds); setTitle(w.title + " (copy)"); setUnitId(w.unitId); setInstructions(w.instructions); toast("Loaded into builder"); }} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700" aria-label="Duplicate"><Copy className="h-4 w-4" /></button>
                  <button onClick={() => { setState((s) => ({ ...s, worksheets: s.worksheets.filter((x) => x.id !== w.id) })); toast("Worksheet deleted"); }} className="rounded p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

export default function WorksheetsPage() {
  return <Suspense fallback={null}><WorksheetBuilder /></Suspense>;
}
