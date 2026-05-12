'use client';

import { ProductImageFill } from '@/components/product-image';

interface ProductDetailGalleryProps {
  imageUrl: string | null | undefined;
  productName: string;
}

export function ProductDetailGallery({ imageUrl, productName }: ProductDetailGalleryProps) {
  return (
    <div className="relative">
      {/* 프리미엄 메인 이미지 캔버스 */}
      <div className="rounded-[2.5rem] overflow-hidden bg-secondary aspect-square shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] relative group border border-border/40">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 z-10 pointer-events-none" />
        <ProductImageFill
          src={imageUrl}
          alt={productName}
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="transition-transform duration-1000 group-hover:scale-105 object-center"
        />
        
        {/* 장식용 디테일 뱃지 */}
        <div className="absolute top-6 right-6 z-20">
          <div className="bg-background/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-border/50 shadow-sm text-[10px] font-black uppercase tracking-widest text-primary/60">
            Certified Object
          </div>
        </div>
      </div>

      {/* 하단 장식선 (이미지 무게감 부여) */}
      <div className="mt-6 flex justify-center gap-2">
        <div className="w-12 h-1 bg-primary rounded-full" />
        <div className="w-2 h-1 bg-primary/20 rounded-full" />
        <div className="w-2 h-1 bg-primary/20 rounded-full" />
      </div>
    </div>
  );
}
