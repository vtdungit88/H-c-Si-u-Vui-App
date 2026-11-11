import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { 
  getAppStatistics, 
  getStudentProfiles, 
  saveStudentProfiles, 
  adminUpdateStudent, 
  adminDeleteStudent, 
  getAdminAnnouncement,
  setAdminAnnouncement
} from '../utils/studentStorage';
import { soundManager } from '../utils/audio';
import { AvatarRenderer } from './AvatarRenderer';
import { APP_LOGO_SRC, CURRENT_VERSION } from '../data/versionHistory';
import { SHOP_ITEMS } from '../data/items';
import { 
  ShieldCheck, 
  Users, 
  Coins, 
  Star, 
  Key, 
  RotateCcw, 
  Trash2, 
  Plus, 
  Bell, 
  Save, 
  X, 
  Check, 
  BarChart3, 
  SlidersHorizontal,
  Gift,
  Mail,
  Copy,
  Lock,
  LogIn,
  LogOut,
  AlertCircle,
  Database,
  Download,
  FileJson,
  HardDrive,
  MessageSquareHeart,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { 
  getUserFeedbacks, 
  deleteUserFeedback, 
  toggleResolveFeedback, 
  UserFeedback 
} from '../utils/feedbackStorage';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentModified: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onStudentModified
}) => {
  // Admin access is disabled until server-side roles (Supabase Auth + platform_roles) are wired in (M2).
  // No credentials are stored or compared in the browser.
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Admin login credentials
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Management state
  const [adminTab, setAdminTab] = useState<'students' | 'feedbacks' | 'stats' | 'broadcast' | 'export'>('students');
  const [announcementText, setAnnouncementText] = useState(() => getAdminAnnouncement());
  const [statusMsg, setStatusMsg] = useState('');
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>(() => getUserFeedbacks());

  const reloadFeedbacks = () => {
    setFeedbacks(getUserFeedbacks());
  };

  const handleToggleFeedbackStatus = (id: string) => {
    soundManager.play('click');
    toggleResolveFeedback(id);
    reloadFeedbacks();
    setStatusMsg('Đã cập nhật trạng thái phản hồi!');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleDeleteFeedbackItem = (id: string) => {
    if (window.confirm('Xóa phản hồi này khỏi hệ thống?')) {
      soundManager.play('click');
      deleteUserFeedback(id);
      reloadFeedbacks();
      setStatusMsg('Đã xóa phản hồi.');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  if (!isOpen) return null;

  const stats = getAppStatistics();
  const profiles = getStudentProfiles();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.play('wrong');
    setAdminLoginError('Khu vực quản trị đang chờ đăng nhập bằng Supabase Auth (vai trò kiểm tra ở máy chủ). Tạm thời chưa mở.');
  };

  const handleAdminLogout = () => {
    soundManager.play('click');
    setIsAdminAuthenticated(false);
    setAdminUsername('');
    setAdminPassword('');
  };

  const handleCopyEmail = () => {
    soundManager.play('click');
    navigator.clipboard.writeText('dungvt.hbh@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleAddBonus = (studentId: string, addCoins: number, addStars: number) => {
    soundManager.play('coin');
    const target = profiles.find((p) => p.id === studentId);
    if (!target) return;

    adminUpdateStudent(studentId, {
      coins: (target.coins || 0) + addCoins,
      stars: (target.stars || 0) + addStars
    });
    setStatusMsg(`Đã tặng +${addCoins} Xu và +${addStars} Sao cho "${target.name}"!`);
    onStudentModified();
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleDelete = (studentId: string, studentName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${studentName}" không?`)) return;
    soundManager.play('click');
    adminDeleteStudent(studentId);
    setStatusMsg(`Đã xóa tài khoản "${studentName}"`);
    onStudentModified();
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleSaveAnnouncement = () => {
    soundManager.play('click');
    setAdminAnnouncement(announcementText);
    setStatusMsg('Đã cập nhật thông báo toàn hệ thống thành công!');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleGiftAll = () => {
    soundManager.play('fanfare');
    const updated = profiles.map((p) => ({
      ...p,
      coins: (p.coins || 0) + 200,
      stars: (p.stars || 0) + 5
    }));
    saveStudentProfiles(updated);
    setStatusMsg('Đã tặng 200 Xu và 5 Sao cho TẤT CẢ học sinh!');
    onStudentModified();
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleExportDatabase = () => {
    soundManager.play('unlock');
    const exportData = {
      exportTimestamp: new Date().toISOString(),
      platform: 'Học Siêu Vui by dungvt.hbh VNPT',
      version: CURRENT_VERSION,
      statistics: getAppStatistics(),
      totalStudents: profiles.length,
      studentProfiles: profiles,
      announcement: getAdminAnnouncement(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hocsieuvui-database-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg('Đã xuất file sao lưu cơ sở dữ liệu học sinh thành công!');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleExportMathLessons = () => {
    soundManager.play('click');
    // Lesson/question content now lives in Supabase (answers are private); export is done server-side.
    setStatusMsg('Nội dung bài học nằm trên máy chủ (đáp án được giữ riêng tư).');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  const handleExportShopItems = () => {
    soundManager.play('click');
    const blob = new Blob([JSON.stringify(SHOP_ITEMS, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hocsieuvui-shop-items.json';
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg('Đã xuất file dữ liệu phụ kiện Studio!');
    setTimeout(() => setStatusMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <img 
              src={APP_LOGO_SRC} 
              alt="Học Siêu Vui Logo" 
              className="w-11 h-11 rounded-2xl object-cover shadow-md border border-white/20 shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Cổng Quản Trị Viên & Hỗ Trợ
                </h2>
                <span className="text-[10px] font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase">
                  {CURRENT_VERSION}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Học Siêu Vui by dungvt.hbh VNPT • Quản trị hệ thống
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.play('click');
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Message toast */}
        {statusMsg && (
          <div className="bg-emerald-500 text-white text-xs font-bold py-2 px-4 text-center animate-fadeIn flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* VIEW A: NOT AUTHENTICATED -> SHOW CONTACT INFO & ADMIN LOGIN GATE */}
        {!isAdminAuthenticated ? (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            {/* Public Administrator & Support Contact Card */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 dark:from-slate-850 dark:via-indigo-950/30 dark:to-slate-800 p-6 rounded-3xl border border-blue-200 dark:border-slate-700 space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white">
                    Liên Hệ Quản Trị Viên & Hỗ Trợ Kỹ Thuật
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Dành cho học sinh, phụ huynh và giáo viên khi cần liên hệ
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Email Liên Hệ Chính Thức
                </span>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm sm:text-base">
                    dungvt.hbh@gmail.com
                  </span>
                  <button
                    onClick={handleCopyEmail}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-700 dark:text-blue-300 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center gap-1.5 font-semibold text-xs cursor-pointer transition-colors"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedEmail ? 'Đã sao chép email' : 'Sao chép email'}</span>
                  </button>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] pt-1">
                  Mọi thắc mắc kỹ thuật, hỗ trợ tài khoản hoặc góp ý phát triển nội dung bài học xin gửi về hòm thư trên.
                </p>
              </div>
            </div>

            {/* Restricted Administrator Login Form */}
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  Đăng Nhập Quản Trị Hệ Thống
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Chỉ quản trị viên mới được quyền truy cập vào bảng điều khiển và thực hiện các thao tác quản trị.
              </p>

              {adminLoginError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{adminLoginError}</span>
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập Quản Trị</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* VIEW B: AUTHENTICATED -> SUPER ADMIN CONSOLE */
          <>
            {/* Top Bar for Authenticated Admin */}
            <div className="bg-indigo-50 dark:bg-indigo-950/40 px-5 py-2.5 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-700 dark:text-slate-300">
                  Đã đăng nhập: <strong className="text-indigo-600 dark:text-indigo-400">dungvt.hbh VNPT</strong> (dungvt.hbh@gmail.com)
                </span>
              </div>
              <button
                onClick={handleAdminLogout}
                className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng Xuất Quản Trị</span>
              </button>
            </div>

            {/* Tab switches */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 p-2 gap-2 text-xs font-bold">
              <button
                onClick={() => {
                  soundManager.play('click');
                  setAdminTab('students');
                }}
                className={`py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  adminTab === 'students'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Quản Lý Học Sinh ({profiles.length})</span>
              </button>

              <button
                onClick={() => {
                  soundManager.play('click');
                  setAdminTab('feedbacks');
                  reloadFeedbacks();
                }}
                className={`py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  adminTab === 'feedbacks'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <MessageSquareHeart className="w-4 h-4" />
                <span>Phản Hồi ({feedbacks.length})</span>
                {feedbacks.filter(f => !f.resolved).length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ml-0.5"></span>
                )}
              </button>

              <button
                onClick={() => {
                  soundManager.play('click');
                  setAdminTab('stats');
                }}
                className={`py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  adminTab === 'stats'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Thống Kê Hệ Thống</span>
              </button>

              <button
                onClick={() => {
                  soundManager.play('click');
                  setAdminTab('broadcast');
                }}
                className={`py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  adminTab === 'broadcast'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Phát Thông Báo</span>
              </button>

              <button
                onClick={() => {
                  soundManager.play('click');
                  setAdminTab('export');
                }}
                className={`py-2 px-4 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  adminTab === 'export'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Sao Lưu & Xuất DB</span>
              </button>
            </div>

            {/* Main Admin Tab Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* TAB 1: STUDENTS MANAGEMENT */}
              {adminTab === 'students' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white">
                        Danh Sách Tài Khoản Học Sinh Đã Đăng Ký
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Chỉnh sửa số Xu/Sao hoặc xóa tài khoản.
                      </p>
                    </div>

                    <button
                      onClick={handleGiftAll}
                      className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Tặng Quà 200 Xu Toàn Trường!</span>
                    </button>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                        <tr>
                          <th className="p-3">Học Sinh</th>
                          <th className="p-3">Lớp / Trường</th>
                          <th className="p-3 text-center">Cấp / Xu / Sao</th>
                          <th className="p-3 text-center">Bảo Mật MK</th>
                          <th className="p-3 text-right">Thao Tác Tinh Chỉnh</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {profiles.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                                  <AvatarRenderer config={p.avatarConfig} size="sm" showVehicle={false} showTech={false} showPet={false} />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 dark:text-white">
                                    {p.name} {p.isGuest && <span className="text-[10px] text-slate-400 font-normal">(Khách)</span>}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    ID: {p.id.slice(0, 14)}...
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="p-3">
                              <div className="font-bold text-blue-600 dark:text-blue-400">{p.grade}</div>
                              <div className="text-slate-500 dark:text-slate-400 truncate max-w-[140px]">{p.school}</div>
                            </td>

                            <td className="p-3 text-center font-mono">
                              <div className="font-bold text-slate-800 dark:text-slate-200">Lv.{p.level}</div>
                              <div className="text-[11px] text-amber-600 dark:text-amber-400">
                                🪙 {p.coins} • ⭐ {p.stars}
                              </div>
                            </td>

                            <td className="p-3 text-center">
                              <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded text-[10px] text-slate-500 font-mono">
                                ••••••••
                              </span>
                            </td>

                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5 flex-wrap">
                                <button
                                  onClick={() => handleAddBonus(p.id, 100, 2)}
                                  className="px-2 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-100 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                  title="Tặng +100 Xu & +2 Sao"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>+100 Xu</span>
                                </button>

                                {!p.isGuest && (
                                  <button
                                    onClick={() => handleDelete(p.id, p.name)}
                                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                                    title="Xóa tài khoản này"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: FEEDBACKS FROM STUDENTS */}
              {adminTab === 'feedbacks' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquareHeart className="w-4 h-4 text-rose-500" />
                        <span>Hộp Thư Góp Ý & Phản Hồi Từ Học Sinh ({feedbacks.length})</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ý kiến, đánh giá và báo lỗi gửi qua Trợ Lý Ảo tới Quản trị viên (dungvt.hbh@gmail.com)
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-xl border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>
                          TB: {(feedbacks.reduce((a, b) => a + b.rating, 0) / (feedbacks.length || 1)).toFixed(1)}/5⭐
                        </span>
                      </span>
                      <button
                        onClick={reloadFeedbacks}
                        className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                        title="Tải lại danh sách"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {feedbacks.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-400">
                      Chưa có phản hồi nào từ học sinh.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {feedbacks.map((fb) => (
                        <div
                          key={fb.id}
                          className={`p-4 rounded-2xl border transition-all ${
                            fb.resolved
                              ? 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-75'
                              : 'bg-white dark:bg-slate-850 border-blue-200 dark:border-slate-700 shadow-xs'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-xs text-slate-900 dark:text-white">
                                {fb.studentName}
                              </span>
                              <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold">
                                {fb.grade} • {fb.school}
                              </span>
                              {/* Category badge */}
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                fb.category === 'compliment'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : fb.category === 'bug'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  : fb.category === 'suggestion'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}>
                                {fb.category === 'compliment'
                                  ? '💖 Lời Khen Ngợi'
                                  : fb.category === 'bug'
                                  ? '🐛 Báo Lỗi Câu Hỏi'
                                  : fb.category === 'suggestion'
                                  ? '💡 Góp Ý Tính Năng'
                                  : '❓ Thắc Mắc'}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              {/* Star rating */}
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= fb.rating
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-slate-300 dark:text-slate-700'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(fb.createdAt).toLocaleDateString('vi-VN')} {new Date(fb.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>

                          {/* Message content */}
                          <p className="text-xs text-slate-800 dark:text-slate-200 mt-2.5 leading-relaxed font-medium">
                            "{fb.message}"
                          </p>

                          {/* Footer: Contact & Actions */}
                          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                            <div className="text-slate-500">
                              {fb.contact ? (
                                <span>Liên hệ: <strong className="text-blue-600 dark:text-blue-400">{fb.contact}</strong></span>
                              ) : (
                                <span className="italic text-slate-400">Không để lại thông tin liên hệ</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleFeedbackStatus(fb.id)}
                                className={`px-2.5 py-1 rounded-lg font-bold text-[10px] flex items-center gap-1 transition-all cursor-pointer ${
                                  fb.resolved
                                    ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                                    : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200'
                                }`}
                              >
                                <Check className="w-3 h-3" />
                                <span>{fb.resolved ? 'Đã Xử Lý (Bấm mở lại)' : 'Đánh Dấu Đã Xử Lý'}</span>
                              </button>

                              <button
                                onClick={() => handleDeleteFeedbackItem(fb.id)}
                                className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                                title="Xóa phản hồi này"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SYSTEM STATISTICS */}
              {adminTab === 'stats' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-slate-800 rounded-2xl border border-blue-100 dark:border-slate-700 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Tài Khoản Đăng Ký</div>
                      <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                        {stats.totalRegisteredAccounts}
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Tổng Xu Lưu Hành</div>
                      <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
                        {stats.totalCoinsAccumulated}
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 dark:bg-slate-800 rounded-2xl border border-yellow-100 dark:border-slate-700 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Tổng Sao Đã Kiếm</div>
                      <div className="text-2xl font-black text-yellow-500 mt-1">
                        {stats.totalStarsAccumulated}
                      </div>
                    </div>

                    <div className="p-4 bg-emerald-50 dark:bg-slate-800 rounded-2xl border border-emerald-100 dark:border-slate-700 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Tổng Lượt Hoàn Thành</div>
                      <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        {stats.totalLessonsCompleted}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <img src={APP_LOGO_SRC} alt="Logo" className="w-4 h-4 rounded-md object-cover" />
                        <span>Thông Tin Vận Hành • {CURRENT_VERSION}</span>
                      </h4>
                      <span className="text-[10px] bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                        Đang Hoạt Động
                      </span>
                    </div>

                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                      <li>• Nền tảng: <strong>Học Siêu Vui by dungvt.hbh VNPT</strong></li>
                      <li>• Email quản trị: <strong>dungvt.hbh@gmail.com</strong></li>
                      <li>• Khóa học kích hoạt: <strong>Toán Học Các Khối Lớp</strong> (Chương Trình SGK Chuẩn)</li>
                      <li>• Cơ chế tài khoản: Quản trị viên có quyền đặt lại mật khẩu về mặc định khi học sinh quên.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: BROADCAST ANNOUNCEMENT */}
              {adminTab === 'broadcast' && (
                <div className="space-y-4 max-w-xl">
                  <div>
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      Phát Thông Báo Toàn Trường
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Nội dung thông báo sẽ xuất hiện trên đầu trang cho tất cả học sinh đang học.
                    </p>
                  </div>

                  <textarea
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    rows={4}
                    className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập nội dung thông báo cho học sinh..."
                  />

                  <button
                    onClick={handleSaveAnnouncement}
                    className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Lưu & Phát Ngay</span>
                  </button>
                </div>
              )}

              {/* TAB 4: DATABASE & DATA EXPORT */}
              {adminTab === 'export' && (
                <div className="space-y-6">
                  <div className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-3xl text-white shadow-md space-y-2">
                    <div className="flex items-center gap-2.5">
                      <HardDrive className="w-5 h-5 text-amber-300" />
                      <h3 className="font-black text-sm">Trung Tâm Sao Lưu & Xuất Dữ Liệu (Backup & Export DB)</h3>
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed">
                      Toàn bộ dữ liệu tài khoản học sinh, điểm thưởng Xu/Sao, câu hỏi SGK Toán 6 và vật phẩm Studio đều có thể xuất ra file JSON tiêu chuẩn để lưu trữ ngoại tuyến hoặc nhập vào cơ sở dữ liệu (PostgreSQL, MySQL, MongoDB, Firebase) trên máy chủ cá nhân hoặc cloud.
                    </p>
                  </div>

                  {/* 3 Main Export Buttons Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Card 1: Students DB */}
                    <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300">
                            <Users className="w-5 h-5" />
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
                            {profiles.length} tài khoản
                          </span>
                        </div>
                        <h4 className="font-black text-xs text-slate-900 dark:text-white">
                          Cơ Sở Dữ Liệu Học Sinh & Tiến Trình
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Chứa toàn bộ danh sách tài khoản học sinh, số Xu, Sao, cấp độ, lịch sử vượt bài và vật phẩm đã mở khóa.
                        </p>
                      </div>

                      <button
                        onClick={handleExportDatabase}
                        className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Xuất File Học Sinh (.JSON)</span>
                      </button>
                    </div>

                    {/* Card 2: Math Lessons */}
                    <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-300">
                            <FileJson className="w-5 h-5" />
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
                            19 bài học SGK (từ máy chủ)
                          </span>
                        </div>
                        <h4 className="font-black text-xs text-slate-900 dark:text-white">
                          Kho Đề Bài & Câu Hỏi Toán 6 Tập 1
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Toàn bộ hệ thống bài giảng, tóm tắt lý thuyết, câu hỏi trắc nghiệm, hình ảnh vector minh họa và giải thích chi tiết.
                        </p>
                      </div>

                      <button
                        onClick={handleExportMathLessons}
                        className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Xuất File Bài Học Toán 6 (.JSON)</span>
                      </button>
                    </div>

                    {/* Card 3: Shop Items */}
                    <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300">
                            <Database className="w-5 h-5" />
                          </span>
                          <span className="text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                            {SHOP_ITEMS.length} phụ kiện
                          </span>
                        </div>
                        <h4 className="font-black text-xs text-slate-900 dark:text-white">
                          Danh Mục Phụ Kiện Studio Avatar
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Kho 35+ trang phục, phụ kiện cầm tay, xe đạp, điện thoại, laptop và thú cưng phân chia theo độ hiếm và giá Xu/Sao.
                        </p>
                      </div>

                      <button
                        onClick={handleExportShopItems}
                        className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-98"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Xuất File Phụ Kiện (.JSON)</span>
                      </button>
                    </div>

                  </div>

                  {/* Schema Summary Card */}
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <FileJson className="w-4 h-4 text-blue-500" />
                        <span>Thư mục lưu trữ mã nguồn đã xuất: <code className="font-mono text-blue-600 dark:text-blue-400">/data-export/</code></span>
                      </span>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                        Đã khởi tạo
                      </span>
                    </div>
                    <ul className="text-[11px] text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4">
                      <li><strong className="font-mono">database-schema.json:</strong> Định nghĩa toàn bộ cấu trúc bảng, kiểu dữ liệu, khóa chính, khóa ngoại quan hệ.</li>
                      <li><strong className="font-mono">math-lessons-sgk6.json:</strong> Toàn bộ 10 bài học SGK Toán 6 Tập 1 kèm câu hỏi và đáp án.</li>
                      <li><strong className="font-mono">shop-items.json:</strong> Toàn bộ 35+ vật phẩm Studio học sinh.</li>
                      <li><strong className="font-mono">initial-seed-data.json:</strong> Dữ liệu mẫu ban đầu để khởi tạo máy chủ mới.</li>
                    </ul>
                  </div>

                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
