-- phase1_delta.sql  (ADDITIVE: no DROP TABLE/COLUMN, no data deletion)
-- Target: Supabase project owqbwykjabwevkbjroym, after hsv_* migrations 1-7.
-- Dollar tags used: $fn$ (functions), $do$ (DO blocks). Safe to embed in an outer DO.

-- ===== 1. PROFILES: alias moderation, leaderboard opt-in, avatar/locale validation, wallet bootstrap =====
alter table public.profiles
  add column if not exists alias_status text not null default 'auto',
  add column if not exists show_on_leaderboard boolean not null default false;
alter table public.profiles add constraint profiles_alias_status_chk check (alias_status in ('auto','pending','approved','rejected'));
alter table public.profiles add constraint profiles_locale_chk check (locale in ('vi-VN','en-US'));
grant select (alias_status, show_on_leaderboard) on public.profiles to authenticated;
grant update (show_on_leaderboard) on public.profiles to authenticated;

create or replace function private.immutable_columns() returns trigger language plpgsql set search_path = '' as $fn$
declare c text;
begin
  foreach c in array tg_argv loop
    if to_jsonb(new) -> c is distinct from to_jsonb(old) -> c then
      raise exception 'column % of % is immutable', c, tg_table_name using errcode = '55000';
    end if;
  end loop;
  return new;
end $fn$;

create or replace function private.guard_profile() returns trigger language plpgsql set search_path = '' as $fn$
declare v text;
begin
  if current_user in ('authenticated','anon') then
    if tg_op = 'INSERT' then
      raise exception 'profiles are created by the system' using errcode = '42501';
    end if;
    if new.display_alias is distinct from old.display_alias then
      v := regexp_replace(new.display_alias, '[ ._-]', '', 'g');
      if new.display_alias ~ '[@/:<>]' or v ~ '[0-9]{7,}' or new.display_alias ~* '(http|www)' then
        raise exception 'alias contains disallowed content' using errcode = '23514';
      end if;
      new.alias_status := 'pending';
    elsif new.alias_status is distinct from old.alias_status then
      raise exception 'alias_status is managed by moderators' using errcode = '42501';
    end if;
    if new.avatar_key is distinct from old.avatar_key and new.avatar_key is not null
       and not exists (select 1 from public.avatar_catalog a where a.avatar_key = new.avatar_key and a.is_active) then
      raise exception 'unknown avatar' using errcode = '23514';
    end if;
  end if;
  return new;
end $fn$;
create trigger trg_guard_profile before insert or update on public.profiles for each row execute function private.guard_profile();
create trigger trg_immutable_profile before update on public.profiles for each row execute function private.immutable_columns('id','created_at');

create or replace function private.create_wallet_for_profile() returns trigger language plpgsql security definer set search_path = '' as $fn$
begin
  insert into public.student_wallets(student_id) values (new.id) on conflict (student_id) do nothing;
  return new;
end $fn$;
create trigger trg_profile_wallet after insert on public.profiles for each row execute function private.create_wallet_for_profile();
insert into public.student_wallets(student_id) select id from public.profiles on conflict (student_id) do nothing;

create or replace function public.moderate_alias(p_user uuid, p_approve boolean) returns text language plpgsql security definer set search_path = '' as $fn$
declare v_res text;
begin
  if auth.uid() is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if not (private.is_platform_admin() or exists (select 1 from public.platform_roles pr where pr.user_id = auth.uid() and pr.role = 'support_admin')) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  if p_approve then
    update public.profiles set alias_status = 'approved' where id = p_user and alias_status = 'pending';
    v_res := 'approved';
  else
    update public.profiles set display_alias = 'HocSinh-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 8), alias_status = 'auto'
      where id = p_user and alias_status = 'pending';
    v_res := 'reset';
  end if;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, details)
    values (auth.uid(), 'profiles.moderate_alias', 'profiles', p_user::text, jsonb_build_object('result', v_res));
  return v_res;
end $fn$;

