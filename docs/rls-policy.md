# Urban Deco 앱 Supabase RLS / Policy 문서 (shop_ 스키마 격리 버전)

이 문서는 사내 데이터베이스 통합 운영 가이드라인(`앱이름_테이블명`)에 따라 격리된 `shop_products`, `shop_orders` 테이블 및 스토리지 정책 기준을 정리합니다.

## 1) 현재 앱 데이터 흐름 요약

- 클라이언트:
  - 상품 등록(`ProductForm`)은 현재 클라이언트에서 Supabase에 직접 `insert`
  - 체크아웃은 클라이언트에서 `createOrderAction` 서버 액션을 호출하여 `shop_orders`에 `insert`
- 서버:
  - 상품 삭제/수정, 주문 상태 변경은 Server Action에서 수행
  - 관리자 페이지 접근은 Supabase 세션 + `ADMIN_EMAILS` + 마스터 쿠키 기준

## 2) 권장 정책 원칙

- `anon`은 읽기 전용(공개 쇼핑 화면에 필요한 범위만)
- 쓰기(`insert/update/delete`)는 기본 거부
- 관리자 이메일만 쓰기 허용
- 스토리지 버킷(`product-images`)도 동일 기준으로 쓰기 제한

## 3) 테이블 정책 예시 (통합 SQL)

> 실제 운영에서는 Supabase SQL Editor에서 실행하여 신규 스키마 격리를 적용하세요.
> (스크래치 파일: `scratch/migrate_to_shop.sql` 참고)

```sql
-- 1. 상품 테이블 생성
create table if not exists public.shop_products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric not null default 0,
  stock int not null default 0,
  category text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. 주문 테이블 생성
create table if not exists public.shop_orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  phone text not null,
  address text not null,
  total_amount numeric not null default 0,
  status text not null default 'pending',
  items jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 공통: RLS 활성화
alter table public.shop_products enable row level security;
alter table public.shop_orders enable row level security;

-- 상품 조회는 공개
create policy "shop_products_select_public"
on public.shop_products for select to anon, authenticated using (true);

-- 관리자 이메일 검증 함수 (Urban Deco 도메인 적용)
create or replace function public.is_admin_email()
returns boolean language sql stable as $$
  select coalesce(auth.jwt()->>'email', '') in (
    'admin@urbandeco.shop',
    'manager@urbandeco.shop',
    'ko750125@gmail.com'
  );
$$;

-- 관리자 전용 상품 조작 정책
create policy "shop_products_write_admin_only"
on public.shop_products for all to authenticated
using (public.is_admin_email()) with check (public.is_admin_email());

-- 본인 주문(로그인 고객)
create policy "shop_orders_select_own"
on public.shop_orders for select to authenticated
using (user_id is not null and user_id = auth.uid());

-- 관리자: 게스트 포함 전체 주문 조회
create policy "shop_orders_select_admin_all"
on public.shop_orders for select to authenticated
using (public.is_admin_email());

-- 관리자 주문 수정 정책
create policy "shop_orders_update_admin_only"
on public.shop_orders for update to authenticated
using (public.is_admin_email()) with check (public.is_admin_email());
```

## 4) 운영 체크리스트

- [ ] RLS가 `shop_products`, `shop_orders`에 활성화되어 있는가
- [ ] 관리자 이메일 목록이 코드(`src/lib/constants.ts`)와 정책 SQL에서 일치하는가
- [ ] 배포 후 anon 계정으로 임의 조작이 거부되는지 테스트했는가
- [ ] 관리자 계정으로 주문 상태 변경/상품 수정/삭제가 정상 동작하는가
