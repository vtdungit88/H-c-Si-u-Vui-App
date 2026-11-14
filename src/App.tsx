import React, { useState, useEffect } from 'react';
import { StudentProfile, MathLesson } from './types';
import { getActiveStudent, createInitialProfile, setActiveStudentId, scrubLegacyPasswords } from './utils/studentStorage';
import { supabase } from './lib/supabase';
import { loadStudentProfile, signOut } from './lib/api';
import { soundManager } from './utils/audio';
import { Navbar } from './components/Navbar';
import { AvatarStudio } from './components/AvatarStudio';
import { MathGameArena } from './components/MathGameArena';
import { SpeedRunBlitz } from './components/SpeedRunBlitz';
import { AdventureMap } from './components/AdventureMap';
import { LoginModal } from './components/LoginModal';
import { StudentIdCardModal } from './components/StudentIdCardModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { InstallShareModal } from './components/InstallShareModal';
import { AvatarRenderer } from './components/AvatarRenderer';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { SubjectCourseSelector } from './components/SubjectCourseSelector';
import { VirtualAssistant } from './components/VirtualAssistant';
import { APP_LOGO_SRC, CURRENT_VERSION } from './data/versionHistory';
import { GradeLevel } from './types';
import { 
  Sparkles, 
  Coins, 
  Star, 
  Trophy, 
  BookOpen, 
  ShieldCheck, 
  ChevronRight, 
  UserPlus, 
  Bell, 
  CheckCircle2, 
  X, 
  Map, 
  Users, 
  KeyRound, 
  Radio,
  Lock,
  Megaphone
} from 'lucide-react';

