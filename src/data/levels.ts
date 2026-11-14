export interface RankTier {
  minLevel: number;
  maxLevel: number;
  title: string;
  badgeColor: string;
  ringClass: string;
}

export interface LevelMilestone {
  level: number;
  rewardCoins: number;
  badgeTitle: string;
  unlockHint?: string;
}

export const RANK_TIERS: RankTier[] = [
  {
    minLevel: 1,
    maxLevel: 2,
    title: 'Tân Binh Khăn Quàng',
    badgeColor: '#10b981',
    ringClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/50'
  },
  {
    minLevel: 3,
    maxLevel: 5,
    title: 'Thám Hiểm Rừng Tri Thức',
    badgeColor: '#0ea5e9',
    ringClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-400/50'
  },
  {
    minLevel: 6,
    maxLevel: 9,
    title: 'Kiện Tướng Tính Nhanh',
    badgeColor: '#3b82f6',
    ringClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-400/50'
  },
  {
    minLevel: 10,
    maxLevel: 14,
    title: 'Học Giả Thăng Long',
    badgeColor: '#8b5cf6',
    ringClass: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-400/50'
  },
  {
    minLevel: 15,
    maxLevel: 19,
    title: 'Du Hành Gia Xuyên Việt',
    badgeColor: '#f59e0b',
    ringClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-400/50'
  },
  {
    minLevel: 20,
    maxLevel: 29,
    title: 'Kỹ Sư VNPT Cloud',
    badgeColor: '#ec4899',
    ringClass: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-400/50'
  },
  {
    minLevel: 30,
    maxLevel: 39,
    title: 'Trạng Nguyên Đất Việt',
    badgeColor: '#ef4444',
    ringClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/50'
  },
  {
    minLevel: 40,
    maxLevel: 50,
    title: 'Huyền Thoại Học Siêu Vui',
    badgeColor: '#eab308',
    ringClass: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-400/60'
  }
];

export const LEVEL_MILESTONES: LevelMilestone[] = [
  { level: 2, rewardCoins: 12, badgeTitle: 'Tân Binh Chăm Chỉ', unlockHint: 'Mở đường đi Vịnh Hạ Long' },
  { level: 3, rewardCoins: 15, badgeTitle: 'Thám Hiểm Hạ Long', unlockHint: 'Mở đường đi Sa Pa' },
  { level: 5, rewardCoins: 22, badgeTitle: 'Chinh Phục Fansipan', unlockHint: 'Mở đường đi Cố Đô Huế' },
  { level: 6, rewardCoins: 25, badgeTitle: 'Kiện Tướng Tính Nhanh', unlockHint: 'Mở đường đi Đà Nẵng' },
  { level: 8, rewardCoins: 32, badgeTitle: 'Sứ Giả Biển Xanh', unlockHint: 'Mở đường đi Nha Trang' },
  { level: 10, rewardCoins: 40, badgeTitle: 'Học Giả Thăng Long', unlockHint: 'Mở đường đi Đà Lạt' },
  { level: 12, rewardCoins: 48, badgeTitle: 'Du Hành Gia Phương Nam', unlockHint: 'Mở đường đi TP. Hồ Chí Minh' },
  { level: 15, rewardCoins: 60, badgeTitle: 'Thủ Lĩnh Đảo Ngọc', unlockHint: 'Mở đường đi Đảo Ngọc Phú Quốc' },
  { level: 18, rewardCoins: 75, badgeTitle: 'Kỹ Sư VNPT Cloud' },
  { level: 20, rewardCoins: 90, badgeTitle: 'Trạng Nguyên Xuyên Việt' },
  { level: 25, rewardCoins: 120, badgeTitle: 'Bậc Thầy Tri Thức' },
  { level: 30, rewardCoins: 150, badgeTitle: 'Huyền Thoại Học Siêu Vui' }
];

/** Exact cumulative XP needed to reach `level` (matches SQL public.xp_for_level). */
export function xpForLevel(level: number): number {
  const lvl = Math.min(Math.max(1, Math.floor(level)), 50);
  if (lvl <= 1) return 0;
  return 60 * (lvl - 1) + Math.floor((25 * (lvl - 1) * (lvl - 2)) / 2);
}

/** Deterministic level from total XP (matches SQL public.xp_to_level). */
export function levelFromXp(xp: number): number {
  const safeXp = Math.max(0, Math.floor(xp || 0));
  let lvl = 1;
  while (lvl < 50 && safeXp >= xpForLevel(lvl + 1)) {
    lvl += 1;
  }
  return lvl;
}

export function getRankTier(level: number): RankTier {
  return (
    RANK_TIERS.find((t) => level >= t.minLevel && level <= t.maxLevel) ??
    RANK_TIERS[RANK_TIERS.length - 1]
  );
}

export function getLevelProgress(xp: number) {
  const safeXp = Math.max(0, Math.floor(xp || 0));
  const level = levelFromXp(safeXp);
  const currentThreshold = xpForLevel(level);
  const nextLevel = Math.min(50, level + 1);
  const nextThreshold = xpForLevel(nextLevel);
  const span = Math.max(1, nextThreshold - currentThreshold);
  const intoLevel = level >= 50 ? span : Math.max(0, safeXp - currentThreshold);
  const percent = level >= 50 ? 100 : Math.min(100, Math.round((intoLevel / span) * 100));

  return {
    level,
    xp: safeXp,
    currentThreshold,
    nextThreshold,
    intoLevel,
    span,
    xpRemaining: Math.max(0, nextThreshold - safeXp),
    percent,
    rank: getRankTier(level)
  };
}
