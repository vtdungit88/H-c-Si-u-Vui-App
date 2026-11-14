import React from 'react';
import { Lock } from 'lucide-react';

/** Cloud overlay for subjects / grades that have no question bank yet. */
export const FogOfWar: React.FC<{ title: string }> = ({ title }) => (
  <div className="relative overflow-hidden rounded-3xl min-h-[22rem] bg-gradient-to-b from-slate-300 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
    <div aria-hidden className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-white/60 dark:bg-white/10 blur-3xl" />
    <div aria-hidden className="absolute bottom-0 right-0 w-72 h-56 rounded-full bg-white/70 dark:bg-white/10 blur-3xl" />
    <div className="relative text-center max-w-sm space-y-3">
      <span className="mx-auto w-16 h-16 rounded-full bg-white/80 dark:bg-slate-700 shadow-lg flex items-center justify-center text-slate-500"><Lock className="w-8 h-8" /></span>
      <h3 className="text-xl font-black text-slate-700 dark:text-slate-100">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">Vùng đất này còn chìm trong sương mù. Các thầy cô đang hoàn thiện câu hỏi theo chuẩn SGK, hãy quay lại sớm nhé!</p>
      <span className="inline-block text-[11px] font-black uppercase bg-slate-700 text-white px-3 py-1 rounded-full">Đang biên soạn</span>
    </div>
  </div>
);
