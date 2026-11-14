import React, { useState } from 'react';
import { ArrowLeft, BookOpen, Clock, Lock } from 'lucide-react';
import type { GradeLevel, SchoolLevel, SubjectMeta } from '../../types';
import { getGradesForSubject, getSubjectLevelInfo, SUBJECTS_CATALOG } from '../../data/subjectsCatalog';
import { SubjectIcon } from './subjectIcons';

interface Props {
  subject: SubjectMeta;
  initialLevel?: SchoolLevel;
  onBack: () => void;
  onStart: (grade: GradeLevel, term: 1 | 2) => void;
  onJumpToActive?: (subject: SubjectMeta, level: SchoolLevel) => void;
}

/** Step after choosing a subject: pick level (if shared), grade, then term (Tập). */
export const CoursePicker: React.FC<Props> = ({
  subject,
  initialLevel,
  onBack,
  onStart,
  onJumpToActive
}) => {
  const defaultLevel: SchoolLevel =
    initialLevel && subject.schoolLevels.includes(initialLevel)
      ? initialLevel
      : subject.schoolLevels[0] ?? 'primary';

  const [level, setLevel] = useState<SchoolLevel>(defaultLevel);
  const grades = getGradesForSubject(subject, level);
  const info = getSubjectLevelInfo(subject, level);

  const [grade, setGrade] = useState<GradeLevel | null>(() => {
    const firstOpen = grades.find((x) => x.term1Available || x.term2Available);
    return firstOpen?.grade ?? grades[0]?.grade ?? null;
  });

  const isOpen = (g: GradeLevel) =>
    grades.some((x) => x.grade === g && (x.term1Available || x.term2Available));
  const termOpen = (t: 1 | 2) =>
    !!grade && grades.some((x) => x.grade === grade && (t === 1 ? x.term1Available : x.term2Available));

  const selectedGradeMeta = grades.find((x) => x.grade === grade);
  const hasAnyOpenGrade = grades.some((x) => x.term1Available || x.term2Available);
  const fallbackMath = SUBJECTS_CATALOG.find((s) => s.id === 'math');

  const handleSwitchLevel = (nextLevel: SchoolLevel) => {
    setLevel(nextLevel);
    const nextGrades = getGradesForSubject(subject, nextLevel);
    const firstOpen = nextGrades.find((x) => x.term1Available || x.term2Available);
    setGrade(firstOpen?.grade ?? nextGrades[0]?.grade ?? null);
  };

  return (
    <section className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Chọn môn khác
      </button>

      <div className={`rounded-3xl p-5 sm:p-6 text-white bg-gradient-to-br ${subject.color} shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
        <div className="flex items-center gap-4">
          <span className="w-14 h-14 rounded-2xl bg-white/25 flex items-center justify-center shrink-0">
            <SubjectIcon name={subject.iconName} className="w-8 h-8" />
          </span>
          <div>
            <div className="text-xs font-bold text-white/85 uppercase tracking-wider">
              {level === 'primary' ? 'Khối Tiểu học' : 'Khối Trung học Cơ sở'} · {info.gradeRangeLabel}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">{subject.name}</h2>
            {info.tagline && <p className="text-sm font-bold text-white/90">{info.tagline}</p>}
          </div>
        </div>

        {subject.schoolLevels.length > 1 && (
          <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-black/20 self-start sm:self-center shrink-0">
            {([
              { id: 'primary', label: 'Tiểu học (1–5)' },
              { id: 'secondary', label: 'THCS (6–9)' }
            ] as const).map((lv) => (
              <button
                key={lv.id}
                type="button"
                onClick={() => handleSwitchLevel(lv.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  level === lv.id
                    ? 'bg-white text-slate-900 shadow'
                    : 'text-white/90 hover:bg-white/15'
                }`}
              >
                {lv.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">1. Bạn học lớp mấy?</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
            {grades.map(({ grade: g }) => {
              const open = isOpen(g);
              const selected = grade === g;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`relative rounded-2xl py-4 font-black text-lg transition-all cursor-pointer ${
                    selected && open
                      ? 'bg-indigo-600 text-white shadow-lg scale-105 ring-4 ring-indigo-300/50'
                      : selected && !open
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-2 border-amber-400 shadow-sm'
                        : open
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 hover:-translate-y-0.5'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200/70'
                  }`}
                >
                  <span className="block text-[10px] font-bold uppercase opacity-80">Lớp</span>
                  {g}
                  {!open && <Lock className="absolute top-2 right-2 w-3.5 h-3.5 opacity-70" />}
                </button>
              );
            })}
          </div>
        </div>

        {hasAnyOpenGrade ? (
          <div className={grade ? '' : 'opacity-50'}>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3">2. Chọn tập</h3>
            <div className="grid grid-cols-2 gap-3 max-w-md">
              {([1, 2] as const).map((t) => (
                <button
                  key={t}
                  type="button"
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
        ) : (
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 sm:p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </span>
              <div className="space-y-1">
                <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                  {subject.name} {grade ? `· Lớp ${grade}` : ''} — Đã sẵn sàng khung môn học
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedGradeMeta?.notes ? `${selectedGradeMeta.notes}. ` : ''}
                  Môn học đã được chuẩn bị sẵn theo danh mục SGK NXB Giáo Dục và sẽ mở ngay khi bộ câu hỏi được cập nhật.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {fallbackMath && onJumpToActive && (
                <button
                  type="button"
                  onClick={() => onJumpToActive(fallbackMath, level)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Học Toán {level === 'primary' ? 'Tiểu học (1–5)' : 'THCS (6–9)'} ngay</span>
                </button>
              )}
              <button
                type="button"
                onClick={onBack}
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-bold hover:bg-slate-50 cursor-pointer transition-colors"
              >
                Xem các môn khác
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
