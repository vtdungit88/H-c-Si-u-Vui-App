import React from 'react';
import { Award, Bell, ChevronRight, ShieldCheck, Sparkles, Trophy, UserPlus, Users } from 'lucide-react';
import type { StudentProfile } from '../../types';
import { APP_LOGO_SRC } from '../../data/versionHistory';
import { AvatarRenderer } from '../AvatarRenderer';
import { CoinIcon, StarIcon } from '../GameIcons';

interface Props {
  student: StudentProfile;
  onRegister: () => void;
  onOpenShop: () => void;
  onOpenLeaderboard: () => void;
  onOpenCard: () => void;
  onOpenNews: () => void;
  onOpenLobby?: () => void;
  onOpenLevel?: () => void;
}

/** Section 1: greeting. */
export const HomeHero: React.FC<Props> = ({
  student,
  onRegister,
  onOpenShop,
  onOpenLeaderboard,
  onOpenCard,
  onOpenNews,
  onOpenLobby,
  onOpenLevel
}) => {
  const guest = student.isGuest;
  return (
    <section className="relative overflow-hidden rounded-[2rem] shadow-xl text-white bg-gradient-to-br from-indigo-700 via-violet-600 to-fuchsia-600">
      {/* decorative blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-16 -left-10 w-56 h-56 rounded-full bg-sky-400/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 right-10 w-72 h-72 rounded-full bg-amber-400/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-6 right-1/3 text-4xl opacity-30 select-none">✨</div>
      <div className="relative z-10 p-6 sm:p-9 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-2xl space-y-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/30">
              <img src={APP_LOGO_SRC} alt="" className="w-4 h-4 rounded-md object-cover" />
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-200">Vừa học vừa chơi</span>
            </span>
            <button
              onClick={onOpenNews}
              className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full inline-flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-amber-200" /> Có gì mới
            </button>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
            {guest ? (
              <>
                Chào bạn nhỏ!{' '}
                <span className="block bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Hôm nay mình học gì nào?
                </span>
              </>
            ) : (
              <>
                Chào <span className="bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-300 bg-clip-text text-transparent">{student.name}</span>!
                <span className="block">Hôm nay học gì thật vui nào? 🚀</span>
              </>
            )}
          </h1>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-xl">
            Làm bài, gom <b className="text-amber-200">Xu</b> <CoinIcon className="w-5 h-5 align-text-bottom" /> và{' '}
            <b className="text-amber-200">Sao</b> <StarIcon className="w-5 h-5 align-text-bottom" />, lên cấp rồi cùng bạn bè vào{' '}
            <b className="text-emerald-200">Sảnh Online & Du Hành Xuyên Việt</b>!
          </p>
          {guest ? (
            <button
              onClick={onRegister}
              className="group w-full sm:w-auto inline-flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-300 to-orange-400 text-slate-900 font-black shadow-lg hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" /> Tạo biệt danh – chỉ 10 giây, nhận 120 Xu!
              </span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3 py-1.5 text-sm font-bold">
                <CoinIcon className="w-5 h-5" /> {student.coins} Xu
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 rounded-full px-3 py-1.5 text-sm font-bold">
                <StarIcon className="w-5 h-5" /> {student.stars} Sao
              </span>
              <button
                type="button"
                onClick={onOpenLevel}
                className="inline-flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/35 rounded-full px-3 py-1.5 text-sm font-bold cursor-pointer transition-colors"
              >
                <Award className="w-4 h-4 text-amber-300" /> Cấp {student.level}
              </button>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
            {onOpenLobby && (
              <button
                onClick={onOpenLobby}
                className="px-4 py-2.5 bg-emerald-400 text-slate-950 font-black text-sm rounded-xl shadow-md hover:scale-105 transition-transform inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Users className="w-4 h-4" /> Sảnh Online & Du Hành
              </button>
            )}
            <button
              onClick={onOpenShop}
              className="px-4 py-2.5 bg-white text-indigo-700 font-black text-sm rounded-xl shadow-md hover:scale-105 transition-transform inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Studio của tôi
            </button>
            <button
              onClick={onOpenLeaderboard}
              className="px-4 py-2.5 bg-amber-300 text-slate-900 font-black text-sm rounded-xl shadow-md hover:scale-105 transition-transform inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-4 h-4" /> Bảng vàng
            </button>
            <button
              onClick={onOpenCard}
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 font-bold text-sm rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> Thẻ học sinh
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0">
          <div className="w-36 h-40 sm:w-48 sm:h-52 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center p-2 shadow-2xl">
            <AvatarRenderer config={student.avatarConfig} size="md" />
          </div>
          <button
            type="button"
            onClick={onOpenLevel}
            className="mt-2 text-xs font-bold bg-black/25 hover:bg-black/40 px-3 py-0.5 rounded-full cursor-pointer transition-colors"
          >
            {guest ? 'Khách ghé thăm' : `Cấp ${student.level} · Xem Thăng Cấp`}
          </button>
        </div>
      </div>
    </section>
  );
};
