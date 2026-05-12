import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '주문',
  description: 'Urban Deco 안전한 체크아웃 — 선택하신 워크스페이스 소품의 배송 정보를 입력합니다.',
};

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
