'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { deleteProduct } from '@/app/actions/product-actions';
import { useRouter } from 'next/navigation';

interface ProductDeleteButtonProps {
  productId: string;
  productName: string;
}

export function ProductDeleteButton({ productId, productName }: ProductDeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    const result = await deleteProduct(productId);
    
    if (result.success) {
      setOpen(false);
      router.refresh(); // 페이지 새로고침으로 목록 반영
    } else {
      setError(`삭제 실패: ${result.message}`);
    }
    
    setLoading(false);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        삭제
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-destructive">
              <div className="p-2 bg-destructive/10 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              상품 삭제 확인
            </DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 space-y-2">
              <p className="text-sm font-bold text-destructive">⚠️ 주의: 이 작업은 되돌릴 수 없습니다</p>
              <p className="text-sm text-muted-foreground">
                아래 상품을 삭제하면 쇼핑몰에서 즉시 사라지며, 복구할 수 없습니다.
              </p>
            </div>

            <div className="bg-muted/50 rounded-2xl p-4">
              <p className="text-xs text-muted-foreground mb-1">삭제할 상품</p>
              <p className="font-bold text-primary text-lg">"{productName}"</p>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/5 p-3 rounded-xl">{error}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              className="flex-1 h-12 rounded-xl font-bold"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? '삭제 중...' : '⚠️ 영구 삭제'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
