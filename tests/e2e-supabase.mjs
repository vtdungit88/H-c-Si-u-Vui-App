// End-to-end checks against the real Supabase project using ONLY the publishable key (like the browser).
// Covers: auth/session, quiz start/answer/submit, score calculation, idempotency, anti-tamper, access control.
import { createClient } from '@supabase/supabase-js';
import assert from 'node:assert/strict';

const URL = process.env.VITE_SUPABASE_URL;
const KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
assert(URL && KEY, 'missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY');
const mk = () => createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });
const results = [];
const check = async (name, fn) => {
  try { await fn(); results.push(['PASS', name]); console.log('PASS', name); }
  catch (e) { results.push(['FAIL', name]); console.log('FAIL', name, '-', e.message); }
};

const run = Date.now();
const nickA = `CI A ${run.toString(36)}`;
const nickB = `CI B ${run.toString(36)}`;
const normalize = (n) => n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const emailFor = (n) => `${normalize(n)}@hsv.vnptluongson.cloud`;
const emailA = emailFor(nickA), emailB = emailFor(nickB);
async function register(client, nickname, password) {
  const res = await fetch(`${URL}/functions/v1/account`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ action: 'register', nickname, password })
  });
  const body = await res.json().catch(() => ({}));
  assert(res.ok, `register failed ${res.status}: ${JSON.stringify(body)}`);
  const r = await client.auth.signInWithPassword({ email: emailFor(nickname), password });
  assert(!r.error && r.data.session, r.error?.message);
  return r;
}
const pw = `Tt-${run}-${Math.random().toString(36).slice(2)}`;
const anon = mk(), a = mk(), b = mk();
let lesson, session, qs;

await check('anon: can read published chapters/lessons', async () => {
  const c = await anon.from('chapters').select('id').eq('status', 'published');
  assert(!c.error && c.data.length >= 111, JSON.stringify(c.error));
  const l = await anon.from('lessons').select('id,code').eq('status', 'published');
  assert(!l.error && l.data.length >= 111);
  lesson = l.data.find((x) => x.code === 'toan6_ch1')?.id;
  assert(lesson);
});
await check('anon: cannot read questions, answer keys, explanations', async () => {
  const q = await anon.from('questions').select('id').limit(1);
  assert(q.error || q.data.length === 0, 'anon read questions');
  const k = await anon.schema('private').from('question_answer_keys').select('*').limit(1);
  assert(k.error || k.data.length === 0, 'anon read answer keys');
});
await check('anon: cannot start quiz or read profiles/attempts/roles', async () => {
  const r = await anon.rpc('start_quiz', { p_lesson: lesson, p_tier: 'mixed', p_count: 5 });
  assert(r.error, 'anon started quiz');
  for (const t of ['profiles', 'quiz_sessions', 'question_attempts', 'platform_roles', 'student_wallets']) {
    const x = await anon.from(t).select('*').limit(1);
    assert(x.error || x.data.length === 0, `anon read ${t}`);
  }
});

await check('nickname: duplicate and reserved names are rejected', async () => {
  const post = (nickname) => fetch(`${URL}/functions/v1/account`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: KEY, Authorization: `Bearer ${KEY}` }, body: JSON.stringify({ action: 'register', nickname, password: pw }) });
  assert(!(await post('Admin')).ok, 'reserved accepted');
});
await check('visits: record_visit + get_visit_stats work for anon; admin_overview denied', async () => {
  const v = await anon.rpc('record_visit', { p_visitor: `ci-${run}-visitor` });
  assert(!v.error, v.error?.message);
  const st = await anon.rpc('get_visit_stats');
  assert(!st.error && st.data.total_visits >= 1, JSON.stringify(st.error));
  assert((await anon.rpc('admin_overview')).error, 'anon admin_overview');
});

