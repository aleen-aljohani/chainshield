"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Input, Select, Textarea, Label, Badge, Modal, ConfirmDialog, EmptyState } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { useVocab } from "@/hooks/useVocab";
import { curriculum } from "@/data/curriculum";
import type { VocabItem, Difficulty, Mastery } from "@/data/vocabulary";
import { speak, speechAvailable } from "@/lib/speech";
import { shuffle } from "@/lib/selection";
import { uid } from "@/lib/cn";
import { printHtml, docHeader } from "@/lib/print";
import { Volume2, Plus, Pencil, Trash2, Printer, GraduationCap, Search } from "lucide-react";

type Mode = "browse" | "flashcards" | "mcq" | "spelling" | "scramble";

export default function VocabularyPage() {
  const { state, setState, logActivity } = useStore();
  const { toast } = useToast();
  const vocab = useVocab();

  const [mode, setMode] = useState<Mode>("browse");
  const [q, setQ] = useState("");
  const [unit, setUnit] = useState("all");
  const [editing, setEditing] = useState<VocabItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => vocab.filter((v) => {
    if (unit !== "all" && v.unitId !== unit) return false;
    if (q && !v.word.toLowerCase().includes(q.toLowerCase()) && !v.definition.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [vocab, q, unit]);

  const setMastery = (id: string, m: Mastery) => setState((s) => ({ ...s, vocabMastery: { ...s.vocabMastery, [id]: m } }));

  const saveCustom = (item: VocabItem) => {
    const exists = state.customVocab.some((v) => v.id === item.id);
    setState((s) => ({ ...s, customVocab: exists ? s.customVocab.map((v) => v.id === item.id ? item : v) : [{ ...item, custom: true }, ...s.customVocab] }));
    logActivity(exists ? "Edited vocabulary" : "Added vocabulary");
    toast(exists ? "Word updated" : "Word added");
    setEditing(null);
  };

  const removeCustom = (id: string) => {
    setState((s) => ({ ...s, customVocab: s.customVocab.filter((v) => v.id !== id) }));
    toast("Word deleted");
    setDeleteId(null);
  };

  const printSheet = () => {
    const rows = filtered.map((v) => `<tr><td>${v.word}</td><td>${v.partOfSpeech}</td><td>${v.definition}</td><td>${v.arabic}</td><td>${v.page}</td></tr>`).join("");
    printHtml("Vocabulary Sheet", docHeader({ title: "Vocabulary Sheet", header: state.settings.printHeader, teacher: state.profile.name, unit: unit === "all" ? "All units" : curriculum.find((u) => u.id === unit)?.title }) + `<table><thead><tr><th>Word</th><th>Part of speech</th><th>Definition</th><th>Arabic</th><th>Page</th></tr></thead><tbody>${rows}</tbody></table>`);
  };

  return (
    <div>
      <PageHeader
        title="Vocabulary"
        description="Browse, practise, and manage vocabulary. Definitions and examples are original; Arabic glosses need teacher review."
        breadcrumbs={[{ label: "Vocabulary" }]}
        actions={<><Button variant="outline" onClick={printSheet}><Printer className="h-4 w-4" /> Print sheet</Button><Button onClick={() => setEditing({ id: uid("v"), word: "", partOfSpeech: "noun", definition: "", arabic: "", example: "", unitId: "unit-1", lesson: "", page: "", difficulty: "medium", tags: [], mastery: "new", custom: true })}><Plus className="h-4 w-4" /> Add word</Button></>}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {(["browse", "flashcards", "mcq", "spelling", "scramble"] as Mode[]).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`rounded-lg px-3 py-1.5 text-sm capitalize ${mode === m ? "bg-brand-600 text-white" : "border border-neutral-300 dark:border-neutral-600"}`}>{m === "mcq" ? "Multiple choice" : m}</button>
        ))}
      </div>

      <Card className="mb-4 p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="relative"><Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><Input placeholder="Search words…" value={q} onChange={(e) => setQ(e.target.value)} className="ps-9" /></div>
          <Select value={unit} onChange={(e) => setUnit(e.target.value)}><option value="all">All units</option>{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No vocabulary found" hint="Try a different unit or add a custom word." />
      ) : mode === "browse" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((v) => (
            <Card key={v.id} className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{v.word}</h3>
                    <button onClick={() => { if (!speak(v.word)) toast("Speech not available on this device", "info"); }} className="text-brand-600 hover:text-brand-700" aria-label={`Pronounce ${v.word}`}><Volume2 className="h-4 w-4" /></button>
                  </div>
                  <p className="text-xs italic text-neutral-400">{v.partOfSpeech} · {v.page}</p>
                </div>
                <div className="flex gap-1">
                  {v.custom && <>
                    <button onClick={() => setEditing(v)} className="rounded p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => setDeleteId(v.id)} className="rounded p-1 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
                  </>}
                </div>
              </div>
              <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-200">{v.definition}</p>
              {v.arabic && <p className="mt-1 text-sm text-neutral-500" dir="rtl">{v.arabic}</p>}
              {v.example && <p className="mt-1 text-sm italic text-neutral-500">“{v.example}”</p>}
              <div className="mt-3 flex items-center gap-1.5">
                <Badge color={v.difficulty === "hard" ? "red" : v.difficulty === "medium" ? "amber" : "neutral"}>{v.difficulty}</Badge>
                {v.needsReview && <Badge color="amber">Review AR</Badge>}
                <div className="ms-auto flex gap-1">
                  {(["new", "learning", "mastered"] as Mastery[]).map((m) => (
                    <button key={m} onClick={() => setMastery(v.id, m)} className={`rounded px-1.5 py-0.5 text-[10px] ${v.mastery === m ? "bg-brand-600 text-white" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-700"}`}>{m}</button>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : mode === "flashcards" ? (
        <VocabFlashcards items={filtered} />
      ) : mode === "mcq" ? (
        <VocabMcq items={filtered} />
      ) : mode === "spelling" ? (
        <VocabSpelling items={filtered} />
      ) : (
        <VocabScramble items={filtered} />
      )}

      {editing && <VocabEditor item={editing} onSave={saveCustom} onClose={() => setEditing(null)} />}
      <ConfirmDialog open={deleteId !== null} title="Delete word?" message="This custom word will be removed." confirmLabel="Delete" onConfirm={() => deleteId && removeCustom(deleteId)} onCancel={() => setDeleteId(null)} />
    </div>
  );
}

function VocabFlashcards({ items }: { items: VocabItem[] }) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cards = useMemo(() => shuffle(items), [items]);
  const card = cards[i % cards.length];
  if (!card) return null;
  return (
    <Card className="mx-auto max-w-lg p-6 text-center">
      <div className="flip-card mx-auto h-52 w-full cursor-pointer" onClick={() => setFlipped((f) => !f)}>
        <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
          <div className="flip-face rounded-xl border-2 border-brand-200 bg-brand-50 text-3xl font-bold dark:border-brand-800 dark:bg-brand-900/40">{card.word}</div>
          <div className="flip-back flip-face rounded-xl border-2 border-brand-500 bg-white p-4 dark:bg-neutral-800">
            <div><p className="text-lg font-medium">{card.definition}</p><p className="mt-1 text-neutral-500" dir="rtl">{card.arabic}</p></div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-neutral-400">Card {(i % cards.length) + 1} of {cards.length} — click to flip</p>
      <div className="mt-3 flex justify-center gap-2">
        <Button variant="outline" onClick={() => { setFlipped(false); setI((x) => (x - 1 + cards.length) % cards.length); }}>Previous</Button>
        <Button variant="ghost" onClick={() => speak(card.word)}><Volume2 className="h-4 w-4" /></Button>
        <Button onClick={() => { setFlipped(false); setI((x) => (x + 1) % cards.length); }}>Next</Button>
      </div>
    </Card>
  );
}

function VocabMcq({ items }: { items: VocabItem[] }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const questions = useMemo(() => shuffle(items).filter((_, idx) => idx < 20), [items]);
  const current = questions[i];
  const options = useMemo(() => {
    if (!current) return [];
    const others = shuffle(items.filter((v) => v.id !== current.id)).slice(0, 3).map((v) => v.definition);
    return shuffle([current.definition, ...others]);
  }, [current, items]);
  if (!current) return <EmptyState title="Need more words" hint="Add more vocabulary to practise multiple choice." />;
  return (
    <Card className="mx-auto max-w-lg p-6">
      <p className="mb-1 text-sm text-neutral-400">Question {i + 1} of {questions.length} · Score {score.correct}/{score.total}</p>
      <h3 className="mb-4 text-2xl font-bold">{current.word}</h3>
      <div className="space-y-2">
        {options.map((opt) => {
          const isCorrect = opt === current.definition;
          const show = picked !== null;
          return (
            <button key={opt} disabled={picked !== null} onClick={() => { setPicked(opt); setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 })); }}
              className={`w-full rounded-lg border p-3 text-start text-sm ${show && isCorrect ? "border-brand-500 bg-brand-50 dark:bg-brand-900/40" : show && picked === opt ? "border-red-400 bg-red-50 dark:bg-red-900/30" : "border-neutral-300 dark:border-neutral-600"}`}>{opt}</button>
          );
        })}
      </div>
      {picked && <Button className="mt-4 w-full" onClick={() => { setPicked(null); setI((x) => (x + 1) % questions.length); }}>Next</Button>}
    </Card>
  );
}

