"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Input, Select, Textarea, Label, Badge, EmptyState, ConfirmDialog } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { curriculum, getUnit } from "@/data/curriculum";
import type { LessonPlan } from "@/lib/types";
import { uid, todayISO, formatDate } from "@/lib/cn";
import { printHtml, docHeader, escapeHtml } from "@/lib/print";
import { Plus, Printer, Copy, Trash2, Wand2, CheckCircle2, Clock, CalendarDays } from "lucide-react";

function blankLesson(unitId = "unit-1"): LessonPlan {
  return { id: uid("lp"), title: "", classId: "", date: todayISO(), unitId, lesson: "Lesson 1", duration: "45 minutes", objectives: "", vocabulary: "", grammar: "", strategy: "", warmUp: "", presentation: "", guidedPractice: "", independentPractice: "", assessment: "", homework: "", resources: "", differentiation: "", reflection: "", completed: false, createdAt: new Date().toISOString() };
}

/** Local, rule-based lesson-structure suggestion (no AI) built from unit metadata. */
function suggestFromUnit(unitId: string): Partial<LessonPlan> {
  const u = getUnit(unitId);
  if (!u) return {};
  return {
    objectives: u.objectives.join("\n"),
    vocabulary: u.vocabularyCategories.join(", "),
    grammar: u.grammarTopics.join("; "),
    strategy: "Communicative approach with pair and group work.",
    warmUp: `Activate prior knowledge on "${u.theme}" (5 min): quick discussion or vocabulary brainstorm.`,
    presentation: `Introduce target language: ${u.grammarTopics[0] ?? "the unit grammar"} and key vocabulary (10 min).`,
    guidedPractice: `Controlled practice using the ${u.readingFocus.toLowerCase()} focus and example sentences (10 min).`,
    independentPractice: `Students produce language via a ${u.speakingFocus.toLowerCase()} or writing task (10 min).`,
    assessment: "Quick check: teacher monitors and gives feedback; short exit question.",
    homework: `Prepare for: ${u.writingFocus}.`,
    differentiation: "Provide sentence starters for support; add an extension prompt for stronger students.",
  };
}