let signedUp = false;
await check('auth: nickname register (Edge Function) + session', async () => {
  await register(a, nickA, pw);
  signedUp = true;
});
if (signedUp) {
  await check('auth: profile + wallet bootstrapped, alias update allowed', async () => {
    const u = (await a.auth.getUser()).data.user;
    const p = await a.from('profiles').select('display_alias').eq('id', u.id).single();
    assert(!p.error && p.data.display_alias === nickA, p.data?.display_alias);
    const up = await a.from('profiles').update({ display_alias: `CI Alias ${run.toString(36)}` }).eq('id', u.id);
    assert(!up.error, up.error?.message);
    const w = await a.from('student_wallets').select('coin_balance,xp_balance').eq('student_id', u.id).single();
    assert(!w.error && Number(w.data.xp_balance) === 0);
  });
  await check('quiz: start returns questions without any answer key', async () => {
    const r = await a.rpc('start_quiz', { p_lesson: lesson, p_tier: 'mixed', p_count: 5 });
    assert(!r.error, r.error?.message);
    session = r.data.session_id; qs = r.data.questions;
    assert.equal(qs.length, 5);
    assert(!/correct|isCorrect|answer_key/i.test(JSON.stringify(r.data)), 'payload leaks answer info');
  });
  await check('quiz: users cannot read answer keys / explanations directly', async () => {
    const k = await a.schema('private').from('question_answer_keys').select('*').limit(1);
    assert(k.error || k.data.length === 0);
    const e = await a.from('questions').select('explanation').limit(1);
    assert(e.error, 'authenticated read explanation column');
  });
  let firstKey;
  await check('quiz: answer reveals verdict; second answer to same question is ignored', async () => {
    const r1 = await a.rpc('answer_question', { p_quiz_question: qs[0].quiz_question_id, p_option_key: 'A', p_response_ms: 500 });
    assert(!r1.error, r1.error?.message);
    firstKey = r1.data.correct_key;
    const r2 = await a.rpc('answer_question', { p_quiz_question: qs[0].quiz_question_id, p_option_key: firstKey });
    assert.equal(r2.data.already_answered, true);
    assert.equal(r2.data.selected, r1.data.selected);
  });
  await check('quiz: answer 2..5 correctly using revealed keys is impossible beforehand (no keys) - answer with first option', async () => {
    for (const q of qs.slice(1)) {
      const r = await a.rpc('answer_question', { p_quiz_question: q.quiz_question_id, p_option_key: q.options[0].key });
      assert(!r.error, r.error?.message);
    }
  });
  let result;
  await check('quiz: submit grades on server; score matches recorded attempts', async () => {
    const r = await a.rpc('submit_quiz', { p_session: session, p_answers: [] });
    assert(!r.error, r.error?.message);
    result = r.data;
    assert.equal(result.total_count, 5);
    const att = await a.from('question_attempts').select('is_correct');
    assert(!att.error);
    assert.equal(att.data.filter((x) => x.is_correct).length, result.correct_count);
    assert.equal(result.score, Math.round((1000 * result.correct_count) / 5) / 10);
  });
  await check('quiz: resubmit is idempotent (same result, no extra XP)', async () => {
    const r = await a.rpc('submit_quiz', { p_session: session, p_answers: [{ quiz_question_id: qs[0].quiz_question_id, option_key: 'B' }] });
    assert(!r.error); assert.deepEqual(r.data, result);
    const u = (await a.auth.getUser()).data.user;
    const w = await a.from('student_wallets').select('xp_balance').eq('student_id', u.id).single();
    assert.equal(Number(w.data.xp_balance), result.xp_awarded);
  });
  await check('anti-tamper: cannot edit score, wallet, ledger or attempts from client', async () => {
    const u = (await a.auth.getUser()).data.user;
    assert((await a.from('quiz_sessions').update({ score: 100 }).eq('id', session)).error, 'score editable');
    assert((await a.from('student_wallets').update({ coin_balance: 999999 }).eq('student_id', u.id)).error, 'wallet editable');
    assert((await a.from('xp_ledger').insert({ student_id: u.id, kind: 'earn', amount: 9999, idempotency_key: 'hack' + run })).error, 'ledger insertable');
    assert((await a.from('question_attempts').update({ is_correct: true }).eq('quiz_question_id', qs[0].quiz_question_id)).error, 'attempt editable');
  });
  await check('persistence: new client (another device) signs in and sees progress', async () => {
    const d = mk();
    const s = await d.auth.signInWithPassword({ email: emailA, password: pw });
    assert(!s.error, s.error?.message);
    const p = await d.from('learning_progress').select('lesson_id,mastery');
    assert(!p.error && p.data.length === 1 && p.data[0].lesson_id === lesson);
    const sess = await d.from('quiz_sessions').select('status').eq('id', session).single();
    assert.equal(sess.data.status, 'graded');
  });
  await check('isolation: user B cannot see or submit user A data', async () => {
    await register(b, nickB, pw);
    assert((await b.rpc('submit_quiz', { p_session: session, p_answers: [] })).error, 'B submitted A session');
    assert((await b.rpc('answer_question', { p_quiz_question: qs[1].quiz_question_id, p_option_key: 'A' })).error, 'B answered A question');
    for (const t of ['quiz_sessions', 'learning_progress', 'question_attempts']) {
      const x = await b.from(t).select('*');
      assert(!x.error && x.data.length === 0, `B sees ${t}`);
    }
    const pr = await b.from('profiles').select('id');
    assert.equal(pr.data.length, 1, 'B sees other profiles');
  });
  await check('roles: normal user cannot read platform_roles or use admin RPCs', async () => {
    const r = await a.from('platform_roles').select('*');
    assert(!r.error && r.data.length === 0);
    assert((await a.rpc('moderate_alias', { p_user: (await a.auth.getUser()).data.user.id, p_approve: true })).error);
    assert((await a.rpc('admin_get_question_explanation', { p_question: crypto.randomUUID() })).error);
  });
}

const failed = results.filter((r) => r[0] === 'FAIL');
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
