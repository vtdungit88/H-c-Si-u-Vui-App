-- Read-only/manual acceptance checks for guardian consent migration. Run on staging after migration.
select to_regclass('public.guardian_consents') is not null as guardian_consents_exists;
select to_regclass('public.guardian_consent_events') is not null as guardian_consent_events_exists;
select c.relname, c.relrowsecurity as rls_enabled from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relname in ('guardian_consents','guardian_consent_events') order by c.relname;
select grantee, table_name, privilege_type from information_schema.role_table_grants where table_schema='public' and table_name in ('guardian_consents','guardian_consent_events') and grantee in ('anon','authenticated','service_role') order by table_name, grantee, privilege_type;
select schemaname, tablename, policyname from pg_policies where schemaname='public' and tablename in ('guardian_consents','guardian_consent_events');
-- Expected: both tables exist, RLS enabled, anon/authenticated have no grants, service_role has required privileges, no client policies.