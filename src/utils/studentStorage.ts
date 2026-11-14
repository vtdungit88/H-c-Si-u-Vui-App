import { StudentProfile, AvatarConfig } from '../types';

const STORAGE_KEY_PROFILES = 'hsv_student_profiles';
const STORAGE_KEY_ACTIVE_ID = 'hsv_active_student_id';
const STORAGE_KEY_ANNOUNCEMENT = 'hocsieuvui_admin_announcement_v1';

export const DEFAULT_AVATAR: AvatarConfig = {
  gender: 'boy',
  skinColor: '#FDDFC6',
  hairStyle: 'short_neat',
  hairColor: '#1E293B',
  eyeExpression: 'glasses_happy',
  outfitId: 'outfit_uniform',
  handheldId: 'hand_pencil',
  phoneId: 'phone_brick',
  vehicleId: 'veh_honeycomb',
  techId: 'tech_notebook',
  petId: 'pet_none'
};

export const FUNNY_NICKNAMES: string[] = [
  'Bé Siêu Vui',
  'Thần Đồng Tính Nhẩm',
  'Bé Bánh Mì Patê',
  'Cú Vọ Mọt Sách',
  'Chiến Thần Ước Bội',
  'Dũng Sĩ Sa Pa',
  'Bé Mèo Ham Học',
  'Thám Tử Conan Nhí',
  'Trùm Cuối Khối 6',
  'Vua Lũy Thừa',
  'Tiểu Tiên Cá Số Học',
  'Hiệp Sĩ Khăn Quàng Đỏ',
  'Siêu Trí Tuệ Nhí',
  'Bé Gấu Chăm Chỉ',
  'Cao Thủ Bấm Máy Casio',
  'Thần Rùa Đua Top',
  'Bé Trà Sữa Trân Châu'
];

export const getRandomNickname = (): string => {
  const index = Math.floor(Math.random() * FUNNY_NICKNAMES.length);
  return FUNNY_NICKNAMES[index];
};

export const createInitialProfile = (
  name: string = 'Bé Siêu Vui',
  grade: string = '6A1',
  school: string = 'Trường Học Vui Nhộn',
  gender: 'boy' | 'girl' | 'scholar' = 'boy',
  isGuest: boolean = true
): StudentProfile => {
  const avatar: AvatarConfig = {
    ...DEFAULT_AVATAR,
    gender,
    hairStyle: gender === 'girl' ? 'ponytail' : 'short_neat'
  };

  return {
    id: 'student_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name,
    grade,
    school,
    avatarConfig: avatar,
    coins: 120, // Starter bonus
    stars: 5,   // Starter stars
    level: 1,
    exp: 0,
    completedLessons: {},
    unlockedItems: [
      'outfit_uniform',
      'hand_pencil',
      'phone_brick',
      'veh_honeycomb',
      'tech_notebook',
      'pet_none'
    ],
    equippedItems: {
      outfit: 'outfit_uniform',
      handheld: 'hand_pencil',
      phone: 'phone_brick',
      vehicle: 'veh_honeycomb',
      tech: 'tech_notebook',
      pet: 'pet_none'
    },
    highScoreBlitz: 0,
    motto: 'Học hết mình, chơi siêu vui!',
    createdAt: new Date().toISOString(),
    isGuest
  };
};

export const getStudentProfiles = (): StudentProfile[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading profiles from localStorage', e);
  }

  // Create default starter profile
  const defaultProfile = createInitialProfile();
  saveStudentProfiles([defaultProfile]);
  setActiveStudentId(defaultProfile.id);
  return [defaultProfile];
};

export const saveStudentProfiles = (profiles: StudentProfile[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(profiles));
  } catch (e) {
    console.error('Error saving profiles to localStorage', e);
  }
};

export const getActiveStudentId = (): string => {
  return localStorage.getItem(STORAGE_KEY_ACTIVE_ID) || '';
};

export const setActiveStudentId = (id: string): void => {
  localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
};

export const getActiveStudent = (): StudentProfile => {
  const profiles = getStudentProfiles();
  const activeId = getActiveStudentId();
  const found = profiles.find((p) => p.id === activeId);
  if (found) return found;
  if (profiles.length > 0) {
    setActiveStudentId(profiles[0].id);
    return profiles[0];
  }
  const fresh = createInitialProfile();
  saveStudentProfiles([fresh]);
  setActiveStudentId(fresh.id);
  return fresh;
};

