import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { getLeaderboardData } from '../data/leaderboardData';
import { AvatarRenderer } from './AvatarRenderer';
import { soundManager } from '../utils/audio';
import { SHOP_ITEMS } from '../data/items';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  Zap, 
  School, 
  Users,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { CoinIcon, StarIcon } from './GameIcons';

interface GlobalLeaderboardProps {
  student: StudentProfile;
  onNavigateToStudy: () => void;
  onNavigateToBlitz: () => void;
  onNavigateToShop: () => void;
  onOpenLogin: () => void;
}

export const GlobalLeaderboard: React.FC<GlobalLeaderboardProps> = ({
  student,
  onNavigateToStudy,
  onNavigateToBlitz,
  onNavigateToShop,
  onOpenLogin
}) => {
  const [filter, setFilter] = useState<'all' | 'stars' | 'coins'>('all');

  const { top10, activeStudentEntry, totalRealCount } = getLeaderboardData(student, filter);

  const top1 = top10[0];
  const top2 = top10[1];
  const top3 = top10[2];
  const restRanks = top10.slice(3);

  const getItemName = (itemId?: string) => {
    if (!itemId) return '';
    return SHOP_ITEMS.find((i) => i.id === itemId)?.name || '';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Top Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 rounded-3xl text-slate-950 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-black/15 text-slate-950 px-3 py-1 rounded-full">
              Bảng Vàng Danh Dự
            </span>
            <span className="text-xs font-bold text-amber-950">
              • Top Thành Tích Học Tập
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-sm">
            Bảng Xếp Hạng Học Siêu Vui
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 font-medium mt-1 max-w-xl">
            Vinh danh các bạn học sinh có tổng số Sao <StarIcon className="w-4 h-4 align-text-bottom" /> và Xu <CoinIcon className="w-4 h-4 align-text-bottom" /> tích lũy cao nhất từ các bài học SGK và Đấu trường 60 giây.
          </p>
        </div>

        {/* Action button to challenge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.play('click');
              onNavigateToBlitz();
            }}
            className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 hover:scale-105"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Đua Top 60s Ngay!</span>
          </button>
        </div>
      </div>

      {/* User's Current Position Strip (if registered or active) */}
      {activeStudentEntry && (
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-400 dark:border-blue-600 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-center font-mono font-black text-blue-600 dark:text-blue-400 text-lg shrink-0">
              #{activeStudentEntry.rank}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Vị trí của bạn:</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  {activeStudentEntry.name} ({activeStudentEntry.grade})
                </span>
                <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                  Cấp {activeStudentEntry.level}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeStudentEntry.rank === 1
                  ? 'Tuyệt đỉnh! Bạn đang dẫn đầu Bảng Vàng Học Siêu Vui!'
                  : `Bạn đang ở vị trí #${activeStudentEntry.rank}. Giải thêm bài tập SGK để vươn lên dẫn đầu!`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 text-xs font-mono font-bold">
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <CoinIcon className="w-4 h-4" />
                <span className="tabular-nums">{activeStudentEntry.coins}</span> xu
              </span>
              <span className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                <StarIcon className="w-4 h-4 fill-yellow-400" />
                <span className="tabular-nums">{activeStudentEntry.stars}</span> sao
              </span>
            </div>

            <button
              onClick={() => {
                soundManager.play('click');
                onNavigateToStudy();
              }}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Học Tiếp</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Filter Segmented Control Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => {
              soundManager.play('click');
              setFilter('all');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Toàn Diện (Sao + Xu)
          </button>
          <button
            onClick={() => {
              soundManager.play('click');
              setFilter('stars');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'stars'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <StarIcon className="w-3.5 h-3.5 fill-amber-400" />
            <span>Vua Sao Vàng</span>
          </button>
          <button
            onClick={() => {
              soundManager.play('click');
              setFilter('coins');
            }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'coins'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <CoinIcon className="w-3.5 h-3.5" />
            <span>Đại Gia Xu</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 dark:text-slate-500">
          Hiện có: <strong>{totalRealCount} tài khoản</strong> tham gia đua top
        </span>
      </div>

      {/* IF NO STUDENTS IN LEADERBOARD YET */}
      {top10.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-10 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Bảng Xếp Hạng Đang Chờ Người Dẫn Đầu!
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Hãy là bạn học sinh đầu tiên đăng ký tài khoản và chinh phục các bài học Toán để ghi danh vị trí Quán Quân!
          </p>
          <button
            onClick={onOpenLogin}
            className="py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Đăng Ký Biệt Danh Leo Bảng Vàng Ngay</span>
          </button>
        </div>
      ) : (
        <>
          {/* TOP 3 PODIUM (Real Students Only) */}
          <div className="pt-8 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              {/* Rank 2 (Bạc - Silver) */}
              {top2 ? (
                <div className="order-2 md:order-1 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-md text-center flex flex-col items-center justify-between min-h-[360px] relative">
                  <div className="absolute -top-4 w-9 h-9 rounded-full bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white dark:border-slate-900">
                    🥈 2
                  </div>

                  <div className="w-28 h-32 flex items-center justify-center mt-3 overflow-visible">
                    <AvatarRenderer config={top2.avatarConfig} size="sm" showVehicle={false} />
                  </div>

                  <div className="w-full space-y-1.5 mt-2">
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <School className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[180px]">{top2.school}</span>
                    </div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">
                      {top2.name}
                    </h3>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                      {top2.title} • Lớp {top2.grade}
                    </p>
                    <p className="text-[11px] italic text-slate-400 line-clamp-1">
                      "{top2.motto}"
                    </p>
                  </div>

                  <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around font-mono text-xs font-bold">
                    <span className="text-yellow-500 flex items-center gap-1">
                      <StarIcon className="w-3.5 h-3.5 fill-yellow-400" />
                      <span className="tabular-nums">{top2.stars}</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <CoinIcon className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{top2.coins}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="order-2 md:order-1 p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="text-2xl mb-1">🥈</div>
                  <div className="font-bold text-xs">Vị Trí Hạng 2 Đang Chờ Bạn</div>
                  <p className="text-[11px] text-slate-400 mt-1">Đăng ký biệt danh để chiếm lĩnh ngôi vị này!</p>
                </div>
              )}

              {/* Rank 1 (Vàng - Gold) - Elevated in center */}
              {top1 && (
                <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-900 rounded-3xl p-6 border-2 border-amber-400 dark:border-amber-500 shadow-xl text-center flex flex-col items-center justify-between min-h-[410px] relative -translate-y-2">
                  <div className="absolute -top-6 flex flex-col items-center">
                    <Crown className="w-8 h-8 text-amber-500 fill-amber-400 drop-shadow" />
                    <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow-lg border-2 border-white dark:border-slate-900 -mt-1">
                      🥇 1
                    </div>
                  </div>

                  <div className="w-32 h-36 flex items-center justify-center mt-6 overflow-visible">
                    <AvatarRenderer config={top1.avatarConfig} size="md" />
                  </div>

                  <div className="w-full space-y-1.5 mt-2">
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <School className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[200px]">{top1.school}</span>
                    </div>
                    <h3 className="font-black text-lg text-slate-900 dark:text-white">
                      {top1.name}
                    </h3>
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-extrabold uppercase tracking-wide">
                      Quán Quân • Lớp {top1.grade}
                    </p>
                    <p className="text-xs italic text-slate-500 dark:text-slate-400 line-clamp-1">
                      "{top1.motto}"
                    </p>
                  </div>

                  <div className="w-full mt-4 pt-3 border-t border-amber-200 dark:border-amber-900/50 flex items-center justify-around font-mono text-sm font-black bg-amber-100/50 dark:bg-amber-950/40 p-2.5 rounded-2xl">
                    <span className="text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                      <StarIcon className="w-4 h-4 fill-yellow-400" />
                      <span className="tabular-nums">{top1.stars}</span> Sao
                    </span>
                    <span className="text-amber-300">|</span>
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <CoinIcon className="w-4 h-4" />
                      <span className="tabular-nums">{top1.coins}</span> Xu
                    </span>
                  </div>
                </div>
              )}

              {/* Rank 3 (Đồng - Bronze) */}
              {top3 ? (
                <div className="order-3 bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-md text-center flex flex-col items-center justify-between min-h-[360px] relative">
                  <div className="absolute -top-4 w-9 h-9 rounded-full bg-amber-700 text-white flex items-center justify-center font-black text-sm shadow-md border-2 border-white dark:border-slate-900">
                    🥉 3
                  </div>

                  <div className="w-28 h-32 flex items-center justify-center mt-3 overflow-visible">
                    <AvatarRenderer config={top3.avatarConfig} size="sm" showVehicle={false} />
                  </div>

                  <div className="w-full space-y-1.5 mt-2">
                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                      <School className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[180px]">{top3.school}</span>
                    </div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">
                      {top3.name}
                    </h3>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                      {top3.title} • Lớp {top3.grade}
                    </p>
                    <p className="text-[11px] italic text-slate-400 line-clamp-1">
                      "{top3.motto}"
                    </p>
                  </div>

                  <div className="w-full mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-around font-mono text-xs font-bold">
                    <span className="text-yellow-500 flex items-center gap-1">
                      <StarIcon className="w-3.5 h-3.5 fill-yellow-400" />
                      <span className="tabular-nums">{top3.stars}</span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <CoinIcon className="w-3.5 h-3.5" />
                      <span className="tabular-nums">{top3.coins}</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="order-3 p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-slate-400 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="text-2xl mb-1">🥉</div>
                  <div className="font-bold text-xs">Vị Trí Hạng 3 Đang Chờ Bạn</div>
                  <p className="text-[11px] text-slate-400 mt-1">Đăng ký biệt danh để chiếm lĩnh ngôi vị này!</p>
                </div>
              )}
            </div>
          </div>

          {/* RANKS 4 THROUGH 10 (If any) */}
          {restRanks.length > 0 && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Bảng Xếp Hạng Hạng 4 Đến Hạng 10
                  </h3>
                </div>
                <span className="text-xs text-slate-400">
                  Người Thật
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {restRanks.map((item) => {
                  const isMe = item.id === student.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-colors ${
                        isMe
                          ? 'bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-l-blue-600 font-bold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-black text-slate-700 dark:text-slate-300 text-sm shrink-0">
                          #{item.rank}
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                          <AvatarRenderer config={item.avatarConfig} size="sm" showVehicle={false} showTech={false} showPet={false} />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {item.name}
                            </span>
                            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-md">
                              {item.grade}
                            </span>
                            {isMe && (
                              <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                                Bạn
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                            <School className="w-3 h-3 text-slate-400" />
                            <span>{item.school}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 self-stretch sm:self-auto justify-between sm:justify-end">
                        <div className="text-right hidden md:block">
                          <span className="text-[10px] text-slate-400 uppercase">Trang Bị Nổi Bật</span>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                            {getItemName(item.avatarConfig.handheldId) || getItemName(item.avatarConfig.vehicleId) || 'Đồng phục'}
                          </p>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono font-bold">
                          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                            <CoinIcon className="w-3.5 h-3.5" />
                            <span className="tabular-nums">{item.coins}</span> xu
                          </span>
                          <span className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
                            <StarIcon className="w-3.5 h-3.5 fill-yellow-400" />
                            <span className="tabular-nums">{item.stars}</span> sao
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
