import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Flame, Timer, Volume2 } from 'lucide-react';
import { buildArenaQuestionDeck, type ArenaQuestion } from '../../utils/arenaQuestionGenerator';
import { soundManager } from '../../utils/audio';
import type { GradeLevel } from '../../types';
import { emitMascot } from '../../lib/mascotBus';
import { MathText } from '../MathText';

export interface WrongItem { question: ArenaQuestion; chosen: string }
export interface BlitzOutcome { correct: number; wrong: number; maxCombo: number; wrongItems: WrongItem[] }

interface Props {
  grade: GradeLevel;
  seed: number;
  duration: number;
  onFinish: (o: BlitzOutcome) => void;
}

const LETTERS = ['A', 'B', 'C', 'D'];

/** Plays one timed blitz round from a seeded, grade-appropriate procedural deck. */
export const BlitzEngine: React.FC<Props> = ({ grade, seed, duration, onFinish }) => {
  const youngKid = Number(grade) <= 2;
  const [deck, setDeck] = useState<ArenaQuestion[]>(() => buildArenaQuestionDeck({ grade, totalQuestions: 80, matchSeed: seed }));
  const [idx, setIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [flash, setFlash] = useState<'ok' | 'bad' | null>(null);
  const wrongItems = useRef<WrongItem[]>([]);
  const done = useRef(false);
  const stats = useRef({ correct: 0, wrong: 0, maxCombo: 0 });
  stats.current = { correct, wrong, maxCombo };

  const finish = useCallback(() => {
    if (done.current) return;
    done.current = true;
    window.speechSynthesis?.cancel();
    onFinish({ ...stats.current, wrongItems: wrongItems.current });
  }, [onFinish]);

  useEffect(() => {
    const t = window.setInterval(() => setTimeLeft((p) => {
      if (p <= 1) { window.clearInterval(t); return 0; }
      if (p <= 6) soundManager.play('countdown');
      return p - 1;
    }), 1000);
    return () => window.clearInterval(t);
  }, []);
  useEffect(() => { if (timeLeft === 0) finish(); }, [timeLeft, finish]);

  // deck ran out (very fast player): extend with a fresh seed
  useEffect(() => {
    if (idx >= deck.length - 3) {
      setDeck((d) => [...d, ...buildArenaQuestionDeck({ grade, totalQuestions: 40, matchSeed: seed + d.length })]);
    }
  }, [idx, deck.length, grade, seed]);

  const q = deck[idx];
  const speak = useCallback(() => {
    if (!q || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(q.questionText);
    u.lang = 'vi-VN'; u.rate = 0.9;
    window.speechSynthesis.speak(u);
  }, [q]);

  const answer = (optId: string) => {
    if (!q || done.current || flash) return;
    const opt = q.options.find((o) => o.id === optId)!;
    if (opt.right) {
      soundManager.play('correct');
      const c = combo + 1;
      setCorrect((x) => x + 1); setCombo(c); setMaxCombo((m) => Math.max(m, c));
      setFlash('ok');
      if (c % 5 === 0) { emitMascot({ type: 'streak', count: c }); }
      else if (c % 3 === 0) confetti({ particleCount: 15, spread: 40, origin: { y: 0.7 } });
    } else {
      soundManager.play('wrong');
      setWrong((x) => x + 1); setCombo(0); setFlash('bad');
      wrongItems.current.push({ question: q, chosen: opt.text });
    }
    window.setTimeout(() => { setFlash(null); setIdx((i) => i + 1); }, youngKid ? 350 : 220);
  };

  const pct = useMemo(() => (timeLeft / duration) * 100, [timeLeft, duration]);
  if (!q) return null;

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between text-sm font-black mb-2">
        <span className="flex items-center gap-1 text-slate-700 dark:text-slate-200"><Timer className="w-4 h-4" /> {timeLeft}s</span>
        <span className="text-emerald-600">Đúng {correct}</span>
        <span className={`flex items-center gap-1 ${combo >= 3 ? 'text-orange-500' : 'text-slate-400'}`}><Flame className="w-4 h-4" /> x{combo}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-4" role="progressbar" aria-valuemin={0} aria-valuemax={duration} aria-valuenow={timeLeft}>
        <div className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 10 ? 'bg-rose-500' : 'bg-sky-500'}`} style={{ width: `${pct}%` }} />
      </div>
      <div className={`rounded-3xl border-2 p-5 mb-4 text-center bg-white dark:bg-slate-900 transition-colors ${flash === 'ok' ? 'border-emerald-400' : flash === 'bad' ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'}`}>
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{q.topicTag}</div>
        <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-50 leading-snug"><MathText text={q.questionText} /></div>
        {youngKid && (
          <button onClick={speak} className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-100 text-sky-700 text-xs font-bold cursor-pointer" aria-label="Đọc đề">
            <Volume2 className="w-4 h-4" /> Đọc đề cho mình
          </button>
        )}
      </div>
      <div className={`grid grid-cols-2 gap-3 ${youngKid ? 'sm:gap-4' : ''}`}>
        {q.options.map((o, i) => (
          <button key={o.id} onClick={() => answer(o.id)} disabled={!!flash}
            className={`rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-slate-800 dark:text-slate-100 hover:border-sky-400 active:scale-95 transition cursor-pointer flex items-center gap-2 px-3 ${youngKid ? 'py-6 text-2xl' : 'py-4 text-lg'}`}>
            <span className="w-7 h-7 shrink-0 rounded-full bg-sky-100 text-sky-700 text-sm flex items-center justify-center">{LETTERS[i]}</span>
            <span className="flex-1 text-center"><MathText text={o.text} /></span>
          </button>
        ))}
      </div>
    </div>
  );
};
