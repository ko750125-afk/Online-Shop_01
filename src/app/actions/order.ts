'use server';

import { getServiceRoleSupabase } from '@/lib/supabase-service-role';
import { revalidatePath } from 'next/cache';

export async function createOrderAction(formData: {
  customer_name: string;
  phone: string;
  address: string;
  total_amount: number;
  items: any[];
  user_id?: string | null;
  status?: string;
}) {
  const supabase = getServiceRoleSupabase();
  if (!supabase) {
    throw new Error('Supabase service role client not initialized');
  }

  // 넘어온 status가 존재하면 우선 적용하고, 없으면 기본값 'pending' 할당
  const finalStatus = formData.status || 'pending';

  const { data, error } = await supabase
    .from('shop_orders')
    .insert([
      {
        ...formData,
        status: finalStatus,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message };
  }

  // 주문 인서트 성공 시, 상품별 실시간 DB 잔여 재고 안전 차감 로직 실행
  if (data && formData.items && Array.isArray(formData.items)) {
    for (const item of formData.items) {
      if (item.id && item.quantity) {
        // 실시간 현재 DB 재고 안전 조회
        const { data: prod } = await supabase
          .from('shop_products')
          .select('stock')
          .eq('id', item.id)
          .single();

        if (prod && typeof prod.stock === 'number') {
          const remainStock = Math.max(0, prod.stock - item.quantity);
          await supabase
            .from('shop_products')
            .update({ stock: remainStock })
            .eq('id', item.id);
        }
      }
    }
  }

  // 백오피스 대시보드, 마이페이지 및 메인 쇼핑몰 화면 전체 캐시 즉시 갱신 (재고 반영)
  revalidatePath('/admin/orders');
  revalidatePath('/mypage');
  revalidatePath('/');

  return { success: true, order: data };
}

