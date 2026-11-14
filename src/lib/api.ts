import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { upsertAuthProfile } from '../utils/studentStorage';
import type { StudentProfile } from '../types';

/**
 * Typed data-access layer. UI components must not talk to Supabase directly.
 * Answer keys never reach the browser before an answer is committed: scoring is done by
 * the SECURITY DEFINER RPCs public.start_quiz / answer_question / submit_quiz.
 */

export type DbTier = 'basic' | 'application' | 'advanced' | 'mixed';
export type UiTier = 'easy' | 'medium' | 'hard' | 'mixed';
export const UI_TO_DB_TIER: Record<UiTier, DbTier> = { easy: 'basic', medium: 'application', hard: 'advanced', mixed: 'mixed' };
export const DB_TO_UI_TIER: Record<DbTier, UiTier> = { basic: 'easy', application: 'medium', advanced: 'hard', mixed: 'mixed' };

export type SubjectKey = 'math' | 'science' | 'all';
const CHAPTER_PREFIX: Record<Exclude<SubjectKey, 'all'>, string> = { math: 'toan6-c', science: 'khtn6-c' };

export interface DbChapter { id: string; code: string; title: string; sequence_no: number }
export interface DbLesson {
  id: string;
  chapter_id: string;
  code: string;
  title: string;
  sequence_no: number;
  learning_material: {
    subtitle?: string;
    sgk_page?: string;
    concepts?: string[];
    reward_coins?: number;
    reward_stars?: number;
  };
}
export interface Curriculum { chapters: DbChapter[]; lessons: DbLesson[] }

export interface QuizQuestion {
  quiz_question_id: string;
  seq: number;
  prompt: { text: string; hint?: string; visualType?: string; visualData?: unknown };
  options: { key: 'A' | 'B' | 'C' | 'D'; content: { text: string } }[];
}
export interface QuizStart { session_id: string; total: number; questions: QuizQuestion[] }
export interface AnswerResult {
  quiz_question_id: string;
  selected: string | null;
  correct_key: string;
  is_correct: boolean;
  explanation: { text?: string; tip?: string };
  already_answered: boolean;
}
export interface QuizResult {
  session_id: string;
  lesson_id: string;
  tier: DbTier;
  score: number;
  correct_count: number;
  total_count: number;
  xp_awarded: number;
  coins_awarded: number;
}

function fail(prefix: string, error: { message: string } | null): never {
  throw new Error(`${prefix}: ${error?.message ?? 'unknown error'}`);
}

// ---------- Auth ----------
export async function signUpWithEmail(email: string, password: string, alias: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);
  // With "Confirm email" ON there is no session yet; the alias is applied on first sign-in.
  if (data.session) await setAlias(alias);
  return { needsEmailConfirmation: !data.session };
}

export async function signInWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

export async function setAlias(alias: string) {
  const clean = alias.trim();
  if (!clean) return;
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return;
  const { error } = await supabase.from('profiles').update({ display_alias: clean }).eq('id', u.user.id);
  if (error) throw new Error(error.message);
}

// ---------- Curriculum (public read of published content) ----------
const curriculumCache = new Map<SubjectKey, Promise<Curriculum>>();

export function fetchCurriculum(subject: SubjectKey = 'math'): Promise<Curriculum> {
  const hit = curriculumCache.get(subject);
  if (hit) return hit;
  const p = (async () => {
    const [ch, ls] = await Promise.all([
      supabase.from('chapters').select('id,code,title,sequence_no').eq('grade_id', 6).eq('status', 'published').order('sequence_no'),
      supabase.from('lessons').select('id,chapter_id,code,title,sequence_no,learning_material').eq('status', 'published').order('sequence_no')
    ]);
    if (ch.error) fail('chapters', ch.error);
    if (ls.error) fail('lessons', ls.error);
    const wanted = (Object.keys(CHAPTER_PREFIX) as (keyof typeof CHAPTER_PREFIX)[]).filter((k) => subject === 'all' || subject === k);
    const chapters = (ch.data as DbChapter[]).filter((c) => wanted.some((k) => c.code.startsWith(CHAPTER_PREFIX[k])));
    const ids = new Set(chapters.map((c) => c.id));
    return { chapters, lessons: (ls.data as DbLesson[]).filter((l) => ids.has(l.chapter_id)) };
  })();
  curriculumCache.set(subject, p);
  p.catch(() => curriculumCache.delete(subject));
  return p;
}

