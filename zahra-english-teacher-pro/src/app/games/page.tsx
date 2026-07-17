"use client";

import { useState, useMemo, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, Button, Select, Badge, Input, EmptyState } from "@/components/ui";
import { useStore } from "@/context/StoreProvider";
import { useToast } from "@/context/ToastProvider";
import { useVocab } from "@/hooks/useVocab";
import { curriculum } from "@/data/curriculum";
import { filterQuestions, shuffle, pickNoRepeat } from "@/lib/selection";
import type { Question } from "@/data/questions";
import {
  Gamepad2, Zap, Users, Shuffle as ShuffleIcon, Brain, Grid3x3, Type, Trophy,
  Eye, EyeOff, ArrowRight, Plus, Minus, RotateCcw, Timer, AlertTriangle,
} from "lucide-react";

type Game = "menu" | "quickfire" | "teams" | "scramble" | "hangman" | "memory" | "wheel" | "jeopardy";

const GAMES: { id: Game; name: string; desc: string; icon: any }[] = [
  { id: "quickfire", name: "Quick-fire Quiz", desc: "Teacher-led rapid questions with reveal. No student devices needed.", icon: Zap },
  { id: "teams", name: "Team Challenge", desc: "Split the class into teams and keep score with a timer.", icon: Users },
  { id: "wheel", name: "Spin Wheel", desc: "Spin to land on a random question from the pool.", icon: ShuffleIcon },
  { id: "scramble", name: "Word Scramble", desc: "Unscramble vocabulary words against the clock.", icon: Type },
  { id: "hangman", name: "Hangman", desc: "Guess the vocabulary word letter by letter.", icon: Brain },
  { id: "memory", name: "Memory Match", desc: "Match each word to its meaning.", icon: Grid3x3 },
  { id: "jeopardy", name: "Jeopardy Board", desc: "Pick a skill and points value, reveal the question.", icon: Trophy },
];

export default function GamesPage() {
  const { state } = useStore();
  const [game, setGame] = useState<Game>("menu");
  const [unit, setUnit] = useState("all");

  const questionPool = useMemo(() => filterQuestions(state.questions, { unitIds: unit === "all" ? undefined : [unit] }), [state.questions, unit]);

  return (
    <div>
      <PageHeader title="Revision Games" description="Classroom revision games built from your questions and vocabulary. No student devices, no Kahoot branding." breadcrumbs={[{ label: "Revision Games" }]}
        actions={game !== "menu" ? <Button variant="outline" onClick={() => setGame("menu")}>← All games</Button> : undefined} />

      {game === "menu" ? (
        <>
          <Card className="mb-4 p-4"><div className="flex items-center gap-3"><span className="text-sm font-medium">Filter content by unit:</span><Select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-48"><option value="all">All units</option>{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select></div></Card>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {GAMES.map((g) => (
              <button key={g.id} onClick={() => setGame(g.id)} className="flex flex-col items-start gap-2 rounded-xl border border-neutral-200 bg-white p-5 text-start transition-colors hover:border-brand-300 hover:bg-brand-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-brand-900/30">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/40"><g.icon className="h-6 w-6" /></span>
                <h3 className="font-semibold">{g.name}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{g.desc}</p>
              </button>
            ))}
          </div>
          <Card className="mt-4 p-4">
            <p className="flex items-start gap-2 text-sm text-neutral-500"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /><span><strong>Word search & crossword:</strong> reliable automatic crossword generation is intentionally not shipped to avoid broken puzzles. Use the printable vocabulary and flashcard sheets, or the Word Scramble game, for word-play revision. This is a documented limitation, not a broken feature.</span></p>
          </Card>
        </>
      ) : (
        <div className="mb-4"><Card className="p-4"><div className="flex items-center gap-3"><span className="text-sm font-medium">Unit:</span><Select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-48"><option value="all">All units</option>{curriculum.map((u) => <option key={u.id} value={u.id}>{u.title}</option>)}</Select></div></Card>
        <div className="mt-4">
          {game === "quickfire" && <QuickFire pool={questionPool} />}
          {game === "teams" && <TeamChallenge pool={questionPool} />}
          {game === "wheel" && <WheelGame pool={questionPool} />}
          {game === "scramble" && <ScrambleGame unit={unit} />}
          {game === "hangman" && <HangmanGame unit={unit} />}
          {game === "memory" && <MemoryGame unit={unit} />}
          {game === "jeopardy" && <Jeopardy pool={questionPool} />}
        </div>
        </div>
      )}
    </div>
  );
}

function useAnswerReveal() {
  const [reveal, setReveal] = useState(false);
  return { reveal, setReveal };
}

