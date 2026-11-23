create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  label text not null default 'Home' check (label in ('Home','Office','Other')),
  full_address text not null,
  phone text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists customer_addresses_one_default_per_user
on public.customer_addresses(user_id) where is_default = true;

alter table public.customer_addresses enable row level security;
grant select, insert, update, delete on public.customer_addresses to authenticated;

drop policy if exists customer_addresses_select_own on public.customer_addresses;
create policy customer_addresses_select_own on public.customer_addresses
for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists customer_addresses_insert_own on public.customer_addresses;
create policy customer_addresses_insert_own on public.customer_addresses
for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists customer_addresses_update_own on public.customer_addresses;
create policy customer_addresses_update_own on public.customer_addresses
for update to authenticated using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

drop policy if exists customer_addresses_delete_own on public.customer_addresses;
create policy customer_addresses_delete_own on public.customer_addresses
for delete to authenticated using (user_id = (select auth.uid()));