function VocabSpelling({ items }: { items: VocabItem[] }) {
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"" | "right" | "wrong">("");
  const words = useMemo(() => shuffle(items), [items]);
  const word = words[i % words.length];
  if (!word) return null;
  return (
    <Card className="mx-auto max-w-lg p-6 text-center">
      <p className="mb-3 text-sm text-neutral-500">Listen and type the word:</p>
      <Button variant="secondary" onClick={() => speak(word.word)}><Volume2 className="h-4 w-4" /> Play word</Button>
      <p className="mt-2 text-sm text-neutral-400">Hint: {word.definition}</p>
      <Input className="mt-4 text-center" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type here…" />
      {result && <p className={`mt-2 font-medium ${result === "right" ? "text-brand-600" : "text-red-500"}`}>{result === "right" ? "Correct! ✓" : `Not quite — it's "${word.word}"`}</p>}
      <div className="mt-4 flex justify-center gap-2">
        <Button onClick={() => setResult(answer.trim().toLowerCase() === word.word.toLowerCase() ? "right" : "wrong")}>Check</Button>
        <Button variant="outline" onClick={() => { setAnswer(""); setResult(""); setI((x) => (x + 1) % words.length); }}>Next word</Button>
      </div>
    </Card>
  );
}

function VocabScramble({ items }: { items: VocabItem[] }) {
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"" | "right" | "wrong">("");
  const words = useMemo(() => shuffle(items), [items]);
  const word = words[i % words.length];
  const scrambled = useMemo(() => (word ? shuffle(word.word.split("")).join("") : ""), [word]);
  if (!word) return null;
  return (
    <Card className="mx-auto max-w-lg p-6 text-center">
      <p className="mb-2 text-sm text-neutral-500">Unscramble the word:</p>
      <p className="text-3xl font-bold tracking-widest">{scrambled.toUpperCase()}</p>
      <p className="mt-2 text-sm text-neutral-400">Meaning: {word.definition}</p>
      <Input className="mt-4 text-center" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Your answer…" />
      {result && <p className={`mt-2 font-medium ${result === "right" ? "text-brand-600" : "text-red-500"}`}>{result === "right" ? "Correct! ✓" : `It's "${word.word}"`}</p>}
      <div className="mt-4 flex justify-center gap-2">
        <Button onClick={() => setResult(answer.trim().toLowerCase() === word.word.toLowerCase() ? "right" : "wrong")}>Check</Button>
        <Button variant="outline" onClick={() => { setAnswer(""); setResult(""); setI((x) => (x + 1) % words.length); }}>Next</Button>
      </div>
    </Card>
  );
}

