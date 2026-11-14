import React from 'react';
import { Lock } from 'lucide-react';
import { SUBJECTS_CATALOG } from '../../data/subjectsCatalog';
import { SORTED_SUBJECTS } from '../home/SubjectGrid';
import { SubjectIcon } from '../home/subjectIcons';

interface Props {
  subjectId: string;
  grade: number;
  onChange: (subjectId: string, grade: number) => void;
}

const PRIMARY = [1, 2, 3, 4, 5];
const SECONDARY = [6, 7, 8, 9];

/** Header HUD: school level, grade, subject. */
export const MapHUD: React.FC<Props> = ({ subjectId, grade, onChange }) => {
  const level: 'primary' | 'secondary' = grade <= 5 ? 'primary' : 'secondary';
  const grades = level === 'primary' ? PRIMARY : SECONDARY;
  const subj = SUBJECTS_CATALOG.find((s) => s.id === subjectId);
  const gradeOpen = (g: number) => !!subj?.availableGrades.some((x) => x.grade === String(g) && (x.term1Available || x.term2Available));
  const chip = (active: boolean) => `px-3 py-1.5 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${active ? 'bg-white text-teal-700 shadow' : 'bg-white/15 text-white hover:bg-white/25'}`;

  return (
    <div className="space-y-2.5">
      <div className="flex gap-2 flex-wrap">
        {([['primary', 'Tiểu học (1–5)', 1], ['secondary', 'THCS (6–9)', 6]] as const).map(([k, label, g]) => (
          <button key={k} className={chip(level === k)} onClick={() => level !== k && onChange(subjectId, g)}>{label}</button>
        ))}
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Khối lớp">
        {grades.map((g) => (
          <button key={g} className={`${chip(grade === g)} ${gradeOpen(g) ? '' : 'opacity-70'}`} onClick={() => onChange(subjectId, g)}>
            Lớp {g}{!gradeOpen(g) && <Lock className="inline w-3 h-3 ml-1" />}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Môn học">
        {SORTED_SUBJECTS.map((s) => (
          <button key={s.id} className={`${chip(subjectId === s.id)} inline-flex items-center gap-1.5`} onClick={() => onChange(s.id, grade)}>
            <SubjectIcon name={s.iconName} className="w-4 h-4" /> {s.name}{s.status !== 'active' && <Lock className="w-3 h-3" />}
          </button>
        ))}
      </div>
    </div>
  );
};
