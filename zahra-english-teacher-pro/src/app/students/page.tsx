"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Input, Select, Textarea, Label, Badge, Modal, ConfirmDialog, EmptyState } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import type { StudentRecord, ClassRecord } from "@/lib/types";
import { uid } from "@/lib/cn";
import { Plus, Users, Pencil, Trash2, Download, Upload, ClipboardPaste, Archive, ShieldCheck, Search } from "lucide-react";

export default function StudentsPage() {
  const { state, setState, logActivity } = useStore();
  const { toast } = useToast();
  const [classFilter, setClassFilter] = useState("all");
  const [q, setQ] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRecord | null>(null);
  const [editingClass, setEditingClass] = useState<ClassRecord | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const students = useMemo(() => state.students.filter((s) => {
    if (!showArchived && s.status === "archived") return false;
    if (classFilter !== "all" && s.classId !== classFilter) return false;
    if (q && !s.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [state.students, classFilter, q, showArchived]);

  const saveStudent = (st: StudentRecord) => {
    const exists = state.students.some((x) => x.id === st.id);
    setState((s) => ({ ...s, students: exists ? s.students.map((x) => x.id === st.id ? st : x) : [...s.students, st] }));
    logActivity(exists ? "Edited a student" : `Added student ${st.name}`);
    toast(exists ? "Student updated" : "Student added");
    setEditingStudent(null);
  };

  const saveClass = (c: ClassRecord) => {
    const exists = state.classes.some((x) => x.id === c.id);
    setState((s) => ({ ...s, classes: exists ? s.classes.map((x) => x.id === c.id ? c : x) : [...s.classes, c] }));
    toast(exists ? "Class updated" : "Class added");
    setEditingClass(null);
  };

  const archive = (id: string) => { setState((s) => ({ ...s, students: s.students.map((x) => x.id === id ? { ...x, status: x.status === "archived" ? "active" : "archived" } : x) })); toast("Student status updated"); };
  const remove = (id: string) => { setState((s) => ({ ...s, students: s.students.filter((x) => x.id !== id) })); toast("Student deleted"); setDeleteId(null); };

  const exportCsv = () => {
    const rows = [["Name", "Number", "Class", "Status"], ...state.students.map((s) => [s.name, s.number, state.classes.find((c) => c.id === s.classId)?.name ?? "", s.status])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "students.csv"; a.click(); URL.revokeObjectURL(url);
  };

  const importCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).split(/\r?\n/).filter(Boolean);
      const targetClass = classFilter !== "all" ? classFilter : state.classes[0]?.id;
      if (!targetClass) return toast("Create a class first", "error");
      const parsed: StudentRecord[] = lines.slice(lines[0]?.toLowerCase().includes("name") ? 1 : 0).map((line, i) => {
        const cells = line.split(",").map((c) => c.replace(/^"|"$/g, "").trim());
        return { id: uid("st"), name: cells[0] || `Student ${i + 1}`, number: cells[1] || String(i + 1), classId: targetClass, status: "active", notes: "" };
      });
      setState((s) => ({ ...s, students: [...s.students, ...parsed] }));
      toast(`Imported ${parsed.length} student(s)`);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <PageHeader
        title="Students & Classes"
        description="Manage classes and students locally. Sample students are fictional."
        breadcrumbs={[{ label: "Students" }]}
        actions={<>
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</Button>
          <label className="inline-flex"><input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => e.target.files?.[0] && importCsv(e.target.files[0])} /><span className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-4 text-sm hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"><Upload className="h-4 w-4" /> Import CSV</span></label>
          <Button variant="secondary" onClick={() => setBulkOpen(true)}><ClipboardPaste className="h-4 w-4" /> Bulk add</Button>
          <Button onClick={() => setEditingStudent({ id: uid("st"), name: "", number: "", classId: state.classes[0]?.id ?? "", status: "active", notes: "" })}><Plus className="h-4 w-4" /> Add student</Button>
        </>}
      />

      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-200">
        <ShieldCheck className="me-1 inline h-4 w-4" /> <strong>Privacy:</strong> All student data is stored only in this browser (local storage). It is never uploaded. Back it up regularly and keep backups secure.
      </div>

      {/* Classes */}
      <Card className="mb-5">
        <CardHeader title="Classes" action={<Button size="sm" variant="outline" onClick={() => setEditingClass({ id: uid("class"), name: "", section: "", year: state.profile.academicYear, notes: "" })}><Plus className="h-4 w-4" /> Add class</Button>} />
        <div className="flex flex-wrap gap-2 p-5">
          {state.classes.length === 0 ? <p className="text-sm text-neutral-400">No classes yet.</p> : state.classes.map((c) => (
            <div key={c.id} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700">
              <Users className="h-4 w-4 text-brand-600" /><span className="font-medium">{c.name}</span>
              <span className="text-xs text-neutral-400">{state.students.filter((s) => s.classId === c.id && s.status === "active").length} students</span>
              <button onClick={() => setEditingClass(c)} className="text-neutral-400 hover:text-brand-600" aria-label="Edit class"><Pencil className="h-3.5 w-3.5" /></button>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px]"><Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" /><Input placeholder="Search students…" value={q} onChange={(e) => setQ(e.target.value)} className="ps-9" /></div>
          <Select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="w-40"><option value="all">All classes</option>{state.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="h-4 w-4 accent-brand-600" /> Show archived</label>
        </div>
      </Card>

      {students.length === 0 ? (
        <EmptyState title="No students" hint="Add students individually, bulk-paste names, or import a CSV." icon={<Users className="h-8 w-8" />} />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-neutral-200 text-start text-neutral-500 dark:border-neutral-700"><th scope="col" className="px-4 py-2 text-start">#</th><th scope="col" className="px-4 py-2 text-start">Name</th><th scope="col" className="px-4 py-2 text-start">Class</th><th scope="col" className="px-4 py-2 text-start">Status</th><th scope="col" className="px-4 py-2 text-end">Actions</th></tr></thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-neutral-100 dark:border-neutral-800">
                    <td className="px-4 py-2 text-neutral-400">{s.number}</td>
                    <td className="px-4 py-2 font-medium">{s.name}</td>
                    <td className="px-4 py-2">{state.classes.find((c) => c.id === s.classId)?.name ?? "—"}</td>
                    <td className="px-4 py-2"><Badge color={s.status === "active" ? "green" : "neutral"}>{s.status}</Badge></td>
                    <td className="px-4 py-2">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditingStudent(s)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700" aria-label="Edit"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => archive(s.id)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700" aria-label="Archive"><Archive className="h-4 w-4" /></button>
                        <button onClick={() => setDeleteId(s.id)} className="rounded p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30" aria-label="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {editingStudent && <StudentEditor student={editingStudent} classes={state.classes} onSave={saveStudent} onClose={() => setEditingStudent(null)} />}
      {editingClass && <ClassEditor cls={editingClass} onSave={saveClass} onClose={() => setEditingClass(null)} onDelete={() => { setState((s) => ({ ...s, classes: s.classes.filter((x) => x.id !== editingClass.id) })); setEditingClass(null); toast("Class deleted"); }} />}
      {bulkOpen && <BulkAdd classes={state.classes} defaultClass={classFilter !== "all" ? classFilter : state.classes[0]?.id ?? ""} onAdd={(names, classId) => { const added = names.map((n, i) => ({ id: uid("st"), name: n, number: String(state.students.filter((s) => s.classId === classId).length + i + 1), classId, status: "active" as const, notes: "" })); setState((s) => ({ ...s, students: [...s.students, ...added] })); toast(`Added ${added.length} student(s)`); setBulkOpen(false); }} onClose={() => setBulkOpen(false)} />}
      <ConfirmDialog open={deleteId !== null} title="Delete student?" message="This student record will be permanently removed." confirmLabel="Delete" onConfirm={() => deleteId && remove(deleteId)} onCancel={() => setDeleteId(null)} />
    </div>
  );
}

function StudentEditor({ student, classes, onSave, onClose }: { student: StudentRecord; classes: ClassRecord[]; onSave: (s: StudentRecord) => void; onClose: () => void }) {
  const [f, setF] = useState(student);
  const set = (p: Partial<StudentRecord>) => setF((x) => ({ ...x, ...p }));
  return (
    <Modal open onClose={onClose} title={student.name ? "Edit student" : "Add student"} size="sm">
      <div className="space-y-3">
        <div><Label>Name (fictional for samples)</Label><Input value={f.name} onChange={(e) => set({ name: e.target.value })} /></div>
        <div className="grid grid-cols-2 gap-3"><div><Label>Number</Label><Input value={f.number} onChange={(e) => set({ number: e.target.value })} /></div><div><Label>Class</Label><Select value={f.classId} onChange={(e) => set({ classId: e.target.value })}>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div></div>
        <div><Label>Status</Label><Select value={f.status} onChange={(e) => set({ status: e.target.value as any })}><option value="active">Active</option><option value="archived">Archived</option></Select></div>
        <div><Label>Notes</Label><Textarea value={f.notes} onChange={(e) => set({ notes: e.target.value })} /></div>
        <div className="flex justify-end gap-2 pt-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(f)} disabled={!f.name.trim() || !f.classId}>Save</Button></div>
      </div>
    </Modal>
  );
}

function ClassEditor({ cls, onSave, onClose, onDelete }: { cls: ClassRecord; onSave: (c: ClassRecord) => void; onClose: () => void; onDelete: () => void }) {
  const [f, setF] = useState(cls);
  const set = (p: Partial<ClassRecord>) => setF((x) => ({ ...x, ...p }));
  return (
    <Modal open onClose={onClose} title={cls.name ? "Edit class" : "Add class"} size="sm">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3"><div><Label>Class name</Label><Input value={f.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. 12-A" /></div><div><Label>Section</Label><Input value={f.section} onChange={(e) => set({ section: e.target.value })} /></div></div>
        <div><Label>Academic year</Label><Input value={f.year} onChange={(e) => set({ year: e.target.value })} /></div>
        <div><Label>Notes</Label><Textarea value={f.notes} onChange={(e) => set({ notes: e.target.value })} /></div>
        <div className="flex justify-between pt-2"><Button variant="danger" onClick={onDelete}>Delete class</Button><div className="flex gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(f)} disabled={!f.name.trim()}>Save</Button></div></div>
      </div>
    </Modal>
  );
}

function BulkAdd({ classes, defaultClass, onAdd, onClose }: { classes: ClassRecord[]; defaultClass: string; onAdd: (names: string[], classId: string) => void; onClose: () => void }) {
  const [text, setText] = useState("");
  const [classId, setClassId] = useState(defaultClass);
  const names = text.split(/\r?\n/).map((n) => n.trim()).filter(Boolean);
  return (
    <Modal open onClose={onClose} title="Bulk add students" size="sm">
      <div className="space-y-3">
        <div><Label>Class</Label><Select value={classId} onChange={(e) => setClassId(e.target.value)}>{classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
        <div><Label>Paste one name per line</Label><Textarea className="min-h-[160px]" value={text} onChange={(e) => setText(e.target.value)} placeholder={"Sara Ahmed\nNoura Ali\n…"} /></div>
        <p className="text-xs text-neutral-400">{names.length} name(s) detected. Use fictional names for demos.</p>
        <div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onAdd(names, classId)} disabled={names.length === 0 || !classId}>Add {names.length}</Button></div>
      </div>
    </Modal>
  );
}
