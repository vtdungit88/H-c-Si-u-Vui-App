/**
 * Nickname -> synthetic login e-mail. Accounts are "nickname + password" (no real e-mail needed).
 * MUST stay identical to normalize()/emailFor() in the `account` Edge Function.
 */
export const LOGIN_EMAIL_DOMAIN = 'hsv.vnptluongson.cloud';

export function normalizeNickname(nick: string): string {
  return nick
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'd')
    .toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export const emailForNickname = (nick: string) => `${normalizeNickname(nick)}@${LOGIN_EMAIL_DOMAIN}`;
