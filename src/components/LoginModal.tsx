import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { 
  getStudentProfiles, 
  setActiveStudentId, 
  createInitialProfile, 
  saveStudentProfiles, 
  FUNNY_NICKNAMES, 
  getRandomNickname,
  getAppStatistics,
  loginStudent,
  resetStudentPassword,
  isNicknameTaken,
  DEFAULT_PASSWORD
} from '../utils/studentStorage';
import { AvatarRenderer } from './AvatarRenderer';
import { soundManager } from '../utils/audio';
import { APP_LOGO_SRC, CURRENT_VERSION } from '../data/versionHistory';
import { 
  UserPlus, 
  Sparkles, 
  School, 
  GraduationCap, 
  X, 
  Check, 
  Users, 
  Dices, 
  BarChart3, 
  Award, 
  Coins, 
  Star,
  Lock,
  Key,
  LogIn,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (student: StudentProfile) => void;
  activeStudent: StudentProfile;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
  activeStudent
}) => {
  const [tab, setTab] = useState<'login' | 'create' | 'stats'>('login');
  const [profiles, setProfiles] = useState<StudentProfile[]>(() => getStudentProfiles());

  // Login form state
  const [loginNickname, setLoginNickname] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl' | 'scholar'>('boy');
  const [password, setPassword] = useState('');
  const [motto, setMotto] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Quick nickname suggestions
  const [suggestedNicknames, setSuggestedNicknames] = useState<string[]>(() => [
    'Thần Đồng Tính Nhẩm',
    'Bé Bánh Mì Patê',
    'Cú Vọ Mọt Sách',
    'Chiến Thần Ước Bội',
    'Bé Mèo Ham Học',
    'Vua Lũy Thừa'
  ]);

  if (!isOpen) return null;

  const appStats = getAppStatistics();

  const handleShuffleNicknames = () => {
    soundManager.play('click');
    const shuffled = [...FUNNY_NICKNAMES].sort(() => 0.5 - Math.random()).slice(0, 6);
    setSuggestedNicknames(shuffled);
  };

  const handlePickNickname = (nick: string) => {
    soundManager.play('click');
    setName(nick);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');

    if (!loginNickname.trim()) {
      setLoginError('Vui lòng nhập biệt danh học sinh!');
      return;
    }

    const result = loginStudent(loginNickname.trim(), loginPassword || DEFAULT_PASSWORD);
    if (result.success && result.student) {
      soundManager.play('fanfare');
      setLoginSuccess('Đăng nhập thành công!');
      onSelectStudent(result.student);
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      soundManager.play('wrong');
      setLoginError(result.message);
    }
  };

  const handleResetPasswordClick = () => {
    if (!loginNickname.trim()) {
      setLoginError('Vui lòng nhập biệt danh học sinh cần khôi phục mật khẩu!');
      return;
    }
    const res = resetStudentPassword(loginNickname.trim());
    if (res.success) {
      soundManager.play('unlock');
      setLoginPassword(DEFAULT_PASSWORD);
      setLoginSuccess(res.message);
      setLoginError('');
    } else {
      soundManager.play('wrong');
      setLoginError(res.message);
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setRegisterError('Vui lòng nhập hoặc chọn biệt danh!');
      return;
    }

    if (isNicknameTaken(trimmedName)) {
      setRegisterError(`Biệt danh "${trimmedName}" đã được bạn khác đăng ký. Hãy chọn biệt danh độc đáo khác hoặc đăng nhập bằng mật khẩu!`);
      soundManager.play('wrong');
      return;
    }

    soundManager.play('fanfare');
    const newProfile = createInitialProfile(
      trimmedName, 
      grade.trim() || '6A1', 
      school.trim() || 'THCS Chu Văn An', 
      gender, 
      false, 
      password.trim() || DEFAULT_PASSWORD
    );
    newProfile.motto = motto.trim() || 'Học hết mình, chơi siêu vui!';

    const currentProfiles = getStudentProfiles().filter((p) => !p.isGuest);
    const updated = [...currentProfiles, newProfile];
    saveStudentProfiles(updated);
    setActiveStudentId(newProfile.id);
    setProfiles(updated);
    onSelectStudent(newProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-850">
          <div className="flex items-center gap-3">
            <img 
              src={APP_LOGO_SRC} 
              alt="Học Siêu Vui" 
              className="w-11 h-11 rounded-2xl object-cover shadow-md border border-blue-200 dark:border-blue-700 shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Cổng Học Sinh • Học Siêu Vui
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                  {CURRENT_VERSION}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Đăng ký biệt danh duy nhất, bảo mật mật khẩu đơn giản & theo dõi thống kê
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.play('click');
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch (Đăng Nhập, Đăng Ký Mới, Thống Kê) */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-1.5 gap-2">
          <button
            onClick={() => {
              soundManager.play('click');
              setTab('login');
              setLoginError('');
              setLoginSuccess('');
            }}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              setTab('create');
              setRegisterError('');
            }}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'create'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng Ký Biệt Danh</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              setTab('stats');
            }}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              tab === 'stats'
                ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Thống Kê</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* TAB 1: LOGIN WITH NICKNAME & PASSWORD */}
          {tab === 'login' && (
            <div className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {loginSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{loginSuccess}</span>
                </div>
              )}

              {/* Current student status pill */}
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400">Đang hoạt động:</span>{' '}
                  <strong className="text-slate-900 dark:text-white">{activeStudent.name}</strong>
                  {activeStudent.isGuest ? (
                    <span className="ml-1 text-[10px] text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-1.5 py-0.5 rounded">
                      Chưa Đăng Ký
                    </span>
                  ) : (
                    <span className="ml-1 text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded font-bold">
                      Đã Đăng Ký
                    </span>
                  )}
                </div>
                <span className="font-mono font-bold text-amber-600">
                  {activeStudent.coins} xu • {activeStudent.stars} ⭐
                </span>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Biệt Danh Học Sinh Đã Đăng Ký
                  </label>
                  <input
                    type="text"
                    required
                    value={loginNickname}
                    onChange={(e) => setLoginNickname(e.target.value)}
                    placeholder="Nhập biệt danh của bạn..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mật Khẩu (Mặc định: hocvui123)
                    </label>
                    <button
                      type="button"
                      onClick={handleResetPasswordClick}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Quên mật khẩu? (Reset về hocvui123)</span>
                    </button>
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Nhập mật khẩu (hoặc để trống nếu dùng hocvui123)"
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Đăng Nhập Vào Học</span>
                  </button>
                </div>
              </form>

              {/* Fast switch list of existing accounts */}
              {profiles.filter((p) => !p.isGuest).length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Gợi ý tài khoản trên thiết bị này:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {profiles
                      .filter((p) => !p.isGuest)
                      .map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setLoginNickname(p.name);
                            setLoginPassword('');
                          }}
                          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>{p.name}</span>
                          <span className="text-[10px] text-slate-400">({p.grade})</span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REGISTER WITH FUNNY NICKNAMES & UNIQUE ACCOUNT */}
          {tab === 'create' && (
            <form onSubmit={handleCreateNew} className="space-y-4">
              {registerError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{registerError}</span>
                </div>
              )}

              {/* Quick funny nickname suggestions box */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Gợi Ý Biệt Danh Nhanh Vui Nhộn:</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleShuffleNicknames}
                    className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-900 flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    <span>Đổi Bộ Khác</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {suggestedNicknames.map((nick) => (
                    <button
                      key={nick}
                      type="button"
                      onClick={() => handlePickNickname(nick)}
                      className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-amber-100 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl border border-amber-200 dark:border-amber-700/60 transition-colors cursor-pointer shadow-2xs"
                    >
                      {nick}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Biệt Danh Học Sinh (Duy Nhất) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ví dụ: Thần Đồng Tính Nhẩm, Bé Bánh Mì Patê..."
                      className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setName(getRandomNickname())}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                      title="Chọn ngẫu nhiên 1 biệt danh"
                    >
                      <Dices className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Đặt Mật Khẩu (Mặc định: hocvui123)
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mật khẩu đơn giản..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Lớp Học (Khối 6)
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="6A1, 6A2..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Trường THCS
                  </label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="THCS Chu Văn An, Giảng Võ..."
                    className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Chọn Nhân Vật Khởi Tạo
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setGender('boy')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        gender === 'boy'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-2xl mb-1">👦</div>
                      <div className="text-xs">Học Sinh Nam</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('girl')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        gender === 'girl'
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-2xl mb-1">👧</div>
                      <div className="text-xs">Học Sinh Nữ</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('scholar')}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        gender === 'scholar'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="text-2xl mb-1">🧙‍♂️</div>
                      <div className="text-xs">Nhà Toán Học</div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  Đăng Ký & Nhận Quà Khởi Nghiệp 120 Xu!
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SYSTEM STATISTICS (Word 'thật' removed as requested) */}
          {tab === 'stats' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Thống kê các tài khoản học sinh đã đăng ký và lượt tham gia học tập trên nền tảng:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-800/80 text-center">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-[10px] text-blue-700 dark:text-blue-300 uppercase font-semibold">Tài Khoản Đăng Ký</div>
                  <div className="text-xl font-black font-mono text-blue-700 dark:text-blue-300">{appStats.totalRegisteredAccounts}</div>
                </div>

                <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 text-center">
                  <Award className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-semibold">Bài Học Vượt Qua</div>
                  <div className="text-xl font-black font-mono text-emerald-700 dark:text-emerald-300">{appStats.totalLessonsCompleted}</div>
                </div>

                <div className="p-3.5 bg-yellow-50 dark:bg-yellow-950/40 rounded-2xl border border-yellow-200 dark:border-yellow-800/80 text-center">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500 mx-auto mb-1" />
                  <div className="text-[10px] text-yellow-700 dark:text-yellow-300 uppercase font-semibold">Tổng Sao Gom Được</div>
                  <div className="text-xl font-black font-mono text-yellow-600 dark:text-yellow-400">{appStats.totalStarsAccumulated}</div>
                </div>

                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/80 text-center">
                  <Coins className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <div className="text-[10px] text-amber-700 dark:text-amber-300 uppercase font-semibold">Tổng Xu Đã Kiếm</div>
                  <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">{appStats.totalCoinsAccumulated}</div>
                </div>
              </div>

              {/* List of registered students */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Danh Sách Học Sinh:
                </h4>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {appStats.activeAccountsList.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-400">#{idx + 1}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded text-slate-700 dark:text-slate-300">
                          {item.grade}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 font-mono font-semibold">
                        <span className="text-slate-500">Cấp {item.level}</span>
                        <span className="text-yellow-500 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400" />
                          {item.stars}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
