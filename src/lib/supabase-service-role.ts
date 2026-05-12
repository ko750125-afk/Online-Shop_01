import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null | undefined;

/**
 * 서버 전용. RLS 우회용 비밀 키가 있을 때만 클라이언트를 반환합니다.
 *
 * - 레거시 JWT: `SUPABASE_SERVICE_ROLE_KEY` (service_role)
 * - 신규 대시보드 Secret: `sb_secret_...` → 동일 변수에 넣거나 `SUPABASE_SECRET_KEY` 사용
 *
 * 관리자 페이지·액션에서 이메일/마스터 쿠키 검증 후에만 사용합니다.
 */
export function getServiceRoleSupabase(): SupabaseClient | null {
  if (cached !== undefined) {
    return cached;
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) {
    cached = null;
    return null;
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
