import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { emailForNickname } from './nickname';
import { upsertAuthProfile } from '../utils/studentStorage';
import type { StudentProfile, AvatarConfig } from '../types';

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
const CHAPTER_PREFIX: Record<Exclude<SubjectKey, 'all'>, string> = { math: 'toan', science: 'khtn' };

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

// ---------- Auth (nickname + password; no e-mail) ----------
const FN_URL = `${import.meta.env.VITE_SUPABASE_URL as string}/functions/v1/account`;

async function callAccountFn(body: Record<string, unknown>, accessToken?: string) {
  const res = await fetch(FN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string,
      Authorization: `Bearer ${accessToken ?? (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string)}`
    },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message ?? 'Có lỗi xảy ra, hãy thử lại.');
  return data;
}

export async function signUpWithNickname(nickname: string, password: string) {
  await callAccountFn({ action: 'register', nickname, password });
  await signInWithNickname(nickname, password);
}

export async function signInWithNickname(nickname: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email: emailForNickname(nickname), password });
  if (error) throw new Error(/invalid login/i.test(error.message) ? 'Biệt danh hoặc mật khẩu chưa đúng.' : error.message);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

// ---------- Curriculum (public read of published content) ----------
const curriculumCache = new Map<string, Promise<Curriculum>>();

