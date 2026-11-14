import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import type { GradeLevel, SubjectMeta } from '../../types';
import { SubjectIcon } from './subjectIcons';

interface Props {
  subject: SubjectMeta;
  onBack: () => void;
  onStart: (grade: GradeLevel, term: 1 | 2) => void;
}

/** Step after choosing a subject: pick the grade, then the term (Tập). */
export const CoursePicker: React.FC<Props> = ({ subject, onBack, onStart }) => {
  const [grade, setGrade] = useState<GradeLevel | null>(null);
  const isOpen = (g: GradeLevel) => subject.availableGrades.some((x) => x.grade === g && (x.term1Available || x.term2Available));
  const termOpen = (t: 1 | 2) => !!grade && subject.availableGrades.some((x) => x.grade === grade && (t === 1 ? x.term1Available : x.term2Available));

  return (
    <section className="space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Chọn môn khác
      </button>

      <div className={`rounded-3xl p-5 sm:p-6 text-white bg-gradient-to-br ${subject.color} shadow-lg flex items-center gap-4`}>
        <span className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center shrink-0"><SubjectIcon name={subject.iconName} className="w-8 h-8" /></span>
        <div>
          <h2 className="text-2xl sm:text-3xl font-black">{subject.name}</h2>
          {subject.tagline && <p className="text-sm font-bold text-white/90">{subject.tagline}</p>}
        </div>
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">1. Bạn học lớp mấy?</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2.5">
            {subject.availableGrades.map(({ grade: g }) => {
              const open = isOpen(g);
              const selected = grade === g;
              return (
                <button
                  key={g}
                  disabled={!open}
                  onClick={() => setGrade(g)}
                  className={`relative rounded-2xl py-4 font-black text-lg transition-all ${
                    selected ? 'bg-indigo-600 text-white shadow-lg scale-105 ring-4 ring-indigo-300/50'
                    : open ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 hover:-translate-y-0.5 cursor-pointer'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span className="block text-[10px] font-bold uppercase opacity-80">Lớp</span>
                  {g}
                  {!open && <Lock className="absolute top-1.5 right-1.5 w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className={grade ? '' : 'opacity-50'}>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">2. Chọn tập</h3>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {([1, 2] as const).map((t) => (
              <button
                key={t}
                disabled={!termOpen(t)}
                onClick={() => grade && onStart(grade, t)}
                className="rounded-2xl py-4 font-black text-lg bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 disabled:from-slate-200 disabled:to-slate-200 dark:disabled:from-slate-800 dark:disabled:to-slate-800 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Tập {t} →
              </button>
            ))}
          </div>
          {!grade && <p className="text-xs text-slate-500 mt-2">Hãy chọn lớp trước nhé.</p>}
        </div>
      </div>
    </section>
  );
};
