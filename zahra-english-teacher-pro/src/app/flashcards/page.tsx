"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Select, Badge, EmptyState } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { useVocab } from "@/hooks/useVocab";
import { curriculum } from "@/data/curriculum";
import { shuffle } from "@/lib/selection";
import { printHtml, docHeader } from "@/lib/print";
import { Shuffle, ChevronLeft, ChevronRight, Check, AlertCircle, Star, Printer, Filter } from "lucide-react";

export default function FlashcardsPage() {
  const { state, setState } = useStore();
  const { toast } = useToast();
  const vocab = useVocab();
  const [unit, setUnit] = useState("all");
  const [order, setOrder] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [difficultOnly, setDifficultOnly] = useState(false);

  const deck = useMemo(() => {
    let cards = unit === "all" ? vocab : vocab.filter((v) => v.unitId === unit);
    if (difficultOnly) cards = cards.filter((v) => state.flashcardProgress[v.id] === "difficult");
    return cards;
  }, [vocab, unit, difficultOnly, state.flashcardProgress]);

  const ordered = useMemo(() => {
    if (order.length === 0) return deck;
    const map = new Map(deck.map((c) => [c.id, c]));
    return order.map((id) => map.get(id)).filter(Boolean) as typeof deck;
  }, [deck, order]);

  const card = ordered[idx % Math.max(1, ordered.length)];

  const counts = useMemo(() => {
    let known = 0, review = 0, difficult = 0;
    deck.forEach((c) => {
      const p = state.flashcardProgress[c.id];
      if (p === "known") known++;
      else if (p === "review") review++;
      else if (p === "difficult") difficult++;
    });
    return { known, review, difficult };
  }, [deck, state.flashcardProgress]);

  const mark = (status: "known" | "review" | "difficult") => {
    if (!card) return;
    setState((s) => ({ ...s, flashcardProgress: { ...s.flashcardProgress, [card.id]: status } }));
    next();
  };
  const next = () => { setFlipped(false); setIdx((i) => (i + 1) % Math.max(1, ordered.length)); };
  const prev = () => { setFlipped(false); setIdx((i) => (i - 1 + ordered.length) % Math.max(1, ordered.length)); };
  const doShuffle = () => { setOrder(shuffle(deck).map((c) => c.id)); setIdx(0); setFlipped(false); toast("Deck shuffled"); };

  const printDeck = () => {
    const cells = deck.map((c) => `<td style="border:1px dashed #999;padding:16px;width:33%;height:90px;vertical-align:middle;text-align:center;font-weight:600;">${c.word}<div style="font-weight:400;font-size:11px;color:#666;margin-top:6px;">${c.arabic}</div></td>`);
    let rows = "";
    for (let i = 0; i < cells.length; i += 3) rows += `<tr>${cells.slice(i, i + 3).join("")}</tr>`;
    printHtml("Flashcards", docHeader({ title: "Flashcard Sheet", header: state.settings.printHeader, teacher: state.profile.name, unit: unit === "all" ? "All units" : curriculum.find((u) => u.id === unit)?.title }) + `<table style="border:none;">${rows}</table>`);
  };

  return (
    <div>
      <PageHeader title="Flashcards" description="Study vocabulary decks by unit. Progress is saved locally." breadcrumbs={[{ label: "Flashcards" }]} actions={<Button variant="outline" onClick={printDeck}><Printer className="h-4 w-4" /> Print deck</Button>} />

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={unit} onChange={(e) => { setUnit(e.target.value); setIdx(0); setOrder([]); }} className="w-52"><option value="all">All units</option>{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select>
          <Button variant="outline" size="sm" onClick={doShuffle}><Shuffle className="h-4 w-4" /> Shuffle</Button>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={difficultOnly} onChange={(e) => { setDifficultOnly(e.target.checked); setIdx(0); }} className="h-4 w-4 accent-brand-600" /> <Filter className="h-3.5 w-3.5" /> Difficult only</label>
          <div className="ms-auto flex gap-1.5 text-xs">
            <Badge color="green">Known {counts.known}</Badge>
            <Badge color="amber">Review {counts.review}</Badge>
            <Badge color="red">Difficult {counts.difficult}</Badge>
          </div>
        </div>
      </Card>

      {!card ? (
        <EmptyState title="No cards in this deck" hint={difficultOnly ? "No cards marked difficult yet." : "Choose a different unit."} />
      ) : (
        <Card className="mx-auto max-w-xl p-6">
          <p className="mb-2 text-center text-sm text-neutral-400">Card {(idx % ordered.length) + 1} of {ordered.length}</p>
          <div className="flip-card mx-auto h-60 w-full cursor-pointer" onClick={() => setFlipped((f) => !f)}>
            <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
              <div className="flip-face rounded-xl border-2 border-brand-200 bg-brand-50 text-3xl font-bold dark:border-brand-800 dark:bg-brand-900/40">{card.word}</div>
              <div className="flip-back flip-face flex-col rounded-xl border-2 border-brand-500 bg-white p-4 text-center dark:bg-neutral-800">
                <p className="text-lg font-medium">{card.definition}</p>
                <p className="mt-1 text-neutral-500" dir="rtl">{card.arabic}</p>
                {card.example && <p className="mt-2 text-sm italic text-neutral-400">“{card.example}”</p>}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Button variant="outline" onClick={prev}><ChevronLeft className="h-4 w-4 rtl:rotate-180" /></Button>
            <Button variant="secondary" onClick={() => mark("known")}><Check className="h-4 w-4" /> Known</Button>
            <Button variant="secondary" onClick={() => mark("review")}><AlertCircle className="h-4 w-4" /> Review</Button>
            <Button variant="secondary" onClick={() => mark("difficult")}><Star className="h-4 w-4" /> Difficult</Button>
            <Button variant="outline" onClick={next}><ChevronRight className="h-4 w-4 rtl:rotate-180" /></Button>
          </div>
        </Card>
      )}
    </div>
  );
}
