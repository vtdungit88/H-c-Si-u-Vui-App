import React from 'react';
import { Compass, Map as MapIcon } from 'lucide-react';

/** Section 3: placeholder for the expedition map (being designed by the team). */
export const MapTeaser: React.FC = () => (
  <section aria-labelledby="map-title" className="relative overflow-hidden rounded-3xl border-2 border-dashed border-emerald-300 dark:border-emerald-800 bg-gradient-to-br from-emerald-50 to-sky-50 dark:from-emerald-950/30 dark:to-sky-950/30 p-6 sm:p-8 text-center">
    <div aria-hidden className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-emerald-200/40 blur-2xl" />
    <div className="relative flex flex-col items-center gap-3">
      <span className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow flex items-center justify-center text-emerald-600"><MapIcon className="w-9 h-9" /></span>
      <h2 id="map-title" className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2"><Compass className="w-6 h-6 text-emerald-600" /> Bản Đồ Thám Hiểm</h2>
      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">Hành trình vượt ải khám phá các hòn đảo kiến thức đang được chuẩn bị. Hãy quay lại sớm nhé!</p>
      <span className="text-[11px] font-black uppercase bg-emerald-600 text-white px-3 py-1 rounded-full">Sắp mở</span>
    </div>
  </section>
);
