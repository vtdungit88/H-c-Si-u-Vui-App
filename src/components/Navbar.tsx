import React from 'react';
import { StudentProfile } from '../types';
import { soundManager } from '../utils/audio';
import { AvatarRenderer } from './AvatarRenderer';
import { APP_LOGO_SRC, CURRENT_VERSION } from '../data/versionHistory';
import { 
  BookOpen, 
  Sparkles, 
  Zap, 
  Map, 
  Volume2, 
  VolumeX, 
  User, 
  IdCard, 
  Coins, 
  Star,
  Trophy,
  LogOut,
  LogIn,
  ShieldCheck,
  Radio,
  Download,
  Share2
} from 'lucide-react';

interface NavbarProps {
  currentView: 'study' | 'shop' | 'blitz' | 'map' | 'leaderboard';
  onSelectView: (view: 'study' | 'shop' | 'blitz' | 'map' | 'leaderboard') => void;
  student: StudentProfile;
  onOpenProfile: () => void;
  onOpenCard: () => void;
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
  onLogout,
  onOpenAdmin,
  onOpenInstallShare,
  onlineCount = 18,
  isMuted,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark with Mascot Logo */}
        <div
          onClick={() => {
            soundManager.play('click');
            onSelectView('study');
          }}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 select-none group"
        >
          <img
            src={APP_LOGO_SRC}
            alt="Học Siêu Vui Mascot Logo"
            className="w-10 h-10 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform shrink-0 border border-blue-200 dark:border-blue-800"
          />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white leading-none">
              Học Siêu Vui
            </span>
            <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-0.5">
              Vừa Học Vừa Chơi
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => {
              soundManager.play('click');
              onSelectView('study');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 ${
              currentView === 'study' ? 'text-blue-600 dark:text-blue-400 font-bold underline underline-offset-8' : ''
            }`}
          >
            Bài Học SGK
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              onSelectView('shop');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 ${
              currentView === 'shop' ? 'text-blue-600 dark:text-blue-400 font-bold underline underline-offset-8' : ''
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Studio của tôi</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              onSelectView('blitz');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 ${
              currentView === 'blitz' ? 'text-blue-600 dark:text-blue-400 font-bold underline underline-offset-8' : ''
            }`}
          >
            <Zap className="w-4 h-4 text-orange-500" />
            <span>Đấu Trường 60s</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              onSelectView('map');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 ${
              currentView === 'map' ? 'text-blue-600 dark:text-blue-400 font-bold underline underline-offset-8' : ''
            }`}
          >
            <Map className="w-4 h-4 text-emerald-500" />
            <span>Bản Đồ Ải</span>
          </button>

          <button
            onClick={() => {
              soundManager.play('click');
              onSelectView('leaderboard');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 ${
              currentView === 'leaderboard' ? 'text-blue-600 dark:text-blue-400 font-bold underline underline-offset-8' : ''
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Bảng Xếp Hạng</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Profile Info */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Live Online Presence Indicator */}
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-xs select-none"
            title="Số học sinh đang trực tuyến học & chơi"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{onlineCount} bạn online</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
              className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-95"
              title="Cài đặt App ra màn hình hoặc chia sẻ Zalo, Facebook"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cài Đặt App</span>
              <span className="sm:hidden">App</span>
            </button>
          )}

          {/* Admin Panel Quick Trigger */}
          {onOpenAdmin && (
            <button
              onClick={() => {
                soundManager.play('click');
                onOpenAdmin();
              }}
              className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-xl transition-colors cursor-pointer"
              title="Quản trị viên (dungvt.hbh@gmail.com)"
              aria-label="Quản trị viên"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
          )}

          {/* Quick Wallet preview */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
              <Coins className="w-3.5 h-3.5" />
              {student.coins}
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
              <Star className="w-3.5 h-3.5 fill-yellow-400" />
              {student.stars}
            </span>
          </div>

          {/* Student ID Card trigger */}
          <button
            onClick={() => {
              soundManager.play('click');
              onOpenCard();
            }}
            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors cursor-pointer"
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
            className="flex items-center gap-2 py-1.5 px-3 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-900 rounded-xl text-slate-900 dark:text-white transition-colors cursor-pointer"
            title="Hồ sơ & Đăng nhập"
          >
            <div className="w-7 h-7 rounded-lg overflow-hidden bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
              <AvatarRenderer config={student.avatarConfig} size="sm" showVehicle={false} showTech={false} showPet={false} />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold leading-none truncate max-w-[95px]">{student.name}</div>
              <div className="text-[10px] text-blue-600 dark:text-blue-400 leading-none mt-0.5">
                {student.isGuest ? 'Khách ghé thăm' : student.grade}
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
              className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              title="Đăng xuất tài khoản"
              aria-label="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar for easy thumb navigation */}
      <div className="hsv-mobile-nav md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-2 py-1.5 text-[11px] font-bold">
        <button
          onClick={() => {
            soundManager.play('click');
            onSelectView('study');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            currentView === 'study' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Bài Học</span>
        </button>

        <button
          onClick={() => {
            soundManager.play('click');
            onSelectView('shop');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            currentView === 'shop' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Studio</span>
        </button>

        <button
          onClick={() => {
            soundManager.play('click');
            onSelectView('blitz');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            currentView === 'blitz' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Zap className="w-4 h-4 text-orange-500" />
          <span>60 Giây</span>
        </button>

        <button
          onClick={() => {
            soundManager.play('click');
            onSelectView('map');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            currentView === 'map' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Map className="w-4 h-4 text-emerald-500" />
          <span>Bản Đồ</span>
        </button>

        <button
          onClick={() => {
            soundManager.play('click');
            onSelectView('leaderboard');
          }}
          className={`flex flex-col items-center py-1 px-2 rounded-lg transition-colors ${
            currentView === 'leaderboard' ? 'text-blue-600' : 'text-slate-500'
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Xếp Hạng</span>
        </button>
      </div>
    </header>
  );
};