// ---------- Quiz (server-side scoring) ----------
export async function startQuiz(lessonId: string, tier: UiTier, count = 15): Promise<QuizStart> {
  const { data, error } = await supabase.rpc('start_quiz', { p_lesson: lessonId, p_tier: UI_TO_DB_TIER[tier], p_count: count });
  if (error) fail('start_quiz', error);
  return data as QuizStart;
}

export async function answerQuestion(quizQuestionId: string, optionKey: string | null, responseMs?: number): Promise<AnswerResult> {
  const { data, error } = await supabase.rpc('answer_question', {
    p_quiz_question: quizQuestionId,
    p_option_key: optionKey,
    p_response_ms: responseMs ?? null
  });
  if (error) fail('answer_question', error);
  return data as AnswerResult;
}

export async function submitQuiz(sessionId: string): Promise<QuizResult> {
  const { data, error } = await supabase.rpc('submit_quiz', { p_session: sessionId, p_answers: [] });
  if (error) fail('submit_quiz', error);
  return data as QuizResult;
}

// ---------- Student profile bundle (own data only; enforced by RLS) ----------
export async function loadStudentProfile(user: User): Promise<StudentProfile> {
  const [prof, wallet, progress, sessions, cur] = await Promise.all([
    supabase.from('profiles').select('display_alias').eq('id', user.id).maybeSingle(),
    supabase.from('student_wallets').select('xp_balance,coin_balance').eq('student_id', user.id).maybeSingle(),
    supabase.from('learning_progress').select('lesson_id,status,mastery,last_activity_at').eq('student_id', user.id),
    supabase
      .from('quiz_sessions')
      .select('correct_count,total_count,submitted_at,tier:server_result->>tier,lesson_id:server_result->>lesson_id')
      .eq('student_id', user.id)
      .eq('status', 'graded'),
    fetchCurriculum('all')
  ]);
  if (prof.error) fail('profile', prof.error);
  if (wallet.error) fail('wallet', wallet.error);
  if (progress.error) fail('progress', progress.error);
  if (sessions.error) fail('sessions', sessions.error);

  const codeById = new Map(cur.lessons.map((l) => [l.id, l.code] as const));
  const completed: StudentProfile['completedLessons'] = {};
  let stars = 0;

  for (const p of progress.data ?? []) {
    const code = codeById.get(p.lesson_id as string);
    if (!code) continue;
    const done = p.status === 'completed';
    if (done) stars += 1;
    completed[code] = {
      stars: done ? 1 : 0,
      bestScore: Math.round(Number(p.mastery) || 0),
      completedAt: (p.last_activity_at as string) ?? new Date().toISOString()
    };
  }
  // Per-tier best results (key: "<lessonCode>_<easy|medium|hard>") for the existing lesson UI.
  for (const s of (sessions.data ?? []) as unknown as {
    correct_count: number; total_count: number; submitted_at: string; tier: DbTier; lesson_id: string;
  }[]) {
    const code = codeById.get(s.lesson_id);
    if (!code || !DB_TO_UI_TIER[s.tier]) continue;
    const key = `${code}_${DB_TO_UI_TIER[s.tier]}`;
    const best = Math.max(completed[key]?.bestScore ?? 0, s.correct_count ?? 0);
    const good = s.total_count > 0 && s.correct_count / s.total_count >= 0.8;
    completed[key] = { stars: good ? 1 : (completed[key]?.stars ?? 0), bestScore: best, completedAt: s.submitted_at };
  }

  return upsertAuthProfile(user.id, {
    name: (prof.data?.display_alias as string) ?? 'Học sinh',
    coins: Number(wallet.data?.coin_balance ?? 0),
    stars,
    exp: Number(wallet.data?.xp_balance ?? 0),
    completedLessons: completed
  });
}
