drop policy if exists newsletter_public_insert on public.newsletter_subscribers;
create policy newsletter_public_insert on public.newsletter_subscribers
for insert to anon, authenticated
with check (
  length(trim(email)) between 3 and 254
  and email = lower(trim(email))
  and email ~* '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
);
