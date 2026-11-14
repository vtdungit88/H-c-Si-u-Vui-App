import React, { useCallback, useEffect, useState } from 'react';
import { Swords, Users, Zap, Medal, Loader2 } from 'lucide-react';
import type { GradeLevel, StudentProfile } from '../../types';
import { soundManager } from '../../utils/audio';
import {
  arenaLeaderboard, arenaStartBlitz, arenaStatus, arenaSubmitBlitz, arenaStartDuel, arenaSubmitDuel, arenaEloLeaderboard,
  type ArenaLeaderRow, type ArenaResult, type ArenaStart, type ArenaStatus, type DuelStart, type DuelResult, type EloLeaderRow
} from '../../lib/api';
import { BlitzEngine, type BlitzOutcome, type WrongItem } from './BlitzEngine';
import { PostMatchReview } from './PostMatchReview';
import { DuelEngine, type DuelOutcome } from './DuelEngine';
import { rankOf, nextRank } from '../../utils/arenaRank';

interface Props {
  student: StudentProfile;
  onUpdateStudent: (s: StudentProfile) => void;
  onRequireLogin?: () => void;
}

const GRADES: GradeLevel[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const gradeOf = (s: StudentProfile): GradeLevel => {
  const n = parseInt(String(s.grade).replace(/\D/g, ''), 10);
  return (n >= 1 && n <= 9 ? String(n) : '6') as GradeLevel;
};

export const ArenaHub: React.FC<Props> = ({ student, onUpdateStudent, onRequireLogin }) => {
  const [grade, setGrade] = useState<GradeLevel>(() => gradeOf(student));
  const [phase, setPhase] = useState<'hub' | 'playing' | 'duel' | 'result'>('hub');
  const [duelStart, setDuelStart] = useState<DuelStart | null>(null);
  const [duelRes, setDuelRes] = useState<DuelResult | null>(null);
  const [eloBoard, setEloBoard] = useState<EloLeaderRow[]>([]);
  const [tab, setTab] = useState<'blitz' | 'elo'>('elo');
  const [start, setStart] = useState<ArenaStart | null>(null);
  const [status, setStatus] = useState<ArenaStatus | null>(null);
  const [board, setBoard] = useState<ArenaLeaderRow[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ArenaResult | null>(null);
  const [saveError, setSaveError] = useState('');
  const [wrongItems, setWrongItems] = useState<WrongItem[]>([]);

  const refresh = useCallback(async () => {
    try {
      setBoard(await arenaLeaderboard(Number(grade)));
      setEloBoard(await arenaEloLeaderboard(Number(grade)));
      if (!student.isGuest) setStatus(await arenaStatus(Number(grade)));
    } catch { /* leaderboard is best-effort */ }
  }, [grade, student.isGuest]);
  useEffect(() => { if (phase === 'hub') void refresh(); }, [phase, refresh]);

  const begin = async () => {
    if (student.isGuest) { soundManager.play('wrong'); onRequireLogin?.(); return; }
    setBusy(true); setError('');
    try {
      const s = await arenaStartBlitz(Number(grade));
      soundManager.play('fanfare');
      setStart(s); setResult(null); setSaveError(''); setWrongItems([]); setPhase('playing');
    } catch (e) { setError(e instanceof Error ? e.message : 'Không bắt đầu được, thử lại nhé.'); }
    finally { setBusy(false); }
  };

  const beginDuel = async () => {
    if (student.isGuest) { soundManager.play('wrong'); onRequireLogin?.(); return; }
    setBusy(true); setError('');
    try {
      const d = await arenaStartDuel(Number(grade));
      soundManager.play('fanfare');
      setDuelStart(d); setDuelRes(null); setResult(null); setSaveError(''); setWrongItems([]); setPhase('duel');
    } catch (e) { setError(e instanceof Error ? e.message : 'Không bắt đầu được, thử lại nhé.'); }
    finally { setBusy(false); }
  };

  const onDuelFinish = useCallback(async (o: DuelOutcome) => {
    setWrongItems(o.wrongItems); setPhase('result');
    if (!duelStart) return;
    try {
      const r = await arenaSubmitDuel(duelStart.match_id, o.ok, o.ms);
      setDuelRes(r);
      if (r.coins > 0) onUpdateStudent({ ...student, coins: student.coins + r.coins });
    } catch (e) { setSaveError(e instanceof Error ? e.message : 'Chưa lưu được kết quả.'); }
  }, [duelStart, student, onUpdateStudent]);

  const onFinish = useCallback(async (o: BlitzOutcome) => {
    setWrongItems(o.wrongItems); setPhase('result');
    if (!start) return;
    try {
      const r = await arenaSubmitBlitz(start.match_id, o.correct, o.wrong, o.maxCombo);
      setResult(r);
      if (r.coins > 0) onUpdateStudent({ ...student, coins: student.coins + r.coins });
    } catch (e) { setSaveError(e instanceof Error ? e.message : 'Chưa lưu được kết quả.'); }
  }, [start, student, onUpdateStudent]);

  if (phase === 'playing' && start) {
    return <div className="py-4"><BlitzEngine grade={grade} seed={start.seed} duration={start.duration} onFinish={onFinish} /></div>;
  }
  if (phase === 'duel' && duelStart) {
    return <div className="py-4"><DuelEngine grade={grade} seed={duelStart.seed} limitMs={duelStart.limit_ms} plan={duelStart.plan} studentName={student.name || 'Bạn'} onFinish={onDuelFinish} /></div>;
  }
  if (phase === 'result') {
    return <div className="py-4"><PostMatchReview result={result} duel={duelRes} saveError={saveError} wrongItems={wrongItems} onAgain={() => { setPhase('hub'); void (duelStart && duelRes ? beginDuel() : begin()); }} onBack={() => setPhase('hub')} /></div>;
  }

  const dur = Number(grade) <= 2 ? 90 : 60;
  return (
    <div className="max-w-3xl mx-auto py-4 space-y-5">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-sky-600 to-cyan-500 text-white p-5 shadow-xl">
        <h2 className="text-2xl font-black flex items-center gap-2"><Swords className="w-7 h-7" /> Đấu Trường Tri Thức</h2>
        <p className="text-sm opacity-90 mt-1">Rèn phản xạ tính nhanh chuẩn sách giáo khoa. Chọn đúng khối lớp của bạn!</p>
        {status && <div className="mt-3 text-xs flex flex-wrap gap-3 font-bold">
          <span className="bg-white/20 rounded-full px-3 py-1">{rankOf(status.elo ?? 1000).icon} {rankOf(status.elo ?? 1000).name} • Elo {status.elo ?? 1000}{nextRank(status.elo ?? 1000) ? ` (còn ${nextRank(status.elo ?? 1000)!.min - (status.elo ?? 1000)} lên hạng)` : ''}</span>
          <span className="bg-white/20 rounded-full px-3 py-1">Thắng/Thua: {status.wins ?? 0}/{status.losses ?? 0}</span>
          <span className="bg-white/20 rounded-full px-3 py-1">Kỷ lục lớp {grade}: {status.best}</span>
          <span className="bg-white/20 rounded-full px-3 py-1">Lượt thưởng hôm nay: {status.rewards_left_today}/5</span>
        </div>}
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Chọn khối lớp</div>
        <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
          {GRADES.map((g) => (
            <button key={g} onClick={() => { soundManager.play('click'); setGrade(g); }} aria-pressed={g === grade}
              className={`py-2.5 rounded-2xl font-black text-lg border-2 cursor-pointer ${g === grade ? 'bg-sky-600 border-sky-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>{g}</button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <button onClick={begin} disabled={busy} className="sm:col-span-1 text-left rounded-3xl p-4 bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-lg cursor-pointer disabled:opacity-60">
          <Zap className="w-7 h-7 mb-1" />
          <div className="font-black text-lg">Siêu Tốc {dur}s</div>
          <div className="text-xs font-semibold">Trả lời thật nhanh, lập kỷ lục lớp {grade}.</div>
          <div className="mt-2 font-black text-sm flex items-center gap-1">{busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}{student.isGuest ? 'Đăng nhập để chơi' : 'Bắt đầu ▶'}</div>
        </button>
        <button onClick={beginDuel} disabled={busy} className="text-left rounded-3xl p-4 bg-rose-500 hover:bg-rose-400 text-white shadow-lg cursor-pointer disabled:opacity-60">
          <Swords className="w-7 h-7 mb-1" />
          <div className="font-black text-lg">Thách Đấu 1v1</div>
          <div className="text-xs font-semibold">10 câu đấu với VNPT Vui-Bot, thắng để lên hạng Elo.</div>
          <div className="mt-2 font-black text-sm">{student.isGuest ? 'Đăng nhập để chơi' : 'Vào đấu ▶'}</div>
        </button>
        <div className="rounded-3xl p-4 bg-slate-100 dark:bg-slate-800 text-slate-500 relative">
          <Users className="w-7 h-7 mb-1" />
          <div className="font-black text-lg">Phòng Lớp Học</div>
          <div className="text-xs">Thi đua theo mã PIN như Kahoot.</div>
          <span className="absolute top-3 right-3 text-[10px] font-black bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-100 rounded-full px-2 py-0.5">Sắp ra mắt</span>
        </div>
      </div>
      {error && <div role="alert" className="text-sm text-rose-700 bg-rose-50 rounded-xl p-3">{error}</div>}

      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex gap-2 mb-3">
          {([['elo', 'Hạng Elo 1v1'], ['blitz', 'Siêu Tốc']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} aria-pressed={tab === k} className={`px-3 py-1.5 rounded-full text-xs font-black cursor-pointer ${tab === k ? 'bg-sky-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>{l}</button>
          ))}
        </div>
        <h3 className="font-black flex items-center gap-2 mb-2"><Medal className="w-5 h-5 text-amber-500" /> Bảng vàng Lớp {grade}</h3>
        {(tab === 'elo' ? eloBoard.length : board.length) === 0 ? <p className="text-sm text-slate-500">Chưa có ai trên bảng. Hãy là người đầu tiên!</p> : (
          <ol className="space-y-1.5">
            {(tab === 'elo' ? eloBoard.map((r) => ({ rank: r.rank, alias: r.alias, v: `${rankOf(r.elo).icon} ${r.elo}` })) : board.map((r) => ({ rank: r.rank, alias: r.alias, v: String(r.score) }))).map((r) => (
              <li key={r.rank} className="flex items-center gap-3 text-sm bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
                <span className="w-6 text-center font-black">{r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : r.rank}</span>
                <span className="flex-1 font-bold truncate">{r.alias}</span>
                <span className="font-black text-sky-700 dark:text-sky-300">{r.v}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};
