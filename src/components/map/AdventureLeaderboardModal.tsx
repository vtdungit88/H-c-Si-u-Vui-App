import React, { useEffect, useState } from 'react';
import { Loader2, Trophy, X } from 'lucide-react';
import { fetchAdventureLeaderboard, type MapLeaderRow, type SubjectKey } from '../../lib/api';
import { StarIcon } from '../GameIcons';

interface Props { open: boolean; onClose: () => void; subject: SubjectKey; grade: number; label: string }

export const AdventureLeaderboardModal: React.FC<Props> = ({ open, onClose, subject, grade, label }) => {
  const [rows, setRows] = useState<MapLeaderRow[] | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    if (!open) return;
    let alive = true;
    setRows(null); setErr('');
    fetchAdventureLeaderboard(subject, grade).then((r) => alive && setRows(r)).catch(() => alive && setErr('Không tải được bảng xếp hạng.'));
    return () => { alive = false; };
  }, [open, subject, grade]);
  if (!open) return null;
  const medal = (n: number) => (n === 1 ? '🥇' : n === 2 ? '🥈' : n === 3 ? '🥉' : String(n));
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-black text-lg flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-500" /> Top 10 · {label} lớp {grade}</h2>
          <button onClick={onClose} aria-label="Đóng" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-2">
          {!rows && !err && <div className="flex items-center gap-2 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>}
          {err && <div className="text-sm text-rose-600">{err}</div>}
          {rows && rows.length === 0 && <p className="text-sm text-slate-500">Chưa có ai vượt ải ở đây. Hãy là người đầu tiên!</p>}
          {rows?.map((r) => (
            <div key={r.rank} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
              <span className="w-8 text-center font-black text-lg">{medal(r.rank)}</span>
              <span className="flex-1 font-bold truncate">{r.alias}</span>
              <span className="text-xs text-slate-500">{r.cleared} ải</span>
              <span className="inline-flex items-center gap-1 font-black text-amber-600"><StarIcon className="w-4 h-4" /> {r.stars}</span>
            </div>
          ))}
          <p className="text-[11px] text-slate-400 pt-1">Xếp theo tổng sao, rồi số ải đã vượt.</p>
        </div>
      </div>
    </div>
  );
};