-- ===== 2. QUESTIONS: workflow guard, publish validation as definer, hide explanation, answer-key RLS =====
create or replace function private.guard_question_status() returns trigger language plpgsql set search_path = '' as $fn$
declare v_uid uuid := auth.uid(); v_client boolean := current_user in ('authenticated','anon');
begin
  if tg_op = 'INSERT' then
    if v_client then
      if new.status not in ('draft','pending_review') then
        raise exception 'clients may only create draft or pending_review questions' using errcode = '42501';
      end if;
      if new.created_by is distinct from v_uid or new.reviewed_by is not null or new.reviewed_at is not null then
        raise exception 'invalid author/reviewer fields' using errcode = '42501';
      end if;
    end if;
    return new;
  end if;
  if old.status = 'published' and new.status not in ('published','archived') then
    raise exception 'published questions can only be archived' using errcode = '55000';
  end if;
  if old.status = 'archived' and new.status <> 'archived' then
    raise exception 'archived questions are terminal' using errcode = '55000';
  end if;
  if v_client then
    if new.created_by is distinct from old.created_by or new.reviewed_by is distinct from old.reviewed_by or new.reviewed_at is distinct from old.reviewed_at then
      raise exception 'author/reviewer fields are system-managed' using errcode = '42501';
    end if;
    if new.status is distinct from old.status then
      if old.status = 'draft' and new.status in ('pending_review','archived') then
        null;
      elsif old.status = 'pending_review' and new.status in ('draft','archived') then
        null;
      elsif old.status = 'pending_review' and new.status = 'approved' then
        if not private.is_platform_admin() then raise exception 'only platform_admin may approve' using errcode = '42501'; end if;
        if old.created_by is not distinct from v_uid then raise exception 'reviewer must differ from author' using errcode = '42501'; end if;
        new.reviewed_by := v_uid; new.reviewed_at := now();
      elsif old.status = 'approved' and new.status = 'published' then
        if not private.is_platform_admin() then raise exception 'only platform_admin may publish' using errcode = '42501'; end if;
        if old.reviewed_by is null or old.reviewed_by is not distinct from old.created_by then raise exception 'approved by a different reviewer is required' using errcode = '42501'; end if;
      elsif old.status = 'approved' and new.status in ('pending_review','draft') then
        if not private.is_platform_admin() then raise exception 'only platform_admin may return approved questions' using errcode = '42501'; end if;
        new.reviewed_by := null; new.reviewed_at := null;
      elsif old.status in ('approved','published') and new.status = 'archived' then
        if not private.is_platform_admin() then raise exception 'only platform_admin may archive' using errcode = '42501'; end if;
      else
        raise exception 'invalid status transition % -> %', old.status, new.status using errcode = '55000';
      end if;
    end if;
  end if;
  return new;
end $fn$;
create trigger trg_guard_question_status before insert or update on public.questions for each row execute function private.guard_question_status();

create or replace function private.validate_question_publish() returns trigger language plpgsql security definer set search_path = '' as $fn$
declare
  v_option_count integer;
  v_correct_key char(1);
begin
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from new.status) then
    select count(*) into v_option_count from public.question_options qo where qo.question_id = new.id;
    select qak.correct_option_key into v_correct_key from private.question_answer_keys qak where qak.question_id = new.id;
    if v_option_count <> 4 then
      raise exception 'A published question must have exactly four options (found %)', v_option_count;
    end if;
    if v_correct_key is null or not exists (select 1 from public.question_options qo where qo.question_id = new.id and qo.option_key = v_correct_key) then
      raise exception 'A published question must have exactly one valid private answer key';
    end if;
  end if;
  return new;
end $fn$;

alter table private.question_answer_keys enable row level security;
revoke all on private.question_answer_keys from public, anon, authenticated;

do $do$
declare cols text;
begin
  select string_agg(quote_ident(attname), ', ' order by attnum) into cols
    from pg_attribute where attrelid = 'public.questions'::regclass and attnum > 0 and not attisdropped and attname <> 'explanation';
  revoke select on public.questions from authenticated, anon;
  execute format('grant select (%s) on public.questions to authenticated', cols);
end $do$;

create or replace function public.admin_get_question_explanation(p_question uuid) returns jsonb language plpgsql stable security definer set search_path = '' as $fn$
declare v jsonb;
begin
  if auth.uid() is null or not (private.is_platform_admin() or exists (select 1 from public.platform_roles pr where pr.user_id = auth.uid() and pr.role = 'content_admin')) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  select q.explanation into v from public.questions q where q.id = p_question;
  return v;
