/** OG 스타일 정적 플레이스홀더 (`public/placeholder.svg`) */
export const PRODUCT_PLACEHOLDER = '/placeholder.svg';

export function resolveProductImageSrc(src: string | null | undefined): string {
  if (typeof src === 'string' && src.trim().length > 0) {
    return src.trim();
  }
  return PRODUCT_PLACEHOLDER;
}
