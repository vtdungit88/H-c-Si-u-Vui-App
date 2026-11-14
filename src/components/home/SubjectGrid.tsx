import React, { useState } from 'react';
import { Backpack, ChevronRight, Clock, GraduationCap, Rocket } from 'lucide-react';
import {
  SUBJECTS_CATALOG,
  getSubjectLevelInfo,
  getSubjectsForLevel
} from '../../data/subjectsCatalog';
import type { SchoolLevel, SubjectMeta } from '../../types';
import { SubjectIcon } from './subjectIcons';

/** Open subjects first, subjects that are not open yet after. */
export const SORTED_SUBJECTS: SubjectMeta[] = [...SUBJECTS_CATALOG].sort(
  (a, b) => Number(b.status === 'active') - Number(a.status === 'active')
);

interface Props {
  onPick: (subject: SubjectMeta, level?: SchoolLevel) => void;
}

type LevelFilter = 'all' | SchoolLevel;

const PRIMARY_SUBJECTS = getSubjectsForLevel('primary');
const SECONDARY_SUBJECTS = getSubjectsForLevel('secondary');

/** Section 2: all subjects grouped cleanly into Tiểu học (1-5) and THCS (6-9). */
export const SubjectGrid: React.FC<Props> = ({ onPick }) => {
  const [filter, setFilter] = useState<LevelFilter>('all');

  const renderGroup = (
    level: SchoolLevel,
    title: string,
    summary: string,
    Icon: React.ComponentType<{ className?: string }>,
    accentCls: string,
    subjects: SubjectMeta[]
  ) => (
    <div key={level} className="space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${accentCls}`}>
            <Icon className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {summary}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {subjects.map((subj) => {
          const open = subj.status === 'active';
          const info = getSubjectLevelInfo(subj, level);

          return open ? (
            <button
              key={`${level}-${subj.id}`}
              type="button"
              onClick={() => onPick(subj, level)}
              className={`group relative text-left rounded-3xl p-5 text-white bg-gradient-to-br ${subj.color} shadow-lg hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] transition-all cursor-pointer overflow-hidden min-h-[11rem] flex flex-col justify-between`}
            >
              <span aria-hidden className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/15" />
              <div className="flex items-start justify-between gap-2 relative">
                <span className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur flex items-center justify-center shadow-inner">
                  <SubjectIcon name={subj.iconName} className="w-7 h-7" />
                </span>
                <span className="text-[11px] font-black uppercase bg-white text-emerald-700 px-2.5 py-1 rounded-full shadow">
                  Mở rồi
                </span>
              </div>
              <div className="relative mt-4">
                <h4 className="text-xl font-black leading-tight">{subj.name}</h4>
                {info.tagline && <p className="text-xs font-bold text-white/90 mt-0.5">{info.tagline}</p>}
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-black bg-white/25 group-hover:bg-white group-hover:text-slate-900 px-3 py-1.5 rounded-full transition-colors">
                  Học ngay <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </button>
          ) : (
            <button
              key={`${level}-${subj.id}`}
              type="button"
              onClick={() => onPick(subj, level)}
              className="group text-left rounded-3xl p-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md active:scale-[0.99] transition-all cursor-pointer min-h-[11rem] flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${subj.color} text-white opacity-85 group-hover:opacity-100 flex items-center justify-center shadow-sm transition-opacity`}>
                  <SubjectIcon name={subj.iconName} className="w-6 h-6" />
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Sắp mở
                </span>
              </div>
              <div className="mt-3 space-y-1">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                  {info.gradeRangeLabel} · Tập 1 &amp; 2
                </div>
                <h4 className="text-base font-black text-slate-800 dark:text-slate-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {subj.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {info.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section aria-labelledby="subjects-title" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 id="subjects-title" className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Rocket className="w-7 h-7 text-fuchsia-500 shrink-0" />
            <span>Chọn môn học của bạn</span>
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Đầy đủ môn học chuẩn Chương trình GDPT 2018 (NXB Giáo Dục) · Nhóm riêng Tiểu học &amp; Trung học.
          </p>
        </div>

        <div
          role="group"
          aria-label="Lọc theo cấp học"
          className="inline-flex flex-wrap items-center gap-1 p-1 rounded-2xl bg-slate-200/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 self-start md:self-auto"
        >
          {(
            [
              { id: 'all', label: 'Tất cả (2 cấp)' },
              { id: 'primary', label: 'Tiểu học (1–5)' },
              { id: 'secondary', label: 'Trung học CS (6–9)' }
            ] as const
          ).map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-8">
        {(filter === 'all' || filter === 'primary') &&
          renderGroup(
            'primary',
            'Khối Tiểu học (Lớp 1 – 5)',
            `${PRIMARY_SUBJECTS.length} môn học chuẩn NXB Giáo Dục · Toán học đang mở sẵn 27 chương (405 câu)`,
            Backpack,
            'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300',
            PRIMARY_SUBJECTS
          )}

        {(filter === 'all' || filter === 'secondary') &&
          renderGroup(
            'secondary',
            'Khối Trung học Cơ sở (Lớp 6 – 9)',
            `${SECONDARY_SUBJECTS.length} môn học chuẩn NXB Giáo Dục · Toán & Khoa học Tự nhiên đang mở 84 chương`,
            GraduationCap,
            'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300',
            SECONDARY_SUBJECTS
          )}
      </div>
    </section>
  );
};
