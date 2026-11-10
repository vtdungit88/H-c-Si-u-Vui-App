# Học Siêu Vui — MVP Execution Brief

**Target:** Live-preview website for Toán lớp 6, mobile-first, backed by the existing Supabase project.  
**Repository:** `vtdungit88/H-c-Si-u-Vui-App`  
**Working branch:** `feature/mvp-web-supabase`  
**Base branch:** `main` (do not push implementation directly to main).

## Product scope

Deliver a responsive web application first. Optimize the student experience for mobile browsers, then desktop. Do not build a native Android/iOS app in this MVP. Keep the subject scope to Math Grade 6. Other grades and subjects are later phases.

## MVP acceptance flow

1. Student opens the HTTPS website on a phone.
2. Student registers/signs in through Supabase Auth (not a client-side nickname/password database).
3. Student sees Grade 6 Math chapters/lessons.
4. Student opens a published quiz and submits answers.
5. Correct answers are evaluated server-side; answer keys and privileged secrets never reach the browser.
6. Result/attempt and progress are persisted to Supabase and can be reloaded on another device.
7. A teacher/admin view can inspect results for their authorized class only.
8. Anonymous visitors cannot read private student data, attempts, answer keys, or role/authorization data.

## Required engineering workflow

- Work only on `feature/mvp-web-supabase`; preserve `main`.
- Inspect the entire repository and existing migrations before coding.
- Produce small, reviewable commits. Do not rewrite working visual/gameplay components without a concrete reason.
- Keep current avatar, artwork, question content and useful gameplay where compatible; disable or defer non-MVP features rather than deleting them.
- Run `npm run lint` and `npm run build` after each integration milestone; report exact output.
- Add automated tests for auth/session handling, quiz submission, score calculation, and access control.
- Never place Supabase service-role/secret keys in frontend code or VITE_ environment variables.
- Frontend may use only the Supabase project URL and publishable/anon key.
- Use server-side/Edge Function or secure database RPC for quiz scoring. Do not send correct-answer keys to the client before submission.
- Apply database changes only as reviewed, additive, repeatable migrations. Verify with SQL and Supabase Advisors.
- Do not seed production-like student identities or real personal data. Use clearly marked test accounts/content.
- Do not add paid services or incur paid infrastructure without owner approval.

## Confirmed initial source risks

1. `src/utils/studentStorage.ts` stores student profiles and passwords in browser LocalStorage, uses a shared default password, and implements password reset without independent identity verification. Replace this auth path with Supabase Auth; do not migrate stored plaintext passwords.
2. `src/types.ts` includes a client-side `password` field. Remove it from persisted client profile types once migration is complete.
3. The existing Admin UI and architecture documentation describe hardcoded administrator credentials. Remove all embedded credentials and password-reset shortcuts. Admin access must be granted through verified server-side role membership / app metadata or protected role tables and RLS.
4. Current learning/game components are largely wired to LocalStorage. Introduce a typed repository/data-access layer so UI components do not directly own persistence logic.
5. Existing Vite PWA configuration is present. Verify all referenced icons/assets exist in `public/`, verify mobile viewport and safe-area behavior, and check service-worker cache invalidation before preview release.
6. Review the app for misleading simulated online counts, fake leaderboard/student records, and unsupported claims. Clearly label demo content or remove it from live MVP screens.

## Supabase state observed during kickoff

Project: `owqbwykjabwevkbjroym` (ACTIVE_HEALTHY, PostgreSQL 17).  
Existing migration history: 7 migrations.  
Public schema has 37 tables; all observed public tables have RLS enabled.  
No Auth users, no Edge Functions, and no Grade 6 subject/lesson/question seed data were observed.  
The private table `private.question_answer_keys` currently has RLS disabled. Treat as a security blocker. Do not blindly enable RLS without reviewing intended privileged access; define an explicit private-schema access model and verify it.  
Supabase Security and Health Advisor returned no lints, but this does not negate the direct RLS finding above.

## Recommended implementation order

### Milestone 1 — Deployable frontend preview
- Verify build and runtime configuration.
- Add safe SPA hosting configuration if needed.
- Connect repository to a free-tier static hosting provider (prefer Vercel or Cloudflare Pages only if available and approved).
- Create Preview deployment from this branch; do not make production deployment the default.
- Verify mobile layout on narrow viewport, refresh/deep-link behavior, asset paths, PWA manifest/icons, and service worker.

### Milestone 2 — Supabase client and identity
- Add pinned `@supabase/supabase-js` dependency and lockfile update.
- Add typed Supabase client using `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- Implement sign-up/sign-in/sign-out/session restore and profile bootstrap.
- Define student, teacher, school admin, and platform admin permissions with server-enforced authorization.
- Remove LocalStorage password/authentication paths and hardcoded admin credentials.
- Preserve non-sensitive local UI preferences only.

### Milestone 3 — Grade 6 Math learning flow
- Map current Math 6 content into the existing subjects/chapters/lessons/questions schema.
- Keep content in `pending_review` until curriculum/content review and teacher approval.
- Build lesson list/detail and quiz UI from Supabase data.
- Submit answers without exposing answer keys.
- Calculate score on the server and persist attempts/results/progress.
- Verify replay/idempotency and prevent client score tampering.

### Milestone 4 — Teacher view and pilot readiness
- Restrict class results to authorized teachers/school admins.
- Add empty/loading/error states and mobile usability checks.
- Run RLS tests for anon, student, teacher, school admin, and platform admin.
- Verify data survives logout/login and another device.
- Publish only after acceptance checks pass.

## Required report from Claude Code

Before implementation: provide repository-wide inventory, current build/lint output, actual hosting blockers, and a short file-level plan.  
After each milestone: list changed files, migration names, commands/tests run with exact pass/fail output, deployment URL if created, and remaining blockers.  
Never claim a task is complete without evidence.