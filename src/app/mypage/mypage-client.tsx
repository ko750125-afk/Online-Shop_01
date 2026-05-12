'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Truck, Calendar, MapPin, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ProductImageFill } from '@/components/product-image';
import { UserOrderDetailDialog } from '@/components/user-order-detail-dialog';

interface OrderCardProps {
  order: any;
  onViewDetail: (order: any) => void;
}

function OrderCard({ order, onViewDetail }: OrderCardProps) {
  return (
    <div className="group bg-card hover:bg-secondary/10 transition-all duration-300 rounded-[2.5rem] p-6 md:p-8 border border-border shadow-sm hover:shadow-xl">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex-1 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-primary/5 px-4 py-2 rounded-full flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                {new Date(order.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <Badge variant="secondary" className={`
              px-4 py-1 rounded-full border-none font-bold
              ${order.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-green-500/10 text-green-600'}
            `}>
              {order.status === 'pending' ? 'Processing' : 'Delivered'}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">#{order.id.slice(0, 8)}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary uppercase tracking-tighter">Shipping</p>
                <p className="text-xs text-muted-foreground leading-relaxed truncate max-w-[250px]">{order.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary uppercase tracking-tighter">Status</p>
                <p className="text-xs text-muted-foreground">
                  {order.status === 'pending' 
                    ? 'Preparing your package' 
                    : 'Successfully delivered'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {order.items?.slice(0, 3).map((item: any, idx: number) => (
              <div key={idx} className="relative w-16 h-16 rounded-2xl overflow-hidden border border-border shadow-sm">
                <ProductImageFill
                  src={item.image_url}
                  alt={item.name}
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ))}
            {order.items?.length > 3 && (
              <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center text-xs font-bold text-muted-foreground border border-dashed border-border">
                +{order.items.length - 3}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-between items-end gap-4 min-w-[180px]">
          <div className="text-right">
            <p className="text-[10px] font-black text-primary/30 uppercase tracking-widest mb-1">Amount</p>
            <p className="text-2xl font-black text-primary">₩{order.total_amount.toLocaleString()}</p>
          </div>
          <Button 
            onClick={() => onViewDetail(order)}
            variant="outline" 
            className="w-full h-12 rounded-2xl border-primary/10 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 font-bold group/btn"
          >
            VIEW DETAILS 
            <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface MyPageClientProps {
  initialOrders: any[];
  user: any;
}

export function MyPageClient({ initialOrders, user }: MyPageClientProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetail = (order: any) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary">MY ORDERS</h1>
            <p className="text-muted-foreground mt-2">
              {user ? `${user.email} 님의 소중한 쇼핑 여정` : '주문 내역을 확인하고 있습니다...'}
            </p>
          </div>
          <div className="flex bg-secondary/30 p-1 rounded-2xl border border-border">
            <div className="px-6 py-3 text-center">
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Orders</p>
              <p className="text-xl font-bold">{initialOrders?.length || 0}</p>
            </div>
          </div>
        </div>

        <section className="space-y-8">
          <div className="flex items-center gap-2 text-xl font-bold text-primary mb-2">
            <ShoppingBag className="w-6 h-6" />
            <h2>Recent Orders</h2>
          </div>

          {initialOrders && initialOrders.length > 0 ? (
            <div className="grid gap-6">
              {initialOrders.map((order) => (
                <OrderCard key={order.id} order={order} onViewDetail={handleViewDetail} />
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-[3rem] p-20 text-center border border-dashed border-border flex flex-col items-center space-y-6">
              <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center text-muted-foreground">
                <ShoppingBag className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-primary">
                  {user ? 'No orders yet' : 'Login Required'}
                </p>
                <p className="text-muted-foreground">
                  {user ? 'Discover our premium collections.' : 'Please login to view your order history.'}
                </p>
              </div>
              <Button size="lg" asChild className="rounded-2xl px-10 h-14 font-bold">
                <Link href={user ? "/" : "/login"}>
                  {user ? 'GO SHOPPING' : 'LOGIN NOW'}
                </Link>
              </Button>
            </div>
          )}
        </section>
      </main>

      <UserOrderDetailDialog 
        order={selectedOrder}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
}
