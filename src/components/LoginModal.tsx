import React, { useState } from 'react';
import { X, LogIn, UserPlus, LogOut, AlertCircle, User, Lock, Sparkles, Loader2 } from 'lucide-react';
import { StudentProfile } from '../types';
import { AvatarRenderer } from './AvatarRenderer';
import { soundManager } from '../utils/audio';
import { FUNNY_NICKNAMES } from '../utils/studentStorage';
import { signInWithNickname, signUpWithNickname } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeStudent: StudentProfile;
  onLogout: () => void;
}

/** Sign in / sign up with nickname + password (Supabase Auth). No passwords are stored or compared in the browser. */
export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, activeStudent, onLogout }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const reset = () => { setError(''); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    reset();
    if (!isSupabaseConfigured) { setError('Ứng dụng chưa được cấu hình kết nối máy chủ.'); return; }
    if (nickname.trim().length < 3) { setError('Biệt danh cần từ 3 ký tự (không dùng email, số điện thoại).'); return; }
    if (password.length < 6) { setError('Mật khẩu cần ít nhất 6 ký tự.'); return; }
    setBusy(true);
    try {
      if (tab === 'register') await signUpWithNickname(nickname.trim(), password);
      else await signInWithNickname(nickname.trim(), password);
      soundManager.play('correct');
      setPassword('');
      onClose();
    } catch (err) {
      soundManager.play('wrong');
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
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

            <div>
              <label className="text-sm font-bold flex items-center gap-1"><User className="w-4 h-4" /> Biệt danh</label>
              <div className="flex gap-2 mt-1">
                <input value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={20} autoComplete="username" autoCapitalize="none"
                  placeholder="Ví dụ: Thần Đồng Tính Nhẩm"
                  className="flex-1 min-w-0 px-3 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent" />
                {tab === 'register' && (
                  <button type="button" aria-label="Gợi ý biệt danh" onClick={() => setNickname(FUNNY_NICKNAMES[Math.floor(Math.random() * FUNNY_NICKNAMES.length)])}
                    className="px-3 rounded-2xl bg-amber-100 text-amber-700"><Sparkles className="w-5 h-5" /></button>
                )}
              </div>
              {tab === 'register' && <p className="text-xs text-slate-500 mt-1">Đừng dùng tên thật, email hay số điện thoại. Không cần email để đăng ký.</p>}
            </div>
            <div>
              <label className="text-sm font-bold flex items-center gap-1"><Lock className="w-4 h-4" /> Mật khẩu (từ 6 ký tự)</label>
              <input type="password" autoComplete={tab === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-transparent" />
            </div>

            {error && <div role="alert" className="flex gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 p-3 rounded-2xl"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />{error}</div>}

            <button disabled={busy} type="submit" className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-2xl bg-blue-600 text-white font-extrabold disabled:opacity-60">
              {busy && <Loader2 className="w-4 h-4 animate-spin" />}{tab === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}
            </button>
            <p className="text-xs text-slate-500 text-center">Kết quả học được lưu trên máy chủ, xem lại được trên thiết bị khác. Quên mật khẩu: nhờ quản trị viên đặt lại.</p>
          </form>
        )}
      </div>
    </div>
  );
};
