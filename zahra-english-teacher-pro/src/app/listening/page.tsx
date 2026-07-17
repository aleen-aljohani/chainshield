"use client";

import { useState, useRef } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, Button, Badge, Select } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { seedListening } from "@/data/skills";
import { curriculum } from "@/data/curriculum";
import { printHtml, docHeader, studentFields, escapeHtml } from "@/lib/print";
import { Headphones, Upload, Play, Pause, RotateCcw, Printer, AlertTriangle } from "lucide-react";

export default function ListeningPage() {
  const { state } = useStore();
  const { toast } = useToast();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioName, setAudioName] = useState("");
  const [speed, setSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const loadAudio = (file: File) => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioName(file.name);
    toast(`Loaded "${file.name}" (plays locally, not saved)`, "info");
  };

  const setPlaybackSpeed = (s: number) => {
    setSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  };

  const printQuestions = (item: (typeof seedListening)[number]) => {
    printHtml(item.title, docHeader({ title: item.title + " — Listening", header: state.settings.printHeader, teacher: state.profile.name, unit: curriculum.find((u) => u.id === item.unitId)?.title }) + studentFields() + `<p><strong>Objective:</strong> ${escapeHtml(item.objective)}</p><p><strong>Question types:</strong> ${item.questionTypes.join(", ")}</p><p class="note">Teacher: play the audio and add specific questions for each type.</p><ol class="questions"><li>Question 1 <div style="border-bottom:1px solid #999;height:24px;margin-top:6px;"></div></li><li>Question 2 <div style="border-bottom:1px solid #999;height:24px;margin-top:6px;"></div></li><li>Question 3 <div style="border-bottom:1px solid #999;height:24px;margin-top:6px;"></div></li></ol>`);
  };

  return (
    <div>
      <PageHeader title="Listening" description="Manage listening activities. Attach a local audio file to play in class — no audio is bundled or uploaded anywhere." breadcrumbs={[{ label: "Listening" }]} />

      <Card className="mb-5 p-5">
        <div className="flex items-center gap-2"><Headphones className="h-5 w-5 text-brand-600" /><h3 className="font-semibold">Local audio player</h3></div>
        <p className="mt-1 text-sm text-neutral-500">Select an audio file from your device. It plays in the browser and is not stored or sent anywhere.</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="inline-flex">
            <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files?.[0] && loadAudio(e.target.files[0])} />
            <span className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-neutral-300 px-4 text-sm hover:bg-neutral-50 dark:border-neutral-600 dark:hover:bg-neutral-800"><Upload className="h-4 w-4" /> Choose audio file</span>
          </label>
          {audioName && <span className="text-sm text-neutral-500">{audioName}</span>}
        </div>
        {audioUrl && (
          <div className="mt-4 space-y-3">
            <audio ref={audioRef} src={audioUrl} controls className="w-full" />
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => audioRef.current?.play()}><Play className="h-4 w-4" /> Play</Button>
              <Button size="sm" variant="outline" onClick={() => audioRef.current?.pause()}><Pause className="h-4 w-4" /> Pause</Button>
              <Button size="sm" variant="outline" onClick={() => { if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); } }}><RotateCcw className="h-4 w-4" /> Restart</Button>
              <span className="ms-2 text-sm text-neutral-500">Speed:</span>
              <Select value={String(speed)} onChange={(e) => setPlaybackSpeed(Number(e.target.value))} className="w-24"><option value="0.5">0.5×</option><option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option></Select>
            </div>
          </div>
        )}
      </Card>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {seedListening.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Headphones className="h-5 w-5 text-brand-600" /><h3 className="font-semibold">{item.title}</h3></div>
              <Badge color="amber"><AlertTriangle className="me-1 inline h-3 w-3" />No audio</Badge>
            </div>
            <p className="mt-1 text-xs text-neutral-400">{curriculum.find((u) => u.id === item.unitId)?.title} · {item.page}</p>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">{item.objective}</p>
            <div className="mt-2 flex flex-wrap gap-1">{item.questionTypes.map((t) => <Badge key={t} color="blue">{t}</Badge>)}</div>
            <p className="mt-2 text-xs italic text-neutral-400">{item.teacherNotes}</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => printQuestions(item)}><Printer className="h-4 w-4" /> Print question sheet</Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
