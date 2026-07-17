"use client";

import { useMemo } from "react";
import type { Question } from "@/data/questions";
import { Badge, Button } from "@/components/ui";
import { GripVertical, X, ArrowUp, ArrowDown, Plus } from "lucide-react";

/** Reusable selected-questions list with reorder + remove, shared by quiz/worksheet/homework. */
export function SelectedList({
  questions,
  onRemove,
  onMove,
}: {
  questions: Question[];
  onRemove: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}) {
  const total = questions.reduce((s, q) => s + q.marks, 0);
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium">{questions.length} selected</span>
        <Badge color="green">{total} marks</Badge>
      </div>
      {questions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-400 dark:border-neutral-600">No questions selected yet.</p>
      ) : (
        <ol className="space-y-1.5">
          {questions.map((q, i) => (
            <li key={q.id} className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-2 text-sm dark:border-neutral-700 dark:bg-neutral-800">
              <GripVertical className="h-4 w-4 shrink-0 text-neutral-300" />
              <span className="min-w-0 flex-1 truncate">{i + 1}. {q.text}</span>
              <Badge color="blue">{q.type}</Badge>
              <button onClick={() => onMove(q.id, -1)} disabled={i === 0} className="rounded p-1 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-700" aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></button>
              <button onClick={() => onMove(q.id, 1)} disabled={i === questions.length - 1} className="rounded p-1 text-neutral-400 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-700" aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></button>
              <button onClick={() => onRemove(q.id)} className="rounded p-1 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" aria-label="Remove"><X className="h-4 w-4" /></button>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

export function AvailableList({
  pool,
  selectedIds,
  onAdd,
}: {
  pool: Question[];
  selectedIds: string[];
  onAdd: (q: Question) => void;
}) {
  const available = useMemo(() => pool.filter((q) => !selectedIds.includes(q.id)), [pool, selectedIds]);
  return (
    <div className="max-h-80 space-y-1.5 overflow-y-auto pe-1">
      {available.length === 0 ? (
        <p className="text-sm text-neutral-400">No more questions match the current filter.</p>
      ) : (
        available.map((q) => (
          <div key={q.id} className="flex items-center gap-2 rounded-lg border border-neutral-200 p-2 text-sm dark:border-neutral-700">
            <span className="min-w-0 flex-1 truncate">{q.text}</span>
            <Badge color="blue">{q.skill}</Badge>
            <Button size="sm" variant="ghost" onClick={() => onAdd(q)} aria-label="Add question"><Plus className="h-4 w-4" /></Button>
          </div>
        ))
      )}
    </div>
  );
}
