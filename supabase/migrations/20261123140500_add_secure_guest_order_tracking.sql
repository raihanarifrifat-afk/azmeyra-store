create or replace function public.track_guest_order(p_order_number text, p_phone text)
returns jsonb
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select jsonb_build_object(
    'order_number', o.order_number,
    'status', o.status,
    'total', o.total,
    'created_at', o.created_at,
    'delivery_area', o.delivery_area,
    'delivery_fee', o.delivery_fee,
    'item_count', coalesce((select sum(oi.quantity)::integer from public.order_items oi where oi.order_id = o.id), 0)
  )
  from public.orders o
  where upper(o.order_number) = upper(trim(p_order_number))
    and regexp_replace(coalesce(o.phone, ''), '[^0-9]', '', 'g') = regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g')
  limit 1;
$$;

revoke all on function public.track_guest_order(text, text) from public;
grant execute on function public.track_guest_order(text, text) to anon, authenticated;
