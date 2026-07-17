"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Select, Input, Badge, EmptyState } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import type { AttendanceStatus } from "@/lib/types";
import { summariseAttendance } from "@/lib/calc";
import { todayISO } from "@/lib/cn";
import { printHtml, docHeader } from "@/lib/print";
import { CheckCheck, Copy, Printer, Download, CalendarCheck } from "lucide-react";

const STATUS: { value: AttendanceStatus; label: string; color: "green" | "red" | "amber" | "blue" }[] = [
  { value: "present", label: "Present", color: "green" },
  { value: "absent", label: "Absent", color: "red" },
  { value: "late", label: "Late", color: "amber" },
  { value: "excused", label: "Excused", color: "blue" },
];

export default function AttendancePage() {
  const { state, setState, logActivity } = useStore();
  const { toast } = useToast();
  const [classId, setClassId] = useState(state.classes[0]?.id ?? "");
  const [date, setDate] = useState(todayISO());

  const students = useMemo(() => state.students.filter((s) => s.classId === classId && s.status === "active"), [state.students, classId]);
  const recordId = `${classId}:${date}`;
  const record = state.attendance.find((r) => r.id === recordId);

  const setStatus = (studentId: string, status: AttendanceStatus) => {
    setState((s) => {
      const existing = s.attendance.find((r) => r.id === recordId);
      const entries = { ...(existing?.entries ?? {}), [studentId]: { status, note: existing?.entries[studentId]?.note ?? "" } };
      const rec = { id: recordId, classId, date, entries };
      return { ...s, attendance: existing ? s.attendance.map((r) => r.id === recordId ? rec : r) : [...s.attendance, rec] };
    });
  };

  const markAllPresent = () => {
    setState((s) => {
      const entries: Record<string, { status: AttendanceStatus; note: string }> = {};
      students.forEach((st) => { entries[st.id] = { status: "present", note: record?.entries[st.id]?.note ?? "" }; });
      const rec = { id: recordId, classId, date, entries };
      const existing = s.attendance.find((r) => r.id === recordId);
      return { ...s, attendance: existing ? s.attendance.map((r) => r.id === recordId ? rec : r) : [...s.attendance, rec] };
    });
    logActivity(`Marked attendance for ${state.classes.find((c) => c.id === classId)?.name} on ${date}`);
    toast("All marked present");
  };

  const copyPrevious = () => {
    const prev = [...state.attendance].filter((r) => r.classId === classId && r.date < date).sort((a, b) => b.date.localeCompare(a.date))[0];
    if (!prev) return toast("No previous record for this class", "error");
    setState((s) => {
      const rec = { id: recordId, classId, date, entries: { ...prev.entries } };
      const existing = s.attendance.find((r) => r.id === recordId);
      return { ...s, attendance: existing ? s.attendance.map((r) => r.id === recordId ? rec : r) : [...s.attendance, rec] };
    });
    toast(`Copied from ${prev.date}`);
  };

  const summary = record ? summariseAttendance([record]) : null;

  const printReport = () => {
    const rows = students.map((st) => `<tr><td>${st.number}</td><td>${st.name}</td><td>${record?.entries[st.id]?.status ?? "—"}</td></tr>`).join("");
    printHtml("Attendance", docHeader({ title: "Daily Attendance", header: state.settings.printHeader, teacher: state.profile.name, className: state.classes.find((c) => c.id === classId)?.name, date }) + `<table><thead><tr><th>#</th><th>Name</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>`);
  };

  const exportCsv = () => {
    const rows = [["Number", "Name", "Status", "Note"], ...students.map((st) => [st.number, st.name, record?.entries[st.id]?.status ?? "", record?.entries[st.id]?.note ?? ""])];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `attendance-${date}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div>
      <PageHeader title="Attendance" description="Take and review daily attendance. Records are saved locally per class and date." breadcrumbs={[{ label: "Attendance" }]} />

      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div><label className="mb-1 block text-sm font-medium">Class</label><Select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-40">{state.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></div>
          <div><label className="mb-1 block text-sm font-medium">Date</label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
          <Button variant="secondary" onClick={markAllPresent}><CheckCheck className="h-4 w-4" /> Mark all present</Button>
          <Button variant="outline" onClick={copyPrevious}><Copy className="h-4 w-4" /> Copy previous</Button>
          <Button variant="outline" onClick={printReport}><Printer className="h-4 w-4" /> Print</Button>
          <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4" /> CSV</Button>
        </div>
      </Card>

      {summary && (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Card className="p-3 text-center"><p className="text-xl font-bold text-brand-600">{summary.present}</p><p className="text-xs text-neutral-500">Present</p></Card>
          <Card className="p-3 text-center"><p className="text-xl font-bold text-red-500">{summary.absent}</p><p className="text-xs text-neutral-500">Absent</p></Card>
          <Card className="p-3 text-center"><p className="text-xl font-bold text-amber-500">{summary.late}</p><p className="text-xs text-neutral-500">Late</p></Card>
          <Card className="p-3 text-center"><p className="text-xl font-bold text-blue-500">{summary.excused}</p><p className="text-xs text-neutral-500">Excused</p></Card>
          <Card className="p-3 text-center"><p className="text-xl font-bold">{summary.rate}%</p><p className="text-xs text-neutral-500">Attendance rate</p></Card>
        </div>
      )}

      {!classId ? <EmptyState title="No class selected" hint="Create a class in the Students page first." /> : students.length === 0 ? (
        <EmptyState title="No active students in this class" hint="Add students to this class first." icon={<CalendarCheck className="h-8 w-8" />} />
      ) : (
        <Card>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {students.map((st) => {
              const current = record?.entries[st.id]?.status;
              return (
                <div key={st.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-medium"><span className="me-2 text-neutral-400">{st.number}</span>{st.name}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS.map((s) => (
                      <button key={s.value} onClick={() => setStatus(st.id, s.value)} className={`rounded-lg border px-3 py-1 text-sm ${current === s.value ? "border-transparent bg-brand-600 text-white" : "border-neutral-300 text-neutral-600 dark:border-neutral-600 dark:text-neutral-300"}`}>{s.label}</button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
