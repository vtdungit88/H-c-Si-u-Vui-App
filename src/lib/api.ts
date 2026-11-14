import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { emailForNickname } from './nickname';
import { upsertAuthProfile } from '../utils/studentStorage';
import type { StudentProfile, AvatarConfig } from '../types';
import { SUBJECT_DB_CODES } from '../data/subjectsCatalog';

/**
 * Typed data-access layer. UI components must not talk to Supabase directly.
 * Answer keys never reach the browser before an answer is committed: scoring is done by
 * the SECURITY DEFINER RPCs public.start_quiz / answer_question / submit_quiz.
 */

export type DbTier = 'basic' | 'application' | 'advanced' | 'mixed';
export type UiTier = 'easy' | 'medium' | 'hard' | 'mixed';
export const UI_TO_DB_TIER: Record<UiTier, DbTier> = { easy: 'basic', medium: 'application', hard: 'advanced', mixed: 'mixed' };
export const DB_TO_UI_TIER: Record<DbTier, UiTier> = { basic: 'easy', application: 'medium', advanced: 'hard', mixed: 'mixed' };

export type SubjectKey = string;
const CHAPTER_PREFIX: Record<string, string> = SUBJECT_DB_CODES;

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
    const wanted = Object.keys(CHAPTER_PREFIX).filter((k) => subject === 'all' || subject === k);
    const chapters = (ch.data as DbChapter[]).filter((c) => wanted.some((k) => new RegExp(`^${CHAPTER_PREFIX[k]}\\d+-c`).test(c.code)));
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
export interface ServerShopItem {
  item_key: string;
  name: string;
  description: string;
  item_type: string;
  price_coins: number;
  required_stars: number;
  is_active: boolean;
}
export async function fetchShopCatalog(): Promise<ServerShopItem[]> {
  const { data, error } = await supabase
    .from('shop_items')
    .select('item_key,name,description,item_type,price_coins,required_stars,is_active')
    .eq('is_active', true);
  if (error) fail('shop_items', error);
  return (data ?? []) as ServerShopItem[];
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
  const code = SUBJECT_DB_CODES[subject] ?? null;
  const { data, error } = await supabase.rpc('adventure_leaderboard', { p_subject: code, p_grade: grade });
  if (error) fail('adventure_leaderboard', error);
  return (data ?? []) as MapLeaderRow[];
}

// ---------- Arena (Blitz) ----------
export interface ArenaStart { match_id: string; seed: number; duration: number }
export interface ArenaResult {
  score: number; correct: number; wrong?: number; max_combo?: number; coins: number;
  previous_best?: number; is_record?: boolean; rewards_left_today?: number; already?: boolean;
}
export interface ArenaStatus { best: number; rewards_left_today: number; elo?: number; wins?: number; losses?: number }
export interface ArenaLeaderRow { rank: number; alias: string; score: number; correct: number }

export async function arenaStartBlitz(grade: number): Promise<ArenaStart> {
  const { data, error } = await supabase.rpc('arena_start_blitz', { p_grade: grade });
  if (error) fail('arena_start_blitz', error);
  return data as ArenaStart;
}
export async function arenaSubmitBlitz(matchId: string, correct: number, wrong: number, maxCombo: number): Promise<ArenaResult> {
  const { data, error } = await supabase.rpc('arena_submit_blitz', { p_match: matchId, p_correct: correct, p_wrong: wrong, p_max_combo: maxCombo });
  if (error) fail('arena_submit_blitz', error);
  return data as ArenaResult;
}
export async function arenaStatus(grade: number): Promise<ArenaStatus> {
  const { data, error } = await supabase.rpc('arena_status', { p_grade: grade });
  if (error) fail('arena_status', error);
  return data as ArenaStatus;
}
export async function arenaLeaderboard(grade: number): Promise<ArenaLeaderRow[]> {
  const { data, error } = await supabase.rpc('arena_leaderboard', { p_grade: grade });
  if (error) fail('arena_leaderboard', error);
  return (data ?? []) as ArenaLeaderRow[];
}

// ---------- Arena (1v1 vs Vui-Bot, Elo) ----------
export interface DuelStart { match_id: string; seed: number; limit_ms: number; plan: { ok: boolean; ms: number }[]; elo: number; questions: number }
export interface DuelResult {
  outcome: 'win' | 'lose' | 'draw'; my_score: number; bot_score: number; correct?: number;
  elo_before: number; elo_after: number; elo_delta: number; coins: number; rewards_left_today?: number; already?: boolean;
}
export interface EloLeaderRow { rank: number; alias: string; elo: number; wins: number; losses: number }

