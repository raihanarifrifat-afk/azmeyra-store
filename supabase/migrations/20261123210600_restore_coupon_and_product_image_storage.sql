create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  discount_type text not null check (discount_type in ('percentage','fixed')),
  discount_value numeric(12,2) not null check (discount_value > 0),
  expires_at timestamptz,
  usage_limit integer check (usage_limit is null or usage_limit > 0),
  usage_count integer not null default 0 check (usage_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.coupons enable row level security;
grant select, insert, update, delete on public.coupons to authenticated;
drop policy if exists coupons_admin_all on public.coupons;
create policy coupons_admin_all on public.coupons
for all to authenticated using ((select private.is_admin()))
with check ((select private.is_admin()));

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('product-images','product-images',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=10485760,
  allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists product_images_admin_insert on storage.objects;
create policy product_images_admin_insert on storage.objects
for insert to authenticated with check (bucket_id='product-images' and (select private.is_admin()));
drop policy if exists product_images_admin_update on storage.objects;
create policy product_images_admin_update on storage.objects
for update to authenticated using (bucket_id='product-images' and (select private.is_admin()))
with check (bucket_id='product-images' and (select private.is_admin()));
drop policy if exists product_images_admin_delete on storage.objects;
create policy product_images_admin_delete on storage.objects
for delete to authenticated using (bucket_id='product-images' and (select private.is_admin()));
