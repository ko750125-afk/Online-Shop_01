'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { updateOrderStatus, type OrderStatus } from '@/app/actions/product-actions';
import { Loader2, CheckCircle2, Clock } from 'lucide-react';

interface OrderStatusToggleProps {
  orderId: string;
  currentStatus: string;
}

export function OrderStatusToggle({ orderId, currentStatus }: OrderStatusToggleProps) {
  const [status, setStatus] = useState<OrderStatus>(
    currentStatus === 'completed' ? 'completed' : 'pending'
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [targetStatus, setTargetStatus] = useState<OrderStatus | null>(null);

  const setNextStatus = (nextStatus: OrderStatus) => {
    if (status === nextStatus) return;
    
    setError(null);
    setTargetStatus(nextStatus);
    
    startTransition(async () => {
      const previous = status;
      setStatus(nextStatus);
      const result = await updateOrderStatus(orderId, nextStatus);
      
      if (!result.success) {
        setStatus(previous);
        setError(result.message ?? '상태 변경에 실패했습니다.');
      }
      setTargetStatus(null);
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-1 bg-secondary/30 rounded-xl w-fit border border-border/50">
        <Button
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={() => setNextStatus('pending')}
          className={`
            h-8 rounded-lg px-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300
            ${status === 'pending' 
              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
              : 'text-muted-foreground hover:bg-secondary'}
            ${targetStatus === 'pending' ? 'animate-pulse scale-95' : 'active:scale-95'}
          `}
        >
          {targetStatus === 'pending' ? (
            <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
          ) : (
            <Clock className={`w-3 h-3 mr-1.5 ${status === 'pending' ? 'animate-pulse' : ''}`} />
          )}
          대기중
        </Button>

        <Button
          size="sm"
          variant="ghost"
          disabled={isPending}
          onClick={() => setNextStatus('completed')}
          className={`
            h-8 rounded-lg px-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300
            ${status === 'completed' 
              ? 'bg-primary text-white shadow-lg shadow-primary/20' 
              : 'text-muted-foreground hover:bg-secondary'}
            ${targetStatus === 'completed' ? 'animate-pulse scale-95' : 'active:scale-95'}
          `}
        >
          {targetStatus === 'completed' ? (
            <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3 h-3 mr-1.5" />
          )}
          처리완료
        </Button>
      </div>
      {error && <p className="text-[10px] font-bold text-destructive animate-bounce px-1">{error}</p>}
    </div>
  );
}

