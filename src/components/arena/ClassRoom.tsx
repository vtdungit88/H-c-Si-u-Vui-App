import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Crown, Loader2, Play, Users } from 'lucide-react';
import type { GradeLevel, StudentProfile } from '../../types';
import { soundManager } from '../../utils/audio';
import { roomCreate, roomEnd, roomJoin, roomState, roomStart, roomSubmit, type RoomPlayer, type RoomState } from '../../lib/api';
import { DuelEngine, type DuelOutcome } from './DuelEngine';

interface Props { student: StudentProfile; defaultGrade: GradeLevel; onBack: () => void }

const Board: React.FC<{ players: RoomPlayer[]; showScore: boolean }> = ({ players, showScore }) => (
  <ol className="space-y-1.5">
    {players.map((p, i) => (
      <li key={i} className={`flex items-center gap-3 text-sm rounded-xl px-3 py-2 ${p.me ? 'bg-sky-100 dark:bg-sky-950 ring-2 ring-sky-400' : 'bg-slate-50 dark:bg-slate-800'}`}>
        <span className="w-7 text-center font-black">{showScore && p.done ? (i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1) : '•'}</span>
        <span className="flex-1 font-bold truncate">{p.alias}{p.me ? ' (bạn)' : ''}</span>
        <span className="font-black text-sky-700 dark:text-sky-300">{p.done ? (showScore ? `${p.score} đ · ${p.correct}/10` : 'Đã nộp') : '…'}</span>
      </li>
    ))}
  </ol>
);

