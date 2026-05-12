'use server';

import { revalidatePath } from 'next/cache';
import { getSupabaseForAdminActions } from '@/lib/admin-supabase';

export type OrderStatus = 'pending' | 'completed';

export async function deleteProduct(productId: string): Promise<{ success: boolean; message?: string }> {
  const gate = await getSupabaseForAdminActions();
  if (!gate.ok) {
    return { success: false, message: gate.error };
  }

  const { error } = await gate.client
    .from('shop_products')
    .delete()
    .eq('id', productId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ success: boolean; message?: string }> {
  const gate = await getSupabaseForAdminActions();
  if (!gate.ok) {
    return { success: false, message: gate.error };
  }

  const nextStatus: OrderStatus = status === 'completed' ? 'completed' : 'pending';
  const { error } = await gate.client
    .from('shop_orders')
    .update({ status: nextStatus })
    .eq('id', orderId);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/orders');
  return { success: true };
}

export interface ProductUpdatePayload {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
}

export async function updateProduct(
  payload: ProductUpdatePayload
): Promise<{ success: boolean; message?: string }> {
  const gate = await getSupabaseForAdminActions();
  if (!gate.ok) {
    return { success: false, message: gate.error };
  }

  if (!payload.id) {
    return { success: false, message: '상품 ID가 없습니다.' };
  }

  const { error } = await gate.client
    .from('shop_products')
    .update({
      name: payload.name.trim(),
      category: payload.category.trim(),
      description: payload.description.trim(),
      price: payload.price,
      stock: payload.stock,
      image_url: payload.image_url?.trim() || null,
    })
    .eq('id', payload.id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath('/admin/orders');
  return { success: true };
}
