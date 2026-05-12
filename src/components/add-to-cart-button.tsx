'use client';

import { useCart } from '@/store/use-cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check } from 'lucide-react';
import { useState } from 'react';

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <Button 
      onClick={handleAdd}
      className={`w-full h-16 text-lg font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] ${
        isAdded 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
      }`}
    >
      {isAdded ? (
        <>
          <Check className="w-5 h-5 mr-2" />
          담았습니다
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5 mr-2" />
          장바구니 담기
        </>
      )}
    </Button>
  );
}
