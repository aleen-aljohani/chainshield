"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, Button, Input, Select, Badge, EmptyState, ConfirmDialog, Modal, Label } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { formatDate, uid } from "@/lib/cn";
import { Search, Printer, Copy, Trash2, Pencil, FileText } from "lucide-react";

export default function PrintablesPage() {
  const { state, setState } = useStore();
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);

  const kinds = useMemo(() => Array.from(new Set(state.printables.map((p) => p.kind))), [state.printables]);
  const filtered = useMemo(() => state.printables.filter((p) => {
    if (kind !== "all" && p.kind !== kind) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [state.printables, q, kind]);

  const duplicate = (id: string) => {
    const p = state.printables.find((x) => x.id === id); if (!p) return;
    setState((s) => ({ ...s, printables: [{ ...p, id: uid("pr"), name: p.name + " (copy)", createdAt: new Date().toISOString() }, ...s.printables] }));
    toast("Duplicated");
  };

  return (
    <div>
      <PageHeader title="Printable Resources" description="A central library of everything you've created. Open the source module to re-print or export as PDF." breadcrumbs={[{ label: "Printable Resources" }]} />

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]"><Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><Input placeholder="Search resources…" value={q} onChange={(e) => setQ(e.target.value)} className="ps-9" /></div>
          <Select value={kind} onChange={(e) => setKind(e.target.value)} className="w-48"><option value="all">All types</option>{kinds.map((k) => <option key={k} value={k}>{k}</option>)}</Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState title="No saved resources yet" hint="Quizzes, worksheets, homework and lesson plans you save will appear here." icon={<FileText className="h-8 w-8" />} />
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <Card key={p.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40"><FileText className="h-5 w-5" /></span>
                <div><p className="font-medium">{p.name}</p><p className="text-xs text-neutral-400">{p.kind} · {formatDate(p.createdAt)}</p></div>
              </div>
              <div className="flex items-center gap-1">
                <Badge color="green">{p.kind}</Badge>
                <button onClick={() => setRenaming({ id: p.id, name: p.name })} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700" aria-label="Rename"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => duplicate(p.id)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700" aria-label="Duplicate"><Copy className="h-4 w-4" /></button>
                <button onClick={() => setDeleteId(p.id)} className="rounded p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {renaming && (
        <Modal open onClose={() => setRenaming(null)} title="Rename resource" size="sm">
          <Label>Name</Label>
          <Input value={renaming.name} onChange={(e) => setRenaming({ ...renaming, name: e.target.value })} />
          <div className="mt-4 flex justify-end gap-2"><Button variant="outline" onClick={() => setRenaming(null)}>Cancel</Button><Button onClick={() => { setState((s) => ({ ...s, printables: s.printables.map((x) => x.id === renaming.id ? { ...x, name: renaming.name } : x) })); toast("Renamed"); setRenaming(null); }}>Save</Button></div>
        </Modal>
      )}
      <ConfirmDialog open={deleteId !== null} title="Remove from library?" message="This entry will be removed from the printable library. The original quiz/worksheet is not affected." confirmLabel="Remove" onConfirm={() => { setState((s) => ({ ...s, printables: s.printables.filter((x) => x.id !== deleteId) })); toast("Removed"); setDeleteId(null); }} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
