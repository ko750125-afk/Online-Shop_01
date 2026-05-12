import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: '회원가입',
  description: 'Urban Deco 회원가입 — 나만의 프리미엄 워크스페이스 큐레이션을 시작하세요.',
};

export default function SignupLayout({ children }: { children: ReactNode }) {
  return children;
}
