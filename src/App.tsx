import React, { useState, useEffect } from 'react';
import { StudentProfile } from './types';
import { createInitialProfile, setActiveStudentId, scrubLegacyPasswords } from './utils/studentStorage';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import {
  fetchHubState,
  loadStudentProfile,
  signOut,
  isPlatformAdmin,
  getVisitStats,
  type HubState,
  type VisitStats
} from './lib/api';
import { getVisitorId, useOnlineCount, useRecordVisit } from './lib/presence';
import { levelFromXp } from './data/levels';
import { soundManager } from './utils/audio';
import { CoinIcon, StarIcon } from './components/GameIcons';
import { Navbar, type AppView } from './components/Navbar';
import { AvatarStudio } from './components/AvatarStudio';
import { MathGameArena } from './components/MathGameArena';
import { ArenaHub } from './components/arena/ArenaHub';
import { AdventureMap } from './components/AdventureMap';
import { LoginModal } from './components/LoginModal';
import { LegalCenter, type LegalPageKey } from './components/LegalCenter';
import { StudentIdCardModal } from './components/StudentIdCardModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { InstallShareModal } from './components/InstallShareModal';
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
import { AppBackdrop } from './components/AppBackdrop';
import { SocialLobbyView } from './components/SocialLobbyView';
import { LevelProgressionView } from './components/LevelProgressionView';
import { VietnamTravelModal } from './components/VietnamTravelModal';
import { APP_LOGO_SRC } from './data/versionHistory';
import { GradeLevel, SchoolLevel } from './types';
import { ShieldCheck, Bell, X } from 'lucide-react';

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
  const [hubState, setHubState] = useState<HubState | null>(null);
  const [cityOnlineCounts, setCityOnlineCounts] = useState<Record<string, number>>({});
  const onlineCount = useOnlineCount();
  useRecordVisit();
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const t = setTimeout(() => {
      getVisitStats().then(setVisitStats).catch(() => undefined);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const [currentView, setCurrentView] = useState<AppView>('study');
  const [currentSubjectId, setCurrentSubjectId] = useState<string>('math');
  const [learning, setLearning] = useState(false);
  const [pendingLesson, setPendingLesson] = useState<string | null>(null);
  const [pickSubject, setPickSubject] = useState<SubjectMeta | null>(null);
  const [pickLevel, setPickLevel] = useState<SchoolLevel | undefined>(undefined);
  const activeSubjectMeta = SUBJECTS_CATALOG.find((x) => x.id === currentSubjectId) ?? SUBJECTS_CATALOG[0];
  const [currentGrade, setCurrentGrade] = useState<GradeLevel>('6');
  const [currentTerm, setCurrentTerm] = useState<1 | 2>(1);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [legalPage, setLegalPage] = useState<LegalPageKey | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isInstallShareOpen, setIsInstallShareOpen] = useState(false);
  const [isUpdateNoticeOpen, setIsUpdateNoticeOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [showTicker, setShowTicker] = useState(true);
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuted());

  // Restore the Supabase session and keep the profile in sync with auth state.
  useEffect(() => {
    let cancelled = false;
    const hydrate = async (user: { id: string } | null) => {
      if (!user) {
        setIsAdmin(false);
        setHubState(null);
        const guest = createInitialProfile('Bé Siêu Vui', '6', '', 'boy', true);
        setActiveStudentId(guest.id);
        if (!cancelled) setStudent(guest);
        return;
      }
      try {
        const p = await loadStudentProfile(user as never);
        if (!cancelled) setStudent(p);
        const [adm, hub] = await Promise.all([
          isPlatformAdmin(user.id),
          fetchHubState().catch(() => null)
        ]);
        if (!cancelled) {
          setIsAdmin(adm);
          setHubState(hub);
          if (hub) {
            setStudent((prev) => ({
              ...prev,
              coins: hub.coins,
              exp: hub.xp,
              level: levelFromXp(hub.xp)
            }));
          }
        }
      } catch (e) {
        console.error('Không tải được hồ sơ', e);
      }
    };
    supabase.auth
      .getSession()
      .then(({ data }) => hydrate(data.session?.user ?? null))
      .finally(() => !cancelled && setAuthReady(true));
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      // Defer to avoid awaiting Supabase calls inside the auth callback.
      setTimeout(() => hydrate(session?.user ?? null), 0);
    });
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Track real online occupancy per city destination across users
  const activeDestKey = hubState?.current_dest || 'hanoi_school';
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const presenceKey = student.isGuest ? `guest:${getVisitorId()}` : student.id;
    const channel = supabase.channel('hsv-cities-presence', {
      config: { presence: { key: presenceKey } }
    });
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState<{ destKey?: string; inLobby?: boolean }>();
        const counts: Record<string, number> = {};
        for (const list of Object.values(state)) {
          if (!Array.isArray(list) || list.length === 0) continue;
          const latest = list[list.length - 1];
          if (latest?.inLobby && latest?.destKey) {
            counts[latest.destKey] = (counts[latest.destKey] || 0) + 1;
          }
        }
        setCityOnlineCounts(counts);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            destKey: activeDestKey,
            inLobby: currentView === 'lobby'
          });
        }
      });

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [activeDestKey, currentView, student.id, student.isGuest]);

  // Handle sound toggle
  const handleToggleSound = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundManager.play('click');
    }
  };

  const handleUpdateStudent = (updated: StudentProfile) => {
    const syncedLevel = levelFromXp(updated.exp);
    const next = { ...updated, level: syncedLevel };
    setStudent(next);
    setHubState((prev) =>
      prev
        ? {
            ...prev,
            coins: next.coins,
            xp: next.exp,
            level: syncedLevel
          }
        : prev
    );
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

  if (!authReady) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 mx-auto rounded-2xl border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Đang kết nối Học Siêu Vui…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-sky-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-blue-500 selection:text-white">
      <AppBackdrop view={currentView} />
      {/* 3-Zone Navigation Header */}
      <Navbar
        currentView={currentView}
        onSelectView={(v) => {
          if (v === 'study' && currentView === 'study') {
            setLearning(false);
            setPickSubject(null);
          }
          setCurrentView(v);
        }}
        student={student}
        onOpenProfile={() => setIsLoginModalOpen(true)}
        onOpenCard={() => setIsCardModalOpen(true)}
        onOpenLevel={() => setIsLevelModalOpen(true)}
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
              🎉 <strong>Mới: Cấp Độ & Sảnh Online Du Hành Xuyên Việt!</strong> Làm bài lên Cấp nhận thưởng Xu • Vào Sảnh giao lưu & đi Hồ Gươm, Hạ Long, Đà Nẵng, Đà Lạt, TP.HCM, Phú Quốc!
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={() => {
                soundManager.play('click');
                setCurrentView('lobby');
              }}
              className="px-2 py-0.5 bg-black/30 hover:bg-black/40 text-amber-200 hover:text-white rounded-md text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>✈️ Sảnh & Du Hành</span>
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
      <main className="relative z-10 flex-1 pb-20 md:pb-8">
        {/* VIEW 1: STUDY & ARENA */}
        {currentView === 'study' && (
          <div className="max-w-6xl mx-auto px-4 pt-4 sm:pt-6 space-y-8">
            {learning ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white">
                    <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeSubjectMeta.color} text-white flex items-center justify-center`}>
                      <SubjectIcon name={activeSubjectMeta.iconName} className="w-5 h-5" />
                    </span>
                    <span>
                      {activeSubjectMeta.name} · Lớp {currentGrade} · Tập {currentTerm}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {([1, 2] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          soundManager.play('click');
                          setCurrentTerm(t);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                          currentTerm === t
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Tập {t}
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        soundManager.play('click');
                        setLearning(false);
                        setPickSubject(null);
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer"
                    >
                      Đổi môn / lớp
                    </button>
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
                  onRegister={() => {
                    soundManager.play('click');
                    setIsLoginModalOpen(true);
                  }}
                  onOpenShop={() => {
                    soundManager.play('click');
                    setCurrentView('shop');
                  }}
                  onOpenLeaderboard={() => {
                    soundManager.play('click');
                    setCurrentView('leaderboard');
                  }}
                  onOpenCard={() => {
                    soundManager.play('click');
                    setIsCardModalOpen(true);
                  }}
                  onOpenNews={() => {
                    soundManager.play('click');
                    setIsUpdateNoticeOpen(true);
                  }}
                  onOpenLobby={() => {
                    soundManager.play('click');
                    setCurrentView('lobby');
                  }}
                  onOpenLevel={() => {
                    soundManager.play('click');
                    setIsLevelModalOpen(true);
                  }}
                />
                {pickSubject ? (
                  <CoursePicker
                    key={`${pickSubject.id}-${pickLevel ?? "auto"}`}
                    subject={pickSubject}
                    initialLevel={pickLevel}
                    onBack={() => setPickSubject(null)}
                    onStart={(grade, term) => {
                      soundManager.play('click');
                      setCurrentSubjectId(pickSubject.id);
                      setCurrentGrade(grade);
                      setCurrentTerm(term);
                      setLearning(true);
                    }}
                    onJumpToActive={(targetSubj, lv) => {
                      soundManager.play('click');
                      setPickSubject(targetSubj);
                      setPickLevel(lv);
                    }}
                  />
                ) : (
                  <SubjectGrid
                    onPick={(subj, lv) => {
                      soundManager.play('click');
                      setPickSubject(subj);
                      setPickLevel(lv);
                    }}
                  />
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

        {/* VIEW 5: SOCIAL LOBBY & VIETNAM TRAVEL */}
        {currentView === 'lobby' && (
          <SocialLobbyView
            student={student}
            hubState={hubState}
            cityOnlineCounts={cityOnlineCounts}
            onUpdateStudent={handleUpdateStudent}
            onHubStateChange={setHubState}
            onOpenTravel={() => setIsTravelModalOpen(true)}
            onOpenLevel={() => setIsLevelModalOpen(true)}
            onNavigateToBlitz={() => setCurrentView('blitz')}
            onNavigateToShop={() => setCurrentView('shop')}
            onRequireLogin={handleRequireLogin}
          />
        )}

        {/* VIEW 6: GLOBAL LEADERBOARD */}
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
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-slate-900 backdrop-blur py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src={APP_LOGO_SRC}
              alt="Học Siêu Vui Logo"
              className="w-7 h-7 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-800"
            />
            <span className="font-bold text-slate-800 dark:text-slate-200">Học Siêu Vui – Dự án độc lập</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] font-semibold" aria-label="Thống kê truy cập">
            <span>
              Lượt truy cập: <b>{visitStats ? visitStats.total_visits.toLocaleString('vi-VN') : '—'}</b>
            </span>
            <span>
              Hôm nay: <b>{visitStats ? visitStats.today_visits.toLocaleString('vi-VN') : '—'}</b>
            </span>
            <span>
              Đang online: <b>{onlineCount ?? '—'}</b>
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
                setCurrentView('lobby');
              }}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Sảnh Online
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
        <nav
          className="max-w-6xl mx-auto mt-5 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-semibold"
          aria-label="Chính sách và pháp lý"
        >
          <button onClick={() => setLegalPage('privacy')} className="hover:text-blue-600">
            Quyền riêng tư
          </button>
          <button onClick={() => setLegalPage('terms')} className="hover:text-blue-600">
            Điều khoản sử dụng
          </button>
          <button onClick={() => setLegalPage('children')} className="hover:text-blue-600">
            Bảo vệ trẻ em
          </button>
          <button onClick={() => setLegalPage('cookies')} className="hover:text-blue-600">
            Cookie
          </button>
          <a href="mailto:dungvt.hbh@gmail.com" className="hover:text-blue-600">
            Liên hệ quyền riêng tư
          </a>
        </nav>
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
                  Học Siêu Vui – Cấp Độ & Du Hành Xuyên Việt
                </h3>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Phiên bản mới mở khóa hệ thống <strong>Cấp Độ (Lv 1–50)</strong>, <strong>Sảnh Giao Lưu Trực Tuyến</strong> và{' '}
                <strong>Bản Đồ Du Hành 10 Địa Danh 3D</strong> lấy Hà Nội làm trung tâm Km 0!
              </p>
              <div className="space-y-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                  <span>
                    <strong>Thăng Cấp nhận thưởng Xu:</strong> Cày XP từ bài học & Đấu trường để lên cấp và nhận mốc thưởng lên tới 150 Xu.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span>
                    <strong>Sảnh Giao Lưu Trực Tuyến:</strong> Di chuyển nhân vật trong sân trường/địa danh 3D, trò chuyện bằng Chat Nhanh, Sticker & Chat Tự Do có lọc an toàn.
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0"></span>
                  <span>
                    <strong>Du Hành Xuyên Việt từ Hà Nội:</strong> Mua vé khứ hồi đi Hồ Gươm, Hạ Long, Sa Pa, Huế, Đà Nẵng, Nha Trang, Đà Lạt, TP.HCM, Phú Quốc (xe Studio giảm tới 30%!).
                  </span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                  <span>
                    <strong>Studio & Hộp Quà:</strong> Sắm trang bị mới và đố vui cùng Vui-Bot mỗi ngày nhận thêm Xu <CoinIcon className="w-4 h-4 align-text-bottom" /> và Sao <StarIcon className="w-4 h-4 align-text-bottom" />.
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsUpdateNoticeOpen(false)}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Đã Hiểu & Bắt Đầu Chơi
            </button>
          </div>
        </div>
      )}

      {/* Level Progression & Vietnam Passport Modal */}
      <LevelProgressionView
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
        student={student}
        hubState={hubState}
        onUpdateCoinsAndClaims={(nextCoins, claimedLevel) => {
          setStudent((prev) => ({ ...prev, coins: nextCoins }));
          setHubState((prev) =>
            prev
              ? {
                  ...prev,
                  coins: nextCoins,
                  claimed_levels: Array.from(new Set([...prev.claimed_levels, claimedLevel]))
                }
              : prev
          );
        }}
        onOpenTravel={() => {
          setIsLevelModalOpen(false);
          setCurrentView('lobby');
          setIsTravelModalOpen(true);
        }}
      />

      {/* Vietnam Travel Map & Round-Trip Ticket Modal */}
      <VietnamTravelModal
        isOpen={isTravelModalOpen}
        onClose={() => setIsTravelModalOpen(false)}
        student={student}
        hubState={hubState}
        currentDestKey={activeDestKey}
        cityOnlineCounts={cityOnlineCounts}
        onTravelSuccess={(nextDestKey, nextCoins, nextXp, stamps, totalKm) => {
          const nextLvl = levelFromXp(nextXp);
          setStudent((prev) => ({
            ...prev,
            coins: nextCoins,
            exp: nextXp,
            level: nextLvl
          }));
          setHubState((prev) => ({
            xp: nextXp,
            coins: nextCoins,
            level: nextLvl,
            next_level_xp: prev?.next_level_xp ?? 0,
            current_level_xp: prev?.current_level_xp ?? 0,
            claimed_levels: prev?.claimed_levels ?? [],
            current_dest: nextDestKey,
            stamps,
            total_km: totalKm,
            trivia_claimed_today: prev?.trivia_claimed_today ?? false
          }));
          setCurrentView('lobby');
        }}
        onRequireLogin={handleRequireLogin}
      />

      {/* Profile & Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        activeStudent={student}
        onLogout={handleLogout}
        onOpenLegal={(page) => {
          setIsLoginModalOpen(false);
          setLegalPage(page);
        }}
      />

      {/* Student ID Card Modal */}
      <StudentIdCardModal isOpen={isCardModalOpen} onClose={() => setIsCardModalOpen(false)} student={student} />

      {/* Super Admin Modal */}
      <AdminPanelModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} />

      {/* PWA Install & Social Sharing Modal */}
      <InstallShareModal isOpen={isInstallShareOpen} onClose={() => setIsInstallShareOpen(false)} />

      {legalPage && <LegalCenter page={legalPage} onClose={() => setLegalPage(null)} onNavigate={setLegalPage} />}

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
