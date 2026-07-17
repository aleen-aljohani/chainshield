"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Select, Input, Badge, EmptyState, Modal, Label } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import type { Gradebook, GradeCategory } from "@/lib/types";
import { computeStudentGrade, classAverage } from "@/lib/calc";
import { uid } from "@/lib/cn";
import { printHtml, docHeader } from "@/lib/print";
import { Plus, Printer, Download, GraduationCap, Settings2, Trash2 } from "lucide-react";

const DEFAULT_CATEGORIES: GradeCategory[] = [
  { id: "quizzes", name: "Quizzes", weight: 20, maxMarks: 20 },
  { id: "homework", name: "Homework", weight: 10, maxMarks: 10 },
  { id: "participation", name: "Participation", weight: 10, maxMarks: 10 },
  { id: "writing", name: "Writing", weight: 15, maxMarks: 20 },
  { id: "speaking", name: "Speaking", weight: 15, maxMarks: 20 },
  { id: "final", name: "Final", weight: 30, maxMarks: 40 },
];

export default function GradesPage() {
  const { state, setState, logActivity } = useStore();
  const { toast } = useToast();
  const [classId, setClassId] = useState(state.classes[0]?.id ?? "");
  const [showCats, setShowCats] = useState(false);

  const students = useMemo(() => state.students.filter((s) => s.classId === classId && s.status === "active"), [state.students, classId]);
  let book = state.gradebooks.find((b) => b.classId === classId);

  const ensureBook = (): Gradebook => {
    if (book) return book;
    const nb: Gradebook = { classId, categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })), scores: {}, comments: {} };
    setState((s) => ({ ...s, gradebooks: [...s.gradebooks, nb] }));
    return nb;
  };

  const currentBook = book ?? { classId, categories: DEFAULT_CATEGORIES, scores: {}, comments: {} };

  const setScore = (studentId: string, catId: string, value: string) => {
    const nb = ensureBook();
    setState((s) => ({
      ...s,
      gradebooks: s.gradebooks.map((b) => b.classId === classId ? { ...b, scores: { ...b.scores, [studentId]: { ...b.scores[studentId], [catId]: value } } } : b),
    }));
  };

  const updateCategories = (categories: GradeCategory[]) => {
    ensureBook();
    setState((s) => ({ ...s, gradebooks: s.gradebooks.map((b) => b.classId === classId ? { ...b, categories } : b) }));
  };

  const avg = book ? classAverage(book, students.map((s) => s.id), state.settings.gradeBoundaries) : null;

  const printReport = () => {
    const headers = currentBook.categories.map((c) => `<th>${c.name} (${c.maxMarks})</th>`).join("");
    const rows = students.map((st) => {
      const r = computeStudentGrade(currentBook.categories, currentBook.scores[st.id] ?? {}, state.settings.gradeBoundaries);
      const cells = currentBook.categories.map((c) => `<td>${currentBook.scores[st.id]?.[c.id] ?? "—"}</td>`).join("");
      return `<tr><td>${st.name}</td>${cells}<td><strong>${r.percentage ?? "—"}%</strong></td><td>${r.letter}</td></tr>`;
    }).join("");
    printHtml("Grade Report", docHeader({ title: "Grade Report", header: state.settings.printHeader, teacher: state.profile.name, className: state.classes.find((c) => c.id === classId)?.name }) + `<table><thead><tr><th>Student</th>${headers}<th>Total</th><th>Grade</th></tr></thead><tbody>${rows}</tbody></table><p class="note">Class average: ${avg ?? "—"}%</p>`);
  };

  const exportCsv = () => {
    const header = ["Student", ...currentBook.categories.map((c) => c.name), "Percentage", "Grade"];
    const rows = students.map((st) => {
      const r = computeStudentGrade(currentBook.categories, currentBook.scores[st.id] ?? {}, state.settings.gradeBoundaries);
      return [st.name, ...currentBook.categories.map((c) => currentBook.scores[st.id]?.[c.id] ?? ""), r.percentage ?? "", r.letter];
    });
    const csv = [header, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "grades.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const totalWeight = currentBook.categories.reduce((s, c) => s + c.weight, 0);

  return (
    <div>
      <PageHeader
        title="Gradebook"
        description="Weighted grades with editable categories, weights and boundaries. Totals calculate automatically."
        breadcrumbs={[{ label: "Grades" }]}
        actions={<>
          <Button variant="outline" onClick={() => setShowCats(true)}><Settings2 className="h-4 w-4" /> Categories</Button>
          <Button variant="outline" onClick={printReport}><Printer className="h-4 w-4" /> Print</Button>
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" /> CSV</Button>
        </>}
      />

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-40">{state.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
          {avg !== null && <Badge color="green">Class average: {avg}%</Badge>}
          {totalWeight !== 100 && <Badge color="amber">Weights total {totalWeight}% (not 100%) — percentages are normalised.</Badge>}
        </div>
      </Card>

      {!classId ? <EmptyState title="No class" hint="Create a class first." /> : students.length === 0 ? (
        <EmptyState title="No active students" hint="Add students to this class." icon={<GraduationCap className="h-8 w-8" />} />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th scope="col" className="sticky start-0 bg-white px-3 py-2 text-start dark:bg-neutral-800">Student</th>
                  {currentBook.categories.map((c) => (<th scope="col" key={c.id} className="px-2 py-2 text-center">{c.name}<span className="block text-[10px] font-normal text-neutral-400">/{c.maxMarks} · {c.weight}%</span></th>))}
                  <th scope="col" className="px-3 py-2 text-center">Total</th><th scope="col" className="px-3 py-2 text-center">Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => {
                  const r = computeStudentGrade(currentBook.categories, currentBook.scores[st.id] ?? {}, state.settings.gradeBoundaries);
                  return (
                    <tr key={st.id} className="border-b border-neutral-100 dark:border-neutral-800">
                      <td className="sticky start-0 bg-white px-3 py-1.5 font-medium dark:bg-neutral-800">{st.name}</td>
                      {currentBook.categories.map((c) => (
                        <td key={c.id} className="px-1 py-1.5 text-center">
                          <input value={currentBook.scores[st.id]?.[c.id] ?? ""} onChange={(e) => setScore(st.id, c.id, e.target.value)} placeholder="—" className="w-14 rounded border border-neutral-200 bg-transparent px-1 py-0.5 text-center text-sm focus:border-brand-500 focus:outline-none dark:border-neutral-700" aria-label={`${st.name} ${c.name}`} />
                        </td>
                      ))}
                      <td className="px-3 py-1.5 text-center font-semibold">{r.percentage === null ? "—" : `${r.percentage}%`}</td>
                      <td className="px-3 py-1.5 text-center"><Badge color={r.letter === "F" ? "red" : r.percentage && r.percentage >= 80 ? "green" : "amber"}>{r.letter}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="px-3 py-2 text-xs text-neutral-400">Tip: enter <strong>EX</strong> to mark a category excused (it is dropped and weights re-normalise). Blank = missing (counts as 0).</p>
        </Card>
      )}

      {showCats && <CategoryEditor categories={currentBook.categories} onSave={(c) => { updateCategories(c); logActivity("Updated grade categories"); toast("Categories saved"); setShowCats(false); }} onClose={() => setShowCats(false)} />}
    </div>
  );
}

function CategoryEditor({ categories, onSave, onClose }: { categories: GradeCategory[]; onSave: (c: GradeCategory[]) => void; onClose: () => void }) {
  const [cats, setCats] = useState<GradeCategory[]>(categories.map((c) => ({ ...c })));
  const set = (i: number, patch: Partial<GradeCategory>) => setCats((cs) => cs.map((c, idx) => idx === i ? { ...c, ...patch } : c));
  const total = cats.reduce((s, c) => s + c.weight, 0);
  return (
    <Modal open onClose={onClose} title="Assessment categories" size="md">
      <div className="space-y-2">
        {cats.map((c, i) => (
          <div key={c.id} className="grid grid-cols-12 items-center gap-2">
            <Input className="col-span-5" value={c.name} onChange={(e) => set(i, { name: e.target.value })} />
            <div className="col-span-3"><Input type="number" value={c.weight} onChange={(e) => set(i, { weight: Number(e.target.value) })} aria-label="Weight %" /><span className="text-[10px] text-neutral-400">weight %</span></div>
            <div className="col-span-3"><Input type="number" value={c.maxMarks} onChange={(e) => set(i, { maxMarks: Number(e.target.value) })} aria-label="Max marks" /><span className="text-[10px] text-neutral-400">max marks</span></div>
            <button onClick={() => setCats((cs) => cs.filter((_, idx) => idx !== i))} className="col-span-1 text-red-400" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
        <Button size="sm" variant="ghost" onClick={() => setCats((cs) => [...cs, { id: uid("cat"), name: "New category", weight: 10, maxMarks: 10 }])}><Plus className="h-4 w-4" /> Add category</Button>
        <p className={`text-sm ${total === 100 ? "text-brand-600" : "text-amber-600"}`}>Total weight: {total}%</p>
        <div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(cats)}>Save</Button></div>
      </div>
    </Modal>
  );
}
