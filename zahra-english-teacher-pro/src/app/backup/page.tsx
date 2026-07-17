"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, ConfirmDialog, Badge } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { exportState, parseImport } from "@/lib/storage";
import { formatDateTime } from "@/lib/cn";
import { Download, Upload, DatabaseBackup, ShieldCheck, AlertTriangle } from "lucide-react";

export default function BackupPage() {
  const { state, replaceState, setState } = useStore();
  const { toast } = useToast();
  const [pendingImport, setPendingImport] = useState<ReturnType<typeof parseImport> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const json = exportState({ ...state, backupDate: new Date().toISOString() });
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `zahra-teacher-pro-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
    setState((s) => ({ ...s, backupDate: new Date().toISOString() }));
    toast("Backup downloaded");
  };

  const onFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = parseImport(String(reader.result));
      if (!result.ok) return toast(result.error ?? "Invalid file", "error");
      setPendingImport(result);
    };
    reader.readAsText(file);
  };

  const stats = [
    ["Classes", state.classes.length], ["Students", state.students.length], ["Questions", state.questions.length],
    ["Quizzes", state.quizzes.length], ["Worksheets", state.worksheets.length], ["Homework", state.homework.length],
    ["Lesson plans", state.lessonPlans.length], ["Custom vocab", state.customVocab.length],
    ["Attendance records", state.attendance.length], ["Reading texts", state.readingTexts.length],
  ] as const;

  return (
    <div>
      <PageHeader title="Backup & Restore" description="Export all your data to a JSON file, and restore it on any device. Everything stays local." breadcrumbs={[{ label: "Backup & Restore" }]} />

      <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-200">
        <ShieldCheck className="me-1 inline h-4 w-4" /> Your data lives only in this browser. Clearing browser data or switching devices will lose it unless you back up. Store backups somewhere secure.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader title="Export (backup)" subtitle={state.backupDate ? `Last backup: ${formatDateTime(state.backupDate)}` : "No backup yet"} />
          <div className="p-5">
            <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">Download a complete snapshot of your data as a single JSON file.</p>
            <Button onClick={exportData}><Download className="h-4 w-4" /> Download backup</Button>
          </div>
        </Card>

        <Card>
          <CardHeader title="Import (restore)" subtitle="Overwrites current data" />
          <div className="p-5">
            <p className="mb-4 flex items-start gap-2 text-sm text-amber-700 dark:text-amber-300"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> Restoring replaces everything currently in the app. Export a backup first if unsure.</p>
            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            <Button variant="outline" onClick={() => fileRef.current?.click()}><Upload className="h-4 w-4" /> Choose backup file</Button>
          </div>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader title="Current data" subtitle="What a backup will include" />
        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map(([label, count]) => (
            <div key={label} className="rounded-lg border border-neutral-100 p-3 text-center dark:border-neutral-700"><p className="text-xl font-bold text-brand-600">{count}</p><p className="text-xs text-neutral-500">{label}</p></div>
          ))}
        </div>
      </Card>

      <ConfirmDialog
        open={pendingImport !== null}
        title="Restore this backup?"
        message="This will overwrite ALL current data in the app with the contents of the file. This cannot be undone."
        confirmLabel="Overwrite & restore"
        onConfirm={() => { if (pendingImport?.state) { replaceState(pendingImport.state); toast("Data restored"); } setPendingImport(null); }}
        onCancel={() => setPendingImport(null)}
      />
    </div>
  );
}