end $fn$;

create policy questions_read_content_admin on public.questions for select to authenticated
  using (exists (select 1 from public.platform_roles pr where pr.user_id = (select auth.uid()) and pr.role = 'content_admin'));
create policy question_options_read_content_admin on public.question_options for select to authenticated
  using (exists (select 1 from public.platform_roles pr where pr.user_id = (select auth.uid()) and pr.role = 'content_admin'));

-- ===== 3. CHAPTERS/LESSONS anon read without calling admin helper =====
alter policy chapters_read_published on public.chapters to authenticated;
create policy chapters_read_published_anon on public.chapters for select to anon using (status = 'published');
alter policy lessons_read_published on public.lessons to authenticated;
create policy lessons_read_published_anon on public.lessons for select to anon using (status = 'published');

-- ===== 4. CLASSES: students see only own classes; hide join_code_hash =====
alter policy classes_select_member on public.classes using (
  private.is_platform_admin()
  or private.has_school_role(school_id, array['school_admin'])
  or private.is_class_teacher(id)
  or private.is_class_member(id)
);

-- ===== 5. ASSIGNMENTS =====
create or replace function private.guard_assignment() returns trigger language plpgsql set search_path = '' as $fn$
begin
  if current_user in ('authenticated','anon') then
    if tg_op = 'INSERT' and new.created_by is distinct from auth.uid() then
      raise exception 'created_by must be the caller' using errcode = '42501';
    end if;
    if new.lesson_id is not null and (tg_op = 'INSERT' or new.lesson_id is distinct from old.lesson_id)
       and not exists (select 1 from public.lessons l where l.id = new.lesson_id and l.status = 'published') then
      raise exception 'lesson must be published' using errcode = '23514';
    end if;
  end if;
  return new;
end $fn$;
create trigger trg_guard_assignment before insert or update on public.class_assignments for each row execute function private.guard_assignment();
create trigger trg_immutable_assignment before update on public.class_assignments for each row execute function private.immutable_columns('id','class_id','created_by','created_at');

create or replace function private.guard_assignment_target() returns trigger language plpgsql security definer set search_path = '' as $fn$
begin
  if not exists (
    select 1 from public.class_assignments ca join public.class_memberships cm on cm.class_id = ca.class_id
    where ca.id = new.assignment_id and cm.user_id = new.student_id and cm.member_role = 'student' and cm.status = 'active') then
    raise exception 'target must be an active student of the assignment class' using errcode = '23514';
  end if;
  return new;
end $fn$;
create trigger trg_guard_assignment_target before insert or update on public.assignment_targets for each row execute function private.guard_assignment_target();

create or replace function private.student_targeted(p_assignment uuid, p_student uuid) returns boolean language sql stable security definer set search_path = '' as $fn$
  select not exists (select 1 from public.assignment_targets t where t.assignment_id = p_assignment)
      or exists (select 1 from public.assignment_targets t where t.assignment_id = p_assignment and t.student_id = p_student)
$fn$;
alter policy assignments_select_class_scope on public.class_assignments using (
  private.is_class_teacher(class_id)
  or (status in ('published','closed')
      and private.student_targeted(class_assignments.id, (select auth.uid()))
      and exists (select 1 from public.class_memberships cm
                  where cm.class_id = class_assignments.class_id and cm.user_id = (select auth.uid())
                    and cm.member_role = 'student' and cm.status = 'active'))
);

-- ===== 6. MEMBERSHIP INTEGRITY =====
create or replace function private.guard_class_membership() returns trigger language plpgsql security definer set search_path = '' as $fn$
declare v_school uuid;
begin
  if tg_op = 'UPDATE' and (new.class_id is distinct from old.class_id or new.user_id is distinct from old.user_id) then
    raise exception 'class_id/user_id are immutable' using errcode = '55000';
  end if;
  if new.status in ('active','invited') then
    select c.school_id into v_school from public.classes c where c.id = new.class_id;
    if not exists (
      select 1 from public.school_memberships sm
      where sm.school_id = v_school and sm.user_id = new.user_id and sm.status = 'active'
        and ((new.member_role = 'student' and sm.role = 'student') or (new.member_role = 'teacher' and sm.role in ('teacher','school_admin')))) then
      raise exception 'user must be an active member of the class school with a matching role' using errcode = '23514';
    end if;
  end if;
  return new;