function QuickFire({ pool }: { pool: Question[] }) {
  const [used, setUsed] = useState<string[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const { reveal, setReveal } = useAnswerReveal();
  if (pool.length === 0) return <EmptyState title="No questions" hint="Add questions or pick another unit." />;

  const next = () => {
    const { picked, nextUsed, cycled } = pickNoRepeat(pool.map((q) => q.id), used);
    setUsed(cycled ? [picked!] : nextUsed);
    setCurrent(pool.find((q) => q.id === picked) ?? null);
    setReveal(false);
  };

  return (
    <Card className="mx-auto max-w-2xl p-8 text-center">
      <Badge color="neutral" className="mb-3">{used.length} / {pool.length} asked</Badge>
      {!current ? (
        <><Zap className="mx-auto mb-3 h-12 w-12 text-brand-600" /><p className="text-neutral-500">Press start for the first question.</p></>
      ) : (
        <>
          <p className="mb-4 text-2xl font-semibold">{current.text}</p>
          {current.type === "multiple-choice" && <div className="mb-4 flex flex-wrap justify-center gap-2">{current.distractors.map((d) => <span key={d} className={`rounded-lg border px-3 py-1.5 ${reveal && d === current.answer ? "border-brand-500 bg-brand-50 font-semibold dark:bg-brand-900/40" : "border-neutral-300 dark:border-neutral-600"}`}>{d}</span>)}</div>}
          {reveal && <p className="mb-4 rounded-lg bg-brand-50 p-3 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200"><strong>Answer:</strong> {current.answer} {current.explanation && <span className="block text-sm font-normal">{current.explanation}</span>}</p>}
        </>
      )}
      <div className="flex justify-center gap-2">
        <Button variant="outline" onClick={() => setReveal((r) => !r)} disabled={!current}>{reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {reveal ? "Hide" : "Reveal"}</Button>
        <Button onClick={next}>{current ? "Next" : "Start"} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></Button>
      </div>
    </Card>
  );
}

function TeamChallenge({ pool }: { pool: Question[] }) {
  const [teams, setTeams] = useState([{ name: "Team A", score: 0 }, { name: "Team B", score: 0 }]);
  const [used, setUsed] = useState<string[]>([]);
  const [current, setCurrent] = useState<Question | null>(null);
  const { reveal, setReveal } = useAnswerReveal();
  const [seconds, setSeconds] = useState(30);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running || seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, seconds]);

  const next = () => {
    if (pool.length === 0) return;
    const { picked, nextUsed, cycled } = pickNoRepeat(pool.map((q) => q.id), used);
    setUsed(cycled ? [picked!] : nextUsed);
    setCurrent(pool.find((q) => q.id === picked) ?? null);
    setReveal(false); setSeconds(30); setRunning(true);
  };
  const adjust = (i: number, delta: number) => setTeams((t) => t.map((tm, idx) => idx === i ? { ...tm, score: tm.score + delta } : tm));

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {teams.map((tm, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <Input value={tm.name} onChange={(e) => setTeams((t) => t.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} className="max-w-[160px] font-semibold" />
              <span className="text-3xl font-bold text-brand-600">{tm.score}</span>
            </div>
            <div className="mt-2 flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => adjust(i, 1)}><Plus className="h-4 w-4" /> 1</Button>
              <Button size="sm" variant="secondary" onClick={() => adjust(i, 5)}><Plus className="h-4 w-4" /> 5</Button>
              <Button size="sm" variant="outline" onClick={() => adjust(i, -1)}><Minus className="h-4 w-4" /> 1</Button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-6 text-center">
        <div className="mb-3 flex items-center justify-center gap-4">
          <Badge color={seconds <= 5 ? "red" : "neutral"}><Timer className="me-1 inline h-3 w-3" />{seconds}s</Badge>
          <Button size="sm" variant="ghost" onClick={() => { setSeconds(30); setRunning(false); }}><RotateCcw className="h-4 w-4" /></Button>
        </div>
        {current ? (
          <>
            <p className="mb-3 text-xl font-semibold">{current.text}</p>
            {reveal && <p className="mb-3 rounded-lg bg-brand-50 p-2 text-brand-700 dark:bg-brand-900/40"><strong>Answer:</strong> {current.answer}</p>}
          </>
        ) : <p className="mb-3 text-neutral-500">Press next for the first question.</p>}
        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => setReveal((r) => !r)} disabled={!current}>{reveal ? "Hide" : "Reveal"}</Button>
          <Button onClick={next}>Next question</Button>
        </div>
      </Card>
    </div>
  );
}

function WheelGame({ pool }: { pool: Question[] }) {
  const [rotation, setRotation] = useState(0);
  const [current, setCurrent] = useState<Question | null>(null);
  const [spinning, setSpinning] = useState(false);
  const { reveal, setReveal } = useAnswerReveal();
  if (pool.length === 0) return <EmptyState title="No questions" />;

  const spin = () => {
    setSpinning(true); setReveal(false);
    const i = Math.floor(Math.random() * pool.length);
    setRotation((r) => r + 360 * 5 + Math.random() * 360);
    setTimeout(() => { setCurrent(pool[i]); setSpinning(false); }, 2500);
  };
  return (
    <Card className="flex flex-col items-center p-8">
      <div className="h-56 w-56 rounded-full border-8 border-brand-600 bg-gradient-to-br from-brand-300 to-brand-600 transition-transform duration-[2500ms] ease-out" style={{ transform: `rotate(${rotation}deg)` }} />
      <Button className="mt-6" onClick={spin} disabled={spinning}><ShuffleIcon className="h-4 w-4" /> {spinning ? "Spinning…" : "Spin"}</Button>
      {current && !spinning && (
        <div className="mt-6 w-full max-w-xl rounded-lg border border-neutral-200 p-4 text-center dark:border-neutral-700">
          <p className="text-lg font-medium">{current.text}</p>
          {reveal && <p className="mt-2 text-brand-600"><strong>Answer:</strong> {current.answer}</p>}
          <Button size="sm" variant="outline" className="mt-3" onClick={() => setReveal((r) => !r)}>{reveal ? "Hide" : "Reveal"} answer</Button>
        </div>
      )}
    </Card>
  );
}

function ScrambleGame({ unit }: { unit: string }) {
  const vocab = useVocab();
  const words = useMemo(() => shuffle(unit === "all" ? vocab : vocab.filter((v) => v.unitId === unit)), [vocab, unit]);
  const [i, setI] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [msg, setMsg] = useState("");
  const word = words[i % Math.max(1, words.length)];
  const scrambled = useMemo(() => (word ? shuffle(word.word.split("")).join("").toUpperCase() : ""), [word]);
  if (!word) return <EmptyState title="No vocabulary for this unit" />;
  const check = () => {
    if (answer.trim().toLowerCase() === word.word.toLowerCase()) { setScore((s) => s + 1); setMsg("Correct! ✓"); }
    else setMsg(`It was "${word.word}"`);
  };
  return (
    <Card className="mx-auto max-w-lg p-8 text-center">
      <Badge color="green" className="mb-3">Score: {score}</Badge>
      <p className="text-4xl font-bold tracking-[0.3em]">{scrambled}</p>
      <p className="mt-2 text-sm text-neutral-400">Meaning: {word.definition}</p>
      <Input className="mt-4 text-center" value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type the word" onKeyDown={(e) => e.key === "Enter" && check()} />
      {msg && <p className={`mt-2 font-medium ${msg.startsWith("Correct") ? "text-brand-600" : "text-red-500"}`}>{msg}</p>}
      <div className="mt-4 flex justify-center gap-2"><Button onClick={check}>Check</Button><Button variant="outline" onClick={() => { setAnswer(""); setMsg(""); setI((x) => x + 1); }}>Next word</Button></div>
    </Card>
  );
}

function HangmanGame({ unit }: { unit: string }) {
  const vocab = useVocab();
  const words = useMemo(() => shuffle(unit === "all" ? vocab : vocab.filter((v) => v.unitId === unit)), [vocab, unit]);
  const [i, setI] = useState(0);
  const [guessed, setGuessed] = useState<string[]>([]);
  const word = words[i % Math.max(1, words.length)];
  if (!word) return <EmptyState title="No vocabulary for this unit" />;
  const letters = word.word.toUpperCase().split("");
  const wrong = guessed.filter((g) => !letters.includes(g));
  const won = letters.every((l) => l === " " || guessed.includes(l));
  const lost = wrong.length >= 6;
  const next = () => { setGuessed([]); setI((x) => x + 1); };
  return (
    <Card className="mx-auto max-w-lg p-8 text-center">
      <p className="mb-2 text-sm text-neutral-400">Hint: {word.definition}</p>
      <p className="my-4 text-3xl font-bold tracking-[0.3em]">{letters.map((l, idx) => <span key={idx}>{l === " " ? " " : guessed.includes(l) || lost ? l : "_"}</span>)}</p>
      <p className="text-sm text-red-500">Wrong: {wrong.join(" ")} ({wrong.length}/6)</p>
      {won && <p className="mt-2 font-semibold text-brand-600">You got it! 🎉</p>}
      {lost && !won && <p className="mt-2 font-semibold text-red-500">The word was "{word.word}"</p>}
      <div className="mt-4 flex flex-wrap justify-center gap-1">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((l) => (
          <button key={l} disabled={guessed.includes(l) || won || lost} onClick={() => setGuessed((g) => [...g, l])} className={`h-8 w-8 rounded text-sm ${guessed.includes(l) ? "bg-neutral-200 text-neutral-400 dark:bg-neutral-700" : "bg-brand-100 text-brand-700 hover:bg-brand-200 dark:bg-brand-900/40 dark:text-brand-200"}`}>{l}</button>
        ))}
      </div>
      <Button className="mt-4" variant="outline" onClick={next}>Next word</Button>
    </Card>
  );
}

function MemoryGame({ unit }: { unit: string }) {
  const vocab = useVocab();
  const pairs = useMemo(() => shuffle(unit === "all" ? vocab : vocab.filter((v) => v.unitId === unit)).slice(0, 6), [vocab, unit]);
  const cards = useMemo(() => shuffle(pairs.flatMap((p) => [{ id: p.id + "-w", pair: p.id, text: p.word }, { id: p.id + "-d", pair: p.id, text: p.definition }])), [pairs]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  if (pairs.length < 2) return <EmptyState title="Need more vocabulary" hint="Add at least a few words for this unit." />;

  const click = (id: string, pair: string) => {
    if (flipped.includes(id) || matched.includes(pair) || flipped.length === 2) return;
    const next = [...flipped, id];
    setFlipped(next);
    if (next.length === 2) {
      const [a, b] = next;
      const pa = cards.find((c) => c.id === a)!.pair;
      const pb = cards.find((c) => c.id === b)!.pair;
      setTimeout(() => { if (pa === pb) setMatched((m) => [...m, pa]); setFlipped([]); }, 800);
    }
  };
  const done = matched.length === pairs.length;
  return (
    <Card className="p-6">
      {done && <p className="mb-3 text-center font-semibold text-brand-600">All matched! 🎉</p>}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {cards.map((c) => {
          const show = flipped.includes(c.id) || matched.includes(c.pair);
          return (
            <button key={c.id} onClick={() => click(c.id, c.pair)} className={`flex h-24 items-center justify-center rounded-lg border p-2 text-center text-sm transition-colors ${show ? "border-brand-500 bg-brand-50 dark:bg-brand-900/40" : "border-neutral-300 bg-neutral-100 dark:border-neutral-600 dark:bg-neutral-700"}`}>
              {show ? c.text : "?"}
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function Jeopardy({ pool }: { pool: Question[] }) {
  const skills = useMemo(() => Array.from(new Set(pool.map((q) => q.skill))), [pool]);
  const values = [100, 200, 300];
  const [current, setCurrent] = useState<Question | null>(null);
  const [answered, setAnswered] = useState<string[]>([]);
  const { reveal, setReveal } = useAnswerReveal();
  if (pool.length === 0) return <EmptyState title="No questions" />;

  const pick = (skill: string, value: number) => {
    const key = `${skill}-${value}`;
    const candidates = pool.filter((q) => q.skill === skill && !answered.includes(q.id));
    const q = candidates[0] ?? pool.find((x) => x.skill === skill);
    if (q) { setCurrent(q); setAnswered((a) => [...a, q.id, key]); setReveal(false); }
  };
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-center">
          <thead><tr>{skills.map((s) => <th key={s} className="border border-neutral-200 bg-brand-600 p-2 text-sm capitalize text-white dark:border-neutral-700">{s}</th>)}</tr></thead>
          <tbody>
            {values.map((v) => (
              <tr key={v}>{skills.map((s) => {
                const key = `${s}-${v}`; const done = answered.includes(key);
                return <td key={s} className="border border-neutral-200 p-1 dark:border-neutral-700"><button disabled={done} onClick={() => pick(s, v)} className={`h-14 w-full rounded text-lg font-bold ${done ? "bg-neutral-100 text-neutral-300 dark:bg-neutral-800" : "bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/40 dark:text-brand-200"}`}>{done ? "—" : v}</button></td>;
              })}</tr>
            ))}
          </tbody>
        </table>
      </div>
      {current && (
        <Card className="p-6 text-center">
          <p className="text-xl font-semibold">{current.text}</p>
          {current.type === "multiple-choice" && <div className="mt-3 flex flex-wrap justify-center gap-2">{current.distractors.map((d) => <span key={d} className={`rounded-lg border px-3 py-1.5 ${reveal && d === current.answer ? "border-brand-500 bg-brand-50 font-semibold dark:bg-brand-900/40" : "border-neutral-300 dark:border-neutral-600"}`}>{d}</span>)}</div>}
          {reveal && <p className="mt-3 text-brand-600"><strong>Answer:</strong> {current.answer}</p>}
          <Button size="sm" variant="outline" className="mt-3" onClick={() => setReveal((r) => !r)}>{reveal ? "Hide" : "Reveal"}</Button>
        </Card>
      )}
    </div>
  );
}
