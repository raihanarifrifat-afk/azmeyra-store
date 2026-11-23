alter table public.orders add column if not exists delivery_area text;
alter table public.orders drop constraint if exists orders_delivery_area_check;
alter table public.orders add constraint orders_delivery_area_check check (delivery_area is null or delivery_area in ('inside_dhaka','outside_dhaka'));
update public.orders set delivery_area = case when delivery_fee = 80 then 'inside_dhaka' when delivery_fee = 150 then 'outside_dhaka' else delivery_area end where delivery_area is null;

CREATE OR REPLACE FUNCTION private.create_guest_order(p_customer_name text, p_phone text, p_email text, p_shipping_address text, p_payment_method text, p_items jsonb, p_delivery_area text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(12,2) := 0;
  v_delivery_fee numeric(12,2);
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
  if p_delivery_area not in ('inside_dhaka', 'outside_dhaka') then
    raise exception 'Please select a delivery area';
  end if;

  v_delivery_fee := case p_delivery_area when 'inside_dhaka' then 80 else 150 end;

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
    where id = (v_item ->> 'product_id')::uuid and is_active = true
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
    payment_method, subtotal, delivery_area, delivery_fee, total
  ) values (
    auth.uid(), trim(p_customer_name), trim(p_phone),
    nullif(trim(coalesce(p_email, '')), ''), trim(p_shipping_address),
    'cod', v_subtotal, p_delivery_area, v_delivery_fee, v_subtotal + v_delivery_fee
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

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'delivery_area', p_delivery_area,
    'delivery_fee', v_delivery_fee,
    'total', v_subtotal + v_delivery_fee
  );
end;
$function$


-- Exposed invoker wrapper; privileged checkout logic remains in private schema.
create or replace function public.create_guest_order(
  p_customer_name text, p_phone text, p_email text, p_shipping_address text,
  p_payment_method text, p_items jsonb, p_delivery_area text
)
returns jsonb language sql security invoker set search_path = ''
as $$ select private.create_guest_order($1,$2,$3,$4,$5,$6,$7); $$;
revoke all on function public.create_guest_order(text,text,text,text,text,jsonb,text) from public;
grant execute on function public.create_guest_order(text,text,text,text,text,jsonb,text) to anon, authenticated;