export const updateActiveStudent = (
  updater: (prev: StudentProfile) => StudentProfile
): StudentProfile => {
  const current = getActiveStudent();
  const updated = updater(current);

  // Recalculate level based on stars and lessons
  const totalStars = updated.stars;
  const newLevel = Math.max(1, Math.floor(totalStars / 5) + 1);
  updated.level = newLevel;

  const profiles = getStudentProfiles();
  const newProfiles = profiles.map((p) => (p.id === updated.id ? updated : p));
  saveStudentProfiles(newProfiles);
  return updated;
};

/**
 * Cosmetic-only local cache for a signed-in user (avatar, equipped items, motto).
 * Identity, wallet and learning progress come from Supabase; nothing sensitive is stored here.
 */
export const upsertAuthProfile = (
  id: string,
  server: Pick<StudentProfile, 'name' | 'coins' | 'stars' | 'exp' | 'completedLessons'> & {
    avatarConfig?: Partial<AvatarConfig>;
    unlockedItems?: string[];
  }
): StudentProfile => {
  const profiles = getStudentProfiles();
  const existing = profiles.find((p) => p.id === id);
  const base = existing ?? { ...createInitialProfile(server.name, '6', '', 'boy', false), id };
  const merged: StudentProfile = {
    ...base,
    id,
    isGuest: false,
    name: server.name,
    coins: server.coins,
    stars: server.stars,
    exp: server.exp,
    completedLessons: server.completedLessons,
    // Avatar and owned items are owned by the server; the local copy is only a cache.
    avatarConfig: { ...DEFAULT_AVATAR, ...(server.avatarConfig ?? {}) },
    unlockedItems: server.unlockedItems ?? base.unlockedItems,
    level: Math.max(1, Math.floor(server.stars / 5) + 1)
  };
  const cfg = merged.avatarConfig;
  merged.equippedItems = { outfit: cfg.outfitId, handheld: cfg.handheldId, phone: cfg.phoneId, vehicle: cfg.vehicleId, tech: cfg.techId, pet: cfg.petId };
  const next = existing ? profiles.map((p) => (p.id === id ? merged : p)) : [...profiles, merged];
  saveStudentProfiles(next);
  setActiveStudentId(id);
  return merged;
};

export const logoutStudent = (): StudentProfile => {
  const guest = createInitialProfile('Bé Siêu Vui', '6A1', 'Trường Học Vui Nhộn', 'boy', true);
  setActiveStudentId(guest.id);
  return guest;
};

// Admin utilities for dungvt.hbh
export const adminUpdateStudent = (id: string, updates: Partial<StudentProfile>): void => {
  const profiles = getStudentProfiles();
  const updated = profiles.map((p) => (p.id === id ? { ...p, ...updates } : p));
  saveStudentProfiles(updated);
};

export const adminDeleteStudent = (id: string): void => {
  const profiles = getStudentProfiles();
  const filtered = profiles.filter((p) => p.id !== id);
  saveStudentProfiles(filtered);
};

export const getAdminAnnouncement = (): string => {
  return localStorage.getItem(STORAGE_KEY_ANNOUNCEMENT) || 'Chào mừng các bạn học sinh đến với Học Siêu Vui! Hãy chăm chỉ làm bài tập để mở khóa phụ kiện siêu đỉnh nhé!';
};

export const setAdminAnnouncement = (announcement: string): void => {
  localStorage.setItem(STORAGE_KEY_ANNOUNCEMENT, announcement);
};

export interface AppStatistics {
  totalRegisteredAccounts: number;
  totalLessonsCompleted: number;
  totalStarsAccumulated: number;
  totalCoinsAccumulated: number;
  totalItemsUnlocked: number;
  activeAccountsList: StudentProfile[];
}

export const getAppStatistics = (): AppStatistics => {
  const profiles = getStudentProfiles().filter((p) => !p.isGuest);

  let totalLessons = 0;
  let totalStars = 0;
  let totalCoins = 0;
  let totalItems = 0;

  profiles.forEach((p) => {
    totalLessons += Object.keys(p.completedLessons || {}).length;
    totalStars += p.stars || 0;
    totalCoins += p.coins || 0;
    totalItems += (p.unlockedItems || []).length;
  });

  return {
    totalRegisteredAccounts: profiles.length,
    totalLessonsCompleted: totalLessons,
    totalStarsAccumulated: totalStars,
    totalCoinsAccumulated: totalCoins,
    totalItemsUnlocked: totalItems,
    activeAccountsList: profiles
  };
};

/** Remove any plaintext passwords left by the legacy LocalStorage login. */
export const scrubLegacyPasswords = (): void => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    // Legacy accounts carry a `password` field: drop them entirely (identity is now Supabase Auth).
    const cleaned = parsed.filter((p: Record<string, unknown>) => p && !('password' in p));
    localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(cleaned));
  } catch {
    localStorage.removeItem(STORAGE_KEY_PROFILES);
  }
};