export default function App() {
  const [student, setStudent] = useState<StudentProfile>(() => {
    scrubLegacyPasswords();
    // Legacy local-only accounts are ignored: identity now comes from Supabase Auth.
    const guest = createInitialProfile('Bé Siêu Vui', '6', '', 'boy', true);
    setActiveStudentId(guest.id);
    return guest;
  });
  const [authReady, setAuthReady] = useState(false);
  const [currentView, setCurrentView] = useState<'study' | 'shop' | 'blitz' | 'map' | 'leaderboard'>('study');
  const [currentSubjectId, setCurrentSubjectId] = useState<string>('math');
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>('6');
  const [currentTerm, setCurrentTerm] = useState<1 | 2>(1);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isInstallShareOpen, setIsInstallShareOpen] = useState(false);
  const [isUpdateNoticeOpen, setIsUpdateNoticeOpen] = useState(false);
  const [showTicker, setShowTicker] = useState(true);
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuted());

  // Restore the Supabase session and keep the profile in sync with auth state.
  useEffect(() => {
    let cancelled = false;
    const hydrate = async (user: { id: string } | null) => {
      if (!user) {
        const guest = createInitialProfile('Bé Siêu Vui', '6', '', 'boy', true);
        setActiveStudentId(guest.id);
        if (!cancelled) setStudent(guest);
        return;
      }
      try {
        const p = await loadStudentProfile(user as never);
        if (!cancelled) setStudent(p);
      } catch (e) {
        console.error('Không tải được hồ sơ', e);
      }
    };
    supabase.auth.getSession().then(({ data }) => hydrate(data.session?.user ?? null)).finally(() => !cancelled && setAuthReady(true));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      // Defer to avoid awaiting Supabase calls inside the auth callback.
      setTimeout(() => hydrate(session?.user ?? null), 0);
    });
    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  // Handle sound toggle
  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.play('click');
    }
  };

  const handleUpdateStudent = (updated: StudentProfile) => {
    setStudent(updated);
  };

  const handleLessonSelectedFromMap = (lesson: MathLesson) => {
    setCurrentView('study');
  };

  const handleLogout = () => {
    soundManager.play('click');
    signOut().catch((e) => console.error(e));
  };

  const handleRequireLogin = () => {
    soundManager.play('wrong');
    setIsLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      {/* 3-Zone Navigation Header */}
      <Navbar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        student={student}
        onOpenProfile={() => setIsLoginModalOpen(true)}
        onOpenCard={() => setIsCardModalOpen(true)}
        onLogout={handleLogout}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenInstallShare={() => setIsInstallShareOpen(true)}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
      />

      {/* Gentle 1-Line Running Announcement Ribbon with Mascot Logo & Version */}
      {showTicker && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-slate-950 text-xs font-bold py-1.5 px-4 shadow-sm flex items-center justify-between gap-3 overflow-hidden select-none">
          <div className="flex items-center gap-2 overflow-hidden shrink-0">
            <img 
              src={APP_LOGO_SRC} 
              alt="Logo" 
              className="w-5 h-5 rounded-md object-cover border border-black/20 shrink-0" 
            />
            <span className="bg-black/20 text-white px-2 py-0.5 rounded-md text-[10px] uppercase font-black tracking-wider flex items-center gap-1">
              <span>Học Siêu Vui</span>
            </span>
          </div>

          <div className="flex-1 overflow-hidden whitespace-nowrap text-[11px] sm:text-xs">
            <div className="inline-block animate-marquee hover:pause">
              🎉 <strong>Học Siêu Vui by dungvt.hbh VNPT:</strong> Ứng dụng vừa học vừa chơi bám sát chương trình SGK • Đăng ký tài khoản để làm bài & lưu thành tích • Studio của tôi • Liên hệ: <span className="underline">dungvt.hbh@gmail.com</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => {
                soundManager.play('click');
                setIsInstallShareOpen(true);
              }}
              className="px-2 py-0.5 bg-black/30 hover:bg-black/40 text-amber-200 hover:text-white rounded-md text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>📲 Cài App & Chia Sẻ</span>
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                setIsUpdateNoticeOpen(true);
              }}
              className="px-2 py-0.5 bg-black/20 hover:bg-black/30 text-white rounded-md text-[11px] font-semibold transition-colors cursor-pointer hidden sm:inline"
            >
              Tính năng mới
            </button>
            <button
              onClick={() => setShowTicker(false)}
              className="text-black/60 hover:text-black p-0.5 cursor-pointer"
              title="Đóng thanh thông báo"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 pb-16 md:pb-8">
        {/* VIEW 1: STUDY & ARENA */}
        {currentView === 'study' && (
          <div className="space-y-4">
            {/* Joyful School Hero Banner */}
            <div className="max-w-6xl mx-auto px-4 pt-4 sm:pt-6">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border border-blue-200 dark:border-slate-800 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Background hero image overlay with measured scrim */}
                <img
                  src="/src/assets/images/math6_hero_banner_1793633027233.jpg"
                  alt="Học sinh vui vẻ"
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 pointer-events-none"
                  referrerPolicy="no-referrer"
                />

                <div className="relative z-10 max-w-xl space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                      <img 
                        src={APP_LOGO_SRC} 
                        alt="Logo" 
                        className="w-4 h-4 rounded-md object-cover" 
                      />
                      <span className="text-[11px] font-black uppercase tracking-wider text-amber-300">
                        Vừa Học Vừa Chơi SGK
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        soundManager.play('click');
                        setIsUpdateNoticeOpen(true);
                      }}
                      className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-full flex items-center gap-1 cursor-pointer transition-colors backdrop-blur-xs"
                    >
                      <Bell className="w-3.5 h-3.5 text-amber-300" />
                      <span>Thông Báo Cập Nhật</span>
                    </button>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black leading-tight text-white drop-shadow">
                    {student.isGuest || student.name === 'Bé Siêu Vui'
                      ? 'Chào bạn! Đăng ký tài khoản để bắt đầu học & lưu điểm thưởng! 🚀'
                      : `Chào ${student.name}, hôm nay học gì thật vui nào! 🚀`}
                  </h1>

                  <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                    Học tập là niềm vui bất tận! Đăng ký tài khoản để chinh phục kiến thức SGK, tích lũy Xu 🪙 và Sao ⭐ nâng cấp Studio của tôi!
                  </p>

                  {/* Mandatory sign-up invitation banner for guest */}
                  {(student.isGuest || student.name === 'Bé Siêu Vui') && (
                    <div
                      onClick={() => {
                        soundManager.play('click');
                        setIsLoginModalOpen(true);
                      }}
                      className="p-3.5 bg-amber-400 text-slate-950 hover:bg-amber-300 rounded-2xl shadow-lg cursor-pointer transition-all flex items-center justify-between text-left group border border-amber-300"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-slate-950 text-amber-300 flex items-center justify-center shrink-0">
                          <UserPlus className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-black uppercase tracking-wide">
                            Yêu Cầu Đăng Ký Tài Khoản
                          </div>
                          <div className="text-xs font-semibold text-slate-800">
                            Bấm vào đây để đặt Biệt Danh (10 giây) & mở khóa làm bài tập, nhận 120 Xu!
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  )}

                  <div className="pt-1 flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => {
                        soundManager.play('click');
                        setCurrentView('shop');
                      }}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Studio Của Tôi</span>
                    </button>
                    <button
                      onClick={() => {
                        soundManager.play('click');
                        setCurrentView('leaderboard');
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 fill-slate-950" />
                      <span>Đua Top Bảng Vàng</span>
                    </button>
                    <button
                      onClick={() => {
                        soundManager.play('click');
                        setIsCardModalOpen(true);
                      }}
                      className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs rounded-xl backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Thẻ Học Sinh Cấp {student.level}</span>
                    </button>
                  </div>
                </div>

                {/* Animated Avatar Character Display */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-32 h-36 sm:w-44 sm:h-48 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center p-2 shadow-2xl overflow-visible">
                    <AvatarRenderer config={student.avatarConfig} size="md" />
                  </div>
                  <span className="mt-2 text-xs font-bold text-blue-200 bg-black/30 px-3 py-0.5 rounded-full">
                    {student.isGuest ? 'Khách ghé thăm' : `${student.grade} • ${student.school}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Full Subjects, Grades & Terms Course Selector */}
            <div className="max-w-6xl mx-auto px-4 pt-2">
              <SubjectCourseSelector
                currentSubjectId={currentSubjectId}
                currentGrade={currentGrade}
                currentTerm={currentTerm}
                onSelectCourse={(subjId, grade, term) => {
                  setCurrentSubjectId(subjId);
                  setCurrentGrade(grade);
                  setCurrentTerm(term);
                }}
              />
            </div>

            {/* Arena Lessons Browser & Quiz (Grades 1-9 & Math 6 Term 1 + Term 2) */}
            <MathGameArena
              student={student}
              subjectId={currentSubjectId}
              currentGrade={currentGrade}
              currentTerm={currentTerm}
              onUpdateStudent={handleUpdateStudent}
              onNavigateToShop={() => setCurrentView('shop')}
              onRequireLogin={handleRequireLogin}
            />
          </div>
        )}

        {/* VIEW 2: STUDIO CỦA TÔI */}
        {currentView === 'shop' && (
          <AvatarStudio
            student={student}
            onUpdateStudent={handleUpdateStudent}
            onNavigateToStudy={() => setCurrentView('study')}
            onRequireLogin={handleRequireLogin}
          />
        )}

        {/* VIEW 3: SPEED RUN BLITZ (60s) */}
        {currentView === 'blitz' && (
          <SpeedRunBlitz
            student={student}
            onUpdateStudent={handleUpdateStudent}
            onNavigateToShop={() => setCurrentView('shop')}
            onRequireLogin={handleRequireLogin}
          />
        )}

        {/* VIEW 4: ADVENTURE MAP (Vibrant Vector Island Map, No Blackout) */}
        {currentView === 'map' && (
          <AdventureMap
            student={student}
            onSelectLesson={handleLessonSelectedFromMap}
            onRequireLogin={handleRequireLogin}
          />
        )}

        {/* VIEW 5: GLOBAL LEADERBOARD */}
        {currentView === 'leaderboard' && (
          <GlobalLeaderboard
            student={student}
            onNavigateToStudy={() => setCurrentView('study')}
            onNavigateToBlitz={() => setCurrentView('blitz')}
            onNavigateToShop={() => setCurrentView('shop')}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />
        )}
      </main>

      {/* Footer with Brand Logo & Version Info */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img 
              src={APP_LOGO_SRC} 
              alt="Học Siêu Vui Logo" 
              className="w-7 h-7 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-800" 
            />
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Học Siêu Vui by dungvt.hbh VNPT
            </span>
            <span className="text-[10px] font-extrabold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full uppercase">
              {CURRENT_VERSION}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                soundManager.play('click');
                setIsLoginModalOpen(true);
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Hồ Sơ & Biệt Danh
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                setCurrentView('shop');
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Studio Của Tôi
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                setIsLoginModalOpen(true);
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Thống Kê
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                setIsCardModalOpen(true);
              }}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Thẻ Vinh Danh
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                setIsUpdateNoticeOpen(true);
              }}
              className="hover:text-blue-600 flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Bản Cập Nhật ({CURRENT_VERSION})</span>
            </button>
            <button
              onClick={() => {
                soundManager.play('click');
                setIsAdminModalOpen(true);
              }}
              className="hover:text-indigo-600 flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Quản Trị Viên (dungvt.hbh@gmail.com)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Version & Update Announcement Modal */}
      {isUpdateNoticeOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsUpdateNoticeOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <img 
                src={APP_LOGO_SRC} 
                alt="Logo" 
                className="w-12 h-12 rounded-2xl object-cover shadow-md border border-blue-200 dark:border-blue-800 shrink-0" 
              />
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 rounded-full">
                  {CURRENT_VERSION}
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5">
                  Học Siêu Vui by dungvt.hbh VNPT
                </h3>
              </div>
            </div>

            {/* Simple, Professional Update Highlights */}
            <div className="space-y-3 pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Chào mừng các bạn học sinh đến với nền tảng học tập <strong>Học Siêu Vui</strong>! Cùng nhau chinh phục các bài học SGK Toán 6, tích lũy điểm thưởng và so tài trên bảng vàng.
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span><strong>Biểu tượng 3D Mascot:</strong> Người bạn đồng hành học tập ngộ nghĩnh và vui tươi.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span><strong>Học & làm bài tập SGK Toán 6:</strong> Đăng ký tài khoản để bắt đầu thử thách và lưu thành tích.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span><strong>Studio của tôi:</strong> Thỏa sức tạo hình đại diện nhân vật, sắm phụ kiện và phương tiện.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span><strong>Bảng Xếp Hạng:</strong> Thi đua tích lũy Xu 🪙 và Sao ⭐ cùng bạn bè.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsUpdateNoticeOpen(false)}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Đã Hiểu & Bắt Đầu Học
            </button>
          </div>
        </div>
      )}

      {/* Profile & Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        activeStudent={student}
        onLogout={handleLogout}
      />

      {/* Student ID Card Modal */}
      <StudentIdCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        student={student}
      />

      {/* Super Admin Modal for dungvt.hbh VNPT */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onStudentModified={() => setStudent(getActiveStudent())}
      />

      {/* PWA Install & Social Sharing Modal */}
      <InstallShareModal
        isOpen={isInstallShareOpen}
        onClose={() => setIsInstallShareOpen(false)}
      />

      {/* Trợ Lý Ảo Học Siêu Vui & Hộp Thư Góp Ý */}
      <VirtualAssistant
        student={student}
        onNavigateToView={(view) => {
          setCurrentView(view);
        }}
      />
    </div>
  );
}