end $fn$;
create trigger trg_guard_class_membership before insert or update on public.class_memberships for each row execute function private.guard_class_membership();
create trigger trg_immutable_school_membership before update on public.school_memberships for each row execute function private.immutable_columns('id','school_id','user_id');

-- ===== 7. INVITES =====
alter table public.school_invites
  add column if not exists class_id uuid references public.classes(id) on delete cascade,
  add column if not exists revoked_at timestamptz;

create or replace function private.guard_invite() returns trigger language plpgsql security definer set search_path = '' as $fn$
begin
  if new.intended_role = 'school_admin' then
    raise exception 'invites cannot grant school_admin' using errcode = '23514';
  end if;
  if new.class_id is not null and not exists (select 1 from public.classes c where c.id = new.class_id and c.school_id = new.school_id) then
    raise exception 'class does not belong to the invite school' using errcode = '23514';
  end if;
  return new;
end $fn$;
create trigger trg_guard_invite before insert on public.school_invites for each row execute function private.guard_invite();
create trigger trg_immutable_invite before update on public.school_invites for each row execute function private.immutable_columns('id','school_id','class_id','created_by','created_at','invite_code_hash','intended_role');

create table private.invite_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null,
  attempted_at timestamptz not null default now(),
  success boolean not null default false
);
create index invite_attempts_user_time_idx on private.invite_attempts (user_id, attempted_at desc);
alter table private.invite_attempts enable row level security;
revoke all on private.invite_attempts from public, anon, authenticated;

create or replace function public.create_school_invite(p_school uuid, p_class uuid, p_role text, p_max_uses integer default 30, p_ttl_hours integer default 168)
returns text language plpgsql security definer set search_path = '' as $fn$
declare
  v_uid uuid := auth.uid(); v_class_school uuid; v_code text; v_hash text; v_b bytea; v_i int; v_n int := 0;
  v_alpha constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  v_idx constant int[] := array[0,1,2,3,4,5,7,9,10,11];
begin
  if v_uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  if p_role is null or p_role not in ('teacher','student') then raise exception 'invalid role' using errcode = '22023'; end if;
  if p_max_uses is null or p_max_uses not between 1 and 500 or p_ttl_hours is null or p_ttl_hours not between 1 and 2160 then
    raise exception 'invalid limits' using errcode = '22023';
  end if;
  if p_class is not null then
    select c.school_id into v_class_school from public.classes c where c.id = p_class;
    if v_class_school is distinct from p_school then raise exception 'class does not belong to school' using errcode = '42501'; end if;
  end if;
  if not (private.is_platform_admin() or private.has_school_role(p_school, array['school_admin'])
          or (p_role = 'student' and p_class is not null and private.is_class_teacher(p_class))) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  loop
    v_b := decode(replace(gen_random_uuid()::text, '-', ''), 'hex');
    v_code := '';
    for v_i in 0..9 loop
      v_code := v_code || substr(v_alpha, (get_byte(v_b, v_idx[v_i + 1]) % 32) + 1, 1);
    end loop;
    v_hash := encode(sha256(convert_to(v_code, 'UTF8')), 'hex');
    exit when not exists (select 1 from public.school_invites i where i.invite_code_hash = v_hash);
    v_n := v_n + 1;
    if v_n > 5 then raise exception 'could not generate code' using errcode = '54000'; end if;
  end loop;
  insert into public.school_invites(school_id, class_id, invite_code_hash, intended_role, expires_at, max_uses, created_by)
    values (p_school, p_class, v_hash, p_role::public.school_member_role, now() + make_interval(hours => p_ttl_hours), p_max_uses, v_uid);
  return v_code;
end $fn$;

create or replace function public.revoke_school_invite(p_invite uuid) returns boolean language plpgsql security definer set search_path = '' as $fn$
declare v_inv public.school_invites%rowtype;
begin
  if auth.uid() is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  select * into v_inv from public.school_invites i where i.id = p_invite;
  if not found then return false; end if;
  if not (private.is_platform_admin() or private.has_school_role(v_inv.school_id, array['school_admin']) or v_inv.created_by = auth.uid()) then
    raise exception 'not allowed' using errcode = '42501';
  end if;
  update public.school_invites set revoked_at = now() where id = p_invite and revoked_at is null;
  return found;
