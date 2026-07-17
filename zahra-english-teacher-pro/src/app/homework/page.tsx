"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Input, Select, Textarea, Label, Badge, EmptyState, ConfirmDialog } from "@/components/ui";
import { SelectedList, AvailableList } from "@/components/QuestionSelector";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { curriculum } from "@/data/curriculum";
import type { Question } from "@/data/questions";
import { filterQuestions } from "@/lib/selection";
import { printHtml, docHeader, studentFields, escapeHtml } from "@/lib/print";
import { renderQuestionList } from "@/lib/docs";
import { uid, todayISO, formatDate } from "@/lib/cn";
import { Printer, FileCheck2, Plus, Trash2, CheckCircle2, Clock } from "lucide-react";

export default function HomeworkPage() {
  const { state, setState, logActivity } = useStore();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [unitId, setUnitId] = useState("unit-1");
  const [lesson, setLesson] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("Complete the following at home. Bring your work to the next lesson.");
  const [estimatedTime, setEstimatedTime] = useState("20 minutes");
  const [notes, setNotes] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const pool = useMemo(() => filterQuestions(state.questions, { unitIds: [unitId] }), [state.questions, unitId]);
  const selected = useMemo(() => selectedIds.map((id) => state.questions.find((q) => q.id === id)).filter(Boolean) as Question[], [selectedIds, state.questions]);
  const move = (id: string, dir: -1 | 1) => setSelectedIds((ids) => { const i = ids.indexOf(id); const j = i + dir; if (j < 0 || j >= ids.length) return ids; const n = [...ids]; [n[i], n[j]] = [n[j], n[i]]; return n; });

  const unitLabel = curriculum.find((u) => u.id === unitId)?.title;
  const printDoc = (hw: { title: string; instructions: string; dueDate: string; questionIds: string[]; estimatedTime: string }, withAnswers: boolean) => {
    const qs = hw.questionIds.map((id) => state.questions.find((q) => q.id === id)).filter(Boolean) as Question[];
    printHtml(hw.title, docHeader({ title: `${hw.title}${withAnswers ? " — Answer Key" : ""}`, header: state.settings.printHeader, teacher: state.profile.name, school: state.profile.school, unit: unitLabel, date: hw.dueDate ? `Due ${hw.dueDate}` : todayISO() }) + (withAnswers ? "" : studentFields()) + `<p><strong>Instructions:</strong> ${escapeHtml(hw.instructions)} ${hw.estimatedTime ? `(≈ ${escapeHtml(hw.estimatedTime)})` : ""}</p>` + renderQuestionList(qs, withAnswers));
  };

  const create = () => {
    if (!title.trim()) return toast("Enter a title", "error");
    if (!selected.length) return toast("Add at least one question", "error");
    const hw = { id: uid("hw"), title, unitId, lesson, dueDate, instructions, questionIds: selectedIds, estimatedTime, notes, completed: false, createdAt: new Date().toISOString() };
    setState((s) => ({ ...s, homework: [hw, ...s.homework], printables: [{ id: uid("pr"), name: title, kind: "Homework", refId: hw.id, createdAt: hw.createdAt }, ...s.printables] }));
    logActivity(`Created homework "${title}"`);
    toast("Homework created");
    setTitle(""); setSelectedIds([]); setLesson(""); setDueDate("");
  };

  return (
    <div>
      <PageHeader title="Homework Builder" description="Assign homework from the question bank with printable student and teacher versions." breadcrumbs={[{ label: "Homework" }]} actions={<Button onClick={create}><Plus className="h-4 w-4" /> Create homework</Button>} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Details" />
          <div className="space-y-3 p-5">
            <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Unit 2 vocabulary" /></div>
            <div className="grid grid-cols-2 gap-3"><div><Label>Unit</Label><Select value={unitId} onChange={(e) => setUnitId(e.target.value)}>{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select></div><div><Label>Lesson</Label><Input value={lesson} onChange={(e) => setLesson(e.target.value)} /></div></div>
            <div className="grid grid-cols-2 gap-3"><div><Label>Due date</Label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></div><div><Label>Est. time</Label><Input value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} /></div></div>
            <div><Label>Instructions</Label><Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} /></div>
            <div><Label>Teacher notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          </div>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card><CardHeader title="Questions" /><div className="p-5"><SelectedList questions={selected} onRemove={(id) => setSelectedIds((ids) => ids.filter((x) => x !== id))} onMove={move} /></div></Card>
          <Card><CardHeader title="Add from question bank" /><div className="p-5">{pool.length === 0 ? <EmptyState title="No questions for this unit" /> : <AvailableList pool={pool} selectedIds={selectedIds} onAdd={(q) => setSelectedIds((ids) => [...ids, q.id])} />}</div></Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader title="Assigned homework" subtitle={`${state.homework.length} item(s)`} />
        {state.homework.length === 0 ? (
          <div className="p-5"><EmptyState title="No homework yet" hint="Create your first assignment above." /></div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-700">
            {state.homework.map((hw) => (
              <div key={hw.id} className="flex flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{hw.title}</p>
                  <p className="text-xs text-neutral-400">{curriculum.find((u) => u.id === hw.unitId)?.title} · {hw.questionIds.length} items · {hw.dueDate ? `Due ${formatDate(hw.dueDate)}` : "No due date"}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  <Badge color={hw.completed ? "green" : "amber"}>{hw.completed ? "Done" : "Open"}</Badge>
                  <Button size="sm" variant="ghost" onClick={() => setState((s) => ({ ...s, homework: s.homework.map((x) => x.id === hw.id ? { ...x, completed: !x.completed } : x) }))}>{hw.completed ? <Clock className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}</Button>
                  <Button size="sm" variant="outline" onClick={() => printDoc(hw, false)}><Printer className="h-4 w-4" /> Student</Button>
                  <Button size="sm" variant="outline" onClick={() => printDoc(hw, true)}><FileCheck2 className="h-4 w-4" /> Key</Button>
                  <button onClick={() => setDeleteId(hw.id)} className="rounded p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog open={deleteId !== null} title="Delete homework?" message="This assignment will be removed." confirmLabel="Delete" onConfirm={() => { setState((s) => ({ ...s, homework: s.homework.filter((x) => x.id !== deleteId) })); toast("Deleted"); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
