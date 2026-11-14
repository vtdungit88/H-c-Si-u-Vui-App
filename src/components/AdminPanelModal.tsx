import React, { useCallback, useEffect, useState } from 'react';
import { ShieldCheck, X, Users, BarChart3, KeyRound, Loader2, RefreshCw, Eye } from 'lucide-react';
import { adminOverview, adminResetPassword, type AdminOverview } from '../lib/api';

interface Props { isOpen: boolean; onClose: () => void }

/** Real admin panel. Data comes from the admin_overview RPC, which the server only answers for platform_admin. */
export const AdminPanelModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setData(await adminOverview()); } catch (e) { setError(e instanceof Error ? e.message : 'Không tải được dữ liệu'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (isOpen) void load(); }, [isOpen, load]);
  if (!isOpen) return null;

  const reset = async (e: React.FormEvent) => {
    e.preventDefault(); setMsg('');
    if (newPw.length < 6) { setMsg('Mật khẩu mới cần ít nhất 6 ký tự.'); return; }
    setBusy(true);
    try { await adminResetPassword(target.trim(), newPw); setMsg(`Đã đặt lại mật khẩu cho "${target.trim()}".`); setNewPw(''); }
    catch (err) { setMsg(err instanceof Error ? err.message : 'Không đặt lại được'); }
    finally { setBusy(false); }
  };

  const stat = (label: string, v: number | string | null | undefined) => (
    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-extrabold">{v ?? '—'}</div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-3" role="dialog" aria-modal="true">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-indigo-600" /> Quản trị viên</h2>
          <div className="flex gap-1">
            <button onClick={() => void load()} aria-label="Làm mới" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><RefreshCw className="w-5 h-5" /></button>
            <button onClick={onClose} aria-label="Đóng" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {loading && <div className="flex items-center gap-2 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Đang tải…</div>}
        {error && <div className="text-sm text-rose-700 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl">{error}</div>}

        {data && (
          <>
            <section>
              <h3 className="font-bold flex items-center gap-1 mb-2"><BarChart3 className="w-4 h-4" /> Tổng quan</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {stat('Học sinh', data.users)}
                {stat('Đăng ký hôm nay', data.users_today)}
                {stat('Lượt làm bài đã chấm', data.graded_sessions)}
                {stat('Điểm TB', data.avg_score)}
                {stat('Câu hỏi đang dùng', data.questions_published)}
                {stat('Lượt truy cập', data.visits.total_visits)}
                {stat('Hôm nay', data.visits.today_visits)}
                {stat('Khách duy nhất', data.visits.unique_visitors)}
              </div>
            </section>

            <section>
              <h3 className="font-bold flex items-center gap-1 mb-2"><Users className="w-4 h-4" /> Học sinh mới nhất</h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-left text-xs">
                    <tr><th className="p-2">Biệt danh</th><th className="p-2">XP</th><th className="p-2">Xu</th><th className="p-2">Bài</th><th className="p-2">Ngày tạo</th><th className="p-2" /></tr>
                  </thead>
                  <tbody>
                    {data.recent_users.map((u) => (
                      <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="p-2 font-semibold">{u.alias}</td><td className="p-2">{u.xp}</td><td className="p-2">{u.coins}</td><td className="p-2">{u.quizzes}</td>
                        <td className="p-2 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                        <td className="p-2"><button className="text-indigo-600 text-xs font-bold" onClick={() => setTarget(u.alias)}>Đặt lại MK</button></td>
                      </tr>
                    ))}
                    {data.recent_users.length === 0 && <tr><td colSpan={6} className="p-3 text-slate-500">Chưa có học sinh.</td></tr>}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="font-bold flex items-center gap-1 mb-2"><KeyRound className="w-4 h-4" /> Đặt lại mật khẩu cho học sinh</h3>
              <form onSubmit={reset} className="flex flex-col sm:flex-row gap-2">
                <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="Biệt danh" className="flex-1 px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent" />
                <input value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Mật khẩu mới (từ 6 ký tự)" type="text" autoComplete="off" className="flex-1 px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent" />
                <button disabled={busy || !target.trim()} className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-bold disabled:opacity-50 flex items-center gap-1">
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />} Đặt lại
                </button>
              </form>
              {msg && <p className="text-sm mt-2">{msg}</p>}
            </section>
          </>
        )}
      </div>
    </div>
  );
};
