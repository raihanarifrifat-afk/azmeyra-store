drop policy if exists contact_public_insert on public.contact_messages;
create policy contact_public_insert on public.contact_messages
for insert to anon, authenticated
with check (
  (user_id is null or user_id = (select auth.uid()))
  and length(trim(name)) between 2 and 100
  and length(trim(contact)) between 5 and 160
  and length(trim(message)) between 5 and 3000
);

drop policy if exists newsletter_public_insert on public.newsletter_subscribers;
create policy newsletter_public_insert on public.newsletter_subscribers
for insert to anon, authenticated
with check (
  length(trim(email)) between 3 and 254
  and email = lower(trim(email))
  and email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
);
