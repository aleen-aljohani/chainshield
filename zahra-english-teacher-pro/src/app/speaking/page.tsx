"use client";

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Badge, Select, Input } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { seedSpeaking } from "@/data/skills";
import { curriculum } from "@/data/curriculum";
import { rubricTotal } from "@/lib/calc";
import { shuffle } from "@/lib/selection";
import { printHtml, docHeader } from "@/lib/print";
import { MessagesSquare, Shuffle, Timer, Printer, Play, Pause, RotateCcw } from "lucide-react";

export default function SpeakingPage() {
  const { state } = useStore();
  const { toast } = useToast();
  const [unit, setUnit] = useState("all");
  const [current, setCurrent] = useState(seedSpeaking[0]);

  const cards = useMemo(() => (unit === "all" ? seedSpeaking : seedSpeaking.filter((c) => c.unitId === unit)), [unit]);

  const random = () => {
    const pool = cards.length ? cards : seedSpeaking;
    setCurrent(shuffle(pool)[0]);
    toast("New speaking prompt");
  };

  return (
    <div>
      <PageHeader title="Speaking" description="Speaking cards, classroom timers, and an editable speaking rubric." breadcrumbs={[{ label: "Speaking" }]} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Speaking prompt" action={<Select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-40"><option value="all">All units</option>{curriculum.filter((u) => typeof u.number === "number").map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select>} />
            <div className="p-6 text-center">
              <Badge color="green" className="mb-3 capitalize">{current.type.replace("-", " ")}</Badge>
              <p className="mx-auto max-w-xl text-xl font-medium text-neutral-800 dark:text-neutral-100">{current.prompt}</p>
              <p className="mt-2 text-xs text-neutral-400">{curriculum.find((u) => u.id === current.unitId)?.title} · {current.page}</p>
              <Button className="mt-4" onClick={random}><Shuffle className="h-4 w-4" /> Random prompt</Button>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-3">
            <SpeakTimer label="Preparation" seconds={30} />
            <SpeakTimer label="One minute" seconds={60} />
            <SpeakTimer label="Two minutes" seconds={120} />
          </div>

          <Card>
            <CardHeader title="All speaking cards" />
            <div className="grid gap-2 p-5 sm:grid-cols-2">
              {cards.map((c) => (
                <button key={c.id} onClick={() => setCurrent(c)} className="rounded-lg border border-neutral-200 p-3 text-start text-sm hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-700 dark:hover:bg-brand-900/30">
                  <Badge color="blue" className="mb-1 capitalize">{c.type.replace("-", " ")}</Badge>
                  <p>{c.prompt}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1"><SpeakingRubric /></div>
      </div>
    </div>
  );
}

function SpeakTimer({ label, seconds }: { label: string; seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) { setRunning(false); return; }
    const id = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(id);
  }, [running, remaining]);
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  return (
    <Card className="p-4 text-center">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className={`my-2 text-3xl font-bold tabular-nums ${remaining === 0 ? "text-red-500" : "text-brand-600"}`}><Timer className="me-1 inline h-5 w-5" />{mm}:{ss}</p>
      <div className="flex justify-center gap-1">
        <Button size="sm" variant="ghost" onClick={() => setRunning((r) => !r)}>{running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button>
        <Button size="sm" variant="ghost" onClick={() => { setRunning(false); setRemaining(seconds); }}><RotateCcw className="h-4 w-4" /></Button>
      </div>
    </Card>
  );
}

function SpeakingRubric() {
  const { state, setState } = useStore();
  const { toast } = useToast();
  const rubric = state.speakingRubric;
  const [scores, setScores] = useState<Record<string, number>>({});
  const [student, setStudent] = useState("");
  const result = rubricTotal(rubric, scores);

  const setMax = (id: string, max: number) => setState((s) => ({ ...s, speakingRubric: { ...s.speakingRubric, criteria: s.speakingRubric.criteria.map((c) => c.id === id ? { ...c, max } : c) } }));

  const printReport = () => {
    const rows = rubric.criteria.map((c) => `<tr><td>${c.name}</td><td>${scores[c.id] ?? 0} / ${c.max}</td></tr>`).join("");
    printHtml("Speaking Feedback", docHeader({ title: "Speaking Feedback Report", header: state.settings.printHeader, teacher: state.profile.name }) + `<p><strong>Student:</strong> ${student || "________"}</p><table><thead><tr><th>Criterion</th><th>Score</th></tr></thead><tbody>${rows}<tr><th>Total</th><th>${result.earned} / ${result.max} (${result.percentage}%)</th></tr></tbody></table><p class="note">Teacher comments:</p><div style="border:1px solid #ccc;height:80px;border-radius:6px;"></div>`);
  };

  return (
    <Card>
      <CardHeader title="Speaking rubric" subtitle={`Total: ${result.max} points`} />
      <div className="space-y-3 p-5">
        <Input placeholder="Student name (optional)" value={student} onChange={(e) => setStudent(e.target.value)} />
        {rubric.criteria.map((c) => (
          <div key={c.id}>
            <div className="mb-1 flex items-center justify-between text-sm"><span>{c.name}</span><span className="text-neutral-400">/ <input type="number" value={c.max} min={1} onChange={(e) => setMax(c.id, Number(e.target.value))} className="w-12 rounded border border-neutral-300 bg-transparent px-1 text-center dark:border-neutral-600" /></span></div>
            <input type="range" min={0} max={c.max} value={scores[c.id] ?? 0} onChange={(e) => setScores((s) => ({ ...s, [c.id]: Number(e.target.value) }))} className="w-full accent-brand-600" />
            <span className="text-xs text-neutral-500">{scores[c.id] ?? 0} / {c.max}</span>
          </div>
        ))}
        <div className="rounded-lg bg-brand-50 p-3 text-center dark:bg-brand-900/40"><p className="text-2xl font-bold text-brand-700 dark:text-brand-200">{result.earned} / {result.max}</p><p className="text-sm text-neutral-500">{result.percentage}%</p></div>
        <Button variant="outline" className="w-full" onClick={printReport}><Printer className="h-4 w-4" /> Print feedback</Button>
      </div>
    </Card>
  );
}
