import React, { useCallback, useEffect, useState } from 'react';
import {
  ShieldCheck,
  X,
  Users,
  BarChart3,
  KeyRound,
  Loader2,
  RefreshCw,
  Eye,
  Flag,
  EyeOff,
  Clock,
  CheckCircle2
} from 'lucide-react';
import {
  adminOverview,
  adminResetPassword,
  adminFeedback,
  adminLobbyReports,
  adminModerateLobby,
  type AdminOverview,
  type FeedbackRow,
  type LobbyReportRow
} from '../lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

/** Real admin panel. Data comes from the admin_overview RPC, which the server only answers for platform_admin. */
export const AdminPanelModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState('');
  const [newPw, setNewPw] = useState('');
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);
  const [reports, setReports] = useState<LobbyReportRow[]>([]);
  const [modBusyId, setModBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [o, f, r] = await Promise.all([
        adminOverview(),
        adminFeedback(),
        adminLobbyReports().catch(() => [] as LobbyReportRow[])
      ]);
      setData(o);
      setFeedback(f);
      setReports(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Không tải được dữ liệu');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) void load();
  }, [isOpen, load]);

  if (!isOpen) return null;

  const reset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    if (newPw.length < 6) {
      setMsg('Mật khẩu mới cần ít nhất 6 ký tự.');
      return;
    }
    setBusy(true);
    try {
      await adminResetPassword(target.trim(), newPw);
      setMsg(`Đã đặt lại mật khẩu cho "${target.trim()}".`);
      setNewPw('');
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Không đặt lại được');
    } finally {
      setBusy(false);
    }
  };

  const handleModerate = async (reportId: string, action: 'hide_msg' | 'mute_1h' | 'dismiss') => {
    setModBusyId(reportId);
    try {
      await adminModerateLobby(reportId, action);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved' } : r))
      );
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Không xử lý được báo cáo');
    } finally {
      setModBusyId(null);
    }
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
          <h2 className="text-lg font-extrabold flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" /> Quản trị viên
          </h2>
          <div className="flex gap-1">
            <button onClick={() => void load()} aria-label="Làm mới" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button onClick={onClose} aria-label="Đóng" className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Đang tải…
          </div>
        )}
        {error && <div className="text-sm text-rose-700 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-2xl">{error}</div>}

        {data && (
          <>
            <section>
              <h3 className="font-bold flex items-center gap-1 mb-2">
                <BarChart3 className="w-4 h-4" /> Tổng quan
              </h3>
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
              <h3 className="font-bold flex items-center gap-1 mb-2">
                <Users className="w-4 h-4" /> Học sinh mới nhất
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-left text-xs">
                    <tr>
                      <th className="p-2">Biệt danh</th>
                      <th className="p-2">XP</th>
                      <th className="p-2">Xu</th>
                      <th className="p-2">Bài</th>
                      <th className="p-2">Ngày tạo</th>
                      <th className="p-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_users.map((u) => (
                      <tr key={u.id} className="border-t border-slate-100 dark:border-slate-800">
                        <td className="p-2 font-semibold">{u.alias}</td>
                        <td className="p-2">{u.xp}</td>
                        <td className="p-2">{u.coins}</td>
                        <td className="p-2">{u.quizzes}</td>
                        <td className="p-2 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString('vi-VN')}</td>
                        <td className="p-2">
                          <button className="text-indigo-600 text-xs font-bold" onClick={() => setTarget(u.alias)}>
                            Đặt lại MK
                          </button>
                        </td>
                      </tr>
                    ))}
                    {data.recent_users.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-3 text-slate-500">
                          Chưa có học sinh.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="font-bold flex items-center gap-1 mb-2">
                <KeyRound className="w-4 h-4" /> Đặt lại mật khẩu cho học sinh
              </h3>
              <form onSubmit={reset} className="flex flex-col sm:flex-row gap-2">
                <input
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Biệt danh"
                  className="flex-1 px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent"
                />
                <input
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="Mật khẩu mới (từ 6 ký tự)"
                  type="text"
                  autoComplete="off"
                  className="flex-1 px-3 py-2 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent"
                />
                <button
                  disabled={busy || !target.trim()}
                  className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-bold disabled:opacity-50 flex items-center gap-1"
                >
                  {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />} Đặt lại
                </button>
              </form>
              {msg && <p className="text-sm mt-2">{msg}</p>}
            </section>
          </>
        )}

        {/* Lobby Chat Safety Reports */}
        <section>
          <h3 className="font-bold flex items-center gap-1.5 mb-2">
            <Flag className="w-4 h-4 text-rose-500" /> Báo cáo Trò Chuyện Sảnh ({reports.length})
          </h3>
          {reports.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có báo cáo vi phạm nào.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {reports.map((r) => (
                <li
                  key={r.id}
                  className="text-xs bg-slate-50 dark:bg-slate-800 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-[11px] text-slate-500">
                      <b>{r.target_alias}</b> · {r.room_key} · {new Date(r.created_at).toLocaleString('vi-VN')} ·{' '}
                      <span className="font-bold uppercase">{r.status}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white break-words">
                      “{r.excerpt}”
                    </div>
                    <div className="text-[11px] text-rose-600 dark:text-rose-400">Lý do: {r.reason}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={modBusyId === r.id}
                      onClick={() => void handleModerate(r.id, 'hide_msg')}
                      className="px-2.5 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <EyeOff className="w-3.5 h-3.5" /> Ẩn tin
                    </button>
                    <button
                      type="button"
                      disabled={modBusyId === r.id}
                      onClick={() => void handleModerate(r.id, 'mute_1h')}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" /> Khóa chat 1h
                    </button>
                    <button
                      type="button"
                      disabled={modBusyId === r.id}
                      onClick={() => void handleModerate(r.id, 'dismiss')}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Bỏ qua
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-4">
          <h3 className="font-bold mb-2">Góp ý từ học sinh ({feedback.length})</h3>
          {feedback.length === 0 ? (
            <p className="text-sm text-slate-500">Chưa có góp ý nào.</p>
          ) : (
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {feedback.map((f) => (
                <li key={f.id} className="text-sm bg-slate-50 dark:bg-slate-800 rounded-xl p-2.5">
                  <div className="text-[11px] text-slate-500">
                    {f.alias ?? 'Khách'} · {f.category}
                    {f.rating ? ` · ${f.rating}/5` : ''} · {new Date(f.created_at).toLocaleString('vi-VN')}
                  </div>
                  <div className="whitespace-pre-wrap break-words">{f.message}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