/** Kahoot-style classroom room: host shares a 6-digit PIN; everyone plays the same seeded deck. */
export const ClassRoom: React.FC<Props> = ({ student, defaultGrade, onBack }) => {
  const [pin, setPin] = useState('');
  const [grade, setGrade] = useState<GradeLevel>(defaultGrade);
  const [state, setState] = useState<RoomState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submitted = useRef(false);
  const activePin = useRef('');

  const poll = useCallback(async () => {
    if (!activePin.current) return;
    try { setState(await roomState(activePin.current)); } catch (e) { setError(e instanceof Error ? e.message : ''); }
  }, []);
  useEffect(() => {
    if (!state) return;
    const t = window.setInterval(() => void poll(), state.status === 'finished' ? 6000 : 2000);
    return () => window.clearInterval(t);
  }, [state?.status, poll]); // eslint-disable-line react-hooks/exhaustive-deps

  const enter = async (p: string) => {
    activePin.current = p; submitted.current = false;
    setState(await roomState(p));
  };
  const create = async () => {
    setBusy(true); setError('');
    try { const r = await roomCreate(Number(grade)); await roomJoin(r.pin); await enter(r.pin); soundManager.play('fanfare'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Không tạo được phòng.'); }
    finally { setBusy(false); }
  };
  const join = async () => {
    if (!/^\d{6}$/.test(pin.trim())) { setError('Mã PIN gồm 6 chữ số.'); return; }
    setBusy(true); setError('');
    try { const r = await roomJoin(pin.trim()); await enter(r.pin); soundManager.play('click'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Không vào được phòng.'); }
    finally { setBusy(false); }
  };
  const start = async () => {
    if (!state) return;
    setBusy(true); setError('');
    try { await roomStart(state.room_id); soundManager.play('fanfare'); await poll(); } catch (e) { setError(e instanceof Error ? e.message : ''); }
    finally { setBusy(false); }
  };
  const end = async () => { if (state) { try { await roomEnd(state.room_id); await poll(); } catch (e) { setError(e instanceof Error ? e.message : ''); } } };
  const leave = () => { activePin.current = ''; setState(null); setError(''); };

  const onFinish = useCallback(async (o: DuelOutcome) => {
    if (!state || submitted.current) return;
    submitted.current = true; setSubmitting(true);
    try { await roomSubmit(state.room_id, o.ok, o.ms); } catch (e) { setError(e instanceof Error ? e.message : 'Chưa nộp được bài.'); }
    setSubmitting(false); await poll();
  }, [state, poll]);

  const header = (
    <button onClick={state ? leave : onBack} className="mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 dark:text-slate-300 cursor-pointer"><ArrowLeft className="w-4 h-4" /> {state ? 'Rời phòng' : 'Về sảnh'}</button>
  );
  const err = error && <div role="alert" className="text-sm text-rose-700 bg-rose-50 rounded-xl p-3 my-3">{error}</div>;

  // ---- entry ----
  if (!state) return (
    <div className="max-w-xl mx-auto py-4">
      {header}
      <div className="rounded-3xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white p-5 shadow-xl mb-4">
        <h2 className="text-2xl font-black flex items-center gap-2"><Users className="w-7 h-7" /> Phòng Lớp Học</h2>
        <p className="text-sm opacity-90 mt-1">Cả lớp cùng làm một bộ 10 câu, thi đua xem ai nhanh và đúng nhất!</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
          <div className="font-black mb-2">Mình là học sinh</div>
          <input inputMode="numeric" maxLength={6} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="Nhập mã PIN 6 số"
            className="w-full text-center text-2xl font-black tracking-widest px-3 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800" aria-label="Mã PIN" />
          <button onClick={join} disabled={busy} className="mt-3 w-full py-3 rounded-2xl bg-sky-600 text-white font-black cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2">{busy && <Loader2 className="w-4 h-4 animate-spin" />} Vào phòng</button>
        </div>
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
          <div className="font-black mb-2">Mình là thầy/cô (tạo phòng)</div>
          <label className="text-xs font-bold text-slate-500" htmlFor="room-grade">Khối lớp của đề</label>
          <select id="room-grade" value={grade} onChange={(e) => setGrade(e.target.value as GradeLevel)} className="w-full mt-1 px-3 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold">
            {(['1', '2', '3', '4', '5', '6', '7', '8', '9'] as GradeLevel[]).map((g) => <option key={g} value={g}>Lớp {g}</option>)}
          </select>
          <button onClick={create} disabled={busy} className="mt-3 w-full py-3 rounded-2xl bg-fuchsia-600 text-white font-black cursor-pointer disabled:opacity-60">Tạo phòng mới</button>
        </div>
      </div>
      {err}
      <p className="text-xs text-slate-500 mt-3">Phòng giữ trong 4 giờ, tối đa 60 bạn. Chỉ hiển thị biệt danh, không có tin nhắn.</p>
    </div>
  );

  // ---- playing (student, not done) ----
  if (state.status === 'playing' && !state.is_host && !state.me_done && state.seed !== null) {
    return <div className="py-4"><DuelEngine grade={String(state.grade) as GradeLevel} seed={state.seed} limitMs={state.limit_ms} studentName={student.name || 'Bạn'} onFinish={onFinish} /></div>;
  }

  const doneCount = state.players.filter((p) => p.done).length;
  const showScores = state.status === 'finished' || state.me_done || state.is_host;
  return (
    <div className="max-w-xl mx-auto py-4">
      {header}
      <div className="rounded-3xl bg-gradient-to-br from-fuchsia-600 to-indigo-600 text-white p-5 shadow-xl text-center mb-4">
        <div className="text-xs font-bold opacity-80">Mã PIN phòng • Lớp {state.grade}</div>
        <div className="text-5xl font-black tracking-[0.3em] my-1">{state.pin}</div>
        <div className="text-sm font-bold">{state.status === 'lobby' ? 'Đang chờ các bạn vào…' : state.status === 'playing' ? `Đang thi: ${doneCount}/${state.players.length} bạn đã nộp bài` : 'Phòng đã kết thúc'}</div>
      </div>
      {state.status === 'lobby' && state.is_host && (
        <button onClick={start} disabled={busy || state.players.length < 1} className="w-full mb-3 py-3.5 rounded-2xl bg-emerald-500 text-white font-black text-lg cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"><Play className="w-5 h-5" /> Bắt đầu ({state.players.length} bạn)</button>
      )}
      {state.status === 'lobby' && !state.is_host && <p className="text-center font-bold text-slate-600 dark:text-slate-300 mb-3">Bạn đã vào phòng! Chờ thầy/cô bấm bắt đầu nhé…</p>}
      {state.status === 'playing' && state.me_done && !state.is_host && <p className="text-center font-bold text-emerald-700 mb-3">{submitting ? 'Đang nộp bài…' : 'Bạn đã nộp bài! Chờ các bạn khác một chút nhé.'}</p>}
      {state.is_host && state.status !== 'finished' && state.status === 'playing' && (
        <button onClick={end} className="w-full mb-3 py-2.5 rounded-2xl bg-rose-500 text-white font-black cursor-pointer">Kết thúc phòng</button>
      )}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
        <h3 className="font-black flex items-center gap-2 mb-2"><Crown className="w-5 h-5 text-amber-500" /> {state.status === 'lobby' ? `Người chơi (${state.players.length})` : 'Bảng điểm'}</h3>
        {state.players.length === 0 ? <p className="text-sm text-slate-500">Chưa có bạn nào vào phòng.</p> : <Board players={state.players} showScore={showScores && state.status !== 'lobby'} />}
      </div>
      {err}
    </div>
  );
};
