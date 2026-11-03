import { MathQuestion } from '../types';
import { getLessonQuestionsByLevel, LessonDifficultyTier } from '../data/expandedQuestionBank';

/**
 * Trộn ngẫu nhiên một mảng (Fisher-Yates Shuffle)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Chuẩn bị 15 câu hỏi độc lập cho một cấp độ bài học (easy | medium | hard)
 * Tự động shuffle options của từng câu hỏi để tránh học vẹt
 */
export function prepareTieredQuestions(lessonId: string, tier: LessonDifficultyTier): MathQuestion[] {
  const rawQuestions = getLessonQuestionsByLevel(lessonId, tier);

  // Shuffle thứ tự options của từng câu hỏi
  return rawQuestions.map((q, idx) => ({
    ...q,
    id: `${q.id}_idx${idx}`,
    options: shuffleArray(q.options)
  }));
}
