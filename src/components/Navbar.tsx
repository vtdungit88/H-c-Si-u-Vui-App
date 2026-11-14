import React from 'react';
import { StudentProfile } from '../types';
import { soundManager } from '../utils/audio';
import { AvatarRenderer } from './AvatarRenderer';
import { APP_LOGO_SRC } from '../data/versionHistory';
import {
  BookOpen,
  Sparkles,
  Zap,
  Map,
  Volume2,
  VolumeX,
  IdCard,
  Trophy,
  LogOut,
  ShieldCheck,
  Download,
  Users,
  Award
} from 'lucide-react';
import { CoinIcon, StarIcon } from './GameIcons';

export type AppView = 'study' | 'shop' | 'blitz' | 'map' | 'leaderboard' | 'lobby';

interface NavbarProps {
  currentView: AppView;
  onSelectView: (view: AppView) => void;
  student: StudentProfile;
  onOpenProfile: () => void;
  onOpenCard: () => void;
  onOpenLevel?: () => void;
  onLogout?: () => void;
  onOpenAdmin?: () => void;
  onOpenInstallShare?: () => void;
  onlineCount?: number;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  student,
  onOpenProfile,
  onOpenCard,
  onOpenLevel,
  onLogout,
  onOpenAdmin,
  onOpenInstallShare,
  onlineCount,
  isMuted,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-2 md:gap-3 xl:gap-4">
        {/* Zone 1: Brand Wordmark with Mascot Logo */}
        <div
          onClick={() => {
            soundManager.play('click');
            onSelectView('study');
          }}
          className="flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0 select-none group"
        >
          <img
            src={APP_LOGO_SRC}
            alt="Học Siêu Vui Mascot Logo"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform shrink-0 border border-blue-200 dark:border-blue-800"
          />
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base xl:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Học Siêu Vui
            </span>
            <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5">
              Vừa Học Vừa Chơi
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav
          aria-label="Điều hướng chính"
          className="hidden md:flex items-center gap-2.5 xl:gap-4 2xl:gap-5 text-xs xl:text-sm font-semibold text-slate-600 dark:text-slate-300 min-w-0"
        >
          <button
            onClick={() => {
              soundManager.play('click');
              onSelectView('study');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer ${
              currentView === 'study' ? 'text-blue-600 dark:text-blue-400 font-bold underline underline-offset-8' : ''
            }`}
            title="Bài Học SGK"
            aria-label="Bài Học SGK"
          >
            <BookOpen className="w-4 h-4 text-blue-500 xl:hidden" />
            <span className="hidden xl:inline">Bài Học</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              onSelectView('shop');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer ${
              currentView === 'shop' ? 'text-blue-600 dark:text-blue-400 font-bold underline underline-offset-8' : ''
            }`}
            title="Studio của tôi"
            aria-label="Studio của tôi"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden xl:inline">Studio</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              onSelectView('blitz');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer ${
              currentView === 'blitz' ? 'text-blue-600 dark:text-blue-400 font-bold underline underline-offset-8' : ''
            }`}
            title="Đấu Trường 60s"
            aria-label="Đấu Trường 60s"
          >
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="hidden xl:inline">Đấu Trường</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              onSelectView('map');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer ${
              currentView === 'map' ? 'text-blue-600 dark:text-blue-400 font-bold underline underline-offset-8' : ''
            }`}
            title="Bản Đồ Ải"
            aria-label="Bản Đồ Ải"
          >
            <Map className="w-4 h-4 text-emerald-500" />
            <span className="hidden xl:inline">Bản Đồ</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              onSelectView('lobby');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 cursor-pointer ${
              currentView === 'lobby' ? 'text-emerald-600 dark:text-emerald-400 font-bold underline underline-offset-8' : ''
            }`}
            title="Sảnh Giao Lưu & Du Hành Việt Nam"
            aria-label="Sảnh Giao Lưu"
          >
            <Users className="w-4 h-4 text-teal-500" />
            <span className="hidden xl:inline">Sảnh Online</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              onSelectView('leaderboard');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 cursor-pointer ${
              currentView === 'leaderboard' ? 'text-blue-600 dark:text-blue-400 font-bold underline underline-offset-8' : ''
            }`}
            title="Bảng Xếp Hạng"
            aria-label="Bảng Xếp Hạng"
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="hidden xl:inline">Xếp Hạng</span>
          </button>
        </nav>

        {/* Zone 3: Actions, Level, Wallet, Avatar Profile */}
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 shrink">
          {onlineCount !== undefined && (
            <div
              className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-xs select-none shrink-0"
              title="Số học sinh đang trực tuyến học & chơi"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{onlineCount} bạn online</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="hidden lg:inline-flex p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-blue-600" />}
          </button>

          {/* Install & Share App Button */}
          {onOpenInstallShare && (
            <button
              onClick={() => {
                soundManager.play('click');
                onOpenInstallShare();
              }}
              className="flex items-center gap-1 py-1.5 px-2 sm:px-2.5 shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
              title="Cài đặt App ra màn hình hoặc chia sẻ Zalo, Facebook"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden 2xl:inline">Cài Đặt App</span>
              <span className="2xl:hidden">App</span>
            </button>
          )}

          {/* Admin Panel Quick Trigger */}
          {onOpenAdmin && (
            <button
              onClick={() => {
                soundManager.play('click');
                onOpenAdmin();
              }}
              className="hidden xl:inline-flex p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors cursor-pointer shrink-0"
              title="Quản trị viên"
              aria-label="Quản trị viên"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          )}

          {/* Level Badge Button */}
          {onOpenLevel && (
            <button
              onClick={() => {
                soundManager.play('click');
                onOpenLevel();
              }}
              className="hidden sm:inline-flex items-center gap-1 shrink-0 px-2 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-extrabold cursor-pointer transition-colors"
              title="Xem Cấp Độ & Hộ Chiếu Việt Nam"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Lv.{student.level}</span>
            </button>
          )}

          {/* Quick Wallet preview */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 text-xs font-mono font-bold px-2 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <CoinIcon className="w-3.5 h-3.5" />
              {student.coins}
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
              <StarIcon className="w-3.5 h-3.5 fill-yellow-400" />
              {student.stars}
            </span>
          </div>

          {/* Student ID Card trigger */}
          <button
            onClick={() => {
              soundManager.play('click');
              onOpenCard();
            }}
            className="hidden lg:inline-flex p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Xem Thẻ Học Sinh"
            aria-label="Thẻ học sinh"
          >
            <IdCard className="w-5 h-5" />
          </button>

          {/* Active Student Profile Button */}
          <button
            onClick={() => {
              soundManager.play('click');
              onOpenProfile();
            }}
            className="flex items-center gap-2 py-1.5 px-2 sm:px-2.5 min-w-0 shrink bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-900 rounded-xl text-slate-900 dark:text-white transition-colors cursor-pointer"
            title="Hồ sơ & Đăng nhập"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
              <AvatarRenderer config={student.avatarConfig} size="sm" showVehicle={false} showTech={false} showPet={false} />
            </div>
            <div className="text-left hidden lg:block min-w-0">
              <div className="text-xs font-bold leading-none truncate max-w-[92px] 2xl:max-w-[150px]">{student.name}</div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 leading-none mt-0.5">
                {student.isGuest ? 'Khách ghé thăm' : `Cấp ${student.level}`}
              </div>
            </div>
          </button>

          {/* Logout Button (if registered/logged-in user) */}
          {!student.isGuest && onLogout && (
            <button
              onClick={() => {
                soundManager.play('click');
                onLogout();
              }}
              className="p-2 shrink-0 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              title="Đăng xuất tài khoản"
              aria-label="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar for easy thumb navigation */}
      <div className="md:hidden grid grid-cols-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-1 py-1 text-[10px] font-bold">
        <button
          onClick={() => {
            soundManager.play('click');
            onSelectView('study');
          }}
          className={`flex flex-col items-center py-1 px-0.5 rounded-lg transition-colors ${
            currentView === 'study' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="truncate">Bài Học</span>
        </button>
        <button
          onClick={() => {
            soundManager.play('click');
            onSelectView('shop');
          }}
          className={`flex flex-col items-center py-1 px-0.5 rounded-lg transition-colors ${
            currentView === 'shop' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="truncate">Studio</span>
        </button>
        <button
          onClick={() => {
            soundManager.play('click');
            onSelectView('blitz');
          }}
          className={`flex flex-col items-center py-1 px-0.5 rounded-lg transition-colors ${
            currentView === 'blitz' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Zap className="w-4 h-4 text-orange-500" />
          <span className="truncate">60 Giây</span>
        </button>
        <button
          onClick={() => {
            soundManager.play('click');
            onSelectView('map');
          }}
          className={`flex flex-col items-center py-1 px-0.5 rounded-lg transition-colors ${
            currentView === 'map' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Map className="w-4 h-4 text-emerald-500" />
          <span className="truncate">Bản Đồ</span>
        </button>
        <button
          onClick={() => {
            soundManager.play('click');
            onSelectView('lobby');
          }}
          className={`flex flex-col items-center py-1 px-0.5 rounded-lg transition-colors ${
            currentView === 'lobby' ? 'text-emerald-600' : 'text-slate-500'
          }`}
        >
          <Users className="w-4 h-4 text-teal-500" />
          <span className="truncate">Sảnh</span>
        </button>
        <button
          onClick={() => {
            soundManager.play('click');
            onSelectView('leaderboard');
          }}
          className={`flex flex-col items-center py-1 px-0.5 rounded-lg transition-colors ${
            currentView === 'leaderboard' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="truncate">Xếp Hạng</span>
        </button>
      </div>
    </header>
  );
};