end $fn$;

create or replace function public.redeem_school_invite(p_code text) returns jsonb language plpgsql security definer set search_path = '' as $fn$
declare
  v_uid uuid := auth.uid(); v_fails int; v_hash text; v_inv public.school_invites%rowtype; v_sm public.school_memberships%rowtype; v_new boolean := false;
begin
  if v_uid is null then raise exception 'not authenticated' using errcode = '28000'; end if;
  select count(*) into v_fails from private.invite_attempts a where a.user_id = v_uid and not a.success and a.attempted_at > now() - interval '10 minutes';
  if v_fails >= 5 then raise exception 'too_many_attempts' using errcode = '54000'; end if;
  p_code := upper(btrim(coalesce(p_code, '')));
  v_hash := encode(sha256(convert_to(p_code, 'UTF8')), 'hex');
  select * into v_inv from public.school_invites i where i.invite_code_hash = v_hash for update;
  if not found or v_inv.revoked_at is not null or v_inv.expires_at <= now() or v_inv.intended_role = 'school_admin' then
    insert into private.invite_attempts(user_id, success) values (v_uid, false);
    return jsonb_build_object('ok', false, 'error', 'invalid_or_expired');
  end if;
  select * into v_sm from public.school_memberships m where m.school_id = v_inv.school_id and m.user_id = v_uid;
  if found and v_sm.status = 'suspended' then
    insert into private.invite_attempts(user_id, success) values (v_uid, false);
    return jsonb_build_object('ok', false, 'error', 'not_allowed');
  end if;
  if found and v_sm.status = 'active' then
    if v_sm.role <> v_inv.intended_role then
      insert into private.invite_attempts(user_id, success) values (v_uid, false);
      return jsonb_build_object('ok', false, 'error', 'role_conflict');
    end if;
  else
    if v_inv.used_count >= v_inv.max_uses then
      insert into private.invite_attempts(user_id, success) values (v_uid, false);
      return jsonb_build_object('ok', false, 'error', 'invalid_or_expired');
    end if;
    v_new := true;
    insert into public.school_memberships(school_id, user_id, role, status, joined_at)
      values (v_inv.school_id, v_uid, v_inv.intended_role, 'active', now())
      on conflict (school_id, user_id) do update set status = 'active', role = excluded.role, joined_at = coalesce(public.school_memberships.joined_at, now());
    update public.school_invites set used_count = used_count + 1 where id = v_inv.id;
  end if;
  if v_inv.class_id is not null then
    insert into public.class_memberships(class_id, user_id, member_role, status, joined_at)
      values (v_inv.class_id, v_uid, v_inv.intended_role::text, 'active', now())
      on conflict (class_id, user_id) do update set status = 'active', member_role = excluded.member_role, joined_at = coalesce(public.class_memberships.joined_at, now())
      where public.class_memberships.status in ('left','invited');
  end if;
  insert into private.invite_attempts(user_id, success) values (v_uid, true);
  return jsonb_build_object('ok', true, 'school_id', v_inv.school_id, 'class_id', v_inv.class_id, 'role', v_inv.intended_role::text, 'already_member', not v_new);
end $fn$;

do $do$
declare cols text;
begin
  select string_agg(quote_ident(attname), ', ' order by attnum) into cols
    from pg_attribute where attrelid = 'public.classes'::regclass and attnum > 0 and not attisdropped and attname <> 'join_code_hash';
  revoke select on public.classes from authenticated, anon;
  execute format('grant select (%s) on public.classes to authenticated', cols);
  select string_agg(quote_ident(attname), ', ' order by attnum) into cols
    from pg_attribute where attrelid = 'public.school_invites'::regclass and attnum > 0 and not attisdropped and attname <> 'invite_code_hash';
  revoke select on public.school_invites from authenticated, anon;
  execute format('grant select (%s) on public.school_invites to authenticated', cols);
end $do$;

