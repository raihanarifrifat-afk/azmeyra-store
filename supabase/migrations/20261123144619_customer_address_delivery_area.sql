alter table public.customer_addresses
add column if not exists delivery_area text;

alter table public.customer_addresses
drop constraint if exists customer_addresses_delivery_area_check;

alter table public.customer_addresses
add constraint customer_addresses_delivery_area_check
check (delivery_area in ('inside_dhaka','outside_dhaka'));
