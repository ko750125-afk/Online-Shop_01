/**
 * 관리자 이메일 목록 — Supabase Auth에 등록된 이메일과 정확히 일치해야 합니다.
 * (표시 브랜드는 Urban Deco이며, 전용 도메인 계정으로 동기화되었습니다.)
 */
export const ADMIN_EMAILS = [
  'admin@urbandeco.shop',
  'manager@urbandeco.shop',
  'ko750125@gmail.com',
] as const;

export type AdminEmail = (typeof ADMIN_EMAILS)[number];

const ADMIN_EMAIL_SET: ReadonlySet<string> = new Set(ADMIN_EMAILS);

/** Supabase `user.email` 등 임의 문자열이 관리자 목록에 있는지 검사 */
export function isAdminEmail(email: string | null | undefined): boolean {
  return typeof email === 'string' && email.length > 0 && ADMIN_EMAIL_SET.has(email);
}

/** 마스터 로그인 자격증명 (임시 - Supabase 이메일 제한 우회용) */
export const MASTER_CREDENTIALS = {
  email: 'ko750125@gmail.com',
  password: '060812',
} as const;
