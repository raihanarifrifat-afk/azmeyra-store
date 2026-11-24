-- Atomic per-IP Data API rate limiting (PostgREST only).
create table if not exists private.api_rate_limits (
  client_ip inet not null, scope text not null, window_start timestamptz not null,
  request_count integer not null default 0,
  primary key (client_ip,scope,window_start)
);
revoke all on private.api_rate_limits from public,anon,authenticated;
create or replace function private.enforce_api_rate_limit(p_ip inet,p_scope text,p_limit integer,p_window_seconds integer)
returns void language plpgsql security definer set search_path = ''
as $$
declare v_window_start timestamptz; v_count integer;
begin
  v_window_start:=date_bin(make_interval(secs=>p_window_seconds),clock_timestamp(),timestamptz 'epoch');
  insert into private.api_rate_limits(client_ip,scope,window_start,request_count) values(p_ip,p_scope,v_window_start,1)
  on conflict(client_ip,scope,window_start) do update set request_count=private.api_rate_limits.request_count+1
  returning request_count into v_count;
  if v_count>p_limit then
    raise sqlstate 'PGRST' using message=json_build_object('message','Too many requests. Please wait and try again.')::text,
    detail=json_build_object('status',429,'status_text','Too Many Requests')::text;
  end if;
  if random()<0.01 then delete from private.api_rate_limits where window_start<clock_timestamp()-interval '1 day'; end if;
end; $$;
revoke all on function private.enforce_api_rate_limit(inet,text,integer,integer) from public;
grant execute on function private.enforce_api_rate_limit(inet,text,integer,integer) to anon,authenticated;

create or replace function public.check_request()
returns void language plpgsql security definer set search_path = ''
as $$
declare v_method text:=current_setting('request.method',true); v_path text:=coalesce(current_setting('request.path',true),'');
v_headers jsonb; v_ip inet;
begin
  if v_method not in ('POST','PUT','PATCH','DELETE') then return; end if;
  begin
    v_headers:=coalesce(current_setting('request.headers',true),'{}')::jsonb;
    v_ip:=split_part(coalesce(v_headers->>'x-forwarded-for',''),',',1)::inet;
  exception when others then v_ip:=null; end;
  if v_ip is null then v_ip:='0.0.0.0'::inet; end if;
  if v_path like '%/rpc/create_guest_order%' then perform private.enforce_api_rate_limit(v_ip,'guest_checkout',5,600);
  elsif v_path like '%/rpc/track_guest_order%' then perform private.enforce_api_rate_limit(v_ip,'order_tracking',20,600);
  elsif v_path like '%/contact_messages%' then perform private.enforce_api_rate_limit(v_ip,'contact_form',5,600);
  elsif v_path like '%/newsletter_subscribers%' then perform private.enforce_api_rate_limit(v_ip,'newsletter',3,600);
  else perform private.enforce_api_rate_limit(v_ip,'data_api_write',120,300); end if;
end; $$;
revoke all on function public.check_request() from public;
grant execute on function public.check_request() to anon,authenticated;
alter role authenticator set pgrst.db_pre_request='public.check_request';
notify pgrst,'reload config';

drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_insert on public.categories for insert to authenticated with check ((select private.is_admin()));
create policy categories_admin_update on public.categories for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy categories_admin_delete on public.categories for delete to authenticated using ((select private.is_admin()));
drop policy if exists products_admin_all on public.products;
create policy products_admin_insert on public.products for insert to authenticated with check ((select private.is_admin()));
create policy products_admin_update on public.products for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy products_admin_delete on public.products for delete to authenticated using ((select private.is_admin()));
drop policy if exists contact_admin_all on public.contact_messages;
create policy contact_admin_select on public.contact_messages for select to authenticated using ((select private.is_admin()));
create policy contact_admin_update on public.contact_messages for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy contact_admin_delete on public.contact_messages for delete to authenticated using ((select private.is_admin()));
drop policy if exists newsletter_admin_all on public.newsletter_subscribers;
create policy newsletter_admin_select on public.newsletter_subscribers for select to authenticated using ((select private.is_admin()));
create policy newsletter_admin_update on public.newsletter_subscribers for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy newsletter_admin_delete on public.newsletter_subscribers for delete to authenticated using ((select private.is_admin()));
drop policy if exists orders_admin_all on public.orders;
drop policy if exists orders_staff_select on public.orders;
drop policy if exists orders_customer_read_own on public.orders;
create policy orders_read_own_or_staff on public.orders for select to authenticated using (
 user_id=(select auth.uid()) or exists(select 1 from public.profiles p where p.id=(select auth.uid()) and p.role in ('admin','staff')));
create policy orders_admin_insert on public.orders for insert to authenticated with check ((select private.is_admin()));
create policy orders_admin_delete on public.orders for delete to authenticated using ((select private.is_admin()));
drop policy if exists order_items_admin_all on public.order_items;
drop policy if exists order_items_staff_select on public.order_items;
drop policy if exists order_items_customer_read_own on public.order_items;
create policy order_items_read_own_or_staff on public.order_items for select to authenticated using (
 exists(select 1 from public.orders o join public.profiles p on p.id=(select auth.uid())
 where o.id=order_items.order_id and (o.user_id=(select auth.uid()) or p.role in ('admin','staff'))));
create policy order_items_admin_insert on public.order_items for insert to authenticated with check ((select private.is_admin()));
create policy order_items_admin_update on public.order_items for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy order_items_admin_delete on public.order_items for delete to authenticated using ((select private.is_admin()));
drop policy if exists profiles_admin_all on public.profiles;
drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin on public.profiles for select to authenticated using (id=(select auth.uid()) or (select private.is_admin()));
create policy profiles_admin_insert on public.profiles for insert to authenticated with check ((select private.is_admin()));
create policy profiles_admin_delete on public.profiles for delete to authenticated using ((select private.is_admin()));
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update to authenticated
using (id=(select auth.uid()) or (select private.is_admin()))
with check ((select private.is_admin()) or (id=(select auth.uid()) and role in ('customer','staff')));
drop policy if exists site_settings_admin_manage on public.site_settings;
drop policy if exists site_settings_public_welcome_read on public.site_settings;
create policy site_settings_public_welcome_read on public.site_settings for select to anon,authenticated
using (key='welcome_popup_image' or (select private.is_admin()));
create policy site_settings_admin_insert on public.site_settings for insert to authenticated with check ((select private.is_admin()));
create policy site_settings_admin_update on public.site_settings for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy site_settings_admin_delete on public.site_settings for delete to authenticated using ((select private.is_admin()));
