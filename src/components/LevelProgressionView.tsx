import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { StudentProfile } from '../types';
import { DESTINATIONS } from '../data/destinations';
import { LEVEL_MILESTONES, RANK_TIERS, getLevelProgress } from '../data/levels';
import { claimLevelMilestone, type HubState } from '../lib/api';
import { isSupabaseConfigured } from '../lib/supabase';
import { soundManager } from '../utils/audio';
import { CoinIcon } from './GameIcons';
import { Award, Check, Lock, Sparkles, Trophy, X, MapPin, Loader2 } from 'lucide-react';

interface LevelProgressionViewProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  hubState: HubState | null;
  onUpdateCoinsAndClaims: (nextCoins: number, claimedLevel: number) => void;
  onOpenTravel: () => void;
}

export const LevelProgressionView: React.FC<LevelProgressionViewProps> = ({
  isOpen,
  onClose,
  student,
  hubState,
  onUpdateCoinsAndClaims,
  onOpenTravel
}) => {
  const [claimingLevel, setClaimingLevel] = useState<number | null>(null);
  const [notice, setNotice] = useState('');

  if (!isOpen) return null;

  const progress = getLevelProgress(hubState?.xp ?? student.exp);
  const claimedSet = new Set(hubState?.claimed_levels ?? []);
  const stamps = hubState?.stamps ?? { hanoi_school: 1 };
  const visitedCount = Object.keys(stamps).length;

  const handleClaim = async (level: number, rewardCoins: number) => {
    if (student.isGuest || !isSupabaseConfigured) {
      setNotice('Đăng nhập tài khoản để nhận thưởng Xu thăng cấp từ máy chủ nhé!');
      return;
    }
    setClaimingLevel(level);
    setNotice('');
    try {
      const res = await claimLevelMilestone(level);
      soundManager.play('levelUp');
      confetti({ particleCount: 55, spread: 70, origin: { y: 0.6 } });
      onUpdateCoinsAndClaims(res.coins, level);
      setNotice(
        res.already_claimed
          ? `Mốc Cấp ${level} đã được nhận trước đó rồi.`
          : `Chúc mừng! Đã nhận +${res.reward_coins ?? rewardCoins} Xu cho mốc Cấp ${level}!`
      );
    } catch (e) {
      soundManager.play('wrong');
      setNotice(e instanceof Error ? e.message : 'Chưa thể nhận mốc này lúc này.');
    } finally {
      setClaimingLevel(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                Hệ Thống Cấp Độ & Hộ Chiếu Việt Nam
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Làm bài, thi Đấu Trường 60s để tích lũy XP, lên cấp nhận Xu và mở khóa 10 điểm đến!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng bảng cấp độ"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Level & XP Card */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 border border-indigo-500/30 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${progress.rank.ringClass} bg-white/10 text-amber-200 border-white/25`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {progress.rank.title}
              </span>
              <div className="mt-2 flex items-baseline gap-2.5">
                <span className="text-4xl font-black tracking-tight tabular-nums">Cấp {progress.level}</span>
                <span className="text-sm font-bold text-indigo-200 tabular-nums">
                  ({progress.xp.toLocaleString('vi-VN')} XP)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="px-3.5 py-2 rounded-2xl bg-white/10 border border-white/15 text-xs">
                <div className="text-indigo-200">Số dư hiện tại</div>
                <div className="text-base font-black text-amber-300 flex items-center gap-1 tabular-nums">
                  <CoinIcon className="w-4 h-4" />
                  {student.coins.toLocaleString('vi-VN')} Xu
                </div>
              </div>
              <button
                onClick={() => {
                  soundManager.play('click');
                  onOpenTravel();
                }}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Mở Bản Đồ Du Hành
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-200 tabular-nums">
              <span>Tiến độ lên Cấp {Math.min(50, progress.level + 1)}</span>
              <span>
                {progress.level >= 50
                  ? 'Đạt cấp tối đa!'
                  : `${progress.intoLevel}/${progress.span} XP (còn ${progress.xpRemaining} XP)`}
              </span>
            </div>
            <div className="h-3.5 rounded-full bg-white/15 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-yellow-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        </div>

        {notice && (
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm font-bold text-indigo-800 dark:text-indigo-200">
            {notice}
          </div>
        )}

        {/* Rank Tiers Overview */}
        <section className="space-y-2.5">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            8 Bậc Danh Hiệu Học Tập
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {RANK_TIERS.map((tier) => {
              const active = progress.level >= tier.minLevel && progress.level <= tier.maxLevel;
              return (
                <div
                  key={tier.title}
                  className={`p-2.5 rounded-2xl border text-xs transition-all ${
                    active
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                  }`}
                >
                  <div className="font-black text-slate-900 dark:text-white truncate">{tier.title}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Cấp {tier.minLevel} – {tier.maxLevel}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Level Milestones (Claimable Xu Rewards) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" />
              Mốc Thưởng Thăng Cấp
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Đã nhận {claimedSet.size}/{LEVEL_MILESTONES.length} mốc
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {LEVEL_MILESTONES.map((ms) => {
              const reached = progress.level >= ms.level;
              const claimed = claimedSet.has(ms.level);
              const isBusy = claimingLevel === ms.level;
              return (
                <div
                  key={ms.level}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                    claimed
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/70'
                      : reached
                      ? 'bg-amber-50/80 dark:bg-amber-950/25 border-amber-300 dark:border-amber-700'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-xs font-black tabular-nums">
                        Cấp {ms.level}
                      </span>
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                        {ms.badgeTitle}
                      </span>
                    </div>
                    {ms.unlockHint && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{ms.unlockHint}</div>
                    )}
                  </div>

                  {claimed ? (
                    <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                      <Check className="w-3.5 h-3.5" /> Đã nhận
                    </span>
                  ) : reached ? (
                    <button
                      disabled={isBusy}
                      onClick={() => void handleClaim(ms.level, ms.rewardCoins)}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CoinIcon className="w-3.5 h-3.5" />}
                      Nhận +{ms.rewardCoins} Xu
                    </button>
                  ) : (
                    <span className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
                      <Lock className="w-3.5 h-3.5" /> +{ms.rewardCoins} Xu
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Vietnam Passport Stamps */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Hộ Chiếu Du Hành Xuyên Việt ({visitedCount}/{DESTINATIONS.length} điểm đến)
            </h3>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              Tổng quãng đường: {(hubState?.total_km ?? 0).toLocaleString('vi-VN')} km
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {DESTINATIONS.map((dest) => {
              const visits = stamps[dest.destKey] ?? 0;
              return (
                <div
                  key={dest.destKey}
                  className={`p-2.5 rounded-2xl border text-center ${
                    visits > 0
                      ? 'bg-sky-50 dark:bg-sky-950/30 border-sky-300 dark:border-sky-800'
                      : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-65'
                  }`}
                >
                  <div className="text-xs font-black text-slate-900 dark:text-white truncate">{dest.shortName}</div>
                  <div className="text-[10px] text-slate-500 tabular-nums mt-0.5">{dest.distanceKm} km</div>
                  <div className="mt-1.5 text-[11px] font-bold">
                    {visits > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">✓ {visits} dấu mộc</span>
                    ) : (
                      <span className="text-slate-400">Chưa ghé</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
