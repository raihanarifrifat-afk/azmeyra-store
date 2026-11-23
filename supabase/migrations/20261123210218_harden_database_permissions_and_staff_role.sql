-- Keep the existing private auth trigger; remove the duplicate exposed trigger.
drop trigger if exists on_auth_user_created_customer_profile on auth.users;
drop function if exists public.handle_new_customer_profile();

-- Align the schema with the existing staff-only Admin UI and RLS policies.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check
  check (role = any (array['customer'::text,'admin'::text,'staff'::text]));

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()) and role in ('customer','staff'));

-- Keep the privileged implementation outside the exposed API schema.
create or replace function private.track_guest_order(p_order_number text, p_phone text)
returns jsonb language sql stable security definer
set search_path = 'pg_catalog', 'public'
as $function$
  select jsonb_build_object(
    'order_number', o.order_number, 'status', o.status, 'total', o.total,
    'created_at', o.created_at, 'delivery_area', o.delivery_area,
    'delivery_fee', o.delivery_fee,
    'item_count', coalesce((select sum(oi.quantity)::integer from public.order_items oi where oi.order_id = o.id), 0)
  )
  from public.orders o
  where upper(o.order_number) = upper(trim(p_order_number))
    and regexp_replace(coalesce(o.phone, ''), '[^0-9]', '', 'g')
      = regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g')
  limit 1;
$function$;
revoke all on function private.track_guest_order(text,text) from public;
grant execute on function private.track_guest_order(text,text) to anon, authenticated;

create or replace function public.track_guest_order(p_order_number text, p_phone text)
returns jsonb language sql stable security invoker set search_path = ''
as $function$ select private.track_guest_order($1, $2); $function$;
revoke all on function public.track_guest_order(text,text) from public;
grant execute on function public.track_guest_order(text,text) to anon, authenticated;

-- Retire the obsolete six-argument checkout path. Checkout must include delivery_area.
drop function if exists public.create_guest_order(text,text,text,text,text,jsonb);
drop function if exists private.create_guest_order(text,text,text,text,text,jsonb);
revoke all on function private.create_guest_order(text,text,text,text,text,jsonb,text) from public;
grant execute on function private.create_guest_order(text,text,text,text,text,jsonb,text) to anon, authenticated;

-- Re-state welcome popup settings/storage setup so migration history is reproducible.
create table if not exists public.site_settings (key text primary key, value text not null, updated_at timestamptz not null default now());
alter table public.site_settings enable row level security;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
drop policy if exists site_settings_public_welcome_read on public.site_settings;
create policy site_settings_public_welcome_read on public.site_settings for select to anon, authenticated using (key = 'welcome_popup_image');
drop policy if exists site_settings_admin_manage on public.site_settings;
create policy site_settings_admin_manage on public.site_settings for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('welcome-images','welcome-images',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true,file_size_limit=10485760,allowed_mime_types=array['image/jpeg','image/png','image/webp'];
drop policy if exists welcome_images_admin_insert on storage.objects;
create policy welcome_images_admin_insert on storage.objects for insert to authenticated with check (bucket_id='welcome-images' and (select private.is_admin()));
drop policy if exists welcome_images_admin_update on storage.objects;
create policy welcome_images_admin_update on storage.objects for update to authenticated using (bucket_id='welcome-images' and (select private.is_admin())) with check (bucket_id='welcome-images' and (select private.is_admin()));
drop policy if exists welcome_images_admin_delete on storage.objects;
create policy welcome_images_admin_delete on storage.objects for delete to authenticated using (bucket_id='welcome-images' and (select private.is_admin()));
