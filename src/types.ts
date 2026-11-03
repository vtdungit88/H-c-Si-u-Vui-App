export type Gender = 'boy' | 'girl' | 'scholar';

export type ItemCategory = 
  | 'outfit' 
  | 'handheld' 
  | 'phone' 
  | 'vehicle' 
  | 'tech' 
  | 'pet';

export type ItemRarity = 'base' | 'popular' | 'vip' | 'mythic';

export interface ShopItem {
  id: string;
  name: string;
  category: ItemCategory;
  costCoins: number;
  costStars: number;
  description: string;
  rarity: ItemRarity;
  iconName: string;
  tagline: string;
  renderType: string;
}

export interface AvatarConfig {
  gender: Gender;
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  eyeExpression: string;
  outfitId: string;
  handheldId: string;
  phoneId: string;
  vehicleId: string;
  techId: string;
  petId: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  school: string;
  avatarConfig: AvatarConfig;
  coins: number;
  stars: number;
  level: number;
  exp: number;
  completedLessons: Record<string, { stars: number; bestScore: number; completedAt: string }>;
  unlockedItems: string[];
  equippedItems: {
    outfit: string;
    handheld: string;
    phone: string;
    vehicle: string;
    tech: string;
    pet: string;
  };
  highScoreBlitz: number;
  motto: string;
  createdAt: string;
  isGuest?: boolean;
  password?: string;
}

export type GradeLevel = '6' | '7' | '8' | '9';

export interface SubjectMeta {
  id: string;
  name: string;
  iconName: string;
  color: string;
  description: string;
  availableGrades: {
    grade: GradeLevel;
    term1Available: boolean;
    term2Available: boolean;
    notes?: string;
  }[];
  status: 'active' | 'coming_soon';
}

export interface MathQuestion {
  id: string;
  questionText: string;
  contextHint?: string;
  visualType?: 'set' | 'power' | 'divisibility' | 'integers' | 'geometry' | 'none';
  visualData?: any;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  funnyTip: string;
}

export interface MathLesson {
  id: string;
  chapter: number;
  chapterTitle: string;
  lessonNumber: number;
  title: string;
  subTitle: string;
  sgkPage: string;
  conceptSummary: string[];
  questions: MathQuestion[];
  rewardCoins: number;
  rewardStars: number;
}
