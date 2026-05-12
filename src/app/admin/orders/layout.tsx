import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '관리자',
  description: 'Urban Deco 통합 관리자 — 전체 주문 내역 및 상품 카탈로그 대시보드.',
};

export default function AdminOrdersLayout({ children }: { children: ReactNode }) {
  return children;
}
