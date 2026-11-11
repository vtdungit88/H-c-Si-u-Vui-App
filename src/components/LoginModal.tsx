import React, { useState } from 'react';
import { X, LogIn, UserPlus, LogOut, AlertCircle, Mail, Lock, Sparkles, Loader2 } from 'lucide-react';
import { StudentProfile } from '../types';
import { AvatarRenderer } from './AvatarRenderer';
import { soundManager } from '../utils/audio';
import { FUNNY_NICKNAMES } from '../utils/studentStorage';
import { signInWithEmail, signUpWithEmail } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStudent: StudentProfile;
  onLogout: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Sign in / sign up with Supabase Auth. No passwords are stored or compared in the browser. */
export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, activeStudent, onLogout }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alias, setAlias] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  if (!isOpen) return null;

  const reset = () => { setError(''); setInfo(''); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    if (!isSupabaseConfigured) { setError('Ứng dụng chưa được cấu hình kết nối máy chủ.'); return; }
    if (!EMAIL_RE.test(email.trim())) { setError('Email chưa hợp lệ.'); return; }
    if (password.length < 8) { setError('Mật khẩu cần ít nhất 8 ký tự.'); return; }
    if (tab === 'register' && alias.trim().length < 2) { setError('Hãy chọn biệt danh (ít nhất 2 ký tự, không dùng email/số điện thoại).'); return; }
    setBusy(true);
    try {
      if (tab === 'register') {
        const r = await signUpWithEmail(email.trim(), password, alias);
        if (r.needsEmailConfirmation) {
          setInfo('Đã gửi email xác nhận. Hãy mở email, bấm xác nhận rồi quay lại đăng nhập.');
          setTab('login');
          return;
        }
      } else {
        await signInWithEmail(email.trim(), password);
      }
      soundManager.play('correct');
      setPassword('');
      onClose();
    } catch (err) {
      soundManager.play('wrong');
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(/invalid login/i.test(msg) ? 'Email hoặc mật khẩu chưa đúng.' : msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 p-0 sm:p-4" role="dialog" aria-modal="true">
      <div className="w-full sm:max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="font-extrabold text-lg">{activeStudent.isGuest ? 'Đăng nhập để lưu kết quả' : 'Tài khoản của bạn'}</h2>
          <button onClick={() => { soundManager.play('click'); onClose(); }} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800" aria-label="Đóng">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!activeStudent.isGuest ? (
          <div className="p-5 space-y-4 text-center">
            <div className="mx-auto w-24 h-24"><AvatarRenderer config={activeStudent.avatarConfig} /></div>
            <div>
              <div className="font-extrabold text-xl">{activeStudent.name}</div>
              <div className="text-sm text-slate-500">{activeStudent.coins} xu · {activeStudent.exp} XP · {Object.keys(activeStudent.completedLessons).filter((k) => !k.includes('_easy') && !k.includes('_medium') && !k.includes('_hard')).length} bài đã học</div>
            </div>
            <button onClick={() => { onLogout(); onClose(); }} className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800">
              {(['login', 'register'] as const).map((t) => (
                <button type="button" key={t} onClick={() => { reset(); setTab(t); }}
                  className={`py-2 rounded-xl text-sm font-bold ${tab === t ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'}`}>
                  {t === 'login' ? <><LogIn className="inline w-4 h-4 mr-1" />Đăng nhập</> : <><UserPlus className="inline w-4 h-4 mr-1" />Đăng ký</>}
                </button>
              ))}
            </div>

            {tab === 'register' && (
              <div>
                <label className="text-sm font-bold">Biệt danh hiển thị</label>
                <div className="flex gap-2 mt-1">
                  <input value={alias} onChange={(e) => setAlias(e.target.value)} maxLength={24} placeholder="Ví dụ: Thần Đồng Tính Nhẩm"
                    className="flex-1 px-3 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent" />
                  <button type="button" aria-label="Gợi ý biệt danh" onClick={() => setAlias(FUNNY_NICKNAMES[Math.floor(Math.random() * FUNNY_NICKNAMES.length)])}
                    className="px-3 rounded-2xl bg-amber-100 text-amber-700"><Sparkles className="w-5 h-5" /></button>
                </div>
                <p className="text-xs text-slate-500 mt-1">Đừng dùng tên thật, email hay số điện thoại làm biệt danh.</p>
              </div>
            )}

            <div>
              <label className="text-sm font-bold flex items-center gap-1"><Mail className="w-4 h-4" /> Email (của bạn hoặc phụ huynh)</label>
              <input type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent" />
            </div>
            <div>
              <label className="text-sm font-bold flex items-center gap-1"><Lock className="w-4 h-4" /> Mật khẩu (từ 8 ký tự)</label>
              <input type="password" autoComplete={tab === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent" />
            </div>

            {error && <div role="alert" className="flex gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 p-3 rounded-2xl"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}</div>}
            {info && <div className="text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-2xl">{info}</div>}

            <button disabled={busy} type="submit" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 text-white font-extrabold disabled:opacity-60">
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}{tab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
            <p className="text-xs text-slate-500 text-center">Kết quả học được lưu trên máy chủ, xem lại được trên thiết bị khác. Đây là bản dùng thử.</p>
          </form>
        )}
      </div>
    </div>
  );
};
