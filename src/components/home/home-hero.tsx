'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

export function HomeHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const glowOffset = Math.min(scrollY * 0.08, 24);
  const panelOffset = Math.min(scrollY * 0.05, 16);
  const gridOffset = Math.min(scrollY * 0.12, 32);

  return (
    <section className="relative py-20 bg-secondary overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-50 will-change-transform"
        style={{ transform: `translateY(${gridOffset * -1}px)` }}
      >
        <div className="absolute inset-0 [background:linear-gradient(to_right,rgba(10,10,10,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,10,0.06)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div
          className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-primary/10 blur-3xl will-change-transform"
          style={{ transform: `translate(${glowOffset * -1}px, ${glowOffset}px)` }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl will-change-transform"
          style={{ transform: `translate(${glowOffset}px, ${glowOffset * -1}px)` }}
        />
      </div>

      <div className="container mx-auto px-4 text-center relative">
        <div
          className="max-w-4xl mx-auto rounded-[2.5rem] border border-border/70 bg-background/70 backdrop-blur-sm px-6 py-12 md:px-12 md:py-14 shadow-[0_20px_60px_rgba(0,0,0,0.08)] will-change-transform"
          style={{ transform: `translateY(${panelOffset * -1}px)` }}
        >
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="w-10 h-px bg-primary/40" />
            <Badge variant="outline" className="px-3 py-1 text-[10px] tracking-[0.25em] text-primary border-primary/40">
              INTERIOR CURATION
            </Badge>
            <span className="w-10 h-px bg-primary/40" />
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-primary mb-6 tracking-tight">
            Urban Deco
          </h1>

          <div className="mx-auto mb-6 max-w-xl">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          </div>

          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            프리미엄 데스크테리어 — 미니멀한 디자인과 소재로 완성하는 나만의 워크스페이스
          </p>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground/90">
            <span>SPACE BALANCE</span>
            <span className="w-1 h-1 rounded-full bg-primary/50" />
            <span>MATERIAL FOCUS</span>
            <span className="w-1 h-1 rounded-full bg-primary/50" />
            <span>DAILY MOOD</span>
          </div>
        </div>
      </div>
    </section>
  );
}
