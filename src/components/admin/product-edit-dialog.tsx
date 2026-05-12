'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateProduct } from '@/app/actions/product-actions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pencil, Loader2 } from 'lucide-react';
import type { ProductRecord } from '@/types/admin';
import { useRouter } from 'next/navigation';

interface ProductEditDialogProps {
  product: ProductRecord;
}

export function ProductEditDialog({ product }: ProductEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    description: product.description ?? '',
    price: String(product.price),
    stock: String(product.stock),
    image_url: product.image_url ?? '',
  });
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await updateProduct({
      id: product.id,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: Number(formData.price),
      stock: Number(formData.stock),
      image_url: formData.image_url,
    });

    setLoading(false);
    if (!result.success) {
      setError(result.message ?? '상품 수정에 실패했습니다.');
      return;
    }

    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="hover:bg-primary/10 hover:text-primary"
        onClick={() => setOpen(true)}
      >
        <Pencil className="w-4 h-4 mr-2" />
        수정
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">상품 정보 수정</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor={`edit-name-${product.id}`}>상품명</Label>
              <Input
                id={`edit-name-${product.id}`}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`edit-price-${product.id}`}>가격 (₩)</Label>
                <Input
                  id={`edit-price-${product.id}`}
                  type="number"
                  min={0}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`edit-stock-${product.id}`}>재고</Label>
                <Input
                  id={`edit-stock-${product.id}`}
                  type="number"
                  min={0}
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`edit-category-${product.id}`}>카테고리</Label>
              <Input
                id={`edit-category-${product.id}`}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`edit-description-${product.id}`}>설명</Label>
              <Textarea
                id={`edit-description-${product.id}`}
                className="min-h-[100px]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`edit-image-${product.id}`}>이미지 URL</Label>
              <Input
                id={`edit-image-${product.id}`}
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                '변경사항 저장'
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