export async function arenaStartDuel(grade: number): Promise<DuelStart> {
  const { data, error } = await supabase.rpc('arena_start_duel', { p_grade: grade });
  if (error) fail('arena_start_duel', error);
  return data as DuelStart;
}
export async function arenaSubmitDuel(matchId: string, ok: boolean[], ms: number[]): Promise<DuelResult> {
  const { data, error } = await supabase.rpc('arena_submit_duel', { p_match: matchId, p_ok: ok, p_ms: ms });
  if (error) fail('arena_submit_duel', error);
  return data as DuelResult;
}
export async function arenaEloLeaderboard(grade: number): Promise<EloLeaderRow[]> {
  const { data, error } = await supabase.rpc('arena_elo_leaderboard', { p_grade: grade });
  if (error) fail('arena_elo_leaderboard', error);
  return (data ?? []) as EloLeaderRow[];
}

// ---------- Phase 3: Level Progression, Vietnam Travel & Safe Social Lobby ----------

export interface HubState {
  xp: number;
  coins: number;
  level: number;
  next_level_xp: number;
  current_level_xp: number;
  claimed_levels: number[];
  current_dest: string;
  stamps: Record<string, number>;
  total_km: number;
  trivia_claimed_today: boolean;
}

export async function fetchHubState(): Promise<HubState> {
  const { data, error } = await supabase.rpc('get_my_hub_state');
  if (error) fail('get_my_hub_state', error);
  return data as HubState;
}

export async function claimLevelMilestone(level: number): Promise<{ already_claimed: boolean; level: number; reward_coins?: number; coins: number }> {
  const { data, error } = await supabase.rpc('claim_level_milestone', { p_level: level });
  if (error) fail('claim_level_milestone', error);
  return data as { already_claimed: boolean; level: number; reward_coins?: number; coins: number };
}

export interface TravelResult {
  current_dest: string;
  final_cost: number;
  discount_pct: number;
  xp_bonus: number;
  coins: number;
  xp: number;
  level: number;
  stamps: Record<string, number>;
  total_km: number;
}

