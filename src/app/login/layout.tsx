import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '로그인',
  description: 'Urban Deco 로그인 — 엄선된 미니멀 데스크테리어와 라이프스타일 아이템을 만나보세요.',
};

export default function LoginLayout({ children }: { children: ReactNode }) {
  return children;
}