-- ===== 8. LEDGERS: append-only, sign rules, atomic wallet, idempotent posting =====
alter table public.xp_ledger add constraint xp_ledger_sign_chk check ((kind = 'earn' and amount > 0) or kind in ('adjustment','reversal'));
alter table public.coin_ledger add constraint coin_ledger_sign_chk check ((kind = 'earn' and amount > 0) or (kind = 'spend' and amount < 0) or kind in ('adjustment','reversal'));

create or replace function private.deny_ledger_mutation() returns trigger language plpgsql security definer set search_path = '' as $fn$
begin
  if tg_op = 'DELETE' then
    if not exists (select 1 from public.profiles p where p.id = old.student_id) then
      return old;
    end if;
  end if;
  raise exception 'ledger is append-only' using errcode = '55000';
end $fn$;
create trigger trg_xp_ledger_append_only before update or delete on public.xp_ledger for each row execute function private.deny_ledger_mutation();
create trigger trg_xp_ledger_no_truncate before truncate on public.xp_ledger for each statement execute function private.deny_ledger_mutation();
create trigger trg_coin_ledger_append_only before update or delete on public.coin_ledger for each row execute function private.deny_ledger_mutation();
create trigger trg_coin_ledger_no_truncate before truncate on public.coin_ledger for each statement execute function private.deny_ledger_mutation();

create or replace function private.apply_ledger_to_wallet() returns trigger language plpgsql security definer set search_path = '' as $fn$
begin
  if tg_table_name = 'xp_ledger' then
    update public.student_wallets set xp_balance = xp_balance + new.amount, updated_at = now() where student_id = new.student_id;
    if not found then insert into public.student_wallets(student_id, xp_balance) values (new.student_id, new.amount); end if;
  else
    update public.student_wallets set coin_balance = coin_balance + new.amount, updated_at = now() where student_id = new.student_id;
    if not found then insert into public.student_wallets(student_id, coin_balance) values (new.student_id, new.amount); end if;
  end if;
  return null;
end $fn$;
create trigger trg_xp_ledger_apply after insert on public.xp_ledger for each row execute function private.apply_ledger_to_wallet();
create trigger trg_coin_ledger_apply after insert on public.coin_ledger for each row execute function private.apply_ledger_to_wallet();

create or replace function private.post_ledger_entry(p_currency text, p_student uuid, p_kind public.ledger_kind, p_amount bigint, p_source_type text, p_source_id uuid, p_key text, p_reason text default null)
returns boolean language plpgsql security definer set search_path = '' as $fn$
declare n int;
begin
  if p_currency = 'xp' then
    insert into public.xp_ledger(student_id, kind, amount, source_type, source_id, idempotency_key, reason)
      values (p_student, p_kind, p_amount, p_source_type, p_source_id, p_key, p_reason) on conflict do nothing;
  elsif p_currency = 'coin' then
    insert into public.coin_ledger(student_id, kind, amount, source_type, source_id, idempotency_key, reason)
      values (p_student, p_kind, p_amount, p_source_type, p_source_id, p_key, p_reason) on conflict do nothing;
  else
    raise exception 'unknown currency' using errcode = '22023';
  end if;
  get diagnostics n = row_count;
  return n = 1;
end $fn$;

-- ===== 9. GRADING RESULT PROTECTION =====
alter table public.quiz_sessions add constraint quiz_sessions_counts_chk check (correct_count is null or total_count is null or (correct_count >= 0 and correct_count <= total_count));

create or replace function private.guard_quiz_session() returns trigger language plpgsql set search_path = '' as $fn$
begin
  if old.status in ('graded','expired') then
    raise exception 'graded or expired sessions are immutable' using errcode = '55000';
  end if;
  if new.status <> 'graded' and (new.score is distinct from old.score or new.correct_count is distinct from old.correct_count or new.server_result is distinct from old.server_result) then
    raise exception 'results can only be written when grading' using errcode = '55000';
  end if;
  if old.status = 'submitted' and new.status = 'in_progress' then
    raise exception 'invalid status transition' using errcode = '55000';
  end if;
  return new;
end $fn$;
create trigger trg_guard_quiz_session before update on public.quiz_sessions for each row execute function private.guard_quiz_session();
create trigger trg_immutable_quiz_session before update on public.quiz_sessions for each row execute function private.immutable_columns('id','student_id','assignment_id','mode','started_at');

