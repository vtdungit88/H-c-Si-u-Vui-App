-- phase1_delta_rollback.sql : đưa DB về trạng thái trước phase1_delta.
-- Chỉ xoá đối tượng do delta thêm; khôi phục định nghĩa/quyền cũ. Chạy trong 1 giao dịch.
-- CẢNH BÁO: DROP COLUMN profiles.alias_status/show_on_leaderboard và school_invites.class_id/revoked_at làm mất dữ liệu cột đó
-- (chỉ dùng khi chưa có dữ liệu thật; nếu đã có dữ liệu hãy xuất trước).
begin;
-- triggers
do $do$ declare t text; begin
  foreach t in array array['platform_roles','schools','classes','school_memberships','class_memberships','school_invites','questions','class_assignments'] loop
    execute format('drop trigger if exists trg_audit on public.%I', t);
  end loop; end $do$;
drop trigger if exists trg_guard_profile on public.profiles;
drop trigger if exists trg_immutable_profile on public.profiles;
drop trigger if exists trg_profile_wallet on public.profiles;
drop trigger if exists trg_guard_question_status on public.questions;
drop trigger if exists trg_guard_assignment on public.class_assignments;
drop trigger if exists trg_immutable_assignment on public.class_assignments;
drop trigger if exists trg_guard_assignment_target on public.assignment_targets;
drop trigger if exists trg_guard_class_membership on public.class_memberships;
drop trigger if exists trg_immutable_school_membership on public.school_memberships;
drop trigger if exists trg_guard_invite on public.school_invites;
drop trigger if exists trg_immutable_invite on public.school_invites;
drop trigger if exists trg_xp_ledger_append_only on public.xp_ledger;
drop trigger if exists trg_xp_ledger_no_truncate on public.xp_ledger;
drop trigger if exists trg_xp_ledger_apply on public.xp_ledger;
drop trigger if exists trg_coin_ledger_append_only on public.coin_ledger;
drop trigger if exists trg_coin_ledger_no_truncate on public.coin_ledger;
drop trigger if exists trg_coin_ledger_apply on public.coin_ledger;
drop trigger if exists trg_guard_quiz_session on public.quiz_sessions;
drop trigger if exists trg_immutable_quiz_session on public.quiz_sessions;
drop trigger if exists trg_guard_attempt on public.question_attempts;
drop trigger if exists trg_guard_equipment on public.student_equipment;
-- constraints
alter table public.profiles drop constraint if exists profiles_alias_status_chk, drop constraint if exists profiles_locale_chk;
alter table public.xp_ledger drop constraint if exists xp_ledger_sign_chk;
alter table public.coin_ledger drop constraint if exists coin_ledger_sign_chk;
alter table public.quiz_sessions drop constraint if exists quiz_sessions_counts_chk;
-- policies
drop policy if exists questions_read_content_admin on public.questions;
drop policy if exists question_options_read_content_admin on public.question_options;
drop policy if exists chapters_read_published_anon on public.chapters;
drop policy if exists lessons_read_published_anon on public.lessons;
alter policy chapters_read_published on public.chapters to anon, authenticated;
alter policy lessons_read_published on public.lessons to anon, authenticated;
alter policy classes_select_member on public.classes using (private.has_school_role(school_id, NULL::text[]) OR private.is_class_member(id));
alter policy assignments_select_class_scope on public.class_assignments using (
  private.is_class_teacher(class_id) OR (EXISTS (SELECT 1 FROM public.class_memberships cm
   WHERE cm.class_id = class_assignments.class_id AND cm.user_id = (SELECT auth.uid()) AND cm.member_role = 'student' AND cm.status = 'active')));
-- grants (khôi phục SELECT mức bảng như trước)
grant select on public.questions to authenticated;
grant select on public.classes to authenticated;
grant select on public.school_invites to authenticated;
grant select on public.leaderboard_entries to anon, authenticated;
-- answer keys: trước đó RLS tắt, không có grant
alter table private.question_answer_keys disable row level security;
-- validate_question_publish: khôi phục bản gốc (SECURITY INVOKER)
create or replace function private.validate_question_publish() returns trigger language plpgsql set search_path = '' as $fn$
declare v_option_count integer; v_correct_key char(1);
begin
  if new.status='published' and (tg_op='INSERT' or old.status is distinct from new.status) then
    select count(*) into v_option_count from public.question_options qo where qo.question_id=new.id;
    select qak.correct_option_key into v_correct_key from private.question_answer_keys qak where qak.question_id=new.id;
    if v_option_count <> 4 then raise exception 'A published question must have exactly four options (found %)', v_option_count; end if;
    if v_correct_key is null or not exists (select 1 from public.question_options qo where qo.question_id=new.id and qo.option_key=v_correct_key) then
      raise exception 'A published question must have exactly one valid private answer key'; end if;
  end if;
  return new;
end $fn$;
-- functions
drop function if exists public.moderate_alias(uuid, boolean);
drop function if exists public.admin_get_question_explanation(uuid);
drop function if exists public.create_school_invite(uuid, uuid, text, integer, integer);
drop function if exists public.revoke_school_invite(uuid);
drop function if exists public.redeem_school_invite(text);
drop function if exists public.get_leaderboard(uuid);
drop function if exists private.build_leaderboard_snapshot(text, uuid, uuid, integer, date, date);
drop function if exists private.post_ledger_entry(text, uuid, public.ledger_kind, bigint, text, uuid, text, text);
drop function if exists private.immutable_columns();
drop function if exists private.guard_profile();
drop function if exists private.create_wallet_for_profile();
drop function if exists private.guard_question_status();
drop function if exists private.guard_assignment();
drop function if exists private.guard_assignment_target();
drop function if exists private.student_targeted(uuid, uuid);
drop function if exists private.guard_class_membership();
drop function if exists private.guard_invite();
drop function if exists private.deny_ledger_mutation();
drop function if exists private.apply_ledger_to_wallet();
drop function if exists private.guard_quiz_session();
drop function if exists private.guard_attempt();
drop function if exists private.guard_equipment();
drop function if exists private.audit_row();
-- tables / columns thêm bởi delta
drop table if exists private.invite_attempts;
alter table public.school_invites drop column if exists class_id, drop column if exists revoked_at;
alter table public.profiles drop column if exists alias_status, drop column if exists show_on_leaderboard;
-- dữ liệu: subject 'toan' (chỉ xoá nếu chưa có chương nào tham chiếu)
delete from public.subjects s where s.code='toan' and not exists (select 1 from public.chapters c where c.subject_id=s.id);
commit;