function LessonPlanner() {
  const { state, setState, logActivity } = useStore();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [current, setCurrent] = useState<LessonPlan>(blankLesson(searchParams.get("unit") || "unit-1"));
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [view, setView] = useState<"editor" | "week">("editor");

  const set = (p: Partial<LessonPlan>) => setCurrent((c) => ({ ...c, ...p }));

  const save = () => {
    if (!current.title.trim()) return toast("Add a lesson title", "error");
    const exists = state.lessonPlans.some((l) => l.id === current.id);
    setState((s) => ({ ...s, lessonPlans: exists ? s.lessonPlans.map((l) => l.id === current.id ? current : l) : [current, ...s.lessonPlans], printables: exists ? s.printables : [{ id: uid("pr"), name: current.title, kind: "Lesson Plan", refId: current.id, createdAt: current.createdAt }, ...s.printables] }));
    logActivity(exists ? `Updated lesson "${current.title}"` : `Created lesson "${current.title}"`);
    toast("Lesson saved");
  };

  const applySuggestion = () => { set(suggestFromUnit(current.unitId)); toast("Draft structure suggested — review and edit", "info"); };

  const printPlan = () => {
    const fields: [string, string][] = [["Objectives", current.objectives], ["Vocabulary", current.vocabulary], ["Grammar focus", current.grammar], ["Teaching strategy", current.strategy], ["Warm-up", current.warmUp], ["Presentation", current.presentation], ["Guided practice", current.guidedPractice], ["Independent practice", current.independentPractice], ["Assessment", current.assessment], ["Homework", current.homework], ["Resources", current.resources], ["Differentiation", current.differentiation], ["Reflection", current.reflection]];
    const body = fields.filter(([, v]) => v.trim()).map(([k, v]) => `<h3>${k}</h3><p style="white-space:pre-wrap">${escapeHtml(v)}</p>`).join("");
    printHtml(current.title, docHeader({ title: current.title || "Lesson Plan", header: state.settings.printHeader, teacher: state.profile.name, className: state.classes.find((c) => c.id === current.classId)?.name, unit: getUnit(current.unitId)?.title, date: current.date }) + `<p><strong>Duration:</strong> ${escapeHtml(current.duration)} · <strong>Lesson:</strong> ${escapeHtml(current.lesson)}</p>` + body);
  };

  const load = (lp: LessonPlan) => { setCurrent(lp); setView("editor"); };
  const duplicate = (lp: LessonPlan) => { const copy = { ...lp, id: uid("lp"), title: lp.title + " (copy)", createdAt: new Date().toISOString() }; setState((s) => ({ ...s, lessonPlans: [copy, ...s.lessonPlans] })); toast("Lesson duplicated"); };

  const byDate = useMemo(() => [...state.lessonPlans].sort((a, b) => a.date.localeCompare(b.date)), [state.lessonPlans]);

  const fieldRows: [keyof LessonPlan, string][] = [["objectives", "Learning objectives"], ["vocabulary", "Vocabulary"], ["grammar", "Grammar focus"], ["strategy", "Teaching strategy"], ["warmUp", "Warm-up"], ["presentation", "Presentation"], ["guidedPractice", "Guided practice"], ["independentPractice", "Independent practice"], ["assessment", "Assessment"], ["homework", "Homework"], ["resources", "Required resources"], ["differentiation", "Differentiation"], ["reflection", "Teacher reflection"]];

  return (
    <div>
      <PageHeader title="Lesson Planner" description="Plan lessons from unit metadata, save drafts, print and export as PDF." breadcrumbs={[{ label: "Lesson Planner" }]}
        actions={<>
          <div className="flex rounded-lg border border-neutral-300 p-0.5 dark:border-neutral-600"><button onClick={() => setView("editor")} className={`rounded px-3 py-1 text-sm ${view === "editor" ? "bg-brand-600 text-white" : ""}`}>Editor</button><button onClick={() => setView("week")} className={`rounded px-3 py-1 text-sm ${view === "week" ? "bg-brand-600 text-white" : ""}`}>Weekly</button></div>
          <Button variant="outline" onClick={() => setCurrent(blankLesson())}><Plus className="h-4 w-4" /> New</Button>
        </>}
      />

      {view === "week" ? (
        <Card>
          <CardHeader title="Weekly / all lessons" subtitle={`${state.lessonPlans.length} plan(s)`} />
          <div className="p-5">
            {byDate.length === 0 ? <EmptyState title="No lessons yet" hint="Create a lesson in the editor." icon={<CalendarDays className="h-8 w-8" />} /> : (
              <div className="space-y-2">
                {byDate.map((lp) => (
                  <div key={lp.id} className="flex items-center justify-between rounded-lg border border-neutral-100 px-4 py-3 dark:border-neutral-700">
                    <div><p className="font-medium">{lp.title}</p><p className="text-xs text-neutral-400">{formatDate(lp.date)} · {getUnit(lp.unitId)?.title} · {lp.duration}</p></div>
                    <div className="flex items-center gap-1"><Badge color={lp.completed ? "green" : "amber"}>{lp.completed ? "Done" : "Planned"}</Badge><Button size="sm" variant="ghost" onClick={() => load(lp)}>Open</Button><button onClick={() => duplicate(lp)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700" aria-label="Duplicate"><Copy className="h-4 w-4" /></button><button onClick={() => setDeleteId(lp.id)} className="rounded p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" aria-label="Delete"><Trash2 className="h-4 w-4" /></button></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader title="Lesson details" action={<Button size="sm" variant="secondary" onClick={applySuggestion}><Wand2 className="h-4 w-4" /> Suggest</Button>} />
            <div className="space-y-3 p-5">
              <div><Label>Title</Label><Input value={current.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Unit 2 – Present Perfect" /></div>
              <div className="grid grid-cols-2 gap-3"><div><Label>Class</Label><Select value={current.classId} onChange={(e) => set({ classId: e.target.value })}><option value="">—</option>{state.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div><div><Label>Date</Label><Input type="date" value={current.date} onChange={(e) => set({ date: e.target.value })} /></div></div>
              <div className="grid grid-cols-2 gap-3"><div><Label>Unit</Label><Select value={current.unitId} onChange={(e) => set({ unitId: e.target.value })}>{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select></div><div><Label>Lesson</Label><Input value={current.lesson} onChange={(e) => set({ lesson: e.target.value })} /></div></div>
              <div><Label>Duration</Label><Input value={current.duration} onChange={(e) => set({ duration: e.target.value })} /></div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={current.completed} onChange={(e) => set({ completed: e.target.checked })} className="h-4 w-4 accent-brand-600" /> Mark as completed</label>
              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={save}>Save lesson</Button>
                <Button variant="outline" onClick={printPlan}><Printer className="h-4 w-4" /> Print / Export PDF</Button>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader title="Lesson plan" subtitle="Fill in each stage — the Suggest button pre-fills a draft from the unit." />
            <div className="grid gap-3 p-5 sm:grid-cols-2">
              {fieldRows.map(([key, label]) => (
                <div key={key} className={["objectives", "reflection"].includes(key) ? "sm:col-span-2" : ""}>
                  <Label>{label}</Label>
                  <Textarea value={current[key] as string} onChange={(e) => set({ [key]: e.target.value } as any)} className="min-h-[64px]" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <ConfirmDialog open={deleteId !== null} title="Delete lesson plan?" message="This lesson plan will be removed." confirmLabel="Delete" onConfirm={() => { setState((s) => ({ ...s, lessonPlans: s.lessonPlans.filter((x) => x.id !== deleteId) })); toast("Deleted"); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}

export default function LessonsPage() {
  return <Suspense fallback={null}><LessonPlanner /></Suspense>;
}
