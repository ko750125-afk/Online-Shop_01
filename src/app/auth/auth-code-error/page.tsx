import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft, LogIn } from 'lucide-react';

export const metadata: Metadata = {
  title: '인증 오류',
  description: 'RF STORE 이메일 링크 로그인 처리 중 문제가 발생했습니다.',
};

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-destructive/10 text-destructive mb-2">
              <AlertCircle className="w-9 h-9" aria-hidden />
            </div>
            <h1 className="text-3xl font-bold text-primary tracking-tight">인증에 실패했습니다</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              이메일 인증 링크가 만료되었거나 이미 사용되었을 수 있습니다.
              <br />
              링크를 다시 요청하거나 로그인 페이지에서 시도해 주세요.
            </p>
          </div>

          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-xl space-y-4">
            <Button
              render={<Link href="/login" />}
              nativeButton={false}
              className="w-full h-12 rounded-xl font-bold"
            >
              <LogIn className="w-4 h-4 mr-2" />
              로그인으로 돌아가기
            </Button>
            <Button
              variant="outline"
              render={<Link href="/" />}
              nativeButton={false}
              className="w-full h-12 rounded-xl font-bold border-primary/30 text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              쇼핑 홈으로
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
