-- AZMEYRA initial production schema
-- Run this file in Supabase SQL Editor. Never expose the service_role key in the browser.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(12,2) not null check (price >= 0),
  compare_at_price numeric(12,2) check (compare_at_price is null or compare_at_price >= price),
  images text[] not null default '{}',
  sizes text[] not null default '{}',
  colors text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  sku text unique,
  tag text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_active_idx on public.products(category_id, is_active);
create index if not exists products_created_at_idx on public.products(created_at desc);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('AZ' || upper(substr(encode(gen_random_bytes(6), 'hex'), 1, 10))),
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  phone text not null,
  email text,
  shipping_address text not null,
  payment_method text not null check (payment_method in ('cod','bkash','nagad')),
  payment_status text not null default 'unpaid' check (payment_status in ('unpaid','pending','paid','failed','refunded')),
  status text not null default 'received' check (status in ('received','confirmed','processing','shipped','delivered','cancelled')),
  subtotal numeric(12,2) not null check (subtotal >= 0),
  delivery_fee numeric(12,2) not null default 0 check (delivery_fee >= 0),
  total numeric(12,2) not null check (total >= 0),
  customer_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_created_idx on public.orders(user_id, created_at desc);
create index if not exists orders_phone_idx on public.orders(phone);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  image_url text,
  unit_price numeric(12,2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  size text,
  color text,
  created_at timestamptz not null default now()
);

create index if not exists order_items_order_idx on public.order_items(order_id);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  name text not null,
  contact text not null,
  subject text not null default 'General enquiry',
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Keep profile records in sync with Supabase Auth signups.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- Secure guest checkout: the database calculates prices and reserves stock.
create or replace function public.create_guest_order(
  p_customer_name text,
  p_phone text,
  p_email text,
  p_shipping_address text,
  p_payment_method text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(12,2) := 0;
  v_delivery_fee numeric(12,2) := 0;
  v_item jsonb;
  v_product public.products%rowtype;
  v_quantity integer;
  v_size text;
  v_color text;
begin
  if length(trim(coalesce(p_customer_name, ''))) < 2 then
    raise exception 'Please provide your full name';
  end if;
  if trim(coalesce(p_phone, '')) !~ '^01[0-9]{9}$' then
    raise exception 'Please provide a valid Bangladesh mobile number';
  end if;
  if length(trim(coalesce(p_shipping_address, ''))) < 8 then
    raise exception 'Please provide a complete delivery address';
  end if;
  if p_payment_method <> 'cod' then
    raise exception 'Online payment is not enabled yet. Please choose Cash on Delivery.';
  end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) < 1 or jsonb_array_length(p_items) > 20 then
    raise exception 'Your bag must contain between 1 and 20 line items';
  end if;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    if coalesce(v_item ->> 'product_id', '') = '' then
      raise exception 'A product in your bag is invalid';
    end if;
    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity < 1 or v_quantity > 10 then
      raise exception 'Each item quantity must be between 1 and 10';
    end if;
    select * into v_product
      from public.products
      where id = (v_item ->> 'product_id')::uuid
        and is_active = true
      for update;
    if not found then
      raise exception 'A product is no longer available';
    end if;
    if v_product.stock < v_quantity then
      raise exception 'Insufficient stock for %', v_product.name;
    end if;
    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  end loop;

  insert into public.orders (
    user_id, customer_name, phone, email, shipping_address,
    payment_method, subtotal, delivery_fee, total
  ) values (
    auth.uid(), trim(p_customer_name), trim(p_phone), nullif(trim(coalesce(p_email, '')), ''),
    trim(p_shipping_address), 'cod', v_subtotal, v_delivery_fee, v_subtotal + v_delivery_fee
  )
  returning id, order_number into v_order_id, v_order_number;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item ->> 'quantity')::integer;
    v_size := nullif(trim(coalesce(v_item ->> 'size', '')), '');
    v_color := nullif(trim(coalesce(v_item ->> 'color', '')), '');
    select * into v_product
      from public.products
      where id = (v_item ->> 'product_id')::uuid
      for update;

    if v_size is not null and cardinality(v_product.sizes) > 0 and not (v_size = any(v_product.sizes)) then
      raise exception 'Selected size is unavailable for %', v_product.name;
    end if;
    if v_color is not null and cardinality(v_product.colors) > 0 and not (v_color = any(v_product.colors)) then
      raise exception 'Selected colour is unavailable for %', v_product.name;
    end if;

    insert into public.order_items (
      order_id, product_id, product_name, image_url, unit_price, quantity, size, color
    ) values (
      v_order_id, v_product.id, v_product.name, v_product.images[1],
      v_product.price, v_quantity, v_size, v_color
    );

    update public.products
      set stock = stock - v_quantity, updated_at = now()
      where id = v_product.id;
  end loop;

  return jsonb_build_object('id', v_order_id, 'order_number', v_order_number, 'total', v_subtotal + v_delivery_fee);
end;
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Profiles: customers can see/update only their own basic profile; admins can manage all.
drop policy if exists "Profiles are viewable by owner or admin" on public.profiles;
create policy "Profiles are viewable by owner or admin" on public.profiles
for select to authenticated using (id = (select auth.uid()) or public.is_admin());
drop policy if exists "Customers update own profile" on public.profiles;
create policy "Customers update own profile" on public.profiles
for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()) and role = 'customer');
drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public storefront can only read active catalogue items.
drop policy if exists "Public reads active categories" on public.categories;
create policy "Public reads active categories" on public.categories
for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public reads active products" on public.products;
create policy "Public reads active products" on public.products
for select to anon, authenticated using (is_active = true or public.is_admin());
drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products" on public.products
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Only signed-in customers can read their own orders. Admins can manage all orders.
drop policy if exists "Customers read own orders" on public.orders;
create policy "Customers read own orders" on public.orders
for select to authenticated using (user_id = (select auth.uid()) or public.is_admin());
drop policy if exists "Admins manage orders" on public.orders;
create policy "Admins manage orders" on public.orders
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Customers read own order items" on public.order_items;
create policy "Customers read own order items" on public.order_items
for select to authenticated using (
  exists (select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or public.is_admin()))
);
drop policy if exists "Admins manage order items" on public.order_items;
create policy "Admins manage order items" on public.order_items
for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Guest checkout is allowed only through the validated database function above.
drop policy if exists "Public sends contact messages" on public.contact_messages;
create policy "Public sends contact messages" on public.contact_messages
for insert to anon, authenticated with check (
  length(trim(name)) between 2 and 100 and
  length(trim(contact)) between 5 and 160 and
  length(trim(message)) between 5 and 3000
);
drop policy if exists "Admins read and manage contact messages" on public.contact_messages;
create policy "Admins read and manage contact messages" on public.contact_messages
for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public subscribes to newsletter" on public.newsletter_subscribers;
create policy "Public subscribes to newsletter" on public.newsletter_subscribers
for insert to anon, authenticated with check (length(trim(email)) <= 254);
drop policy if exists "Admins manage newsletter" on public.newsletter_subscribers;
create policy "Admins manage newsletter" on public.newsletter_subscribers
for all to authenticated using (public.is_admin()) with check (public.is_admin());

revoke all on function public.create_guest_order(text,text,text,text,text,jsonb) from public;
grant execute on function public.create_guest_order(text,text,text,text,text,jsonb) to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
