import { getUserOrders } from '@/lib/orders';
import { MyPageClient } from './mypage-client';

export const dynamic = 'force-dynamic';

export default async function MyPage() {
  const { orders, user } = await getUserOrders();

  // 서버 사이드 강제 리다이렉트 제거 (클라이언트 세션 동기화 지연 대비)
  // MyPageClient 내부에서 비로그인 대응 처리함

  return <MyPageClient initialOrders={orders || []} user={user} />;
}
