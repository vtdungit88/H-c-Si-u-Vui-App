import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { onMascot } from '../lib/mascotBus';
import { soundManager } from '../utils/audio';

const CORRECT = ['Chính xác! 🎉', 'Giỏi quá!', 'Đúng rồi, tuyệt vời!', 'Siêu đỉnh!'];
const base = import.meta.env.BASE_URL;

type Shown = { kind: 'correct' | 'wrong' | 'streak'; text: string; badge?: string; key: number };

/** Floating mascot that reacts to quiz answers (correct, wrong, 5-in-a-row streak). */
export const MascotReaction: React.FC = () => {
  const [shown, setShown] = useState<Shown | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return onMascot((e) => {
      let next: Shown;
      let ms = 2200;
      if (e.type === 'correct') {
        next = { kind: 'correct', text: CORRECT[Math.floor(Math.random() * CORRECT.length)], key: Date.now() };
      } else if (e.type === 'wrong') {
        next = { kind: 'wrong', text: 'Không sao cả, hãy đọc mẹo bên dưới để hiểu bản chất nhé!', key: Date.now() };
        ms = 4500;
      } else {
        if (e.count % 5 !== 0) return;
        next = { kind: 'streak', text: `Chuỗi ${e.count} câu đúng liên tiếp!`, badge: 'Siêu Trí Tuệ', key: Date.now() };
        ms = 4200;
        soundManager.play('fanfare');
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      }
      setShown(next);
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setShown(null), ms);
    });
  }, []);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  if (!shown) return null;

  const ring = shown.kind === 'wrong' ? 'border-sky-400' : shown.kind === 'streak' ? 'border-amber-400' : 'border-emerald-400';
  return (
    <div key={shown.key} role="status" aria-live="polite" className="pointer-events-none fixed left-3 bottom-24 md:bottom-6 z-40 max-w-[18rem] flex items-end gap-2">
      <div className="relative shrink-0">
        <img src={`${base}assets/icons/mascot-face.webp`} alt="" className={`w-16 h-16 rounded-full border-4 ${ring} bg-sky-200 object-cover shadow-xl ${shown.kind === 'wrong' ? 'motion-safe:-rotate-6' : 'motion-safe:animate-bounce'}`} />
        {shown.kind !== 'wrong' && (
          <span aria-hidden className="absolute -top-3 -right-1 text-2xl">
            <span className="motion-safe:animate-ping absolute inline-flex opacity-70">💡</span>
            <span className="relative">💡</span>
          </span>
        )}
      </div>
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-3 py-2 shadow-xl">
        {shown.badge && <div className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full px-2 py-0.5 w-fit mb-1">🏅 {shown.badge}</div>}
        <div className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">{shown.text}</div>
      </div>
    </div>
  );
};
