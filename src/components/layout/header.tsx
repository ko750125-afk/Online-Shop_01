'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, LogOut, LayoutDashboard, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartSheet } from '@/components/cart-sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from '@/store/use-cart';
import { useAuth } from '@/hooks/use-auth';

const NAV_LINKS = [
  { href: '/', label: 'SHOP' },
  { href: '/lookbook', label: 'ARCHIVE' },
  { href: '/story', label: 'STORY' },
];

export function Header() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, loading, isAdmin, logout } = useAuth();
  const { getTotalItems } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? getTotalItems() : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex h-20 min-h-20 items-center justify-between gap-2 px-3 sm:h-24 sm:min-h-24 sm:gap-3 sm:px-4">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="group relative flex size-14 shrink-0 overflow-hidden rounded-full transition-transform hover:scale-110 focus-visible:outline-none sm:size-16"
          >
            <Image
              src="/urban-deco-seal.png"
              alt="Urban Deco — INTERIOR OBJET & LIVING"
              width={64}
              height={64}
              className="object-cover w-full h-full"
              priority
            />
          </Link>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-2xl font-black text-primary tracking-tight leading-none">Urban Deco</h1>
            <p className="text-[11px] font-medium text-primary/50 tracking-wide mt-0.5">Premium Interior & Lifestyle</p>
          </div>
        </div>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-bold text-primary hover:opacity-70 transition-opacity uppercase tracking-widest"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* 우측 액션 영역 */}
        <div className="flex items-center space-x-2 sm:space-x-5">
          {!loading && (
            <div className="flex items-center">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger 
                    className="relative h-10 w-10 rounded-full bg-secondary/30 border border-primary/5 flex items-center justify-center hover:bg-secondary/50 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all duration-300 outline-none"
                  >
                    <User className="h-5 w-5 text-primary" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 mt-4 rounded-[2rem] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-primary/5 bg-background/95 backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="px-4 py-4 border-b border-border/50 mb-2">
                      <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] mb-1">Authenticated Account</p>
                      <p className="text-sm font-black text-primary truncate">{user.email}</p>
                    </div>
                    <DropdownMenuItem className="rounded-2xl focus:bg-primary/5 focus:text-primary cursor-pointer py-3 mb-1 transition-colors">
                      <Link href="/mypage" className="flex items-center w-full">
                        <ShoppingBag className="w-4 h-4 mr-3 text-primary/60" />
                        <span className="font-bold text-sm">MY ORDERS</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem className="rounded-2xl focus:bg-primary/5 focus:text-primary cursor-pointer py-3 mb-1 transition-colors">
                        <Link href="/admin/orders" className="flex items-center w-full">
                          <LayoutDashboard className="w-4 h-4 mr-3 text-primary/60" />
                          <span className="font-bold text-sm">ADMIN DASHBOARD</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator className="bg-border/50 my-2" />
                    <DropdownMenuItem 
                      onClick={logout}
                      className="rounded-2xl focus:bg-red-50 focus:text-red-600 text-red-500 cursor-pointer py-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3 opacity-60" />
                      <span className="font-bold text-sm">LOG OUT</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-4 mr-2">
                  <Link href="/login" className="text-xs font-black text-primary/60 hover:text-primary transition-colors tracking-widest uppercase">Login</Link>
                  <Link href="/signup" className="text-xs font-black bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90 transition-opacity tracking-widest uppercase shadow-lg shadow-primary/20">Join</Link>
                </div>
              )}
            </div>
          )}

          <div className="w-px h-4 bg-border mx-2 hidden sm:block" />

          {/* 장바구니 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10 rounded-full bg-primary/5 hover:bg-primary text-primary hover:text-primary-foreground transition-all duration-300 group"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black ring-2 ring-background group-hover:bg-red-500 transition-colors">
              {cartCount}
            </span>
          </Button>
        </div>
      </div>

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
}
