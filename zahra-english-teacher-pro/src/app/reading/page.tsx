"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Input, Textarea, Select, Label, Badge, Modal, EmptyState, ConfirmDialog } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { seedReading } from "@/data/skills";
import { curriculum } from "@/data/curriculum";
import type { ReadingText } from "@/lib/types";
import { uid } from "@/lib/cn";
import { printHtml, docHeader, studentFields, escapeHtml } from "@/lib/print";
import { BookMarked, Plus, Printer, FileCheck2, Trash2, AlertTriangle } from "lucide-react";

export default function ReadingPage() {
  const { state, setState, logActivity } = useStore();
  const { toast } = useToast();
  const [editing, setEditing] = useState<ReadingText | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const printText = (text: ReadingText, withAnswers: boolean) => {
    const words = text.body.trim().split(/\s+/).length;
    const time = Math.max(1, Math.round(words / 120));
    const qs = text.questions.map((q, i) => `<li><div>${escapeHtml(q.q)} <span class="badge">${escapeHtml(q.type)}</span></div>${withAnswers ? `<div class="answer">Answer: ${escapeHtml(q.a)}</div>` : `<div style="border-bottom:1px solid #999;height:24px;margin-top:6px;"></div>`}</li>`).join("");
    printHtml(text.title, docHeader({ title: `${text.title}${withAnswers ? " — Teacher Version" : ""}`, header: state.settings.printHeader, teacher: state.profile.name, unit: curriculum.find((u) => u.id === text.unitId)?.title }) + (withAnswers ? "" : studentFields()) + `<p class="note">Estimated reading time: ≈ ${time} min (${words} words)</p><div style="white-space:pre-wrap;border:1px solid #ddd;padding:12px;border-radius:6px;">${escapeHtml(text.body)}</div><h2>Comprehension questions</h2><ol class="questions">${qs}</ol>`);
  };

  const save = (t: ReadingText) => {
    const exists = state.readingTexts.some((x) => x.id === t.id);
    setState((s) => ({ ...s, readingTexts: exists ? s.readingTexts.map((x) => x.id === t.id ? t : x) : [t, ...s.readingTexts] }));
    logActivity(exists ? "Edited a reading text" : "Added a reading text");
    toast("Saved");
    setEditing(null);
  };

  return (
    <div>
      <PageHeader title="Reading" description="Textbook reading items are stored as title, page, focus and a short summary only. Add your own texts with comprehension questions." breadcrumbs={[{ label: "Reading" }]} actions={<Button onClick={() => setEditing({ id: uid("r"), title: "", unitId: "unit-1", body: "", questions: [{ q: "", a: "", type: "Main idea" }], createdAt: new Date().toISOString() })}><Plus className="h-4 w-4" /> Add reading text</Button>} />

      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
        <AlertTriangle className="me-1 inline h-4 w-4" /> To respect copyright, full textbook passages are not reproduced. Only summaries and references are stored below.
      </div>

      <h2 className="mb-2 text-sm font-semibold text-neutral-500">Textbook reading items (reference only)</h2>
      <div className="mb-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {seedReading.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-center gap-2"><BookMarked className="h-5 w-5 text-brand-600" /><h3 className="font-semibold">{r.title}</h3></div>
            <p className="mt-1 text-xs text-neutral-400">{curriculum.find((u) => u.id === r.unitId)?.title} · {r.page}</p>
            <Badge color="blue" className="mt-2">{r.skillFocus}</Badge>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{r.summary}</p>
            <p className="mt-2 text-xs text-neutral-400">Key vocab: {r.keyVocab.join(", ")}</p>
          </Card>
        ))}
      </div>

      <h2 className="mb-2 text-sm font-semibold text-neutral-500">Your reading texts</h2>
      {state.readingTexts.length === 0 ? (
        <EmptyState title="No custom texts yet" hint="Add your own short reading text with questions to create student and teacher versions." />
      ) : (
        <div className="space-y-3">
          {state.readingTexts.map((t) => (
            <Card key={t.id} className="flex items-center justify-between p-4">
              <div><p className="font-medium">{t.title || "Untitled"}</p><p className="text-xs text-neutral-400">{curriculum.find((u) => u.id === t.unitId)?.title} · {t.questions.length} question(s)</p></div>
              <div className="flex flex-wrap gap-1">
                <Button size="sm" variant="outline" onClick={() => printText(t, false)}><Printer className="h-4 w-4" /> Student</Button>
                <Button size="sm" variant="outline" onClick={() => printText(t, true)}><FileCheck2 className="h-4 w-4" /> Teacher</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(t)}>Edit</Button>
                <button onClick={() => setDeleteId(t.id)} className="rounded p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && <ReadingEditor text={editing} onSave={save} onClose={() => setEditing(null)} />}
      <ConfirmDialog open={deleteId !== null} title="Delete reading text?" message="This text and its questions will be removed." confirmLabel="Delete" onConfirm={() => { setState((s) => ({ ...s, readingTexts: s.readingTexts.filter((x) => x.id !== deleteId) })); toast("Deleted"); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}

function ReadingEditor({ text, onSave, onClose }: { text: ReadingText; onSave: (t: ReadingText) => void; onClose: () => void }) {
  const [f, setF] = useState(text);
  const set = (p: Partial<ReadingText>) => setF((x) => ({ ...x, ...p }));
  const setQ = (i: number, patch: Partial<ReadingText["questions"][number]>) => set({ questions: f.questions.map((q, idx) => idx === i ? { ...q, ...patch } : q) });
  return (
    <Modal open onClose={onClose} title={text.title ? "Edit reading text" : "Add reading text"} size="lg">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3"><div><Label>Title</Label><Input value={f.title} onChange={(e) => set({ title: e.target.value })} /></div><div><Label>Unit</Label><Select value={f.unitId} onChange={(e) => set({ unitId: e.target.value })}>{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select></div></div>
        <div><Label>Your reading text (original)</Label><Textarea className="min-h-[140px]" value={f.body} onChange={(e) => set({ body: e.target.value })} placeholder="Write or paste your own short reading text here…" /></div>
        <div>
          <Label>Comprehension questions</Label>
          <div className="space-y-2">
            {f.questions.map((q, i) => (
              <div key={i} className="grid grid-cols-12 gap-2">
                <Input className="col-span-5" value={q.q} onChange={(e) => setQ(i, { q: e.target.value })} placeholder="Question" />
                <Input className="col-span-4" value={q.a} onChange={(e) => setQ(i, { a: e.target.value })} placeholder="Answer" />
                <Select className="col-span-2" value={q.type} onChange={(e) => setQ(i, { type: e.target.value })}>{["Main idea","Detail","True/False","Vocabulary","Inference","Short answer","Sequencing"].map((t) => <option key={t}>{t}</option>)}</Select>
                <button onClick={() => set({ questions: f.questions.filter((_, idx) => idx !== i) })} className="col-span-1 text-red-400" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
          <Button size="sm" variant="ghost" className="mt-2" onClick={() => set({ questions: [...f.questions, { q: "", a: "", type: "Detail" }] })}><Plus className="h-4 w-4" /> Add question</Button>
        </div>
        <div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(f)} disabled={!f.title.trim()}>Save</Button></div>
      </div>
    </Modal>
  );
}
