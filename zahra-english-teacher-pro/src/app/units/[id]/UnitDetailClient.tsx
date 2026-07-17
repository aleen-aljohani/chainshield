"use client";

import Link from "next/link";
import { getUnit } from "@/data/curriculum";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Badge, Button, Textarea, Input, Select, EmptyState } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import type { UnitProgress } from "@/lib/types";
import { Pin, PinOff, Target, Sparkles, FileQuestion, AlertTriangle } from "lucide-react";

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4 className="mb-1 text-sm font-semibold text-neutral-700 dark:text-neutral-200">{title}</h4>
      <ul className="list-inside list-disc space-y-0.5 text-sm text-neutral-600 dark:text-neutral-300">
        {items.map((i, idx) => <li key={idx}>{i}</li>)}
      </ul>
    </div>
  );
}

export default function UnitDetailClient({ id }: { id: string }) {
  const unit = getUnit(id);
  const { state, setState, logActivity } = useStore();
  const { toast } = useToast();

  if (!unit) {
    return (
      <div>
        <PageHeader title="Unit not found" breadcrumbs={[{ label: "Units", href: "/units" }, { label: "Not found" }]} />
        <EmptyState title="This unit does not exist" hint="Return to the units list." />
      </div>
    );
  }

  const prog: UnitProgress = state.unitProgress[unit.id] ?? { status: "not-started", notes: "", lessonDate: "", pinned: [] };

  const updateProg = (patch: Partial<UnitProgress>) => {
    setState((s) => ({ ...s, unitProgress: { ...s.unitProgress, [unit.id]: { ...prog, ...patch } } }));
  };

  const pinItem = (item: string) => {
    const pinned = prog.pinned.includes(item) ? prog.pinned.filter((p) => p !== item) : [...prog.pinned, item];
    updateProg({ pinned });
  };

  const skillItems = [
    { label: "Reading focus", value: unit.readingFocus },
    { label: "Listening focus", value: unit.listeningFocus },
    { label: "Speaking focus", value: unit.speakingFocus },
    { label: "Writing focus", value: unit.writingFocus },
    { label: "Project", value: unit.project },
  ];

  return (
    <div>
      <PageHeader
        title={unit.title}
        description={unit.theme}
        breadcrumbs={[{ label: "Units", href: "/units" }, { label: unit.title }]}
        actions={
          <Link href={`/quiz?unit=${unit.id}`}>
            <Button size="sm"><FileQuestion className="h-4 w-4" /> Generate resources</Button>
          </Link>
        }
      />

      {unit.needsReview && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
          <AlertTriangle className="me-1 inline h-4 w-4" />
          This unit's structure was inferred without the Student Book PDF. Please verify the page range ({unit.pageRange}) and titles.
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader title="Learning objectives" subtitle={unit.pageRange} action={<Badge color="green"><Target className="me-1 inline h-3 w-3" />{unit.objectives.length}</Badge>} />
            <div className="p-5">
              <ul className="space-y-1.5 text-sm">
                {unit.objectives.map((o, i) => (
                  <li key={i} className="flex items-start justify-between gap-2">
                    <span className="flex items-start gap-2 text-neutral-700 dark:text-neutral-200">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{o}
                    </span>
                    <button onClick={() => pinItem(o)} className="text-neutral-300 hover:text-brand-600" aria-label={prog.pinned.includes(o) ? "Unpin" : "Pin"}>
                      {prog.pinned.includes(o) ? <Pin className="h-4 w-4 text-brand-600" /> : <PinOff className="h-4 w-4" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card>
            <CardHeader title="Language & skills" />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Section title="Language functions" items={unit.languageFunctions} />
              <Section title="Grammar topics" items={unit.grammarTopics} />
              <Section title="Vocabulary categories" items={unit.vocabularyCategories} />
              <div className="space-y-2">
                {skillItems.map((s) => (
                  <div key={s.label}>
                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{s.label}: </span>
                    <span className="text-sm text-neutral-600 dark:text-neutral-300">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {prog.pinned.length > 0 && (
            <Card>
              <CardHeader title="Pinned items" />
              <div className="flex flex-wrap gap-2 p-5">
                {prog.pinned.map((p) => (
                  <Badge key={p} color="green"><Pin className="me-1 inline h-3 w-3" />{p}</Badge>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Progress" />
            <div className="space-y-3 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium">Status</label>
                <Select value={prog.status} onChange={(e) => updateProg({ status: e.target.value as any })}>
                  <option value="not-started">Not started</option>
                  <option value="in-progress">In progress</option>
                  <option value="completed">Completed</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Lesson date</label>
                <Input type="date" value={prog.lessonDate} onChange={(e) => updateProg({ lessonDate: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Teacher notes</label>
                <Textarea value={prog.notes} onChange={(e) => updateProg({ notes: e.target.value })} placeholder="Add notes for this unit…" />
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  logActivity(`Updated progress for ${unit.title}`);
                  toast("Unit progress saved");
                }}
              >
                Save changes
              </Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="Generate from this unit" />
            <div className="space-y-2 p-5">
              <Link href={`/quiz?unit=${unit.id}`} className="block"><Button variant="outline" className="w-full justify-start"><FileQuestion className="h-4 w-4" /> Create a quiz</Button></Link>
              <Link href={`/worksheets?unit=${unit.id}`} className="block"><Button variant="outline" className="w-full justify-start"><Sparkles className="h-4 w-4" /> Create a worksheet</Button></Link>
              <Link href={`/lessons?unit=${unit.id}`} className="block"><Button variant="outline" className="w-full justify-start"><Target className="h-4 w-4" /> Plan a lesson</Button></Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
