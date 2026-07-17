"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { curriculum } from "@/data/curriculum";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, Input, Select, Badge, Button } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { BookOpen, ArrowRight, AlertTriangle } from "lucide-react";

const SKILLS = ["reading", "listening", "speaking", "writing", "grammar"] as const;

export default function CurriculumPage() {
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [skill, setSkill] = useState("all");

  const filtered = useMemo(() => {
    const query = q.toLowerCase();
    return curriculum.filter((u) => {
      const matchesQ =
        !query ||
        u.title.toLowerCase().includes(query) ||
        u.theme.toLowerCase().includes(query) ||
        u.grammarTopics.join(" ").toLowerCase().includes(query) ||
        u.vocabularyCategories.join(" ").toLowerCase().includes(query);
      const matchesSkill =
        skill === "all" ||
        (skill === "reading" && u.readingFocus) ||
        (skill === "listening" && u.listeningFocus) ||
        (skill === "speaking" && u.speakingFocus) ||
        (skill === "writing" && u.writingFocus) ||
        (skill === "grammar" && u.grammarTopics.length > 0);
      return matchesQ && matchesSkill;
    });
  }, [q, skill]);

  return (
    <div>
      <PageHeader
        title="Curriculum Explorer"
        description="Mega Goal 3 — First Semester. Structure, objectives, and skill focus for every unit."
        breadcrumbs={[{ label: "Curriculum" }]}
      />

      <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-200">
        <AlertTriangle className="me-1 inline h-4 w-4" />
        The Student Book PDF was not available during setup, so page numbers and titles are approximate and marked
        <Badge color="amber" className="mx-1">Requires teacher review</Badge>. Confirm them against your printed book in the Units page.
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <Input placeholder="Search units, grammar, vocabulary…" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-sm" />
        <Select value={skill} onChange={(e) => setSkill(e.target.value)} className="sm:max-w-[200px]">
          <option value="all">All skills</option>
          {SKILLS.map((s) => (
            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
          ))}
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((u) => {
          const status = state.unitProgress[u.id]?.status ?? "not-started";
          return (
            <Card key={u.id} className="flex flex-col p-5">
              <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs font-medium text-brand-600">{typeof u.number === "number" ? `Unit ${u.number}` : u.number}</p>
                    <h3 className="font-semibold leading-tight">{u.title}</h3>
                  </div>
                </div>
                <Badge color={status === "completed" ? "green" : status === "in-progress" ? "amber" : "neutral"}>
                  {status === "not-started" ? "Not started" : status === "in-progress" ? "In progress" : "Completed"}
                </Badge>
              </div>
              <p className="mb-2 text-sm text-neutral-600 dark:text-neutral-300">{u.theme}</p>
              <p className="mb-3 text-xs text-neutral-400">{u.pageRange}</p>
              <div className="mb-3 flex flex-wrap gap-1">
                {u.grammarTopics.slice(0, 2).map((g) => (
                  <span key={g} className="rounded bg-neutral-100 px-2 py-0.5 text-[11px] text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">{g}</span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xs text-neutral-400">{u.objectives.length} objectives</span>
                <Link href={`/units/${u.id}`}>
                  <Button size="sm" variant="ghost">Open <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
