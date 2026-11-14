import { StudentProfile, AvatarConfig } from '../types';
import { getStudentProfiles } from '../utils/studentStorage';

export interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  grade: string;
  school: string;
  city: string;
  avatarConfig: AvatarConfig;
  stars: number;
  coins: number;
  level: number;
  title: string;
  motto: string;
  isCurrentStudent?: boolean;
}

// Bảng xếp hạng chỉ hiển thị người thật (bỏ hoàn toàn nhân vật ảo theo yêu cầu)
export const getLeaderboardData = (
  activeStudent: StudentProfile,
  sortBy: 'all' | 'stars' | 'coins' = 'all'
): { top10: LeaderboardEntry[]; activeStudentEntry?: LeaderboardEntry; totalRealCount: number } => {
  const allProfiles = getStudentProfiles();

  // Chỉ lấy các học sinh đã đăng ký tài khoản thật (không lấy khách chưa đăng ký)
  // Nếu học sinh hiện tại đã đăng ký hoặc có sao/xu thì vẫn đưa vào
  const realProfiles = allProfiles.filter(
    (p) => !p.isGuest || p.id === activeStudent.id
  );

  const entries: Omit<LeaderboardEntry, 'rank'>[] = realProfiles.map((p) => ({
    id: p.id,
    name: p.name,
    grade: p.grade,
    school: p.school,
    city: 'Việt Nam',
    avatarConfig: p.avatarConfig,
    stars: p.stars || 0,
    coins: p.coins || 0,
    level: p.level || 1,
    title: p.level >= 20 ? 'Bậc Thầy Học Siêu Vui' : p.level >= 10 ? 'Chiến Thần Học Đường' : 'Tân Binh Học Siêu Vui',
    motto: p.motto || 'Học hết mình, chơi siêu vui!',
    isCurrentStudent: p.id === activeStudent.id
  }));

  // Sắp xếp theo tiêu chí người dùng chọn
  const sorted = [...entries].sort((a, b) => {
    if (sortBy === 'stars') {
      if (b.stars !== a.stars) return b.stars - a.stars;
      return b.coins - a.coins;
    }
    if (sortBy === 'coins') {
      if (b.coins !== a.coins) return b.coins - a.coins;
      return b.stars - a.stars;
    }
    // 'all' composite score: stars * 50 + coins
    const scoreA = a.stars * 50 + a.coins;
    const scoreB = b.stars * 50 + b.coins;
    return scoreB - scoreA;
  });

  // Gán thứ hạng
  const rankedList: LeaderboardEntry[] = sorted.map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));

  const top10 = rankedList.slice(0, 10);
  const activeStudentEntry = rankedList.find((entry) => entry.id === activeStudent.id);

  return {
    top10,
    activeStudentEntry,
    totalRealCount: realProfiles.length
  };
};
