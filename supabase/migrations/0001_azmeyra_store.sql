create extension if not exists pgcrypto;
create table if not exists public.products(id uuid primary key default gen_random_uuid(),name text not null,slug text unique,description text,category text not null,price numeric(10,2) not null check(price>=0),compare_at_price numeric(10,2),images text[] not null default '{}',sizes text[] not null default '{}',colors text[] not null default '{}',stock integer not null default 0 check(stock>=0),is_active boolean not null default true,is_featured boolean not null default false,created_at timestamptz not null default now());
create table if not exists public.orders(id uuid primary key default gen_random_uuid(),customer_name text not null,phone text not null,address text not null,payment_method text not null check(payment_method in('Cash on Delivery','bKash','Nagad')),items jsonb not null default '[]',total numeric(10,2) not null check(total>=0),status text not null default 'pending' check(status in('pending','confirmed','processing','shipped','delivered','cancelled')),created_at timestamptz not null default now());
create table if not exists public.coupons(id uuid primary key default gen_random_uuid(),code text unique not null,discount_type text not null check(discount_type in('percentage','fixed')),discount_value numeric(10,2) not null check(discount_value>0),active boolean not null default true,expires_at timestamptz);
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.coupons enable row level security;
create policy "Public can view active products" on public.products for select using(is_active=true);
create policy "Public can view active coupons" on public.coupons for select using(active=true);
-- Public order insertion stays disabled until a trusted checkout endpoint validates product prices and stock.
-- Never expose a Supabase service-role key in browser code.