create or replace function private.guard_attempt() returns trigger language plpgsql security definer set search_path = '' as $fn$
declare v_status public.quiz_status;
begin
  select s.status into v_status from public.quiz_questions qq join public.quiz_sessions s on s.id = qq.session_id where qq.id = old.quiz_question_id;
  if v_status in ('graded','expired') then
    raise exception 'attempts of graded sessions are immutable' using errcode = '55000';
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end $fn$;
create trigger trg_guard_attempt before update or delete on public.question_attempts for each row execute function private.guard_attempt();

create or replace function private.guard_equipment() returns trigger language plpgsql security definer set search_path = '' as $fn$
begin
  if not exists (select 1 from public.student_inventory i where i.student_id = new.student_id and i.item_id = new.item_id) then
    raise exception 'item is not owned by the student' using errcode = '23514';
  end if;
  return new;
end $fn$;
create trigger trg_guard_equipment before insert or update on public.student_equipment for each row execute function private.guard_equipment();

-- ===== 10. AUDIT =====
create or replace function private.audit_row() returns trigger language plpgsql security definer set search_path = '' as $fn$
declare
  r jsonb; o jsonb; d jsonb := '{}'::jsonb; k text; v_school uuid; v_eid text;
  v_skip text[] := array['invite_code_hash','join_code_hash','prompt','explanation','updated_at'];
begin
  r := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  v_eid := case when tg_table_name = 'platform_roles' then (r->>'user_id') || ':' || (r->>'role') else coalesce(r->>'id', r->>'user_id') end;
  if tg_table_name = 'schools' then v_school := (r->>'id')::uuid;
  elsif r ? 'school_id' then v_school := (r->>'school_id')::uuid;
  elsif r ? 'class_id' then select c.school_id into v_school from public.classes c where c.id = (r->>'class_id')::uuid;
  end if;
  if tg_op = 'UPDATE' then
    o := to_jsonb(old);
    for k in select jsonb_object_keys(r) loop
      if k <> all (v_skip) and (o -> k) is distinct from (r -> k) then
        d := d || jsonb_build_object(k, jsonb_build_object('old', o -> k, 'new', r -> k));
      end if;
    end loop;
    if d = '{}'::jsonb then return null; end if;
  else
    for k in select jsonb_object_keys(r) loop
      if k <> all (v_skip) then d := d || jsonb_build_object(k, r -> k); end if;
    end loop;
  end if;
  insert into public.audit_logs(actor_id, action, entity_type, entity_id, school_id, details)
    values (auth.uid(), tg_table_name || '.' || lower(tg_op), tg_table_name, v_eid, v_school, d);
  return null;
end $fn$;

do $do$
declare t text;
begin
  foreach t in array array['platform_roles','schools','classes','school_memberships','class_memberships','school_invites','questions','class_assignments'] loop
    execute format('create trigger trg_audit after insert or update or delete on public.%I for each row execute function private.audit_row()', t);
  end loop;
end $do$;

-- ===== 11. LEADERBOARD: identity-free reads + backend snapshot builder =====
revoke select on public.leaderboard_entries from anon, authenticated;
grant select (snapshot_id, display_alias_snapshot, rank_position, points) on public.leaderboard_entries to anon, authenticated;

create or replace function public.get_leaderboard(p_snapshot uuid)
returns table(rank_position integer, display_alias text, points bigint, is_me boolean)
language sql stable security definer set search_path = '' as $fn$
  select e.rank_position, e.display_alias_snapshot, e.points, coalesce(e.student_id = auth.uid(), false)
  from public.leaderboard_entries e join public.leaderboard_snapshots s on s.id = e.snapshot_id
  where s.id = p_snapshot
    and (s.scope = 'global'
         or (auth.uid() is not null
             and ((s.scope = 'school' and private.has_school_role(s.school_id, null))
               or (s.scope = 'class' and private.is_class_member(s.class_id)))))
  order by e.rank_position, e.display_alias_snapshot
$fn$;

create or replace function private.build_leaderboard_snapshot(
  p_scope text, p_school uuid default null, p_class uuid default null, p_limit integer default 50,
  p_from date default (date_trunc('month', current_date))::date,
  p_to date default ((date_trunc('month', current_date) + interval '1 month') - interval '1 day')::date)
