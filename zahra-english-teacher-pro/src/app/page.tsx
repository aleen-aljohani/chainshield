"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/context/StoreProvider";
import { curriculum } from "@/data/curriculum";
import { seedVocabulary } from "@/data/vocabulary";
import { Card, CardHeader, StatCard, Button, EmptyState, Badge } from "@/components/ui";
import { formatDateTime } from "@/lib/cn";
import { computeStudentGrade, summariseAttendance } from "@/lib/calc";
import {
  Layers, Languages, Database, FileText, FileQuestion, Users, GraduationCap,
  CalendarCheck, Shuffle, Gamepad2, Printer, ClipboardList, PlusCircle, Activity,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid,
} from "recharts";

const PIE_COLORS = ["#27744b", "#5aae7e", "#f59e0b", "#ef4444"];

export default function DashboardPage() {
  const { state } = useStore();

  const stats = useMemo(() => {
    const vocabCount = seedVocabulary.length + state.customVocab.length;
    return {
      units: curriculum.length,
      vocab: vocabCount,
      questions: state.questions.length,
      worksheets: state.worksheets.length,
      quizzes: state.quizzes.length,
      classes: state.classes.length,
      students: state.students.filter((s) => s.status === "active").length,
    };
  }, [state]);

  const unitProgressData = useMemo(() => {
    const buckets = { completed: 0, "in-progress": 0, "not-started": 0 };
    for (const u of curriculum) {
      const p = state.unitProgress[u.id]?.status ?? "not-started";
      buckets[p]++;
    }
    return [
      { name: "Completed", value: buckets.completed, color: "#27744b" },
      { name: "In progress", value: buckets["in-progress"], color: "#f59e0b" },
      { name: "Not started", value: buckets["not-started"], color: "#d4d4d4" },
    ];
  }, [state.unitProgress]);

  const attendance = useMemo(() => summariseAttendance(state.attendance), [state.attendance]);
  const attendanceData = [
    { name: "Present", value: attendance.present },
    { name: "Late", value: attendance.late },
    { name: "Excused", value: attendance.excused },
    { name: "Absent", value: attendance.absent },
  ];

  const gradeByClass = useMemo(() => {
    return state.gradebooks.map((book) => {
      const cls = state.classes.find((c) => c.id === book.classId);
      const ids = state.students.filter((s) => s.classId === book.classId && s.status === "active").map((s) => s.id);
      const results = ids
        .map((id) => computeStudentGrade(book.categories, book.scores[id] ?? {}, state.settings.gradeBoundaries).percentage)
        .filter((p): p is number => p !== null);
      const avg = results.length ? Math.round((results.reduce((a, b) => a + b, 0) / results.length) * 10) / 10 : 0;
      return { name: cls?.name ?? "Class", average: avg };
    });
  }, [state.gradebooks, state.classes, state.students, state.settings.gradeBoundaries]);

  const quickActions = [
    { href: "/quiz", label: "Create Quiz", icon: FileQuestion },
    { href: "/worksheets", label: "Create Worksheet", icon: FileText },
    { href: "/students", label: "Add Student", icon: Users },
    { href: "/attendance", label: "Take Attendance", icon: CalendarCheck },
    { href: "/grades", label: "Record Grades", icon: GraduationCap },
    { href: "/picker", label: "Random Picker", icon: Shuffle },
    { href: "/games", label: "Revision Game", icon: Gamepad2 },
    { href: "/printables", label: "Print Resource", icon: Printer },
  ];

  const hasAttendance = attendance.total > 0;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white shadow-md sm:p-8">
        <p className="text-sm text-brand-100">Welcome,</p>
        <h1 className="text-3xl font-bold">{state.profile.name || "Zahra Aljehani"}</h1>
        <p className="mt-1 text-brand-100">English Teacher – Grade 12</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm">Mega Goal 3</span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm">{state.profile.semester || "First Semester"}</span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm">{state.profile.academicYear}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
        <StatCard label="Units" value={stats.units} icon={<Layers className="h-5 w-5" />} />
        <StatCard label="Vocabulary" value={stats.vocab} icon={<Languages className="h-5 w-5" />} />
        <StatCard label="Questions" value={stats.questions} icon={<Database className="h-5 w-5" />} />
        <StatCard label="Worksheets" value={stats.worksheets} icon={<FileText className="h-5 w-5" />} />
        <StatCard label="Quizzes" value={stats.quizzes} icon={<FileQuestion className="h-5 w-5" />} />
        <StatCard label="Classes" value={stats.classes} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Students" value={stats.students} icon={<GraduationCap className="h-5 w-5" />} />
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader title="Quick actions" subtitle="Jump straight into a common task" />
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 p-4 text-center transition-colors hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-700 dark:hover:border-brand-700 dark:hover:bg-brand-900/30"
            >
              <a.icon className="h-6 w-6 text-brand-600" />
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">{a.label}</span>
            </Link>
          ))}
        </div>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title="Unit progress" subtitle="Across the semester" />
          <div className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={unitProgressData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {unitProgressData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 text-xs">
              {unitProgressData.map((d) => (
                <span key={d.name} className="flex items-center gap-1">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: d.color }} /> {d.name} ({d.value})
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader title="Attendance overview" subtitle={hasAttendance ? `Rate: ${attendance.rate}%` : "No records yet"} />
          <div className="p-4">
            {hasAttendance ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={attendanceData} dataKey="value" nameKey="name" outerRadius={80}>
                    {attendanceData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No attendance yet" hint="Take attendance to see the overview here." icon={<CalendarCheck className="h-8 w-8" />} />
            )}
          </div>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader title="Grade overview" subtitle="Average % by class" />
          <div className="p-4">
            {gradeByClass.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gradeByClass}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-neutral-200 dark:stroke-neutral-700" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#27744b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No grades yet" hint="Set up a gradebook to see class averages." icon={<GraduationCap className="h-8 w-8" />} />
            )}
          </div>
        </Card>
      </div>

      {/* Today's lessons + recent activity */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Today's lessons & upcoming" subtitle="From your lesson planner" action={<Link href="/lessons"><Button size="sm" variant="outline"><PlusCircle className="h-4 w-4" /> Plan</Button></Link>} />
          <div className="p-5">
            {state.lessonPlans.length === 0 ? (
              <EmptyState title="No lessons planned" hint="Create your first lesson plan." icon={<ClipboardList className="h-8 w-8" />} />
            ) : (
              <ul className="space-y-2">
                {state.lessonPlans.slice(0, 5).map((lp) => (
                  <li key={lp.id} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2 text-sm dark:border-neutral-700">
                    <div>
                      <p className="font-medium">{lp.title || "Untitled lesson"}</p>
                      <p className="text-xs text-neutral-500">{lp.date || "No date"} · {lp.unitId}</p>
                    </div>
                    <Badge color={lp.completed ? "green" : "amber"}>{lp.completed ? "Done" : "Planned"}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Recent activity" subtitle="Latest changes you made" />
          <div className="p-5">
            {state.activity.length === 0 ? (
              <EmptyState title="No activity yet" hint="Your recent actions will appear here." icon={<Activity className="h-8 w-8" />} />
            ) : (
              <ul className="space-y-2">
                {state.activity.slice(0, 8).map((a) => (
                  <li key={a.id} className="flex items-start gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    <div>
                      <span className="text-neutral-700 dark:text-neutral-200">{a.message}</span>
                      <span className="block text-xs text-neutral-400">{formatDateTime(a.at)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
