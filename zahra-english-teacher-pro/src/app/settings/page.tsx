"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Input, Textarea, Select, Label, ConfirmDialog, Badge } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import type { TeacherProfile, Settings } from "@/lib/types";
import { User, School, Palette, Printer, GraduationCap, RotateCcw, Trash2, Plus } from "lucide-react";

export default function SettingsPage() {
  const { state, setState, update, resetAll, resetDemo } = useStore();
  const { toast } = useToast();
  const [confirm, setConfirm] = useState<null | "all" | "demo">(null);

  const setProfile = (p: Partial<TeacherProfile>) => update({ profile: { ...state.profile, ...p } });
  const setSettings = (s: Partial<Settings>) => update({ settings: { ...state.settings, ...s } });

  const setBoundary = (i: number, patch: Partial<{ grade: string; min: number }>) =>
    setSettings({ gradeBoundaries: state.settings.gradeBoundaries.map((b, idx) => idx === i ? { ...b, ...patch } : b) });

  return (
    <div>
      <PageHeader title="Settings" description="Personalise the app, printing, grading and data." breadcrumbs={[{ label: "Settings" }]} />

      <div className="space-y-4">
        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><User className="h-4 w-4" /> Teacher profile</span>} subtitle="Shown on the dashboard and in printed headers" />
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <div><Label>Teacher name</Label><Input value={state.profile.name} onChange={(e) => setProfile({ name: e.target.value })} /></div>
            <div><Label>School name</Label><Input value={state.profile.school} onChange={(e) => setProfile({ school: e.target.value })} /></div>
            <div><Label>Academic year</Label><Input value={state.profile.academicYear} onChange={(e) => setProfile({ academicYear: e.target.value })} /></div>
            <div><Label>Semester</Label><Input value={state.profile.semester} onChange={(e) => setProfile({ semester: e.target.value })} /></div>
            <div><Label>Class names</Label><Input value={state.profile.classNames} onChange={(e) => setProfile({ classNames: e.target.value })} /></div>
            <div><Label>Weekly schedule</Label><Input value={state.profile.weeklySchedule} onChange={(e) => setProfile({ weeklySchedule: e.target.value })} placeholder="e.g. Sun/Tue 8–9am 12-A" /></div>
            <div className="sm:col-span-2"><Label>Teacher notes</Label><Textarea value={state.profile.notes} onChange={(e) => setProfile({ notes: e.target.value })} /></div>
          </div>
        </Card>

        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Palette className="h-4 w-4" /> Appearance & language</span>} />
          <div className="grid gap-3 p-5 sm:grid-cols-2">
            <div><Label>Interface language</Label><Select value={state.settings.language} onChange={(e) => setSettings({ language: e.target.value as any })}><option value="en">English</option><option value="ar">العربية (Arabic, RTL)</option></Select></div>
            <div><Label>Theme</Label><Select value={state.settings.theme} onChange={(e) => setSettings({ theme: e.target.value as any })}><option value="light">Light</option><option value="dark">Dark</option></Select></div>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={state.settings.soundEffects} onChange={(e) => setSettings({ soundEffects: e.target.checked })} className="h-4 w-4 accent-brand-600" /> Sound effects</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={state.settings.animations} onChange={(e) => setSettings({ animations: e.target.checked })} className="h-4 w-4 accent-brand-600" /> Animations</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={state.settings.reducedMotion} onChange={(e) => setSettings({ reducedMotion: e.target.checked })} className="h-4 w-4 accent-brand-600" /> Reduced motion</label>
          </div>
        </Card>

        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><Printer className="h-4 w-4" /> Printing defaults</span>} />
          <div className="grid gap-3 p-5">
            <div><Label>Default print header</Label><Input value={state.settings.printHeader} onChange={(e) => setSettings({ printHeader: e.target.value })} /></div>
            <div><Label>Default quiz instructions</Label><Textarea value={state.settings.defaultQuizInstructions} onChange={(e) => setSettings({ defaultQuizInstructions: e.target.value })} /></div>
          </div>
        </Card>

        <Card>
          <CardHeader title={<span className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Grade boundaries</span>} subtitle="Editable — no official policy is assumed" />
          <div className="space-y-2 p-5">
            {state.settings.gradeBoundaries.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input value={b.grade} onChange={(e) => setBoundary(i, { grade: e.target.value })} className="w-20" aria-label="Grade letter" />
                <span className="text-sm text-neutral-500">≥</span>
                <Input type="number" value={b.min} onChange={(e) => setBoundary(i, { min: Number(e.target.value) })} className="w-24" aria-label="Minimum percentage" />
                <span className="text-sm text-neutral-500">%</span>
                <button onClick={() => setSettings({ gradeBoundaries: state.settings.gradeBoundaries.filter((_, idx) => idx !== i) })} className="text-red-400" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setSettings({ gradeBoundaries: [...state.settings.gradeBoundaries, { grade: "New", min: 50 }] })}><Plus className="h-4 w-4" /> Add boundary</Button>
          </div>
        </Card>

        <Card className="border-red-200 dark:border-red-900">
          <CardHeader title="Data management" subtitle="These actions cannot be undone" />
          <div className="flex flex-wrap gap-3 p-5">
            <Button variant="outline" onClick={() => setConfirm("demo")}><RotateCcw className="h-4 w-4" /> Reset demo data</Button>
            <Button variant="danger" onClick={() => setConfirm("all")}><Trash2 className="h-4 w-4" /> Reset entire application</Button>
          </div>
        </Card>
      </div>

      <ConfirmDialog open={confirm === "demo"} title="Reset demo data?" message="This restores the original sample classes, students and questions, replacing your current data." confirmLabel="Reset demo" onConfirm={() => { resetDemo(); toast("Demo data restored"); setConfirm(null); }} onCancel={() => setConfirm(null)} />
      <ConfirmDialog open={confirm === "all"} title="Reset entire application?" message="This permanently deletes ALL your data (students, grades, questions, quizzes, everything) and starts empty. Consider exporting a backup first." confirmLabel="Delete everything" onConfirm={() => { resetAll(); toast("Application reset"); setConfirm(null); }} onCancel={() => setConfirm(null)} />
    </div>
  );
}
