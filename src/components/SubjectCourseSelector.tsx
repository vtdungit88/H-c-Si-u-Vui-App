import React, { useState } from 'react';
import { SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import { GradeLevel, SubjectMeta } from '../types';
import { soundManager } from '../utils/audio';
import { 
  Calculator, 
  BookMarked, 
  Atom, 
  Languages, 
  Compass, 
  Cpu, 
  Shield, 
  Wrench, 
  Lock, 
  Check, 
  Sparkles, 
  ChevronDown, 
  Layers,
  BookOpen,
  Info
} from 'lucide-react';

interface SubjectCourseSelectorProps {
  currentSubjectId: string;
  currentGrade: GradeLevel;
  currentTerm: 1 | 2;
  onSelectCourse: (subjectId: string, grade: GradeLevel, term: 1 | 2) => void;
}

export const SubjectCourseSelector: React.FC<SubjectCourseSelectorProps> = ({
  currentSubjectId,
  currentGrade,
  currentTerm,
  onSelectCourse
}) => {
  const [isOpenSubjectDrawer, setIsOpenSubjectDrawer] = useState(false);
  const [comingSoonNotice, setComingSoonNotice] = useState<{
    subjectName: string;
    grade: string;
    term: number;
    notes?: string;
  } | null>(null);

  const getSubjectIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'Calculator': return <Calculator className={className} />;
      case 'BookMarked': return <BookMarked className={className} />;
      case 'Atom': return <Atom className={className} />;
      case 'Languages': return <Languages className={className} />;
      case 'Compass': return <Compass className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Shield': return <Shield className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  const activeSubject = SUBJECTS_CATALOG.find((s) => s.id === currentSubjectId) || SUBJECTS_CATALOG[0];

  const handleSubjectClick = (subj: SubjectMeta) => {
    soundManager.play('click');
    if (subj.id === 'math') {
      onSelectCourse('math', '6', 1);
      setIsOpenSubjectDrawer(false);
    } else {
      setComingSoonNotice({
        subjectName: subj.name,
        grade: 'Lớp 6',
        term: 1,
        notes: subj.description
      });
    }
  };

  const handleGradeClick = (grade: GradeLevel) => {
    soundManager.play('click');
    if (currentSubjectId === 'math' && grade === '6') {
      onSelectCourse('math', '6', currentTerm);
    } else {
      setComingSoonNotice({
        subjectName: activeSubject.name,
        grade: `Lớp ${grade}`,
        term: currentTerm,
        notes: 'Chương trình đang được thầy cô biên soạn mở rộng sau Toán 6!'
      });
    }
  };

  const handleTermClick = (term: 1 | 2) => {
    soundManager.play('click');
    if (currentSubjectId === 'math' && currentGrade === '6' && term === 1) {
      onSelectCourse('math', '6', 1);
    } else {
      setComingSoonNotice({
        subjectName: activeSubject.name,
        grade: `Lớp ${currentGrade}`,
        term,
        notes: 'Học kỳ 2 đang được hoàn thiện câu đố vui nhộn, bạn hãy tiếp tục hoàn thành Tập 1 nhé!'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Subject Bar + Grade & Term Segmented Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Active Subject Selector Button */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => {
                soundManager.play('click');
                setIsOpenSubjectDrawer(!isOpenSubjectDrawer);
              }}
              className="w-full md:w-auto flex items-center justify-between gap-3 px-4 py-2.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 rounded-2xl text-slate-900 dark:text-white transition-all cursor-pointer shadow-sm group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                  {getSubjectIcon(activeSubject.iconName, 'w-4 h-4')}
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                    Môn Học Đang Chọn
                  </div>
                  <div className="text-sm font-black flex items-center gap-1.5">
                    <span>{activeSubject.name}</span>
                    <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 py-0.2 rounded">
                      Đang Mở
                    </span>
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-blue-600 transition-transform ${isOpenSubjectDrawer ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right: Grade & Term Controls */}
        <div className="flex items-center flex-wrap gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Grade Selector (Lớp 6, 7, 8, 9) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            {(['6', '7', '8', '9'] as GradeLevel[]).map((g) => {
              const isSelected = currentGrade === g;
              const isAvailable = g === '6';

              return (
                <button
                  key={g}
                  onClick={() => handleGradeClick(g)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span>Lớp {g}</span>
                  {!isAvailable && <Lock className="w-2.5 h-2.5 text-slate-400" />}
                </button>
              );
            })}
          </div>

          {/* Term Selector (Tập 1, Tập 2) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => handleTermClick(1)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                currentTerm === 1
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>Tập 1</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </button>

            <button
              onClick={() => handleTermClick(2)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                currentTerm === 2
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span>Tập 2</span>
              <Lock className="w-2.5 h-2.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Subjects Catalog Drawer */}
      {isOpenSubjectDrawer && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Danh Mục Toàn Bộ Môn Học SGK THCS</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Môn Toán Lớp 6 Tập 1 đang mở đầy đủ. Các môn học khác sẽ được cập nhật dần theo kế hoạch mở rộng!
              </p>
            </div>
            <button
              onClick={() => setIsOpenSubjectDrawer(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Thu gọn
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {SUBJECTS_CATALOG.map((subj) => {
              const isActive = subj.id === currentSubjectId;
              const isReady = subj.status === 'active';

              return (
                <div
                  key={subj.id}
                  onClick={() => handleSubjectClick(subj)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm'
                      : isReady
                      ? 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:border-blue-400'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 opacity-90'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${subj.color} text-white flex items-center justify-center shadow-sm`}>
                      {getSubjectIcon(subj.iconName, 'w-4 h-4')}
                    </div>
                    {isReady ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        Sẵn Sàng
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Sắp Ra Mắt
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {subj.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                      {subj.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Coming Soon Friendly Notice Modal */}
      {comingSoonNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full">
                Đang Biên Soạn • Mở Rộng Sắp Tới
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                {comingSoonNotice.subjectName} - {comingSoonNotice.grade} (Tập {comingSoonNotice.term})
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Thầy cô đang tăng tốc chấm bút chuẩn bị ngân hàng câu đố siêu vui nhộn cho môn học này! Mục tiêu của nền tảng là mở rộng đầy đủ các môn THCS.
              </p>
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl text-xs text-blue-700 dark:text-blue-300 font-semibold">
                💡 Hiện tại môn <strong>Toán 6 Tập 1</strong> đã sẵn sàng 100%. Bạn hãy tiếp tục vượt ải kiếm thật nhiều Xu và Sao nhé!
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  soundManager.play('click');
                  setComingSoonNotice(null);
                  onSelectCourse('math', '6', 1);
                }}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Vào Học Toán 6 Tập 1 Ngay
              </button>
              <button
                onClick={() => {
                  soundManager.play('click');
                  setComingSoonNotice(null);
                }}
                className="py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