returns uuid language plpgsql security definer set search_path = '' as $fn$
declare v_id uuid := gen_random_uuid();
begin
  if p_scope is null or p_scope not in ('global','school','class')
     or (p_scope = 'school' and p_school is null) or (p_scope = 'class' and p_class is null)
     or p_from is null or p_to is null or p_to < p_from then
    raise exception 'invalid snapshot arguments' using errcode = '22023';
  end if;
  p_limit := least(greatest(coalesce(p_limit, 50), 1), 200);
  insert into public.leaderboard_snapshots(id, scope, school_id, class_id, period_start, period_end)
    values (v_id, p_scope, case when p_scope = 'school' then p_school end, case when p_scope = 'class' then p_class end, p_from, p_to);
  insert into public.leaderboard_entries(snapshot_id, student_id, display_alias_snapshot, rank_position, points)
  select v_id, x.student_id, x.alias, x.rnk::int, x.pts
  from (
    select p.id as student_id, p.display_alias as alias, sum(l.amount) as pts, row_number() over (order by sum(l.amount) desc, p.display_alias, p.id) as rnk
    from public.xp_ledger l join public.profiles p on p.id = l.student_id
    where l.created_at >= p_from and l.created_at < (p_to + 1)
      and p.show_on_leaderboard and p.alias_status in ('auto','approved')
      and (p_scope = 'global'
           or (p_scope = 'school' and exists (select 1 from public.school_memberships sm where sm.school_id = p_school and sm.user_id = p.id and sm.role = 'student' and sm.status = 'active'))
           or (p_scope = 'class' and exists (select 1 from public.class_memberships cm where cm.class_id = p_class and cm.user_id = p.id and cm.member_role = 'student' and cm.status = 'active')))
    group by p.id, p.display_alias
    having sum(l.amount) > 0
  ) x
  where x.rnk <= p_limit;
  return v_id;
end $fn$;

-- ===== 12. SEED CATALOGUE =====
insert into public.subjects(code, name, is_active) select 'toan', 'Toán', true where not exists (select 1 from public.subjects s where s.code = 'toan');

-- ===== 13. FUNCTION PRIVILEGES (Supabase default ACL grants EXECUTE to anon/authenticated/PUBLIC) =====
do $do$
declare f record;
begin
  for f in select p.oid::regprocedure as sig from pg_proc p join pg_namespace n on n.oid = p.pronamespace
           where n.nspname = 'private' and p.proname in ('immutable_columns','guard_profile','create_wallet_for_profile','guard_question_status','validate_question_publish',
             'guard_assignment','guard_assignment_target','guard_class_membership','guard_invite','deny_ledger_mutation','apply_ledger_to_wallet','post_ledger_entry',
             'guard_quiz_session','guard_attempt','guard_equipment','audit_row','build_leaderboard_snapshot') loop
    execute format('revoke all on function %s from public, anon, authenticated', f.sig);
  end loop;
end $do$;
revoke all on function private.student_targeted(uuid, uuid) from public, anon;
grant execute on function private.student_targeted(uuid, uuid) to authenticated;

revoke all on function public.moderate_alias(uuid, boolean) from public, anon;
revoke all on function public.admin_get_question_explanation(uuid) from public, anon;
revoke all on function public.create_school_invite(uuid, uuid, text, integer, integer) from public, anon;
revoke all on function public.revoke_school_invite(uuid) from public, anon;
revoke all on function public.redeem_school_invite(text) from public, anon;
revoke all on function public.get_leaderboard(uuid) from public;
grant execute on function public.moderate_alias(uuid, boolean) to authenticated;
grant execute on function public.admin_get_question_explanation(uuid) to authenticated;
grant execute on function public.create_school_invite(uuid, uuid, text, integer, integer) to authenticated;
grant execute on function public.revoke_school_invite(uuid) to authenticated;
grant execute on function public.redeem_school_invite(text) to authenticated;
grant execute on function public.get_leaderboard(uuid) to anon, authenticated;
grant usage on schema private to service_role;
grant execute on function private.build_leaderboard_snapshot(text, uuid, uuid, integer, date, date) to service_role;
grant execute on function private.post_ledger_entry(text, uuid, public.ledger_kind, bigint, text, uuid, text, text) to service_role;
