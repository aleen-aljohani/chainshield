"use client";

import { useState, useMemo } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Select, Badge, EmptyState } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { computeStudentGrade, summariseAttendance } from "@/lib/calc";
import { printHtml, docHeader } from "@/lib/print";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Printer, TrendingUp, LifeBuoy, CalendarCheck } from "lucide-react";

export default function ReportsPage() {
  const { state } = useStore();
  const [classId, setClassId] = useState(state.classes[0]?.id ?? "");

  const students = useMemo(() => state.students.filter((s) => s.classId === classId && s.status === "active"), [state.students, classId]);
  const book = state.gradebooks.find((b) => b.classId === classId);

  const studentRows = useMemo(() => students.map((st) => {
    const grade = book ? computeStudentGrade(book.categories, book.scores[st.id] ?? {}, state.settings.gradeBoundaries) : null;
    const att = summariseAttendance(state.attendance.filter((r) => r.classId === classId), st.id);
    return { student: st, pct: grade?.percentage ?? null, letter: grade?.letter ?? "—", attRate: att.rate, absences: att.absent };
  }), [students, book, state.attendance, classId, state.settings.gradeBoundaries]);

  const needSupport = studentRows.filter((r) => r.pct !== null && r.pct < 60);
  const topImprovement = [...studentRows].filter((r) => r.pct !== null).sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0)).slice(0, 3);
  const chartData = studentRows.filter((r) => r.pct !== null).map((r) => ({ name: r.student.name.split(" ")[0], score: r.pct as number }));

  const printClassReport = () => {
    const rows = studentRows.map((r) => `<tr><td>${r.student.name}</td><td>${r.pct ?? "—"}%</td><td>${r.letter}</td><td>${r.attRate}%</td><td>${r.absences}</td></tr>`).join("");
    printHtml("Class Report", docHeader({ title: "Class Performance Report", header: state.settings.printHeader, teacher: state.profile.name, className: state.classes.find((c) => c.id === classId)?.name }) + `<table><thead><tr><th>Student</th><th>Grade %</th><th>Letter</th><th>Attendance</th><th>Absences</th></tr></thead><tbody>${rows}</tbody></table>`);
  };

  return (
    <div>
      <PageHeader title="Reports" description="Class and student performance, attendance, and areas for improvement." breadcrumbs={[{ label: "Reports" }]}
        actions={<Button variant="outline" onClick={printClassReport}><Printer className="h-4 w-4" /> Print class report</Button>} />

      <Card className="mb-4 p-4"><Select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-40">{state.classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Card>

      {students.length === 0 ? <EmptyState title="No data for this class" hint="Add students and grades first." /> : (
        <div className="space-y-4">
          <Card>
            <CardHeader title="Grade distribution" subtitle="Percentage by student" />
            <div className="p-4">
              {chartData.length === 0 ? <EmptyState title="No grades recorded" hint="Enter grades in the Gradebook." /> : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-neutral-200 dark:stroke-neutral-700" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 11 }} /><Tooltip />
                    <Bar dataKey="score" fill="#27744b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader title="Students needing follow-up" subtitle="Below 60% — areas for improvement" />
              <div className="p-5">
                {needSupport.length === 0 ? <p className="text-sm text-neutral-400 flex items-center gap-2"><LifeBuoy className="h-4 w-4" /> No students currently below the threshold.</p> : (
                  <ul className="space-y-2">{needSupport.map((r) => <li key={r.student.id} className="flex items-center justify-between text-sm"><span>{r.student.name}</span><Badge color="amber">{r.pct}% · needs support</Badge></li>)}</ul>
                )}
              </div>
            </Card>
            <Card>
              <CardHeader title="Top performers" subtitle="Highest current averages" />
              <div className="p-5">
                {topImprovement.length === 0 ? <p className="text-sm text-neutral-400">No grades yet.</p> : (
                  <ul className="space-y-2">{topImprovement.map((r) => <li key={r.student.id} className="flex items-center justify-between text-sm"><span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-brand-600" />{r.student.name}</span><Badge color="green">{r.pct}%</Badge></li>)}</ul>
                )}
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Attendance follow-up" subtitle="Students with the most absences" />
            <div className="p-5">
              {studentRows.filter((r) => r.absences > 0).length === 0 ? <p className="text-sm text-neutral-400 flex items-center gap-2"><CalendarCheck className="h-4 w-4" /> No absences recorded.</p> : (
                <ul className="space-y-2">{[...studentRows].sort((a, b) => b.absences - a.absences).filter((r) => r.absences > 0).slice(0, 5).map((r) => <li key={r.student.id} className="flex items-center justify-between text-sm"><span>{r.student.name}</span><Badge color="red">{r.absences} absence(s) · {r.attRate}%</Badge></li>)}</ul>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
