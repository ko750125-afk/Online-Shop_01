'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { resolveProductImageSrc } from '@/lib/product-image';
import { cn } from '@/lib/utils';

const FALLBACK_IMAGE = '/placeholder.svg';

type ProductImageFillProps = {
  src: string | null | undefined;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function ProductImageFill({ src, alt, sizes, className, priority }: ProductImageFillProps) {
  const [imgSrc, setImgSrc] = useState<string>(resolveProductImageSrc(src));

  useEffect(() => {
    setImgSrc(resolveProductImageSrc(src));
  }, [src]);

  return (
    <Image
      fill
      src={imgSrc}
      alt={alt}
      sizes={sizes}
      priority={priority}
      className={cn('object-cover', className)}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}

type ProductImageThumbProps = {
  src: string | null | undefined;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

export function ProductImageThumb({ src, alt, width, height, className, priority }: ProductImageThumbProps) {
  const [imgSrc, setImgSrc] = useState<string>(resolveProductImageSrc(src));

  useEffect(() => {
    setImgSrc(resolveProductImageSrc(src));
  }, [src]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      sizes={`${width}px`}
      priority={priority}
      className={cn('object-cover', className)}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}
