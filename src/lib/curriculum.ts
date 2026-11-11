import type { MathLesson } from '../types';
import type { Curriculum } from './api';

/** Maps published DB lessons to the lesson shape used by the existing UI (no questions / answers). */
export function toMathLessons(curriculum: Curriculum | null): MathLesson[] {
  if (!curriculum) return [];
  const chapterById = new Map(curriculum.chapters.map((c) => [c.id, c] as const));
  const out: MathLesson[] = [];
  for (const l of curriculum.lessons) {
    const ch = chapterById.get(l.chapter_id);
    if (!ch) continue;
    const lm = l.learning_material ?? {};
    out.push({
      id: l.code,
      chapter: ch.sequence_no,
      chapterTitle: ch.title,
      lessonNumber: l.sequence_no,
      title: l.title,
      subTitle: lm.subtitle ?? '',
      sgkPage: lm.sgk_page ?? '',
      conceptSummary: lm.concepts ?? [],
      questions: [],
      rewardCoins: lm.reward_coins ?? 0,
      rewardStars: lm.reward_stars ?? 0
    });
  }
  return out.sort((x, y) => x.chapter - y.chapter || x.lessonNumber - y.lessonNumber);
}
