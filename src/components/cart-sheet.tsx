'use client';

import { useCart } from '@/store/use-cart';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductImageFill } from '@/components/product-image';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCart();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Prevent hydration error
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = () => {
    onOpenChange(false);
    router.push('/checkout');
  };

  if (!mounted) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-background/95 backdrop-blur-xl border-l border-border p-0 overflow-hidden shadow-2xl">
        <SheetHeader className="p-8 pb-6 border-b border-border/50 bg-secondary/5">
          <SheetTitle className="text-2xl font-black text-primary flex items-center tracking-tighter">
            <ShoppingBag className="mr-3 w-6 h-6 text-primary/60" />
            장바구니
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-8 text-center">
            <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center text-muted-foreground/30">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <div className="space-y-2">
              <p className="text-xl font-bold text-primary">장바구니가 비어 있습니다</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Urban Deco의 특별한 아이템들을 둘러보고<br />당신만의 공간을 채워보세요.
              </p>
            </div>
            <Button 
              variant="outline" 
              className="rounded-full px-8 h-12 border-primary/10 font-bold hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => onOpenChange(false)}
            >
              쇼핑 계속하기
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="space-y-4 p-8">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-5 rounded-3xl border border-border/40 bg-secondary/10 p-4 hover:bg-secondary/20 transition-colors group">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-secondary border border-border shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                      <ProductImageFill
                        src={item.image_url}
                        alt={item.name}
                        sizes="80px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <h4 className="text-sm font-black text-primary line-clamp-1 leading-tight">{item.name}</h4>
                        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest">₩{item.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border/60 rounded-xl bg-background/50 p-1 shadow-inner">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-primary"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-primary">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-primary"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-muted-foreground/30 hover:text-red-500 hover:bg-red-50 transition-all"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-8 bg-secondary/10 border-t border-border/50 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                  <span>소계</span>
                  <span className="text-primary tracking-normal">₩{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold text-muted-foreground">
                  <span>배송비</span>
                  <span className="text-green-600 tracking-normal">무료</span>
                </div>
                <Separator className="bg-border/50" />
                <div className="flex justify-between items-end pt-2">
                  <span className="text-sm font-black text-primary">총 합계</span>
                  <span className="text-3xl font-black text-primary tracking-tighter">₩{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
              <Button 
                className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-black rounded-3xl shadow-2xl shadow-primary/20 flex items-center justify-center transition-all hover:scale-[1.02] active:scale-95"
                onClick={handleCheckout}
              >
                주문하기
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
