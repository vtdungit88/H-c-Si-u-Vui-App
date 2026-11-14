export interface ArenaRank { name: string; icon: string; min: number }
const RANKS: ArenaRank[] = [
  { name: 'Tân Binh', icon: '🌱', min: 0 },
  { name: 'Chiến Binh Đồng', icon: '🥉', min: 1000 },
  { name: 'Hiệp Sĩ Bạc', icon: '🥈', min: 1300 },
  { name: 'Kỵ Sĩ Vàng', icon: '🥇', min: 1600 },
  { name: 'Tinh Anh Kim Cương', icon: '💎', min: 1900 },
  { name: 'Trạng Nguyên Siêu Vui', icon: '👑', min: 2200 }
];
export function rankOf(elo: number): ArenaRank {
  let r = RANKS[0];
  for (const x of RANKS) if (elo >= x.min) r = x;
  return r;
}
export function nextRank(elo: number): ArenaRank | null {
  return RANKS.find((r) => r.min > elo) ?? null;
}