function VocabEditor({ item, onSave, onClose }: { item: VocabItem; onSave: (v: VocabItem) => void; onClose: () => void }) {
  const [f, setF] = useState(item);
  const set = (p: Partial<VocabItem>) => setF((x) => ({ ...x, ...p }));
  return (
    <Modal open onClose={onClose} title={item.word ? "Edit word" : "Add word"} size="md">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3"><div><Label>Word</Label><Input value={f.word} onChange={(e) => set({ word: e.target.value })} /></div><div><Label>Part of speech</Label><Input value={f.partOfSpeech} onChange={(e) => set({ partOfSpeech: e.target.value })} /></div></div>
        <div><Label>Definition</Label><Textarea value={f.definition} onChange={(e) => set({ definition: e.target.value })} /></div>
        <div><Label>Arabic meaning</Label><Input value={f.arabic} onChange={(e) => set({ arabic: e.target.value })} dir="rtl" /></div>
        <div><Label>Example sentence</Label><Textarea value={f.example} onChange={(e) => set({ example: e.target.value })} /></div>
        <div className="grid grid-cols-3 gap-3">
          <div><Label>Unit</Label><Select value={f.unitId} onChange={(e) => set({ unitId: e.target.value })}>{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select></div>
          <div><Label>Page</Label><Input value={f.page} onChange={(e) => set({ page: e.target.value })} /></div>
          <div><Label>Difficulty</Label><Select value={f.difficulty} onChange={(e) => set({ difficulty: e.target.value as Difficulty })}><option value="easy">easy</option><option value="medium">medium</option><option value="hard">hard</option></Select></div>
        </div>
        <div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(f)} disabled={!f.word.trim()}>Save</Button></div>
      </div>
    </Modal>
  );
}