export function fetchCurriculum(subject: SubjectKey = 'math', grade?: number): Promise<Curriculum> {
  const cacheKey = `${subject}:${grade ?? 'all'}`;
  const hit = curriculumCache.get(cacheKey);
  if (hit) return hit;
  const p = (async () => {
    let chQuery = supabase.from('chapters').select('id,code,title,sequence_no').eq('status', 'published');
    if (grade) chQuery = chQuery.eq('grade_id', grade);
    const [ch, ls] = await Promise.all([
      chQuery.order('sequence_no'),
      supabase.from('lessons').select('id,chapter_id,code,title,sequence_no,learning_material').eq('status', 'published').order('sequence_no')
    ]);
    if (ch.error) fail('chapters', ch.error);
    if (ls.error) fail('lessons', ls.error);
    const wanted = (Object.keys(CHAPTER_PREFIX) as (keyof typeof CHAPTER_PREFIX)[]).filter((k) => subject === 'all' || subject === k);
    const chapters = (ch.data as DbChapter[]).filter((c) => wanted.some((k) => /^(toan|khtn)\d+-c/.test(c.code) && c.code.startsWith(CHAPTER_PREFIX[k])));
    const ids = new Set(chapters.map((c) => c.id));
    return { chapters, lessons: (ls.data as DbLesson[]).filter((l) => ids.has(l.chapter_id)) };
  })();
  curriculumCache.set(cacheKey, p);
  p.catch(() => curriculumCache.delete(cacheKey));
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

// ---------- Avatar & shop (server-side; the browser keeps no authority over purchases) ----------
export interface AvatarState { config: Partial<AvatarConfig>; owned: string[]; stars: number }

export async function loadMyAvatar(): Promise<AvatarState> {
  const { data, error } = await supabase.rpc('get_my_avatar');
  if (error) fail('get_my_avatar', error);
  return data as AvatarState;
}
export async function buyItem(itemKey: string): Promise<{ item_key: string; already_owned: boolean; coins: number }> {
  const { data, error } = await supabase.rpc('buy_item', { p_item_key: itemKey });
  if (error) throw new Error(/not enough coins/i.test(error.message) ? 'Bạn chưa đủ xu để mở khóa món này.' : /not enough stars/i.test(error.message) ? 'Bạn chưa đủ sao để mở khóa món này.' : error.message);
  return data as { item_key: string; already_owned: boolean; coins: number };
}
export async function saveAvatar(config: AvatarConfig): Promise<void> {
  const { error } = await supabase.rpc('save_avatar', { p_config: config });
  if (error) fail('save_avatar', error);
}

// ---------- Student profile bundle (own data only; enforced by RLS) ----------
export async function loadStudentProfile(user: User): Promise<StudentProfile> {
  const [prof, wallet, progress, sessions, cur, avatar] = await Promise.all([
    supabase.from('profiles').select('display_alias').eq('id', user.id).maybeSingle(),
    supabase.from('student_wallets').select('xp_balance,coin_balance').eq('student_id', user.id).maybeSingle(),
    supabase.from('learning_progress').select('lesson_id,status,mastery,last_activity_at').eq('student_id', user.id),
    supabase
      .from('quiz_sessions')
      .select('correct_count,total_count,submitted_at,tier:server_result->>tier,lesson_id:server_result->>lesson_id')
      .eq('student_id', user.id)
      .eq('status', 'graded'),
    fetchCurriculum('all'),
    loadMyAvatar().catch(() => null)
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
    completedLessons: completed,
    avatarConfig: avatar?.config,
    unlockedItems: avatar?.owned
  });
}

// ---------- Visits & admin ----------
export interface VisitStats { total_visits: number; today_visits: number; unique_visitors: number }

export async function recordVisit(visitorId: string): Promise<void> {
  await supabase.rpc('record_visit', { p_visitor: visitorId });
}
export async function getVisitStats(): Promise<VisitStats | null> {
  const { data, error } = await supabase.rpc('get_visit_stats');
  return error ? null : (data as VisitStats);
}

export interface AdminOverview {
  users: number; users_today: number; graded_sessions: number; avg_score: number | null; questions_published: number;
  visits: VisitStats;
  recent_users: { alias: string; created_at: string; xp: number; coins: number; quizzes: number; id: string }[];
}
export async function isPlatformAdmin(userId: string): Promise<boolean> {
  const { data } = await supabase.from('platform_roles').select('role').eq('user_id', userId).eq('role', 'platform_admin');
  return (data?.length ?? 0) > 0;
}
export async function adminOverview(): Promise<AdminOverview> {
  const { data, error } = await supabase.rpc('admin_overview');
  if (error) fail('admin_overview', error);
  return data as AdminOverview;
}
export async function adminResetPassword(alias: string, password: string) {
  const { data } = await supabase.auth.getSession();
  await callAccountFn({ action: 'admin_reset_password', alias, password }, data.session?.access_token);
}

export type FeedbackCategory = 'suggestion' | 'bug' | 'compliment' | 'question';
export interface FeedbackRow { id: string; alias: string | null; category: FeedbackCategory; rating: number | null; message: string; created_at: string }
export async function submitFeedback(category: FeedbackCategory, rating: number, message: string) {
  const { error } = await supabase.rpc('submit_feedback', { p_category: category, p_rating: rating, p_message: message });
  if (error) {
    if (/rate_limited/.test(error.message)) throw new Error('Bạn gửi hơi nhiều rồi, hãy thử lại sau ít phút nhé.');
    fail('submit_feedback', error);
  }
}
export async function adminFeedback(): Promise<FeedbackRow[]> {
  const { data, error } = await supabase.rpc('admin_feedback');
  if (error) fail('admin_feedback', error);
  return (data ?? []) as FeedbackRow[];
}

// ---------- Adventure map ----------
export interface NodeProgress { bestCorrect: number; total: number; attempts: number; stars: number }

/** Stars for one node from the best graded result: 100% = 3, 80% = 2, 60% = 1. */
export function starsFor(correct: number, total: number): number {
  if (!total) return 0;
  const r = correct / total;
  return r >= 1 ? 3 : r >= 0.8 ? 2 : r >= 0.6 ? 1 : 0;
}

/** Own best result per lesson (key: DB lesson id). RLS limits this to the signed-in student. */
export async function fetchMapProgress(userId: string): Promise<Record<string, NodeProgress>> {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('correct_count,total_count,lesson_id:server_result->>lesson_id')
    .eq('student_id', userId)
    .eq('status', 'graded');
  if (error) fail('map progress', error);
  const out: Record<string, NodeProgress> = {};
  for (const r of (data ?? []) as unknown as { correct_count: number; total_count: number; lesson_id: string | null }[]) {
    if (!r.lesson_id) continue;
    const cur = out[r.lesson_id] ?? { bestCorrect: 0, total: r.total_count, attempts: 0, stars: 0 };
    cur.attempts += 1;
    if (r.correct_count >= cur.bestCorrect) { cur.bestCorrect = r.correct_count; cur.total = r.total_count; }
    cur.stars = starsFor(cur.bestCorrect, cur.total);
    out[r.lesson_id] = cur;
  }
  return out;
}

export interface MapLeaderRow { rank: number; alias: string; stars: number; cleared: number }
export async function fetchAdventureLeaderboard(subject: SubjectKey, grade: number): Promise<MapLeaderRow[]> {
  const code = subject === 'math' ? 'toan' : subject === 'science' ? 'khtn' : null;
  const { data, error } = await supabase.rpc('adventure_leaderboard', { p_subject: code, p_grade: grade });
  if (error) fail('adventure_leaderboard', error);
  return (data ?? []) as MapLeaderRow[];
}
