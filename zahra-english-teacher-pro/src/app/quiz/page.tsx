"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Input, Select, Textarea, Label, Badge, EmptyState } from "@/components/ui";
import { SelectedList, AvailableList } from "@/components/QuestionSelector";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { curriculum } from "@/data/curriculum";
import type { Question, Skill } from "@/data/questions";
import { filterQuestions, selectRandom, selectBalanced, quizTotalMarks, shuffle } from "@/lib/selection";
import { printHtml, docHeader, studentFields, escapeHtml } from "@/lib/print";
import { renderQuestionList, renderMarkSummary, renderAnswerSheet } from "@/lib/docs";
import { uid, todayISO } from "@/lib/cn";
import { Dice5, Scale, Save, Printer, FileCheck2, ListChecks } from "lucide-react";

const SKILLS: Skill[] = ["vocabulary", "grammar", "reading", "listening", "writing", "speaking"];

function QuizBuilder() {
  const { state, setState, logActivity } = useStore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const presetUnit = searchParams.get("unit");

  const [title, setTitle] = useState("Unit Quiz");
  const [classId, setClassId] = useState("");
  const [unitIds, setUnitIds] = useState<string[]>(presetUnit ? [presetUnit] : []);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [difficulty, setDifficulty] = useState<"any" | "easy" | "medium" | "hard">("any");
  const [count, setCount] = useState(5);
  const [instructions, setInstructions] = useState(state.settings.defaultQuizInstructions);
  const [timeLimit, setTimeLimit] = useState("");
  const [shuffleQ, setShuffleQ] = useState(true);
  const [shuffleC, setShuffleC] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const pool = useMemo(
    () => filterQuestions(state.questions, { unitIds, skills, difficulty }),
    [state.questions, unitIds, skills, difficulty]
  );
  const selected = useMemo(
    () => selectedIds.map((id) => state.questions.find((q) => q.id === id)).filter(Boolean) as Question[],
    [selectedIds, state.questions]
  );

  const toggleUnit = (id: string) => setUnitIds((u) => (u.includes(id) ? u.filter((x) => x !== id) : [...u, id]));
  const toggleSkill = (s: Skill) => setSkills((v) => (v.includes(s) ? v.filter((x) => x !== s) : [...v, s]));

  const doRandom = () => {
    if (pool.length === 0) return toast("No questions match the filters", "error");
    setSelectedIds(selectRandom(pool, count).map((q) => q.id));
    toast(`Selected ${Math.min(count, pool.length)} random question(s)`);
  };
  const doBalanced = () => {
    if (pool.length === 0) return toast("No questions match the filters", "error");
    setSelectedIds(selectBalanced(pool, count).map((q) => q.id));
    toast("Balanced selection created");
  };

  const move = (id: string, dir: -1 | 1) => {
    setSelectedIds((ids) => {
      const i = ids.indexOf(id);
      const j = i + dir;
      if (j < 0 || j >= ids.length) return ids;
      const next = [...ids];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const orderedForPrint = (): Question[] => {
    let qs = [...selected];
    if (shuffleQ) qs = shuffle(qs);
    if (shuffleC) qs = qs.map((q) => (q.type === "multiple-choice" ? { ...q, distractors: shuffle(q.distractors) } : q));
    return qs;
  };

  const className = state.classes.find((c) => c.id === classId)?.name;
  const unitLabel = unitIds.map((id) => curriculum.find((u) => u.id === id)?.title).filter(Boolean).join(", ");

  const buildDoc = (withAnswers: boolean, extra = "") => {
    const qs = orderedForPrint();
    return (
      docHeader({
        title: `${title}${withAnswers ? " — Teacher Version (Answer Key)" : ""}`,
        header: state.settings.printHeader,
        teacher: state.profile.name, school: state.profile.school,
        className, unit: unitLabel, date: todayISO(), totalMarks: quizTotalMarks(qs),
      }) +
      (withAnswers ? "" : studentFields()) +
      `<p><strong>Instructions:</strong> ${escapeHtml(instructions)}${timeLimit ? ` &nbsp; <strong>Time:</strong> ${escapeHtml(timeLimit)}` : ""}</p>` +
      renderQuestionList(qs, withAnswers) +
      extra
    );
  };

  const printStudent = () => { if (!selected.length) return toast("Add questions first", "error"); printHtml(title, buildDoc(false)); };
  const printTeacher = () => { if (!selected.length) return toast("Add questions first", "error"); printHtml(title + " (Key)", buildDoc(true, renderMarkSummary(orderedForPrint()))); };
  const printAnswerSheet = () => { if (!selected.length) return toast("Add questions first", "error"); printHtml(title + " Answer Sheet", docHeader({ title: title + " — Answer Sheet", header: state.settings.printHeader, teacher: state.profile.name, className, date: todayISO() }) + studentFields() + renderAnswerSheet(selected.length)); };

  const saveQuiz = () => {
    if (!selected.length) return toast("Add questions first", "error");
    const quiz = { id: uid("quiz"), title, classId, unitIds, instructions, timeLimit, shuffleQuestions: shuffleQ, shuffleChoices: shuffleC, questionIds: selectedIds, createdAt: new Date().toISOString() };
    setState((s) => ({
      ...s,
      quizzes: [quiz, ...s.quizzes],
      printables: [{ id: uid("pr"), name: title, kind: "Quiz", refId: quiz.id, createdAt: quiz.createdAt }, ...s.printables],
    }));
    logActivity(`Created quiz "${title}"`);
    toast("Quiz saved to your library");
  };

  return (
    <div>
      <PageHeader
        title="Quiz Generator"
        description="Build a quiz with deterministic local selection rules — no AI, fully offline. Generates student and teacher versions."
        breadcrumbs={[{ label: "Quiz Generator" }]}
        actions={<Button onClick={saveQuiz}><Save className="h-4 w-4" /> Save quiz</Button>}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader title="Quiz settings" />
            <div className="space-y-3 p-5">
              <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
              <div><Label>Class</Label><Select value={classId} onChange={(e) => setClassId(e.target.value)}><option value="">— None —</option>{state.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
              <div>
                <Label>Units</Label>
                <div className="flex flex-wrap gap-1.5">
                  {curriculum.filter((u) => typeof u.number === "number").map((u) => (
                    <button key={u.id} onClick={() => toggleUnit(u.id)} className={`rounded-full border px-2.5 py-1 text-xs ${unitIds.includes(u.id) ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200" : "border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-300"}`}>{u.title}</button>
                  ))}
                </div>
              </div>
              <div>
                <Label>Skills</Label>
                <div className="flex flex-wrap gap-1.5">
                  {SKILLS.map((s) => (
                    <button key={s} onClick={() => toggleSkill(s)} className={`rounded-full border px-2.5 py-1 text-xs ${skills.includes(s) ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200" : "border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-300"}`}>{s}</button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Difficulty</Label><Select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}><option value="any">Any</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></Select></div>
                <div><Label>Number</Label><Input type="number" min={1} value={count} onChange={(e) => setCount(Number(e.target.value))} /></div>
              </div>
              <div><Label>Time limit</Label><Input value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)} placeholder="e.g. 30 minutes" /></div>
              <div><Label>Instructions</Label><Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={shuffleQ} onChange={(e) => setShuffleQ(e.target.checked)} className="h-4 w-4 accent-brand-600" /> Shuffle questions</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={shuffleC} onChange={(e) => setShuffleC(e.target.checked)} className="h-4 w-4 accent-brand-600" /> Shuffle answer choices</label>
              <p className="text-xs text-neutral-400">{pool.length} question(s) match these filters.</p>
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1" onClick={doRandom}><Dice5 className="h-4 w-4" /> Random</Button>
                <Button variant="secondary" className="flex-1" onClick={doBalanced}><Scale className="h-4 w-4" /> Balanced</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Selected questions" subtitle="Reorder or remove; add more from the pool below." />
            <div className="p-5">
              <SelectedList questions={selected} onRemove={(id) => setSelectedIds((ids) => ids.filter((x) => x !== id))} onMove={move} />
            </div>
          </Card>

          <Card>
            <CardHeader title="Add from question bank" subtitle="Matching the current filters" />
            <div className="p-5">
              {pool.length === 0 ? (
                <EmptyState title="No matching questions" hint="Adjust filters or add questions in the Question Bank." />
              ) : (
                <AvailableList pool={pool} selectedIds={selectedIds} onAdd={(q) => setSelectedIds((ids) => [...ids, q.id])} />
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Print & export" subtitle="Opens a clean print view — choose “Save as PDF” to export." />
            <div className="flex flex-wrap gap-2 p-5">
              <Button variant="outline" onClick={printStudent}><Printer className="h-4 w-4" /> Student version</Button>
              <Button variant="outline" onClick={printTeacher}><FileCheck2 className="h-4 w-4" /> Teacher version + key</Button>
              <Button variant="outline" onClick={printAnswerSheet}><ListChecks className="h-4 w-4" /> Answer sheet</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={null}>
      <QuizBuilder />
    </Suspense>
  );
}
