# Guardian consent flow – implementation notes

Status: implementation branch only; NOT deployed and NOT enabled for public registration.

## Flow
1. Child opens registration and asks a parent/legal guardian to take over.
2. Adult enters their own name, email and relationship.
3. Supabase Auth sends an email OTP. Adult verifies the OTP; this proves control of the mailbox only, not legal identity or legal guardianship.
4. Adult explicitly declares that they are the child's parent/legal representative and consents to the listed processing purposes and policy versions.
5. Adult creates the student's nickname/password. The Edge Function validates the bearer token, verified email, guardian account metadata, signup rate limit and exact server-side policy version before creating the student Auth account.
6. Service writes a restricted guardian consent record and append-only consent event. Student signs in only after the server confirms the record was created.

## Evidence recorded
- Student Auth UUID and guardian Auth UUID
- Verified guardian email, guardian name and relationship declaration
- Email verification timestamp and consent timestamp
- Policy version and source commit SHA
- Explicit processing purposes and consent method
- Append-only consent/withdrawal event history

No ID documents are collected. Email OTP verifies mailbox control only; it does not establish legal identity or prove a biological/legal relationship. A stronger verification process may be required by legal review and the actual age/use case.

## Safety gates
- VITE_GUARDIAN_CONSENT_ENABLED defaults to false. Public registration remains disabled until operator identity/address, final policy wording, data-flow and cross-border transfer assessment, SMTP deliverability, and legal review are complete.
- The policy version in this branch is provisional. The Edge Function must reject registration while the version is marked DRAFT.
- Do not deploy the migration to the current production project. There is no verified staging project yet.
- Existing student accounts are not automatically grandfathered or deleted. A separate re-consent and access policy must be approved.
- Guardian Auth accounts are marked account_type=guardian; the Auth profile bootstrap trigger deliberately skips creating student profiles/wallets for them.

## SMTP verification
The available Supabase connector can inspect project metadata and database schema but does not expose Auth SMTP credentials/configuration. Verify in Supabase Dashboard > Authentication > SMTP Settings:
- Custom SMTP enabled
- Host, port, username and sender address configured
- Password saved (never paste it into chat)
- Sender domain SPF, DKIM and DMARC verified
- Rate limits and OTP expiry appropriate
- Send a real OTP to a test mailbox and verify delivery, expiry, replay rejection and rate limiting

Supabase default SMTP is for development only and is restricted to authorized team addresses. It is not suitable for public child registration.

## Acceptance tests
- No OTP request when feature flag is off.
- Unverified guardian token cannot create a student.
- A normal student Auth account cannot be used as guardian.
- OTP expiry/replay and invalid OTP are rejected.
- Missing declaration, relationship, name, policy version or purpose is rejected.
- Duplicate nickname and signup throttling are handled.
- Failed consent insert rolls back by deleting the newly created Auth user.
- Guardian account creates no profiles row and no student wallet.
- Student account gets a profile and wallet only after consent is recorded.
- Client roles anon and authenticated cannot SELECT/INSERT/UPDATE/DELETE consent records.
- Consent event UPDATE/DELETE is rejected.
- Student registration/login and existing users are tested separately.