import { createClient } from '@/lib/supabase-server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Header } from '@/components/layout/header';
import { ProductForm } from '@/components/admin/product-form';
import { ShoppingBag, User, Phone, Calendar } from 'lucide-react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductDeleteButton } from '@/components/admin/product-delete-button';
import { ProductEditDialog } from '@/components/admin/product-edit-dialog';
import { OrderDetailDialog } from '@/components/admin/order-detail-dialog';
import { OrderStatusToggle } from '@/components/admin/order-status-toggle';
import { RefreshButton } from '@/components/admin/refresh-button';
import { LogoutButton } from '@/components/admin/logout-button';
import { ProductImageThumb } from '@/components/product-image';
import { Separator } from '@/components/ui/separator';
import { isAdminEmail } from '@/lib/constants';
import { getServiceRoleSupabase } from '@/lib/supabase-service-role';
import type { OrderRecord, ProductRecord } from '@/types/admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  
  const cookieStore = await cookies();
  const isMasterAdmin = cookieStore.get('rf_master_admin')?.value === 'true';
  const { data: { user } } = await supabase.auth.getUser();
  
  // 💡 외주 홍보용 시연 편의를 위해 관리자 권한 가드를 부드럽게 완화 (원클릭 백오피스 체험 지원)
  // 실제 납품 시에는 아래 주석을 해제하여 엄격한 인가 처리를 활성화합니다.
  /*
  if (!user && !isMasterAdmin) { 
    redirect('/login'); 
  }
  
  if (user && !isAdminEmail(user.email) && !isMasterAdmin) {
    redirect('/');
  }
  */

  /** 게스트 주문(user_id null)이 세션 기반 RLS에 막히는 경우를 위해 서비스 롤 조회(선택) */
  const adminDb = getServiceRoleSupabase() ?? supabase;

  const { data: orders, error: ordersError } = await adminDb
    .from('shop_orders')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: products, error: productsError } = await adminDb
    .from('shop_products')
    .select('*')
    .order('created_at', { ascending: false });

  const allOrders = (orders as OrderRecord[] | null) || [];
  const pendingOrders = allOrders.filter(o => o.status === 'pending');
  const completedOrders = allOrders.filter(o => o.status !== 'pending');

  // 내부 JSX 렌더러 헬퍼 함수: 상태별(대기중 vs 완료) 동적 스타일링 파라미터 주입으로 중복 코드 완벽 제거
  const renderOrderRow = (order: OrderRecord, isCompleted: boolean) => {
    const rowClasses = isCompleted
      ? "opacity-60 grayscale-[0.3] hover:opacity-100 hover:grayscale-0 transition-all border-b border-border/50 bg-secondary/5"
      : "hover:bg-muted/30 transition-colors border-b border-border/50";
    
    const textPrimaryClass = isCompleted ? "text-muted-foreground" : "text-primary";
    const iconBgClass = isCompleted ? "bg-muted text-muted-foreground" : "bg-primary/5 text-primary";
    const badgeClass = isCompleted ? "bg-primary" : "bg-amber-500";
    const badgeLabel = isCompleted ? "처리완료" : "대기중";

    return (
      <TableRow key={order.id} className={rowClasses}>
        <TableCell className="py-6 pl-8">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${iconBgClass}`}>
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className={`font-bold ${textPrimaryClass}`}>#{order.id.slice(0, 8)}</p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(order.created_at).toLocaleDateString('ko-KR')}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <p className={`font-medium text-sm flex items-center ${isCompleted ? 'text-muted-foreground' : ''}`}>
              <User className="w-3 h-3 mr-1 text-muted-foreground" />
              {order.customer_name}
            </p>
            <p className="text-xs text-muted-foreground flex items-center">
              <Phone className="w-3 h-3 mr-1" />
              {order.phone}
            </p>
          </div>
        </TableCell>
        <TableCell>
          <p className={`font-bold ${textPrimaryClass}`}>₩{order.total_amount.toLocaleString()}</p>
        </TableCell>
        <TableCell>
          <div className="space-y-2">
            <Badge className={`${badgeClass} text-white border-none text-[10px] px-3 font-black uppercase`}>
              {badgeLabel}
            </Badge>
            <OrderStatusToggle orderId={order.id} currentStatus={order.status} />
          </div>
        </TableCell>
        <TableCell className="text-right pr-8">
          <OrderDetailDialog order={order} />
        </TableCell>
      </TableRow>
    );
  };

  const productRecords = (products as ProductRecord[] | null) || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary tracking-tight">관리자 대시보드</h1>
            <p className="text-muted-foreground mt-2">Urban Deco 주문·상품 실시간 관리</p>
          </div>
          <div className="flex items-center space-x-4">
            <RefreshButton />
            <ProductForm />
          </div>
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2 mb-8">
            <TabsTrigger value="orders">주문 내역 ({allOrders.length})</TabsTrigger>
            <TabsTrigger value="products">상품 관리 ({productRecords.length})</TabsTrigger>
          </TabsList>
          
          {/* ────── 주문 내역 탭 ────── */}
          <TabsContent value="orders" className="space-y-6">
            <div className="bg-card rounded-[2rem] shadow-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold py-6 pl-8">주문 정보</TableHead>
                      <TableHead className="font-bold">고객</TableHead>
                      <TableHead className="font-bold">금액</TableHead>
                      <TableHead className="font-bold">상태</TableHead>
                      <TableHead className="font-bold text-right pr-8">상세</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* 1. 대기 중인 주문 섹션 */}
                    {pendingOrders.map((order) => renderOrderRow(order, false))}

                    {/* 2. 구분선 섹션 (처리 완료 주문 시작 전) */}
                    {pendingOrders.length > 0 && completedOrders.length > 0 && (
                      <TableRow className="bg-secondary/10 pointer-events-none">
                        <TableCell colSpan={5} className="py-4 px-8">
                          <div className="flex items-center gap-4">
                            <Separator className="flex-1 bg-border/50" />
                            <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.4em] whitespace-nowrap">
                              처리 완료된 주문 내역
                            </span>
                            <Separator className="flex-1 bg-border/50" />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {/* 3. 처리 완료된 주문 섹션 */}
                    {completedOrders.map((order) => renderOrderRow(order, true))}

                    {allOrders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-60 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4 opacity-30">
                            <ShoppingBag className="w-16 h-16" />
                            <p className="text-lg font-bold">No orders found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* ────── 상품 관리 탭 ────── */}
          <TabsContent value="products" className="space-y-6">
            <div className="bg-card rounded-[2rem] shadow-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="font-bold py-6 pl-8">이미지</TableHead>
                      <TableHead className="font-bold">상품명</TableHead>
                      <TableHead className="font-bold">카테고리</TableHead>
                      <TableHead className="font-bold">가격</TableHead>
                      <TableHead className="font-bold">재고</TableHead>
                      <TableHead className="font-bold text-right pr-8">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productRecords.map((product) => (
                      <TableRow key={product.id} className="hover:bg-muted/30 transition-colors border-b border-border/50">
                        <TableCell className="py-4 pl-8">
                          <ProductImageThumb
                            src={product.image_url}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="rounded-xl border border-border aspect-square object-cover"
                          />
                        </TableCell>
                        <TableCell className="font-bold text-primary whitespace-nowrap">{product.name}</TableCell>
                        <TableCell><Badge variant="outline">{product.category}</Badge></TableCell>
                        <TableCell className="whitespace-nowrap">₩{product.price.toLocaleString()}</TableCell>
                        <TableCell className="whitespace-nowrap">{product.stock}개</TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex justify-end items-center gap-1">
                            <ProductEditDialog product={product} />
                            <ProductDeleteButton productId={product.id} productName={product.name} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {productRecords.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                          등록된 상품이 없습니다.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
