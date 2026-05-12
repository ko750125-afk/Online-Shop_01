'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useState, useTransition } from 'react';

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleRefresh}
      disabled={isPending}
      className={`
        relative border-primary/20 text-primary hover:bg-primary/5 rounded-xl h-10 px-4 transition-all duration-300
        ${isPending ? 'opacity-70 scale-95' : 'active:scale-95'}
      `}
    >
      <RefreshCw className={`w-4 h-4 mr-2 transition-transform duration-700 ${isPending ? 'animate-spin' : ''}`} />
      <span className="font-black text-[10px] tracking-widest uppercase">
        {isPending ? 'Syncing...' : 'Refresh'}
      </span>
      
      {isPending && (
        <span className="absolute inset-0 rounded-xl bg-primary/5 animate-pulse" />
      )}
    </Button>
  );
}
