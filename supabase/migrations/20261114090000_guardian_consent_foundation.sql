-- Học Siêu Vui: guardian consent foundation
-- Additive only. Apply to staging first; do not apply to production until SMTP and legal text are approved.

create table if not exists public.guardian_consents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references auth.users(id) on delete restrict,
  guardian_user_id uuid not null references auth.users(id) on delete restrict,
  guardian_email text not null,
  guardian_name text not null,
  relationship text not null check (relationship in ('parent','legal_guardian','authorized_caregiver')),
  guardian_email_verified_at timestamptz not null,
  consented_at timestamptz not null default now(),
  policy_version text not null,
  policy_commit_sha text not null,
  consent_purposes text[] not null,
  consent_method text not null check (consent_method = 'supabase_email_otp'),
  withdrawn_at timestamptz,
  created_at timestamptz not null default now(),
  constraint guardian_consents_email_lower check (guardian_email = lower(trim(guardian_email))),
  constraint guardian_consents_name_length check (char_length(trim(guardian_name)) between 2 and 120),
  constraint guardian_consents_purposes_nonempty check (cardinality(consent_purposes) > 0),
  constraint guardian_consents_student_guardian_different check (student_id <> guardian_user_id)
);

create unique index if not exists guardian_consents_one_active_per_student on public.guardian_consents(student_id) where withdrawn_at is null;
create index if not exists guardian_consents_guardian_user_idx on public.guardian_consents(guardian_user_id);
create index if not exists guardian_consents_guardian_email_idx on public.guardian_consents(guardian_email);

create table if not exists public.guardian_consent_events (
  id uuid primary key default gen_random_uuid(),
  consent_id uuid not null references public.guardian_consents(id) on delete restrict,
  student_id uuid not null,
  guardian_user_id uuid not null,
  event_type text not null check (event_type in ('consented','withdrawn','reconfirmed','administrative_review')),
  policy_version text not null,
  policy_commit_sha text not null,
  event_payload jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);
create index if not exists guardian_consent_events_consent_time_idx on public.guardian_consent_events(consent_id, occurred_at desc);

alter table public.guardian_consents enable row level security;
alter table public.guardian_consent_events enable row level security;
revoke all on public.guardian_consents from anon, authenticated;
revoke all on public.guardian_consent_events from anon, authenticated;
grant all on public.guardian_consents to service_role;
grant all on public.guardian_consent_events to service_role;

create or replace function private.prevent_guardian_consent_event_mutation()
returns trigger language plpgsql set search_path = '' as $$
begin raise exception 'guardian consent events are append-only'; end;
$$;
drop trigger if exists trg_guardian_consent_events_immutable on public.guardian_consent_events;
create trigger trg_guardian_consent_events_immutable before update or delete on public.guardian_consent_events
for each row execute function private.prevent_guardian_consent_event_mutation();

-- Guardian Auth identities are not student profiles and must not receive student wallets.
create or replace function private.bootstrap_auth_profile()
returns trigger language plpgsql security definer set search_path = '' as $$
declare v_alias text; v_created boolean := false; i integer;
begin
  if coalesce(new.raw_user_meta_data ->> 'account_type', '') = 'guardian' then return new; end if;
  for i in 1..10 loop
    v_alias := 'HocSinh-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));
    insert into public.profiles(id, display_alias) values (new.id, v_alias) on conflict do nothing;
    if found then v_created := true; exit; end if;
    if exists (select 1 from public.profiles p where p.id=new.id) then v_created := true; exit; end if;
  end loop;
  if not v_created then raise exception 'Could not create a unique student profile alias'; end if;
  return new;
end;
$$;

comment on table public.guardian_consents is 'Restricted guardian consent record. Service-role only; collect only after verified guardian email and explicit attestation.';
comment on table public.guardian_consent_events is 'Append-only audit events for guardian consent and withdrawal. Service-role only.';