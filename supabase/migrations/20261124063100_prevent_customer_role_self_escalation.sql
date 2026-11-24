create or replace function private.current_profile_role()
returns text language sql stable security definer set search_path = ''
as $$ select p.role from public.profiles p where p.id=(select auth.uid()) limit 1; $$;
revoke all on function private.current_profile_role() from public;
grant execute on function private.current_profile_role() to authenticated;
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
for update to authenticated
using (id=(select auth.uid()) or (select private.is_admin()))
with check ((select private.is_admin()) or (id=(select auth.uid()) and role=(select private.current_profile_role())));
