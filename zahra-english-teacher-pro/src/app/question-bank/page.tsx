"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, Button, Input, Select, Textarea, Badge, Modal, ConfirmDialog, EmptyState, Label } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { curriculum } from "@/data/curriculum";
import type { Question, QuestionType, Skill } from "@/data/questions";
import type { Difficulty } from "@/data/vocabulary";
import { uid } from "@/lib/cn";
import { Plus, Search, Star, Copy, Pencil, Trash2, Download, Upload, Filter } from "lucide-react";

const TYPES: QuestionType[] = ["multiple-choice", "true-false", "fill-blank", "matching", "short-answer", "essay", "error-correction", "transformation"];
const SKILLS: Skill[] = ["vocabulary", "grammar", "reading", "listening", "writing", "speaking"];
const DIFFS: Difficulty[] = ["easy", "medium", "hard"];

function emptyQuestion(): Question {
  const now = new Date().toISOString();
  return {
    id: uid("q"), text: "", type: "multiple-choice", unitId: "unit-1", lesson: "", skill: "grammar",
    difficulty: "easy", marks: 1, answer: "", distractors: ["", "", "", ""], explanation: "", page: "",
    tags: [], notes: "", favorite: false, createdAt: now, updatedAt: now,
  };
}

export default function QuestionBankPage() {
  const { state, setState, logActivity } = useStore();
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [fType, setFType] = useState("all");
  const [fSkill, setFSkill] = useState("all");
  const [fUnit, setFUnit] = useState("all");
  const [fDiff, setFDiff] = useState("all");
  const [editing, setEditing] = useState<Question | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return state.questions.filter((item) => {
      if (query && !item.text.toLowerCase().includes(query) && !item.tags.join(" ").toLowerCase().includes(query)) return false;
      if (fType !== "all" && item.type !== fType) return false;
      if (fSkill !== "all" && item.skill !== fSkill) return false;
      if (fUnit !== "all" && item.unitId !== fUnit) return false;
      if (fDiff !== "all" && item.difficulty !== fDiff) return false;
      return true;
    });
  }, [state.questions, q, fType, fSkill, fUnit, fDiff]);

  const save = (question: Question) => {
    const exists = state.questions.some((x) => x.id === question.id);
    const updated = { ...question, updatedAt: new Date().toISOString(), distractors: question.distractors.filter((d) => d.trim() !== "" || question.type === "multiple-choice") };
    setState((s) => ({
      ...s,
      questions: exists ? s.questions.map((x) => (x.id === question.id ? updated : x)) : [updated, ...s.questions],
    }));
    logActivity(exists ? "Edited a question" : "Added a question to the bank");
    toast(exists ? "Question updated" : "Question added");
    setEditing(null);
  };

  const duplicate = (item: Question) => {
    const copy = { ...item, id: uid("q"), text: item.text + " (copy)", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setState((s) => ({ ...s, questions: [copy, ...s.questions] }));
    toast("Question duplicated");
  };

  const toggleFav = (id: string) => setState((s) => ({ ...s, questions: s.questions.map((x) => (x.id === id ? { ...x, favorite: !x.favorite } : x)) }));

  const remove = (id: string) => {
    setState((s) => ({ ...s, questions: s.questions.filter((x) => x.id !== id) }));
    toast("Question deleted");
    setDeleteId(null);
  };

  const bulkDelete = () => {
    setState((s) => ({ ...s, questions: s.questions.filter((x) => !selected.has(x.id)) }));
    toast(`${selected.size} question(s) deleted`);
    setSelected(new Set());
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(filtered, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "question-bank.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arr = JSON.parse(String(reader.result));
        if (!Array.isArray(arr)) throw new Error();
        const cleaned: Question[] = arr.map((x: any) => ({ ...emptyQuestion(), ...x, id: uid("q") }));
        setState((s) => ({ ...s, questions: [...cleaned, ...s.questions] }));
        toast(`Imported ${cleaned.length} question(s)`);
      } catch {
        toast("Invalid question file", "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <PageHeader
        title="Question Bank"
        description="Create, edit, and organise original questions. Use them in quizzes, worksheets and homework."
        breadcrumbs={[{ label: "Question Bank" }]}
        actions={
          <>
            <label className="inline-flex">
              <input type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
              <span className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-4 text-sm hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"><Upload className="h-4 w-4" /> Import</span>
            </label>
            <Button variant="outline" onClick={exportJson}><Download className="h-4 w-4" /> Export</Button>
            <Button onClick={() => setEditing(emptyQuestion())}><Plus className="h-4 w-4" /> Add question</Button>
          </>
        }
      />

      <Card className="mb-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input placeholder="Search…" value={q} onChange={(e) => setQ(e.target.value)} className="ps-9" />
          </div>
          <Select value={fType} onChange={(e) => setFType(e.target.value)}><option value="all">All types</option>{TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</Select>
          <Select value={fSkill} onChange={(e) => setFSkill(e.target.value)}><option value="all">All skills</option>{SKILLS.map((t) => <option key={t} value={t}>{t}</option>)}</Select>
          <Select value={fUnit} onChange={(e) => setFUnit(e.target.value)}><option value="all">All units</option>{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select>
          <Select value={fDiff} onChange={(e) => setFDiff(e.target.value)}><option value="all">All levels</option>{DIFFS.map((t) => <option key={t} value={t}>{t}</option>)}</Select>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-neutral-500">
          <span><Filter className="me-1 inline h-4 w-4" />{filtered.length} of {state.questions.length} question(s)</span>
          {selected.size > 0 && <Button size="sm" variant="danger" onClick={bulkDelete}><Trash2 className="h-4 w-4" /> Delete {selected.size} selected</Button>}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No questions match" hint="Try clearing filters or add a new question." />
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <Card key={item.id} className="flex items-start gap-3 p-4">
              <input type="checkbox" className="mt-1.5 h-4 w-4 accent-brand-600" checked={selected.has(item.id)} onChange={(e) => {
                const next = new Set(selected);
                e.target.checked ? next.add(item.id) : next.delete(item.id);
                setSelected(next);
              }} aria-label="Select question" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-neutral-800 dark:text-neutral-100">{item.text || <span className="italic text-neutral-400">Untitled question</span>}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <Badge color="blue">{item.type}</Badge>
                  <Badge color="green">{item.skill}</Badge>
                  <Badge color={item.difficulty === "hard" ? "red" : item.difficulty === "medium" ? "amber" : "neutral"}>{item.difficulty}</Badge>
                  <span className="text-xs text-neutral-400">{item.unitId} · {item.marks} mark(s) · {item.page || "no page"}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <button onClick={() => toggleFav(item.id)} className="rounded p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-700" aria-label="Favorite"><Star className={`h-4 w-4 ${item.favorite ? "fill-amber-400 text-amber-400" : "text-neutral-400"}`} /></button>
                <button onClick={() => duplicate(item)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700" aria-label="Duplicate"><Copy className="h-4 w-4" /></button>
                <button onClick={() => setEditing(item)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(item.id)} className="rounded p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && <QuestionEditor question={editing} onSave={save} onClose={() => setEditing(null)} />}
      <ConfirmDialog open={deleteId !== null} title="Delete question?" message="This question will be removed permanently. This cannot be undone." confirmLabel="Delete" onConfirm={() => deleteId && remove(deleteId)} onCancel={() => setDeleteId(null)} />
    </div>
  );
}

function QuestionEditor({ question, onSave, onClose }: { question: Question; onSave: (q: Question) => void; onClose: () => void }) {
  const [form, setForm] = useState<Question>({ ...question, distractors: question.distractors.length ? question.distractors : ["", "", "", ""] });
  const set = (patch: Partial<Question>) => setForm((f) => ({ ...f, ...patch }));

  return (
    <Modal open onClose={onClose} title={question.text ? "Edit question" : "Add question"} size="lg">
      <div className="space-y-4">
        <div>
          <Label>Question text</Label>
          <Textarea value={form.text} onChange={(e) => set({ text: e.target.value })} placeholder="Type the question…" />
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div><Label>Type</Label><Select value={form.type} onChange={(e) => set({ type: e.target.value as QuestionType })}>{TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</Select></div>
          <div><Label>Skill</Label><Select value={form.skill} onChange={(e) => set({ skill: e.target.value as Skill })}>{SKILLS.map((t) => <option key={t} value={t}>{t}</option>)}</Select></div>
          <div><Label>Difficulty</Label><Select value={form.difficulty} onChange={(e) => set({ difficulty: e.target.value as Difficulty })}>{DIFFS.map((t) => <option key={t} value={t}>{t}</option>)}</Select></div>
          <div><Label>Marks</Label><Input type="number" min={0} value={form.marks} onChange={(e) => set({ marks: Number(e.target.value) })} /></div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div><Label>Unit</Label><Select value={form.unitId} onChange={(e) => set({ unitId: e.target.value })}>{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select></div>
          <div><Label>Lesson</Label><Input value={form.lesson} onChange={(e) => set({ lesson: e.target.value })} placeholder="e.g. Lesson 1" /></div>
          <div><Label>Page ref</Label><Input value={form.page} onChange={(e) => set({ page: e.target.value })} placeholder="e.g. p. 24" /></div>
        </div>

        {form.type === "multiple-choice" && (
          <div>
            <Label>Answer choices (mark the correct one)</Label>
            <div className="space-y-2">
              {form.distractors.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input type="radio" name="correct" checked={form.answer === d && d !== ""} onChange={() => set({ answer: d })} className="h-4 w-4 accent-brand-600" aria-label={`Mark choice ${i + 1} correct`} />
                  <Input value={d} onChange={(e) => {
                    const next = [...form.distractors];
                    const old = next[i];
                    next[i] = e.target.value;
                    set({ distractors: next, answer: form.answer === old ? e.target.value : form.answer });
                  }} placeholder={`Choice ${i + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
        {form.type === "true-false" ? (
          <div><Label>Correct answer</Label><Select value={form.answer} onChange={(e) => set({ answer: e.target.value })}><option value="">Choose…</option><option value="True">True</option><option value="False">False</option></Select></div>
        ) : form.type !== "multiple-choice" ? (
          <div><Label>Model answer</Label><Textarea value={form.answer} onChange={(e) => set({ answer: e.target.value })} placeholder="The correct answer / model response…" /></div>
        ) : null}

        <div><Label>Explanation (for the answer key)</Label><Textarea value={form.explanation} onChange={(e) => set({ explanation: e.target.value })} /></div>
        <div><Label>Tags (comma-separated)</Label><Input value={form.tags.join(", ")} onChange={(e) => set({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} /></div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onSave(form)} disabled={!form.text.trim()}>Save question</Button>
        </div>
      </div>
    </Modal>
  );
}
