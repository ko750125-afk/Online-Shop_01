import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase-server';
import { getServiceRoleSupabase } from '@/lib/supabase-service-role';
import { isAdminEmail } from '@/lib/constants';

type AdminClientResult =
  | { ok: true; client: SupabaseClient }
  | { ok: false; client: null; error: string };

/**
 * 관리자 Server Action·라우트에서 사용. 마스터 쿠키 또는 관리자 이메일만 통과.
 * `SUPABASE_SERVICE_ROLE_KEY`가 있으면 RLS 우회 클라이언트를 반환합니다.
 */
export async function getSupabaseForAdminActions(): Promise<AdminClientResult> {
  const cookieStore = await cookies();
  const isMasterAdmin = cookieStore.get('rf_master_admin')?.value === 'true';
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !isMasterAdmin) {
    return { ok: false, client: null, error: '로그인이 필요합니다.' };
  }
  if (user && !isAdminEmail(user.email) && !isMasterAdmin) {
    return { ok: false, client: null, error: '권한이 없습니다.' };
  }

  const sr = getServiceRoleSupabase();
  return { ok: true, client: sr ?? supabase };
}
