import { StudentProfile, AvatarConfig } from '../types';

const STORAGE_KEY_PROFILES = 'toan6_student_profiles_v1';
const STORAGE_KEY_ACTIVE_ID = 'toan6_active_student_id_v1';
const STORAGE_KEY_ANNOUNCEMENT = 'hocsieuvui_admin_announcement_v1';
export const DEFAULT_PASSWORD = 'hocvui123';

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
  isGuest: boolean = true,
  password: string = DEFAULT_PASSWORD
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
    isGuest,
    password: password || DEFAULT_PASSWORD
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

// Check if a nickname is already taken by a registered student
export const isNicknameTaken = (name: string, excludeId?: string): boolean => {
  const profiles = getStudentProfiles();
  return profiles.some(
    (p) => !p.isGuest && p.name.trim().toLowerCase() === name.trim().toLowerCase() && p.id !== excludeId
  );
};

// Find registered account by nickname
export const findStudentByNickname = (name: string): StudentProfile | undefined => {
  const profiles = getStudentProfiles();
  return profiles.find(
    (p) => !p.isGuest && p.name.trim().toLowerCase() === name.trim().toLowerCase()
  );
};

// Log in with nickname & password
export const loginStudent = (
  nickname: string,
  passwordInput: string
): { success: boolean; student?: StudentProfile; message: string } => {
  const student = findStudentByNickname(nickname);
  if (!student) {
    return { success: false, message: 'Không tìm thấy tài khoản với biệt danh này. Bạn có thể đăng ký mới!' };
  }

  const expectedPass = student.password || DEFAULT_PASSWORD;
  if (passwordInput.trim() !== expectedPass.trim()) {
    return { 
      success: false, 
      message: 'Mật khẩu chưa chính xác! Nếu quên, bạn có thể bấm nút "Quên Mật Khẩu" để đặt lại về ' + DEFAULT_PASSWORD 
    };
  }

  setActiveStudentId(student.id);
  return { success: true, student, message: 'Đăng nhập thành công!' };
};

// Reset password to default 'hocvui123'
export const resetStudentPassword = (nickname: string): { success: boolean; message: string } => {
  const profiles = getStudentProfiles();
  const targetIndex = profiles.findIndex(
    (p) => !p.isGuest && p.name.trim().toLowerCase() === nickname.trim().toLowerCase()
  );

  if (targetIndex === -1) {
    return { success: false, message: 'Không tìm thấy tài khoản để khôi phục mật khẩu!' };
  }

  profiles[targetIndex].password = DEFAULT_PASSWORD;
  saveStudentProfiles(profiles);
  return { 
    success: true, 
    message: `Đã khôi phục mật khẩu của "${profiles[targetIndex].name}" về mặc định: ${DEFAULT_PASSWORD}` 
  };
};

// Logout: return to guest student
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
