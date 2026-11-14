import React, { useState, useEffect } from 'react';
import { StudentProfile, MathLesson } from './types';
import { getActiveStudent, createInitialProfile, setActiveStudentId, scrubLegacyPasswords } from './utils/studentStorage';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { loadStudentProfile, signOut, isPlatformAdmin, getVisitStats, type VisitStats } from './lib/api';
import { useOnlineCount, useRecordVisit } from './lib/presence';
import { soundManager } from './utils/audio';
import { CoinIcon, StarIcon } from './components/GameIcons';
import { Navbar } from './components/Navbar';
import { AvatarStudio } from './components/AvatarStudio';
import { MathGameArena } from './components/MathGameArena';
import { ArenaHub } from './components/arena/ArenaHub';
import { AdventureMap } from './components/AdventureMap';
import { LoginModal } from './components/LoginModal';
import { StudentIdCardModal } from './components/StudentIdCardModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { InstallShareModal } from './components/InstallShareModal';
import { AvatarRenderer } from './components/AvatarRenderer';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { HomeHero } from './components/home/HomeHero';
import { SubjectGrid } from './components/home/SubjectGrid';
import { CoursePicker } from './components/home/CoursePicker';
import { MapPreview } from './components/home/MapPreview';
import { SubjectIcon } from './components/home/subjectIcons';
import { SUBJECTS_CATALOG } from './data/subjectsCatalog';
import type { SubjectMeta } from './types';
import { VirtualAssistant } from './components/VirtualAssistant';
import { MascotReaction } from './components/MascotReaction';
import { APP_LOGO_SRC } from './data/versionHistory';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [visitStats, setVisitStats] = useState<VisitStats | null>(null);
  const onlineCount = useOnlineCount();
  useRecordVisit();
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const t = setTimeout(() => { getVisitStats().then(setVisitStats).catch(() => undefined); }, 1200);
    return () => clearTimeout(t);
  }, []);
  const [currentView, setCurrentView] = useState<'study' | 'shop' | 'blitz' | 'map' | 'leaderboard'>('study');
  const [currentSubjectId, setCurrentSubjectId] = useState<string>('math');
  const [learning, setLearning] = useState(false);
  const [pendingLesson, setPendingLesson] = useState<string | null>(null);
  const [pickSubject, setPickSubject] = useState<SubjectMeta | null>(null);
  const activeSubjectMeta = SUBJECTS_CATALOG.find((x) => x.id === currentSubjectId) ?? SUBJECTS_CATALOG[0];
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
        setIsAdmin(false);
        const guest = createInitialProfile('Bé Siêu Vui', '6', '', 'boy', true);
        setActiveStudentId(guest.id);
        if (!cancelled) setStudent(guest);
        return;
      }
      try {
        const p = await loadStudentProfile(user as never);
        if (!cancelled) setStudent(p);
        const adm = await isPlatformAdmin(user.id);
        if (!cancelled) setIsAdmin(adm);
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

  const handleStartNode = (subjectId: string, grade: number, lessonCode: string) => {
    setCurrentSubjectId(subjectId);
    setCurrentGrade(String(grade) as GradeLevel);
    setCurrentTerm(1);
    setPickSubject(null);
    setPendingLesson(lessonCode);
    setLearning(true);
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
        onSelectView={(v) => {
          if (v === 'study' && currentView === 'study') { setLearning(false); setPickSubject(null); }
          setCurrentView(v);
        }}
        student={student}
        onOpenProfile={() => setIsLoginModalOpen(true)}
        onOpenCard={() => setIsCardModalOpen(true)}
        onLogout={handleLogout}
        onOpenAdmin={isAdmin ? () => setIsAdminModalOpen(true) : undefined}
        onlineCount={onlineCount ?? undefined}
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
          <div className="max-w-6xl mx-auto px-4 pt-4 sm:pt-6 space-y-8">
            {learning ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                    <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeSubjectMeta.color} text-white flex items-center justify-center`}><SubjectIcon name={activeSubjectMeta.iconName} className="w-5 h-5" /></span>
                    <span>{activeSubjectMeta.name} · Lớp {currentGrade} · Tập {currentTerm}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {([1, 2] as const).map((t) => (
                      <button key={t} onClick={() => { soundManager.play('click'); setCurrentTerm(t); }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${currentTerm === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>Tập {t}</button>
                    ))}
                    <button onClick={() => { soundManager.play('click'); setLearning(false); setPickSubject(null); }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer">Đổi môn / lớp</button>
                  </div>
                </div>
                <MathGameArena
                  student={student}
                  subjectId={currentSubjectId}
                  currentGrade={currentGrade}
                  currentTerm={currentTerm}
                  onUpdateStudent={handleUpdateStudent}
                  onNavigateToShop={() => setCurrentView('shop')}
                  onRequireLogin={handleRequireLogin}
                  autoStartLessonCode={pendingLesson}
                  onAutoStartConsumed={() => setPendingLesson(null)}
                />
              </>
            ) : (
              <>
                <HomeHero
                  student={student}
                  onRegister={() => { soundManager.play('click'); setIsLoginModalOpen(true); }}
                  onOpenShop={() => { soundManager.play('click'); setCurrentView('shop'); }}
                  onOpenLeaderboard={() => { soundManager.play('click'); setCurrentView('leaderboard'); }}
                  onOpenCard={() => { soundManager.play('click'); setIsCardModalOpen(true); }}
                  onOpenNews={() => { soundManager.play('click'); setIsUpdateNoticeOpen(true); }}
                />
                {pickSubject ? (
                  <CoursePicker
                    subject={pickSubject}
                    onBack={() => setPickSubject(null)}
                    onStart={(grade, term) => {
                      soundManager.play('click');
                      setCurrentSubjectId(pickSubject.id);
                      setCurrentGrade(grade);
                      setCurrentTerm(term);
                      setLearning(true);
                    }}
                  />
                ) : (
                  <SubjectGrid onPick={(subj) => { soundManager.play('click'); if (subj.status === 'active') setPickSubject(subj); }} />
                )}
                <MapPreview
                  student={student}
                  onOpen={() => {
                    const g = parseInt(String(student.grade).replace(/\D/g, ''), 10);
                    if (g >= 1 && g <= 9) setCurrentGrade(String(g) as typeof currentGrade);
                    setCurrentView('map');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </>
            )}
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
          <ArenaHub
            student={student}
            onUpdateStudent={handleUpdateStudent}
            onRequireLogin={handleRequireLogin}
          />
        )}

        {/* VIEW 4: ADVENTURE MAP (Vibrant Vector Island Map, No Blackout) */}
        {currentView === 'map' && (
          <AdventureMap
            student={student}
            initialSubjectId={currentSubjectId}
            initialGrade={Number(currentGrade)}
            onStartNode={handleStartNode}
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
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-semibold" aria-label="Thống kê truy cập">
            <span>Lượt truy cập: <b>{visitStats ? visitStats.total_visits.toLocaleString('vi-VN') : '—'}</b></span>
            <span>Hôm nay: <b>{visitStats ? visitStats.today_visits.toLocaleString('vi-VN') : '—'}</b></span>
            <span>Đang online: <b>{onlineCount ?? '—'}</b></span>
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
              <span>Có gì mới</span>
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
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Học Siêu Vui by dungvt.hbh VNPT
                </h3>
              </div>
            </div>

            {/* Simple, Professional Update Highlights */}
            <div className="space-y-3 pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Chào mừng các bạn học sinh đến với nền tảng học tập <strong>Học Siêu Vui</strong>! Cùng nhau chinh phục các bài học Toán và Khoa học tự nhiên, tích lũy điểm thưởng và so tài trên bảng vàng.
              </p>

              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span><strong>Biểu tượng 3D Mascot:</strong> Người bạn đồng hành học tập ngộ nghĩnh và vui tươi.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span><strong>Học & làm bài tập:</strong> Toán lớp 1–9 và Khoa học tự nhiên 6. Đăng ký tài khoản để bắt đầu thử thách và lưu thành tích.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span><strong>Studio của tôi:</strong> Thỏa sức tạo hình đại diện nhân vật, sắm phụ kiện và phương tiện.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span><strong>Bảng Xếp Hạng:</strong> Thi đua tích lũy Xu <CoinIcon className="w-4 h-4 align-text-bottom" /> và Sao <StarIcon className="w-4 h-4 align-text-bottom" /> cùng bạn bè.</span>
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
      />

      {/* PWA Install & Social Sharing Modal */}
      <InstallShareModal
        isOpen={isInstallShareOpen}
        onClose={() => setIsInstallShareOpen(false)}
      />

      <MascotReaction />
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
