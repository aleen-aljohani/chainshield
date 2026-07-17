"use client";

import Link from "next/link";
import { curriculum } from "@/data/curriculum";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, Badge, Button } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { ArrowRight } from "lucide-react";

export default function UnitsPage() {
  const { state } = useStore();

  const counts = { "not-started": 0, "in-progress": 0, completed: 0 };
  curriculum.forEach((u) => counts[state.unitProgress[u.id]?.status ?? "not-started"]++);

  return (
    <div>
      <PageHeader title="Units" description="Track progress, add notes and lesson dates for each unit." breadcrumbs={[{ label: "Units" }]} />

      <div className="mb-5 grid grid-cols-3 gap-3">
        <Card className="p-4 text-center"><p className="text-2xl font-bold text-neutral-500">{counts["not-started"]}</p><p className="text-xs text-neutral-500">Not started</p></Card>
        <Card className="p-4 text-center"><p className="text-2xl font-bold text-amber-500">{counts["in-progress"]}</p><p className="text-xs text-neutral-500">In progress</p></Card>
        <Card className="p-4 text-center"><p className="text-2xl font-bold text-brand-600">{counts.completed}</p><p className="text-xs text-neutral-500">Completed</p></Card>
      </div>

      <div className="space-y-3">
        {curriculum.map((u) => {
          const prog = state.unitProgress[u.id];
          const status = prog?.status ?? "not-started";
          return (
            <Card key={u.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-brand-600">{typeof u.number === "number" ? `Unit ${u.number}` : u.number}</span>
                  <Badge color={status === "completed" ? "green" : status === "in-progress" ? "amber" : "neutral"}>
                    {status === "not-started" ? "Not started" : status === "in-progress" ? "In progress" : "Completed"}
                  </Badge>
                  {prog?.lessonDate && <span className="text-xs text-neutral-400">📅 {prog.lessonDate}</span>}
                </div>
                <h3 className="mt-1 font-semibold">{u.title} — <span className="font-normal text-neutral-500">{u.theme}</span></h3>
                <p className="text-xs text-neutral-400">{u.pageRange}</p>
              </div>
              <Link href={`/units/${u.id}`}>
                <Button variant="outline" size="sm">Manage <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
