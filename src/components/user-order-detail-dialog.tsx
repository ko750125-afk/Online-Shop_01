'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, MapPin, Calendar, CreditCard, User } from "lucide-react";
import { ProductImageFill } from "@/components/product-image";

interface OrderDetailDialogProps {
  order: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserOrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl rounded-[2.5rem] p-0 overflow-hidden border-none shadow-[0_30px_60px_rgba(0,0,0,0.3)] bg-background/95 backdrop-blur-2xl">
        <div className="relative overflow-hidden">
          {/* 상단 장식 바 */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
          
          <DialogHeader className="p-8 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.3em]">Official Invoice</p>
                <DialogTitle className="text-3xl font-black tracking-tight text-primary">ORDER ARCHIVE</DialogTitle>
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full w-fit">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(order.created_at).toLocaleString()}</span>
                  <span className="opacity-20">|</span>
                  <span className="text-primary/60">#{order.id.slice(0, 12)}</span>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`
                  px-5 py-2 rounded-2xl border-none font-black text-[11px] uppercase tracking-widest shadow-lg
                  ${order.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-primary text-white'}
                `}>
                  {order.status === 'pending' ? 'In Progress' : 'Completed'}
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="max-h-[80vh] px-8 pb-8">
            <div className="space-y-10">
              {/* 배송 상태 스테퍼 */}
              <div className="bg-secondary/20 p-6 rounded-[2rem] border border-border/50">
                <div className="flex justify-between items-center relative">
                  {[
                    { label: 'Confirmed', icon: Package, active: true },
                    { label: 'Shipping', icon: Truck, active: order.status !== 'pending' },
                    { label: 'Delivered', icon: MapPin, active: order.status !== 'pending' }
                  ].map((step, i, arr) => (
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
                  {/* 진행선 */}
                  <div className="absolute top-6 left-6 right-6 h-0.5 bg-border -z-0">
                    <div 
                      className="h-full bg-primary transition-all duration-1000 ease-out" 
                      style={{ width: order.status === 'pending' ? '0%' : '100%' }}
                    />
                  </div>
                </div>
              </div>

              {/* 주문 상품 리스트 (영수증 스타일) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <h3 className="text-sm font-black text-primary uppercase tracking-widest">Selected Items</h3>
                  <span className="text-xs text-muted-foreground">{order.items?.length || 0} Products</span>
                </div>
                <div className="grid gap-4">
                  {order.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-5 p-2 group">
                      <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border border-border/50 shadow-md transition-transform group-hover:scale-105">
                        <ProductImageFill 
                          src={item.image_url} 
                          alt={item.name} 
                          sizes="80px"
                          className="object-cover" 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-primary/40 uppercase tracking-tighter mb-0.5">{item.category}</p>
                        <p className="text-sm font-black text-primary truncate leading-tight mb-1">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">
                          Quantity: <span className="text-primary font-black">{item.quantity}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground line-through opacity-30 italic">₩{(item.price * 1.1).toLocaleString()}</p>
                        <p className="text-base font-black text-primary tracking-tight">₩{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 정보 상세 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                {/* 배송지 섹션 */}
                <div className="space-y-5">
                  <h3 className="text-xs font-black text-primary/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Destination
                  </h3>
                  <div className="space-y-4 p-6 rounded-[2rem] bg-secondary/10 border border-border/50 relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                      <MapPin className="w-32 h-32" />
                    </div>
                    <div className="relative z-10 space-y-3">
                      <div>
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Recipient</p>
                        <p className="text-sm font-black text-primary">{order.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Address</p>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">{order.address}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Contact</p>
                        <p className="text-xs text-muted-foreground font-medium">{order.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 결제 요약 섹션 */}
                <div className="space-y-5">
                  <h3 className="text-xs font-black text-primary/40 uppercase tracking-[0.2em] flex items-center gap-2">
                    <CreditCard className="w-3.5 h-3.5" /> Billing Summary
                  </h3>
                  <div className="p-8 rounded-[2rem] bg-primary text-primary-foreground shadow-2xl relative overflow-hidden group">
                    <div className="absolute -left-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10 space-y-4">
                      <div className="flex justify-between text-xs font-medium opacity-60">
                        <span>Subtotal</span>
                        <span>₩{order.total_amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs font-medium opacity-60">
                        <span>Shipping Fee</span>
                        <span className="uppercase tracking-widest">Free</span>
                      </div>
                      <Separator className="bg-white/10" />
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-black uppercase tracking-widest">Total</span>
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
            <span className="text-[9px] font-black text-primary/20 uppercase tracking-[0.4em]">Urban Deco Collective</span>
            <div className="flex gap-1">
              {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/10" />)}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
