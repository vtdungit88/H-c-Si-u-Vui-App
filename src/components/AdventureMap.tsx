import React, { useEffect, useMemo, useState } from 'react';
import { Castle, Crown, Loader2, Lock, Play, Trophy, X } from 'lucide-react';
import type { StudentProfile } from '../types';
import { SUBJECTS_CATALOG } from '../data/subjectsCatalog';
import { APP_LOGO_SRC } from '../data/versionHistory';
import { fetchCurriculum, fetchMapProgress, type Curriculum, type DbLesson, type NodeProgress, type SubjectKey } from '../lib/api';
import { soundManager } from '../utils/audio';
import { AvatarRenderer } from './AvatarRenderer';
import { StarIcon } from './GameIcons';
import { MapHUD } from './map/MapHUD';
import { FogOfWar } from './map/FogOfWar';
import { AdventureLeaderboardModal } from './map/AdventureLeaderboardModal';

interface Props {
  student: StudentProfile;
  initialSubjectId: string;
  initialGrade: number;
  onStartNode: (subjectId: string, grade: number, lessonCode: string) => void;
  onRequireLogin?: () => void;
}

interface MapNode {
  lesson: DbLesson;
  index: number;
  title: string;
  kind: 'normal' | 'mini_boss' | 'boss';
  progress?: NodeProgress;
  unlocked: boolean;
}

const W = 600;
const STEP = 124;
const TOP = 90;
const XS = [150, 300, 450, 300];
const pos = (i: number) => ({ x: XS[i % 4], y: TOP + i * STEP });

const MASCOT_FALLBACK = 'Bấm vào hòn đảo đang sáng để bắt đầu nhé!';

