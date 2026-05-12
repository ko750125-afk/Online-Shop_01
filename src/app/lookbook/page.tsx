import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { ProductImageFill } from '@/components/product-image';

export const metadata: Metadata = {
  title: '룩북',
  description: 'Urban Deco가 제안하는 프리미엄 워크스페이스 스타일링 가이드.',
};

interface LookbookProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string | null;
}

export const revalidate = 0;

export default async function LookbookPage() {
  const { data: products, error } = await supabase
    .from('shop_products')
    .select('id, name, description, image_url, category')
    .order('created_at', { ascending: false });

  const lookbookItems = ((products ?? []) as LookbookProduct[])
    .filter((item) => typeof item.image_url === 'string' && item.image_url.trim().length > 0)
    .slice(0, 6);

  const hasItems = lookbookItems.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-20 space-y-4">
          <Badge variant="outline" className="text-primary border-primary px-4 py-1">2026 COLLECTION</Badge>
          <h1 className="text-5xl md:text-7xl font-black text-primary tracking-tighter">룩북</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Urban Deco가 제안하는 프리미엄 워크스페이스 스타일링 가이드
          </p>
        </div>

        {error && (
          <p className="text-center text-sm text-muted-foreground mb-10">
            룩북 데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
          </p>
        )}

        {!error && !hasItems && (
          <div className="max-w-2xl mx-auto rounded-3xl border border-border bg-secondary/40 p-10 text-center space-y-4">
            <h2 className="text-2xl font-bold text-primary">아직 룩북에 노출할 상품이 없습니다</h2>
            <p className="text-muted-foreground">
              이미지가 등록된 상품이 추가되면 이 페이지에 자동으로 반영됩니다.
            </p>
            <Link
              href="/"
              className="inline-block border-b-2 border-primary pb-1 font-bold text-primary hover:opacity-70 transition-opacity"
            >
              Urban Deco 상품 보러가기
            </Link>
          </div>
        )}

        {hasItems && (
          <div className="space-y-32">
            {lookbookItems.map((item, index) => (
              <div key={item.id} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
                <div className="flex-1 w-full overflow-hidden rounded-[2rem] shadow-2xl aspect-[4/3] relative group">
                  <ProductImageFill
                    src={item.image_url}
                    alt={item.name}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex-1 space-y-6 text-center md:text-left">
                  <h2 className="text-3xl md:text-5xl font-bold text-primary">{item.name}</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {item.description?.trim() || 'Urban Deco가 제안하는 프리미엄 워크스페이스 큐레이션'}
                  </p>
                  <div className="pt-4">
                    <Link
                      href={item.category ? `/?category=${encodeURIComponent(item.category)}` : '/'}
                      className="inline-block border-b-2 border-primary pb-2 font-bold text-primary hover:opacity-70 transition-opacity"
                    >
                      {item.category ? `${item.category} 카테고리 보기` : 'Urban Deco 상품 보기'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-primary text-primary-foreground py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="opacity-70">&copy; 2026 Urban Deco. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
