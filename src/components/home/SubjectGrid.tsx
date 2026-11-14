import React from 'react';
import { ChevronRight, Lock, Rocket } from 'lucide-react';
import { SUBJECTS_CATALOG } from '../../data/subjectsCatalog';
import type { SubjectMeta } from '../../types';
import { SubjectIcon } from './subjectIcons';

/** Open subjects first, subjects that are not open yet after. */
export const SORTED_SUBJECTS: SubjectMeta[] = [...SUBJECTS_CATALOG].sort(
  (a, b) => Number(b.status === 'active') - Number(a.status === 'active')
);

interface Props { onPick: (subject: SubjectMeta) => void }

/** Section 2: all subjects. */
export const SubjectGrid: React.FC<Props> = ({ onPick }) => (
  <section aria-labelledby="subjects-title" className="space-y-4">
    <div>
      <h2 id="subjects-title" className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
        <Rocket className="w-7 h-7 text-fuchsia-500" /> Chọn môn học của bạn
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bấm vào một môn đang mở để chọn lớp và bắt đầu làm bài.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {SORTED_SUBJECTS.map((subj) => {
        const open = subj.status === 'active';
        return open ? (
          <button
            key={subj.id}
            onClick={() => onPick(subj)}
            className={`group relative text-left rounded-3xl p-5 text-white bg-gradient-to-br ${subj.color} shadow-lg hover:shadow-2xl hover:-translate-y-1.5 active:scale-[0.98] transition-all cursor-pointer overflow-hidden min-h-[11rem] flex flex-col justify-between`}
          >
            <span aria-hidden className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/15" />
            <div className="flex items-start justify-between gap-2 relative">
              <span className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur flex items-center justify-center shadow-inner"><SubjectIcon name={subj.iconName} className="w-7 h-7" /></span>
              <span className="text-[10px] font-black uppercase bg-white text-emerald-700 px-2.5 py-1 rounded-full shadow">🔥 Mở rồi!</span>
            </div>
            <div className="relative mt-4">
              <h3 className="text-xl font-black leading-tight">{subj.name}</h3>
              {subj.tagline && <p className="text-xs font-bold text-white/90 mt-0.5">{subj.tagline}</p>}
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-black bg-white/25 group-hover:bg-white group-hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">
                Học ngay <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </button>
        ) : (
          <div key={subj.id} aria-disabled="true" className="relative rounded-3xl p-5 bg-slate-100 dark:bg-slate-800/60 border border-dashed border-slate-300 dark:border-slate-700 min-h-[11rem] flex flex-col justify-between select-none">
            <div className="flex items-start justify-between gap-2">
              <span className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center"><SubjectIcon name={subj.iconName} className="w-7 h-7" /></span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 inline-flex items-center gap-1 bg-white/70 dark:bg-slate-900/60 px-2.5 py-1 rounded-full"><Lock className="w-3 h-3" /> Sắp ra mắt</span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-black text-slate-500 dark:text-slate-400">{subj.name}</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mt-0.5">{subj.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
);