export const AdventureMap: React.FC<Props> = ({ student, initialSubjectId, initialGrade, onStartNode, onRequireLogin }) => {
  const [subjectId, setSubjectId] = useState(initialSubjectId);
  const [grade, setGrade] = useState(initialGrade);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [loadError, setLoadError] = useState('');
  const [progress, setProgress] = useState<Record<string, NodeProgress>>({});
  const [selected, setSelected] = useState<number | null>(null);
  const [showBoard, setShowBoard] = useState(false);

  const subject = SUBJECTS_CATALOG.find((s) => s.id === subjectId);
  const gradeOpen = !!subject && subject.status === 'active' && subject.availableGrades.some((x) => x.grade === String(grade) && (x.term1Available || x.term2Available));
  const subjectKey: SubjectKey | null = subjectId === 'math' ? 'math' : subjectId === 'science' ? 'science' : null;

  useEffect(() => {
    let alive = true;
    setCurriculum(null); setLoadError(''); setSelected(null);
    if (!gradeOpen || !subjectKey) return () => { alive = false; };
    fetchCurriculum(subjectKey, grade).then((c) => alive && setCurriculum(c)).catch((e) => alive && setLoadError(String(e.message || e)));
    return () => { alive = false; };
  }, [gradeOpen, subjectKey, grade]);

  useEffect(() => {
    let alive = true;
    if (student.isGuest) { setProgress({}); return; }
    fetchMapProgress(student.id).then((p) => alive && setProgress(p)).catch(() => undefined);
    return () => { alive = false; };
  }, [student.id, student.isGuest]);

  const nodes: MapNode[] = useMemo(() => {
    if (!curriculum) return [];
    const chapterOf = new Map(curriculum.chapters.map((c) => [c.id, c] as const));
    const lessons = curriculum.lessons
      .filter((l) => chapterOf.has(l.chapter_id))
      .sort((a, b) => chapterOf.get(a.chapter_id)!.sequence_no - chapterOf.get(b.chapter_id)!.sequence_no || a.sequence_no - b.sequence_no);
    return lessons.map((lesson, i) => {
      const prev = i > 0 ? progress[lessons[i - 1].id] : undefined;
      const last = i === lessons.length - 1;
      return {
        lesson, index: i,
        title: chapterOf.get(lesson.chapter_id)!.title,
        kind: last && lessons.length > 3 ? 'boss' : (i + 1) % 4 === 0 ? 'mini_boss' : 'normal',
        progress: progress[lesson.id],
        unlocked: i === 0 || (prev?.stars ?? 0) >= 1
      } satisfies MapNode;
    });
  }, [curriculum, progress]);

  const currentIdx = useMemo(() => {
    const i = nodes.findIndex((n) => n.unlocked && (n.progress?.stars ?? 0) < 1);
    return i === -1 ? Math.max(0, nodes.length - 1) : i;
  }, [nodes]);

  const totalStars = nodes.reduce((a, n) => a + (n.progress?.stars ?? 0), 0);
  const cleared = nodes.filter((n) => (n.progress?.stars ?? 0) >= 1).length;

  const mascotText = useMemo(() => {
    if (!nodes.length) return MASCOT_FALLBACK;
    if (student.isGuest) return 'Hãy tạo biệt danh để lưu sao và mở các ải tiếp theo nhé!';
    if (cleared === nodes.length) return 'Tuyệt vời! Bạn đã phá đảo cả vùng đất này rồi! 🎉';
    const nextBoss = nodes.findIndex((n, i) => i >= currentIdx && n.kind !== 'normal');
    if (nextBoss > currentIdx) return `Cố lên! Còn ${nextBoss - currentIdx} ải nữa là tới ${nodes[nextBoss].kind === 'boss' ? 'hòn đảo Trùm Cuối' : 'đảo Kho Báu Giữa Chặng'} rồi!`;
    if (cleared === 0) return 'Bắt đầu từ Ải 1 nhé! Đạt từ 1 sao là mở ải tiếp theo.';
    return 'Đạt 3 sao để lấy điểm tuyệt đối. Bạn làm được mà!';
  }, [nodes, currentIdx, cleared, student.isGuest]);

  const H = TOP * 2 + Math.max(0, nodes.length - 1) * STEP;
  const pathD = useMemo(() => {
    if (nodes.length < 2) return '';
    let d = `M ${pos(0).x} ${pos(0).y}`;
    for (let i = 1; i < nodes.length; i++) {
      const a = pos(i - 1), b = pos(i);
      d += ` C ${a.x} ${a.y + STEP / 2}, ${b.x} ${b.y - STEP / 2}, ${b.x} ${b.y}`;
    }
    return d;
  }, [nodes.length]);

  const sel = selected !== null ? nodes[selected] : null;
  const starsRow = (n: number, cls = 'w-5 h-5') => (
    <span className="inline-flex gap-0.5">{[1, 2, 3].map((k) => <StarIcon key={k} className={`${cls} ${k <= n ? '' : 'opacity-25 grayscale'}`} />)}</span>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <header className="rounded-3xl p-5 text-white shadow-xl bg-gradient-to-br from-cyan-600 via-sky-600 to-indigo-600 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">Bản Đồ Thám Hiểm</h1>
            <p className="text-sm text-white/85">Vượt từng hòn đảo kiến thức, gom sao và leo bảng vàng!</p>
          </div>
          {subjectKey && gradeOpen && (
            <button onClick={() => { soundManager.play('click'); setShowBoard(true); }} className="shrink-0 px-3 py-2 rounded-xl bg-amber-300 text-slate-900 font-black text-sm inline-flex items-center gap-1.5 hover:scale-105 transition-transform cursor-pointer">
              <Trophy className="w-4 h-4" /> Top 10
            </button>
          )}
        </div>
        <MapHUD subjectId={subjectId} grade={grade} onChange={(s, g) => { soundManager.play('click'); setSubjectId(s); setGrade(g); }} />
      </header>

      {!gradeOpen ? (
        <FogOfWar title={`${subject?.name ?? 'Môn này'} · Lớp ${grade}`} />
      ) : loadError ? (
        <div className="p-4 rounded-2xl bg-rose-50 text-rose-700 text-sm">Không tải được bản đồ: {loadError}</div>
      ) : !curriculum ? (
        <div className="flex items-center justify-center gap-2 py-16 text-slate-500"><Loader2 className="w-5 h-5 animate-spin" /> Đang vẽ bản đồ…</div>
      ) : (
        <>
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <img src={APP_LOGO_SRC} alt="Linh vật Bé Siêu Vui" className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-slate-200" />
            <div className="relative flex-1 text-sm font-semibold bg-sky-50 dark:bg-slate-800 rounded-2xl px-3 py-2">{mascotText}</div>
            <div className="text-right shrink-0 text-xs font-bold text-slate-500">
              <div className="inline-flex items-center gap-1 text-amber-600 text-sm"><StarIcon className="w-4 h-4" /> {totalStars}/{nodes.length * 3}</div>
              <div>{cleared}/{nodes.length} ải</div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-sky-200 via-sky-100 to-emerald-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900 border border-sky-200 dark:border-slate-800" style={{ aspectRatio: `${W} / ${H}` }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 w-full h-full" aria-hidden>
              <path d={pathD} fill="none" stroke="#ffffff" strokeOpacity="0.9" strokeWidth="16" strokeLinecap="round" />
              <path d={pathD} fill="none" stroke="#0ea5e9" strokeOpacity="0.55" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 12" />
            </svg>

            {nodes.map((n) => {
              const { x, y } = pos(n.index);
              const stars = n.progress?.stars ?? 0;
              const isCurrent = n.index === currentIdx && n.unlocked;
              const base = n.kind === 'boss' ? 'from-amber-400 to-orange-500' : n.kind === 'mini_boss' ? 'from-fuchsia-400 to-purple-500' : stars >= 1 ? 'from-emerald-400 to-teal-500' : 'from-sky-400 to-blue-500';
              return (
                <div key={n.lesson.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}>
                  {isCurrent && !student.isGuest && (
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 pointer-events-none" aria-hidden><div className="scale-[0.5] origin-bottom"><AvatarRenderer config={student.avatarConfig} size="sm" showVehicle={false} showTech={false} showPet={false} /></div></div>
                  )}
                  <button
                    onClick={() => { soundManager.play('click'); setSelected(n.index); }}
                    aria-label={`Ải ${n.index + 1}: ${n.title}${n.unlocked ? '' : ' (chưa mở)'}`}
                    className={`relative w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] rounded-full flex items-center justify-center text-white font-black text-xl shadow-lg border-4 border-white transition-transform hover:scale-110 cursor-pointer ${n.unlocked ? `bg-gradient-to-br ${base}` : 'bg-slate-400 dark:bg-slate-600'} ${isCurrent ? 'animate-pulse ring-4 ring-amber-300' : ''}`}
                  >
                    {!n.unlocked ? <Lock className="w-6 h-6" /> : n.kind === 'boss' ? <Crown className="w-7 h-7" /> : n.kind === 'mini_boss' ? <Castle className="w-7 h-7" /> : n.index + 1}
                  </button>
                  {n.unlocked && <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1">{starsRow(stars, 'w-4 h-4')}</div>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {sel && (
        <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-slate-900/50 p-0 sm:p-4" role="dialog" aria-modal="true">
          <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 space-y-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wide text-sky-600">
                  Ải {sel.index + 1}{sel.kind === 'boss' ? ' · Trùm cuối' : sel.kind === 'mini_boss' ? ' · Kho báu giữa chặng' : ''}
                </span>
                <h2 className="text-xl font-black leading-snug">{sel.title}</h2>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Đóng" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {starsRow(sel.progress?.stars ?? 0, 'w-6 h-6')}
              {sel.progress && <span className="text-slate-500">Tốt nhất {sel.progress.bestCorrect}/{sel.progress.total} · {sel.progress.attempts} lượt</span>}
            </div>
            {!!sel.lesson.learning_material.concepts?.length && (
              <p className="text-sm text-slate-600 dark:text-slate-300">💡 {sel.lesson.learning_material.concepts.slice(0, 3).join(' · ')}</p>
            )}
            <p className="text-xs text-slate-500">15 câu trộn mọi mức độ, 60 giây mỗi câu. Đúng từ 60% được 1 sao, 80% được 2 sao, 100% được 3 sao.</p>
            {sel.unlocked ? (
              <button
                onClick={() => {
                  if (student.isGuest) { onRequireLogin?.(); return; }
                  soundManager.play('click');
                  onStartNode(subjectId, grade, sel.lesson.code);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black inline-flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
              >
                <Play className="w-5 h-5" /> {student.isGuest ? 'Đăng ký để vào ải' : sel.progress ? 'Chơi lại' : 'Vào ải'}
              </button>
            ) : (
              <div className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-sm font-bold text-center">🔒 Đạt ít nhất 1 sao ở ải trước để mở</div>
            )}
          </div>
        </div>
      )}

      {subjectKey && (
        <AdventureLeaderboardModal open={showBoard} onClose={() => setShowBoard(false)} subject={subjectKey} grade={grade} label={subject?.name ?? ''} />
      )}
    </div>
  );
};
