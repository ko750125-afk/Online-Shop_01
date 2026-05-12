import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { AddToCartButton } from '@/components/add-to-cart-button';
import { ProductImageFill } from '@/components/product-image';
import { ProductDetailGallery } from '@/components/product-detail-gallery';
import { CheckCircle2, ShieldCheck, Truck, RotateCcw, Sparkles, Star } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('shop_products')
    .select('name, description')
    .eq('id', id)
    .single();

  if (!data) {
    return { title: '상품' };
  }

  const description =
    typeof data.description === 'string' && data.description.trim().length > 0
      ? data.description.trim().slice(0, 160)
      : `Urban Deco — ${data.name}`;

  return {
    title: data.name,
    description,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from('shop_products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    return notFound();
  }

  const inStock = product.stock > 0;
  const price = Number(product.price ?? 0);
  const installment = Math.max(1, Math.round(price / 6));
  const productDescription =
    typeof product.description === 'string' && product.description.trim().length > 0
      ? product.description.trim()
      : 'Urban Deco가 엄선한 프리미엄 워크스페이스 아이템입니다.';

  const { data: relatedProducts } = await supabase
    .from('shop_products')
    .select('id, name, price, image_url, category')
    .eq('category', product.category)
    .neq('id', product.id)
    .order('created_at', { ascending: false })
    .limit(4);

  const reviewSamples = [
    {
      id: 1,
      name: '김지현',
      rating: 5,
      text: `${product.name} 받아보고 책상 분위기가 확 달라졌어요. 사진보다 실물이 더 깔끔합니다.`,
      date: '2026.05.08',
    },
    {
      id: 2,
      name: '이도윤',
      rating: 5,
      text: '포장 상태가 좋고 마감이 탄탄해서 만족합니다. 데스크테리어 포인트로 딱 좋아요.',
      date: '2026.05.05',
    },
    {
      id: 3,
      name: '박서연',
      rating: 4,
      text: '전체적인 완성도와 재질감이 좋아요. 업무 공간이 정돈된 느낌이라 재구매 의사 있습니다.',
      date: '2026.05.02',
    },
  ] as const;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <Header />

      <main className="container mx-auto px-4 py-8 lg:py-14">
        <div className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Urban Deco</Link>
          <span>/</span>
          <span>{product.category ?? '전체 상품'}</span>
          <span>/</span>
          <span className="text-primary font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <section className="lg:col-span-7 space-y-6">
            <div className="relative">
              <div className="absolute top-5 left-5 z-10">
                <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm px-4 py-1 text-xs">
                  {product.category ?? 'CURATED'}
                </Badge>
              </div>
              <div className="absolute bottom-20 right-5 z-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/60 px-3 py-1 text-xs font-semibold">
                Urban Deco PICK
              </div>
              <ProductDetailGallery imageUrl={product.image_url} productName={product.name} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-2xl border border-border/60 bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">배송</p>
                <p className="font-semibold">당일/익일 출고</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">품질보증</p>
                <p className="font-semibold">7일 이내 교환 지원</p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">구매만족도</p>
                <p className="font-semibold">RF 기준 검수 완료</p>
              </div>
            </div>

            <div className="rounded-3xl border border-border/60 bg-card p-6 md:p-8 space-y-4">
              <h3 className="text-lg font-bold text-primary">상품 설명</h3>
              <p className="text-muted-foreground leading-relaxed text-[15px] md:text-base">
                {productDescription}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl bg-secondary/50 p-3 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  미니멀 감성 인테리어 포인트
                </div>
                <div className="rounded-xl bg-secondary/50 p-3 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  실사용 기반 큐레이션 아이템
                </div>
              </div>
            </div>
          </section>

          <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-4">
            <div className="rounded-3xl border border-border/70 bg-card p-7 shadow-xl space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">
                  {product.name}
                </h1>
                <p className="text-3xl font-black text-primary">
                  ₩{price.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  월 ₩{installment.toLocaleString()} (6개월 가정)
                </p>
              </div>

              <div className="rounded-2xl bg-secondary/50 border border-border/50 p-4 flex items-center justify-between">
                <span className="text-sm font-semibold">재고 상태</span>
                <Badge variant={inStock ? 'secondary' : 'destructive'} className="px-3 py-1">
                  {inStock ? `${product.stock}개 남음` : '품절'}
                </Badge>
              </div>

              <div className="space-y-3">
                <AddToCartButton product={product} />
                <p className="text-center text-xs text-muted-foreground">
                  Urban Deco — ₩150,000 이상 주문 시 배송비 무료
                </p>
              </div>

              <div className="pt-2 border-t border-border/70 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4 text-primary" />
                  오전 주문 시 빠른 출고
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <RotateCcw className="w-4 h-4 text-primary" />
                  단순 변심 교환 정책 제공
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  제품 상태 2중 검수 후 발송
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-primary">Urban Deco 품질 포인트</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 실사용 데스크 환경에서 직접 선별</li>
                <li>• 공간 분위기에 맞는 디자인 밸런스</li>
                <li>• 책상 위에서 가장 오래 남는 기본템 중심</li>
              </ul>
            </div>
          </aside>
        </div>

        <section className="mt-14">
          <div className="rounded-3xl border border-border/60 bg-card p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">배송/교환 안내</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl bg-secondary/40 p-4">
                <p className="text-sm font-semibold text-primary mb-1">기본 배송</p>
                <p className="text-sm text-muted-foreground">
                  결제 완료 후 1~3영업일 이내 출고됩니다.
                </p>
              </div>
              <div className="rounded-xl bg-secondary/40 p-4">
                <p className="text-sm font-semibold text-primary mb-1">교환/반품</p>
                <p className="text-sm text-muted-foreground">
                  수령 후 7일 이내 고객센터 접수 시 가능합니다.
                </p>
              </div>
              <div className="rounded-xl bg-secondary/40 p-4">
                <p className="text-sm font-semibold text-primary mb-1">고객 지원</p>
                <p className="text-sm text-muted-foreground">
                  제품 문의는 관리자 페이지/문의 채널로 대응합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="rounded-3xl border border-border/60 bg-card p-6 md:p-8">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-primary">구매자 리뷰</h2>
                <p className="text-sm text-muted-foreground mt-1">실제 구매 경험을 바탕으로 한 후기</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">평균 만족도</p>
                <p className="text-lg font-bold text-primary">4.8 / 5.0</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviewSamples.map((review) => (
                <article key={review.id} className="rounded-2xl bg-secondary/40 p-4 border border-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-primary">{review.name}</p>
                    <time className="text-xs text-muted-foreground">{review.date}</time>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={`${review.id}-${index}`}
                        className={`w-4 h-4 ${index < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/40'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="rounded-3xl border border-border/60 bg-card p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-primary mb-6">같은 카테고리 추천</h2>

            {relatedProducts && relatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/products/${related.id}`}
                    className="group rounded-2xl border border-border/60 bg-secondary/20 overflow-hidden hover:border-primary/30 transition-colors"
                  >
                    <div className="aspect-square relative overflow-hidden">
                      <ProductImageFill
                        src={related.image_url}
                        alt={related.name}
                        sizes="(max-width: 1024px) 50vw, 25vw"
                        className="group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-xs text-muted-foreground">{related.category}</p>
                      <p className="font-semibold text-primary line-clamp-2 min-h-[2.8rem]">{related.name}</p>
                      <p className="font-bold text-primary">₩{Number(related.price).toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-secondary/40 border border-border/60 p-6 text-center text-sm text-muted-foreground">
                아직 추천할 관련 상품이 없습니다.
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
