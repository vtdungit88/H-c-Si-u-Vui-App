import React from 'react';

const DOODLES = [
  { t: 'π', x: 6, y: 14, s: 44, c: 'text-sky-400', d: 7 }, { t: '∑', x: 90, y: 10, s: 46, c: 'text-violet-400', d: 9 },
  { t: '×', x: 14, y: 52, s: 52, c: 'text-rose-400', d: 8 }, { t: '÷', x: 84, y: 46, s: 48, c: 'text-emerald-400', d: 10 },
  { t: '√', x: 5, y: 82, s: 46, c: 'text-amber-400', d: 6 }, { t: '+', x: 93, y: 78, s: 54, c: 'text-pink-400', d: 8 },
  { t: 'x²', x: 48, y: 6, s: 40, c: 'text-indigo-400', d: 11 }, { t: '=', x: 70, y: 28, s: 44, c: 'text-teal-400', d: 9 },
  { t: '%', x: 28, y: 30, s: 40, c: 'text-orange-400', d: 12 }, { t: '△', x: 62, y: 70, s: 42, c: 'text-cyan-400', d: 10 }
];

/** Fixed, decorative page background: sky, drifting clouds, floating maths symbols and rolling hills. */
export const AppBackdrop: React.FC = () => (
  <div aria-hidden className="fixed inset-0 -z-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900" />
    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-yellow-200/60 dark:bg-yellow-300/10 blur-3xl" />
    <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-pink-200/50 dark:bg-fuchsia-500/10 blur-3xl" />
    {[8, 24, 46, 63].map((top, i) => (
      <div key={i} className="absolute hsv-anim-drift opacity-90 dark:opacity-15" style={{ top: `${top}%`, left: `${-20 + i * 18}%`, ['--d' as string]: `${70 + i * 18}s`, animationDelay: `${-i * 17}s` }}>
        <svg width="150" height="60" viewBox="0 0 120 50"><g fill="#fff"><ellipse cx="40" cy="32" rx="30" ry="16" /><ellipse cx="68" cy="26" rx="26" ry="18" /><ellipse cx="92" cy="34" rx="22" ry="12" /></g></svg>
      </div>
    ))}
    {DOODLES.map((d, i) => (
      <span key={i} className={`absolute font-display font-extrabold hsv-anim-float opacity-40 dark:opacity-25 select-none ${d.c}`}
        style={{ left: `${d.x}%`, top: `${d.y}%`, fontSize: d.s, ['--d' as string]: `${d.d}s`, animationDelay: `${-i * 1.3}s` }}>{d.t}</span>
    ))}
    {Array.from({ length: 14 }, (_, i) => (
      <span key={i} className="absolute hsv-anim-twinkle text-yellow-300 dark:text-yellow-200" style={{ left: `${(i * 37 + 9) % 96}%`, top: `${(i * 23 + 5) % 80}%`, fontSize: 14 + (i % 3) * 6, animationDelay: `${-i * 0.6}s` }}>✦</span>
    ))}
    <svg className="absolute bottom-0 left-0 w-full h-1/3 min-h-[180px]" viewBox="0 0 1440 320" preserveAspectRatio="none">
      <path d="M0 200 Q240 120 480 190 T960 170 T1440 200 L1440 320 L0 320 Z" fill="#86efac" opacity=".55" className="dark:opacity-15" />
      <path d="M0 240 Q300 170 620 235 T1440 225 L1440 320 L0 320 Z" fill="#4ade80" opacity=".5" className="dark:opacity-15" />
      <path d="M0 280 Q360 230 760 275 T1440 270 L1440 320 L0 320 Z" fill="#22c55e" opacity=".45" className="dark:opacity-15" />
    </svg>
  </div>
);
