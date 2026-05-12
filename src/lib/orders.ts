import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { getMasterUser, MASTER_ADMIN_COOKIE } from '@/lib/auth-utils';

export async function getUserOrders() {
  const supabase = await createClient();
  const cookieStore = await cookies();
  
  // 1. 마스터 관리자 인증 체크 (쿠키 기반)
  const isMaster = cookieStore.get(MASTER_ADMIN_COOKIE)?.value === 'true';
  
  if (isMaster) {
    const { data: orders } = await supabase
      .from('shop_orders')
      .select('*')
      .order('created_at', { ascending: false });

    return { orders: orders || [], user: getMasterUser() };
  }

  // 2. 일반 유저 세션 확인
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { orders: [], user: null };
  }

  // 3. 유저별 주문 내역 조회
  const { data: orders, error } = await supabase
    .from('shop_orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getUserOrders] Error:', error.message);
    return { orders: [], user, error };
  }

  return { orders: orders || [], user };
}
