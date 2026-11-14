import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Scissors, Timer, User } from 'lucide-react';
import { buildArenaQuestionDeck } from '../../utils/arenaQuestionGenerator';
import { soundManager } from '../../utils/audio';
import type { GradeLevel } from '../../types';
import type { WrongItem } from './BlitzEngine';

export interface DuelOutcome { ok: boolean[]; ms: number[]; wrongItems: WrongItem[] }
interface Props {
  grade: GradeLevel; seed: number; limitMs: number;
  plan?: { ok: boolean; ms: number }[]; studentName: string;
  onFinish: (o: DuelOutcome) => void;
}
const TOTAL = 10;
const LETTERS = ['A', 'B', 'C', 'D'];

/** 10-question duel against "VNPT Vui-Bot". The bot's answer times come from the server-issued plan. */
export const DuelEngine: React.FC<Props> = ({ grade, seed, limitMs, plan, studentName, onFinish }) => {
  const deck = useMemo(() => buildArenaQuestionDeck({ grade, totalQuestions: TOTAL, matchSeed: seed }), [grade, seed]);
  const cards = Number(grade) <= 2 ? 0 : Number(grade) <= 5 ? 1 : 2;
  const [idx, setIdx] = useState(0);
  const [msLeft, setMsLeft] = useState(limitMs);
  const [cardsLeft, setCardsLeft] = useState(cards);
  const [hidden, setHidden] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [botDone, setBotDone] = useState(0);
  const ok = useRef<boolean[]>([]);
  const ms = useRef<number[]>([]);
  const wrongItems = useRef<WrongItem[]>([]);
  const qStart = useRef(performance.now());
  const matchStart = useRef(performance.now());
  const finished = useRef(false);

  // bot progress from its server-issued schedule
  useEffect(() => {
    if (!plan) return;
    const cum: number[] = []; plan.reduce((a, p, i) => (cum[i] = a + p.ms, a + p.ms), 0);
    const t = window.setInterval(() => {
      const el = performance.now() - matchStart.current;
      setBotDone(cum.filter((c) => c <= el).length);
    }, 300);
    return () => window.clearInterval(t);
  }, [plan]);

  const record = useCallback((optId: string | null) => {
    if (finished.current) return;
    const q = deck[idx];
    const took = Math.min(Math.max(Math.round(performance.now() - qStart.current), 300), limitMs);
    const opt = optId ? q.options.find((o) => o.id === optId) : undefined;
    const good = !!opt?.right;
    ok.current.push(good); ms.current.push(optId ? took : limitMs);
    if (!good) wrongItems.current.push({ question: q, chosen: opt?.text ?? '(hết giờ)' });
    soundManager.play(good ? 'correct' : 'wrong');
    setPicked(optId ?? '__timeout');
    window.setTimeout(() => {
      if (idx + 1 >= TOTAL) {
        finished.current = true;
        onFinish({ ok: ok.current, ms: ms.current, wrongItems: wrongItems.current });
        return;
      }
      setIdx(idx + 1); setPicked(null); setHidden([]); setMsLeft(limitMs); qStart.current = performance.now();
    }, 450);
  }, [deck, idx, limitMs, onFinish]);

  useEffect(() => {
    if (picked) return;
    const t = window.setInterval(() => {
      const left = limitMs - (performance.now() - qStart.current);
      if (left <= 0) { window.clearInterval(t); setMsLeft(0); record(null); } else setMsLeft(left);
    }, 100);
    return () => window.clearInterval(t);
  }, [picked, record, limitMs]);

  const q = deck[idx];
  if (!q) return null;
  const useFifty = () => {
    if (cardsLeft <= 0 || picked || hidden.length) return;
    soundManager.play('click');
    const wrong = q.options.filter((o) => !o.right).map((o) => o.id).sort(() => Math.random() - 0.5).slice(0, 2);
    setHidden(wrong); setCardsLeft((c) => c - 1);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 mb-3 space-y-2 text-xs font-bold">
        {[{ n: studentName, icon: User, v: idx, c: 'bg-sky-500' }, ...(plan ? [{ n: 'VNPT Vui-Bot [AI]', icon: Bot, v: botDone, c: 'bg-rose-500' }] : [])].map((r) => (
          <div key={r.n} className="flex items-center gap-2">
            <r.icon className="w-4 h-4 shrink-0" /><span className="w-28 truncate">{r.n}</span>
            <div className="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden"><div className={`h-full ${r.c} transition-all`} style={{ width: `${(r.v / TOTAL) * 100}%` }} /></div>
            <span>{r.v}/{TOTAL}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm font-black mb-2">
        <span>Câu {idx + 1}/{TOTAL}</span>
        <span className={`flex items-center gap-1 ${msLeft < 4000 ? 'text-rose-600' : ''}`}><Timer className="w-4 h-4" />{Math.ceil(msLeft / 1000)}s</span>
        {cards > 0 && <button onClick={useFifty} disabled={cardsLeft <= 0 || !!picked || hidden.length > 0}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs disabled:opacity-40 cursor-pointer"><Scissors className="w-3.5 h-3.5" /> 50/50 ({cardsLeft})</button>}
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-3"><div className="h-full bg-sky-500" style={{ width: `${(msLeft / limitMs) * 100}%` }} /></div>
      <div className="rounded-3xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 mb-3 text-center">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">{q.topicTag}</div>
        <div className="text-xl font-black leading-snug">{q.questionText}</div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((o, i) => {
          const gone = hidden.includes(o.id);
          const show = picked && (o.right ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950' : o.id === picked ? 'border-rose-500 bg-rose-50 dark:bg-rose-950' : '');
          return (
            <button key={o.id} disabled={gone || !!picked} onClick={() => record(o.id)}
              className={`rounded-2xl border-2 px-3 py-4 text-lg font-black flex items-center gap-2 cursor-pointer transition ${gone ? 'opacity-20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-400'} ${show || ''}`}>
              <span className="w-7 h-7 shrink-0 rounded-full bg-sky-100 text-sky-700 text-sm flex items-center justify-center">{LETTERS[i]}</span>
              <span className="flex-1 text-center">{o.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
