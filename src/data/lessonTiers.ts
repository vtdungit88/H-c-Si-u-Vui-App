// Tier metadata only (no questions or answers). Questions live in Supabase.
export type LessonDifficultyTier = 'easy' | 'medium' | 'hard' | 'mixed';

export interface LessonTierMeta {
  tier: LessonDifficultyTier;
  title: string;
  subTitle: string;
  questionCount: number;
  timePerQuestionSeconds: number; // 60s
  rewardCoins: number;
  rewardStars: number;
  badgeColor: string;
}

export const LESSON_TIERS_CONFIG: Record<LessonDifficultyTier, LessonTierMeta> = {
  easy: {
    tier: 'easy',
    title: 'Bài 1: Khởi Động & Cơ Bản',
    subTitle: 'Nắm vững lý thuyết, nhận diện quy tắc & công thức cốt lõi',
    questionCount: 15,
    timePerQuestionSeconds: 60,
    rewardCoins: 1,
    rewardStars: 1,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-300'
  },
  medium: {
    tier: 'medium',
    title: 'Bài 2: Luyện Tập & Tiêu Chuẩn',
    subTitle: 'Rèn luyện kỹ năng tính toán, suy luận & giải toán',
    questionCount: 15,
    timePerQuestionSeconds: 60,
    rewardCoins: 2,
    rewardStars: 1,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-300'
  },
  mixed: {
    tier: 'mixed',
    title: 'Ôn tập chương',
    subTitle: 'Câu hỏi tổng hợp nhiều mức độ trong chương',
    questionCount: 15,
    timePerQuestionSeconds: 60,
    rewardCoins: 2,
    rewardStars: 1,
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-300'
  },
  hard: {
    tier: 'hard',
    title: 'Bài 3: Thử Thách & Nâng Cao',
    subTitle: 'Chinh phục bài toán thực tế, tư duy logic & bài toán điểm 10',
    questionCount: 15,
    timePerQuestionSeconds: 60,
    rewardCoins: 3,
    rewardStars: 2,
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300'
  }
};
