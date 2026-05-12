'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Eye, Package, Truck, MapPin, Calendar, CreditCard, User, ShoppingBag } from 'lucide-react';
import type { OrderRecord } from '@/types/admin';
import { ProductImageFill } from '@/components/product-image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { OrderStatusToggle } from './order-status-toggle';

export function OrderDetailDialog({ order }: { order: OrderRecord }) {
  const [open, setOpen] = useState(false);

  if (!order) return null;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="border-primary/20 hover:border-primary hover:bg-primary/5 text-primary rounded-lg h-9 px-4 transition-all font-black text-[10px] tracking-widest shadow-sm"
        onClick={() => setOpen(true)}
      >
        VIEW
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-[0_30px_60px_rgba(0,0,0,0.3)] bg-background/95 backdrop-blur-2xl">
          <div className="relative overflow-hidden">
            {/* 상단 장식 바 */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
            
            <DialogHeader className="p-8 pb-4">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">ADMIN ORDER MANAGEMENT</p>
                  <DialogTitle className="text-3xl font-black tracking-tight text-primary">주문 상세 내역</DialogTitle>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full w-fit">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(order.created_at).toLocaleString('ko-KR')}</span>
                    <span className="opacity-20">|</span>
                    <span className="text-primary/60">주문번호 #{order.id.slice(0, 12)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <Badge className={`
                    px-5 py-2 rounded-2xl border-none font-black text-[11px] uppercase tracking-widest shadow-lg
                    ${order.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-primary text-white'}
                  `}>
                    {order.status === 'pending' ? '대기중' : '처리완료'}
                  </Badge>
                  <div className="scale-90 origin-right">
                    <OrderStatusToggle orderId={order.id} currentStatus={order.status} />
                  </div>
                </div>
              </div>
            </DialogHeader>

            <ScrollArea className="max-h-[75vh] px-8 pb-8">
              <div className="space-y-10">
                {/* 배송 상태 스테퍼 */}
                <div className="bg-secondary/20 p-6 rounded-[2rem] border border-border/50 mt-4">
                  <div className="flex justify-between items-center relative">
                    {[
                      { label: '주문확인', icon: Package, active: true },
                      { label: '배송중', icon: Truck, active: order.status !== 'pending' },
                      { label: '배송완료', icon: MapPin, active: order.status !== 'pending' }
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col items-center gap-3 relative z-10">
                        <div className={`
                          w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                          ${step.active ? 'bg-primary text-primary-foreground shadow-xl scale-110' : 'bg-background text-muted-foreground border border-border'}
                        `}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-tighter ${step.active ? 'text-primary' : 'text-muted-foreground'}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                    <div className="absolute top-6 left-6 right-6 h-0.5 bg-border -z-0">
                      <div 
                        className="h-full bg-primary transition-all duration-1000 ease-out" 
                        style={{ width: order.status === 'pending' ? '0%' : '100%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 주문 상품 리스트 */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-border/50 pb-3">
                    <h3 className="text-sm font-black text-primary flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" /> 주문 상품 목록
                    </h3>
                    <span className="text-xs text-muted-foreground font-bold">총 {order.items?.length || 0}개의 상품</span>
                  </div>
                  <div className="grid gap-4">
                    {order.items?.map((item, idx: number) => (
                      <div key={`${item.id}-${idx}`} className="flex items-center gap-5 p-2 group">
                        <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border border-border/50 shadow-md transition-transform group-hover:scale-105">
                          <ProductImageFill 
                            src={item.image_url} 
                            alt={item.name} 
                            sizes="80px"
                            className="object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-primary/40 uppercase tracking-tighter mb-0.5">{item.category || '생활'}</p>
                          <p className="text-sm font-black text-primary truncate leading-tight mb-1">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground font-medium">
                            수량: <span className="text-primary font-black">{item.quantity}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground opacity-30 italic">₩{(item.price).toLocaleString()}</p>
                          <p className="text-base font-black text-primary tracking-tight">₩{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 정보 상세 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                  {/* 수령인 섹션 */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-black text-primary/40 uppercase tracking-[0.2em] flex items-center gap-2">
                      <User className="w-3.5 h-3.5" /> 배송지 정보
                    </h3>
                    <div className="space-y-4 p-6 rounded-[2rem] bg-secondary/10 border border-border/50 relative overflow-hidden group">
                      <div className="relative z-10 space-y-3">
                        <div>
                          <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">수령인</p>
                          <p className="text-sm font-black text-primary">{order.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">배송지 주소</p>
                          <p className="text-xs text-muted-foreground leading-relaxed font-medium">{order.address}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">연락처</p>
                          <p className="text-xs text-muted-foreground font-medium">{order.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 결제 요약 섹션 */}
                  <div className="space-y-5">
                    <h3 className="text-xs font-black text-primary/40 uppercase tracking-[0.2em] flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5" /> 결제 요약
                    </h3>
                    <div className="p-8 rounded-[2rem] bg-primary text-primary-foreground shadow-2xl relative overflow-hidden group">
                      <div className="relative z-10 space-y-4">
                        <div className="flex justify-between text-xs font-medium opacity-60">
                          <span>상품 합계</span>
                          <span>₩{order.total_amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium opacity-60">
                          <span>배송비</span>
                          <span className="uppercase tracking-widest text-[10px]">무료</span>
                        </div>
                        <Separator className="bg-white/10" />
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-black uppercase tracking-widest">최종 결제 금액</span>
                          <span className="text-3xl font-black tracking-tighter">₩{order.total_amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* 하단 푸터 */}
            <div className="p-8 flex justify-between items-center bg-secondary/5 border-t border-border/50">
              <span className="text-[9px] font-black text-primary/20 uppercase tracking-[0.4em]">URBAN DECO ORDER SYSTEM</span>
              <Button 
                onClick={() => setOpen(false)}
                className="rounded-xl px-8 h-10 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all active:scale-95"
              >
                닫기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