export async function travelToDestination(destKey: string): Promise<TravelResult> {
  const nonce = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`).slice(0, 48);
  const { data, error } = await supabase.rpc('travel_to_destination', { p_dest_key: destKey, p_trip_nonce: nonce });
  if (error) {
    if (/not enough coins/i.test(error.message)) throw new Error('Bạn chưa đủ Xu cho chuyến đi khứ hồi này.');
    if (/requires level/i.test(error.message)) throw new Error('Bạn chưa đạt Cấp độ yêu cầu để tới địa danh này.');
    fail('travel_to_destination', error);
  }
  return data as TravelResult;
}

export async function claimCityTriviaBonus(destKey: string): Promise<{
  already_claimed_today: boolean;
  coins_added?: number;
  xp_added?: number;
  coins: number;
  xp: number;
  level: number;
}> {
  const { data, error } = await supabase.rpc('claim_city_trivia_bonus', { p_dest_key: destKey });
  if (error) fail('claim_city_trivia_bonus', error);
  return data as {
    already_claimed_today: boolean;
    coins_added?: number;
    xp_added?: number;
    coins: number;
    xp: number;
    level: number;
  };
}

export interface LobbyMessage {
  id: string;
  room_key: string;
  student_id: string;
  sender_alias: string;
  sender_level: number;
  kind: 'quick' | 'text' | 'emote';
  body: string;
  created_at: string;
}

export async function fetchLobbyMessages(roomKey: string): Promise<LobbyMessage[]> {
  const { data, error } = await supabase
    .from('lobby_messages')
    .select('id,room_key,student_id,sender_alias,sender_level,kind,body,created_at')
    .eq('room_key', roomKey)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) fail('lobby_messages', error);
  return ((data ?? []) as LobbyMessage[]).reverse();
}

export async function sendLobbyMessage(roomKey: string, kind: 'quick' | 'text' | 'emote', body: string): Promise<LobbyMessage> {
  const { data, error } = await supabase.rpc('send_lobby_message', {
    p_room_key: roomKey,
    p_kind: kind,
    p_body: body
  });
  if (error) throw new Error(error.message);
  return data as LobbyMessage;
}

export async function reportLobbyMessage(messageId: string, reason = 'Nội dung không phù hợp'): Promise<{ reported: boolean; auto_hidden: boolean }> {
  const { data, error } = await supabase.rpc('report_lobby_message', { p_message_id: messageId, p_reason: reason });
  if (error) fail('report_lobby_message', error);
  return data as { reported: boolean; auto_hidden: boolean };
}

export interface LobbyReportRow {
  id: string;
  message_id: string;
  room_key: string;
  reason: string;
  excerpt: string;
  status: string;
  target_alias: string;
  target_student_id: string;
  created_at: string;
}

export async function adminLobbyReports(): Promise<LobbyReportRow[]> {
  const { data, error } = await supabase.rpc('admin_lobby_reports');
  if (error) fail('admin_lobby_reports', error);
  return (data ?? []) as LobbyReportRow[];
}

export async function adminModerateLobby(reportId: string, action: 'hide_msg' | 'mute_1h' | 'dismiss'): Promise<void> {
  const { error } = await supabase.rpc('admin_moderate_lobby', { p_report_id: reportId, p_action: action });
  if (error) fail('admin_moderate_lobby', error);
}

// ---------- Class rooms (PIN) ----------
export interface RoomPlayer { alias: string; score: number | null; correct: number | null; done: boolean; me: boolean }
export interface RoomState {
  room_id: string; pin: string; status: 'lobby' | 'playing' | 'finished'; grade: number; is_host: boolean;
  seed: number | null; limit_ms: number; questions: number; started_at: string | null; me_done: boolean; players: RoomPlayer[];
}
const roomErr = (e: { message: string }): never => {
  const m = e.message;
  if (/room_not_found/.test(m)) throw new Error('Không tìm thấy phòng với mã PIN này. Hãy kiểm tra lại nhé.');
  if (/room_closed/.test(m)) throw new Error('Phòng đã bắt đầu hoặc đã đóng, không vào thêm được.');
  if (/room_full/.test(m)) throw new Error('Phòng đã đủ 60 bạn.');
  if (/too many rooms/.test(m)) throw new Error('Hôm nay bạn đã tạo quá nhiều phòng.');
  if (/no_players/.test(m)) throw new Error('Chưa có bạn nào vào phòng.');
  if (/not_in_room/.test(m)) throw new Error('Bạn chưa ở trong phòng này.');
  throw new Error('Có lỗi với phòng lớp học, thử lại nhé.');
};
export async function roomCreate(grade: number): Promise<{ room_id: string; pin: string }> {
  const { data, error } = await supabase.rpc('room_create', { p_grade: grade });
  if (error) roomErr(error);
  return data as { room_id: string; pin: string };
}
export async function roomJoin(pin: string): Promise<{ room_id: string; pin: string; is_host: boolean }> {
  const { data, error } = await supabase.rpc('room_join', { p_pin: pin });
  if (error) roomErr(error);
  return data as { room_id: string; pin: string; is_host: boolean };
}
export async function roomState(pin: string): Promise<RoomState> {
  const { data, error } = await supabase.rpc('room_state', { p_pin: pin });
  if (error) roomErr(error);
  return data as RoomState;
}
export async function roomStart(roomId: string): Promise<void> {
  const { error } = await supabase.rpc('room_start', { p_room: roomId });
  if (error) roomErr(error);
}
export async function roomEnd(roomId: string): Promise<void> {
  const { error } = await supabase.rpc('room_end', { p_room: roomId });
  if (error) roomErr(error);
}
export async function roomSubmit(roomId: string, ok: boolean[], ms: number[]): Promise<{ score: number; correct: number }> {
  const { data, error } = await supabase.rpc('room_submit', { p_room: roomId, p_ok: ok, p_ms: ms });
  if (error) roomErr(error);
  return data as { score: number; correct: number };
}

// ---------- Global leaderboard (online, shared by every visitor) ----------
export interface GlobalLeaderRow { rank: number; alias: string; stars: number; coins: number; xp: number; avatar: Record<string, unknown> | null; me: boolean | null }
export interface GlobalLeaderboardData {
  total: number; updated_at: string; top: GlobalLeaderRow[];
  me: { rank: number | null; alias: string; stars: number; coins: number; xp: number; visible: boolean } | null;
}
export async function fetchGlobalLeaderboard(sort: 'all' | 'stars' | 'coins'): Promise<GlobalLeaderboardData> {
  const { data, error } = await supabase.rpc('global_leaderboard', { p_sort: sort });
  if (error) fail('global_leaderboard', error);
  return data as GlobalLeaderboardData;
}
export async function setLeaderboardVisibility(show: boolean): Promise<void> {
  const { error } = await supabase.rpc('set_leaderboard_visibility', { p_show: show });
  if (error) fail('set_leaderboard_visibility', error);
}
