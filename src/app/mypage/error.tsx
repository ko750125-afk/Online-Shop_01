'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCcw } from 'lucide-react';
import Link from 'next/link';

export default function MyPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('MyPage Error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 space-y-6 text-center">
      <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
        <AlertCircle className="w-12 h-12" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-primary">정보를 불러오지 못했습니다</h2>
        <p className="text-muted-foreground max-w-md">
          주문 내역을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => reset()} className="flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> 다시 시도
        </Button>
        <Button render={<Link href="/" />} nativeButton={false}>
          홈으로 이동
        </Button>
      </div>
    </div>
  );
}
