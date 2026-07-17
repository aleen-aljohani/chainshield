"use client";

import { useState, useMemo, useRef } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, Button, Select, Badge, EmptyState } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { pickNoRepeat } from "@/lib/selection";
import { Shuffle, RotateCcw, UserX, Volume2, VolumeX, Maximize2 } from "lucide-react";

export default function PickerPage() {
  const { state } = useStore();
  const [classId, setClassId] = useState(state.classes[0]?.id ?? "");
  const [mode, setMode] = useState<"card" | "wheel">("card");
  const [noRepeat, setNoRepeat] = useState(true);
  const [sound, setSound] = useState(state.settings.soundEffects);
  const [used, setUsed] = useState<string[]>([]);
  const [absent, setAbsent] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const students = useMemo(() => state.students.filter((s) => s.classId === classId && s.status === "active"), [state.students, classId]);
  const eligible = useMemo(() => students.filter((s) => !absent.includes(s.id)), [students, absent]);

  const beep = () => {
    if (!sound) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 660; g.gain.value = 0.05;
      o.start(); o.stop(ctx.currentTime + 0.15);
    } catch { /* ignore */ }
  };

  const pick = () => {
    if (eligible.length === 0) return;
    setSpinning(true);
    const eligibleIds = eligible.map((s) => s.id);
    const usedEligible = used.filter((id) => eligibleIds.includes(id));
    const { picked: pickedId, nextUsed, cycled } = noRepeat
      ? pickNoRepeat(eligibleIds, usedEligible)
      : { picked: eligibleIds[Math.floor(Math.random() * eligibleIds.length)], nextUsed: used, cycled: false };

    if (mode === "wheel") {
      const index = eligibleIds.indexOf(pickedId!);
      const slice = 360 / eligibleIds.length;
      const target = 360 * 5 + (360 - (index * slice + slice / 2));
      setRotation((r) => r + target);
    }

    setTimeout(() => {
      setPicked(pickedId);
      setUsed(noRepeat ? (cycled ? [pickedId!] : nextUsed) : used);
      setHistory((h) => [pickedId!, ...h].slice(0, 12));
      setSpinning(false);
      beep();
    }, mode === "wheel" ? 3000 : 700);
  };

  const reset = () => { setUsed([]); setPicked(null); setHistory([]); };
  const toggleAbsent = (id: string) => setAbsent((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
  const pickedStudent = students.find((s) => s.id === picked);

  const goFullscreen = () => { if (wheelRef.current?.requestFullscreen) wheelRef.current.requestFullscreen(); };

  return (
    <div>
      <PageHeader title="Random Student Picker" description="Fairly pick students for questions. Absent students are excluded automatically." breadcrumbs={[{ label: "Random Picker" }]} />

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={classId} onChange={(e) => { setClassId(e.target.value); reset(); setAbsent([]); }} className="w-40">{state.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
          <div className="flex rounded-lg border border-neutral-300 p-0.5 dark:border-neutral-600">
            <button onClick={() => setMode("card")} className={`rounded px-3 py-1 text-sm ${mode === "card" ? "bg-brand-600 text-white" : ""}`}>Card</button>
            <button onClick={() => setMode("wheel")} className={`rounded px-3 py-1 text-sm ${mode === "wheel" ? "bg-brand-600 text-white" : ""}`}>Wheel</button>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={noRepeat} onChange={(e) => setNoRepeat(e.target.checked)} className="h-4 w-4 accent-brand-600" /> No-repeat</label>
          <Button size="sm" variant="ghost" onClick={() => setSound((s) => !s)}>{sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}</Button>
          <Button size="sm" variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset pool</Button>
          <Badge color="neutral">{eligible.length} eligible · {used.length} picked</Badge>
        </div>
      </Card>

      {eligible.length === 0 ? (
        <EmptyState title="No eligible students" hint="Select a class with active students (and un-mark absentees)." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card ref={wheelRef} className="flex min-h-[380px] flex-col items-center justify-center bg-white p-8 dark:bg-neutral-800">
              {mode === "card" ? (
                <div className={`text-center transition-transform ${spinning ? "animate-pulse" : ""}`}>
                  <div className="mx-auto flex h-48 w-72 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white shadow-lg">
                    <span className="text-3xl font-bold">{spinning ? "…" : pickedStudent?.name ?? "Ready?"}</span>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 text-2xl">▼</div>
                  <div className="h-64 w-64 rounded-full border-4 border-brand-600 transition-transform duration-[3000ms] ease-out" style={{ transform: `rotate(${rotation}deg)`, background: conicGradient(eligible.length) }} />
                  <div className="absolute inset-0 flex items-center justify-center"><div className="rounded-full bg-white px-3 py-1 text-sm font-bold text-brand-700 shadow dark:bg-neutral-900">{spinning ? "…" : pickedStudent?.name ?? "Spin!"}</div></div>
                </div>
              )}
              <div className="mt-6 flex gap-2">
                <Button size="lg" onClick={pick} disabled={spinning}><Shuffle className="h-5 w-5" /> {spinning ? "Picking…" : "Pick a student"}</Button>
                {pickedStudent && <Button size="lg" variant="outline" onClick={() => toggleAbsent(pickedStudent.id)}><UserX className="h-5 w-5" /> Mark absent</Button>}
                <Button size="lg" variant="ghost" onClick={goFullscreen} aria-label="Fullscreen"><Maximize2 className="h-5 w-5" /></Button>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="mb-2 text-sm font-semibold">History</h3>
              {history.length === 0 ? <p className="text-sm text-neutral-400">No picks yet.</p> : (
                <ol className="space-y-1 text-sm">{history.map((id, i) => <li key={i} className="text-neutral-600 dark:text-neutral-300">{i + 1}. {students.find((s) => s.id === id)?.name}</li>)}</ol>
              )}
            </Card>
            <Card className="p-4">
              <h3 className="mb-2 text-sm font-semibold">Absent (excluded)</h3>
              <div className="flex flex-wrap gap-1.5">
                {students.map((s) => (
                  <button key={s.id} onClick={() => toggleAbsent(s.id)} className={`rounded-full border px-2.5 py-1 text-xs ${absent.includes(s.id) ? "border-red-300 bg-red-50 text-red-600 line-through dark:bg-red-900/30" : "border-neutral-300 text-neutral-500 dark:border-neutral-600"}`}>{s.name}</button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function conicGradient(n: number): string {
  const colors = ["#27744b", "#5aae7e", "#8ecda8", "#37905f", "#205c3d", "#bce3cb"];
  const slice = 100 / n;
  const stops = Array.from({ length: n }, (_, i) => `${colors[i % colors.length]} ${i * slice}% ${(i + 1) * slice}%`);
  return `conic-gradient(${stops.join(", ")})`;
}
