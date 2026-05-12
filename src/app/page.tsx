import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { ProductImageFill } from '@/components/product-image';
import { HomeHero } from '@/components/home/home-hero';

export const metadata: Metadata = {
  description: 'Urban Deco 전체 상품 — 큐레이션된 프리미엄 데스크테리어.',
};

export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();
  const { data: products, error } = await supabase
    .from('shop_products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('상품 조회 오류:', error);
    return <div className="p-10 text-center">상품을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <HomeHero />

      {/* 상품 목록 */}
      <main className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-primary">전체 상품</h2>
            <p className="text-muted-foreground">큐레이션된 프리미엄 소품들을 만나보세요.</p>
          </div>
          <Badge variant="outline" className="text-primary border-primary">
            {products?.length || 0} ITEMS
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products?.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 group bg-card">
                <div className="aspect-[4/5] overflow-hidden relative bg-secondary/30">
                  <ProductImageFill
                    src={product.image_url}
                    alt={product.name}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">{product.category}</Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-semibold text-primary">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm line-clamp-1">{product.description}</p>
                </CardContent>
                <CardFooter className="flex justify-between items-center pt-0">
                  <p className="text-lg font-bold text-primary">
                    ₩{product.price.toLocaleString()}
                  </p>
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">
                    자세히 보기 →
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="opacity-70">&copy; 2026 Urban Deco. All rights reserved.</p>
          <div className="flex justify-center space-x-4 text-xs opacity-50">
            <Link href="/admin/orders" className="hover:underline">관리자 대시보드</Link>
            <span>|</span>
            <Link href="#" className="hover:underline">개인정보처리방침</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
