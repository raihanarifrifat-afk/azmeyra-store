create or replace function private.check_request()
returns void language plpgsql security definer set search_path = ''
as $$
declare v_method text:=current_setting('request.method',true); v_path text:=coalesce(current_setting('request.path',true),''); v_headers jsonb; v_ip inet;
begin
 if v_method not in ('POST','PUT','PATCH','DELETE') then return; end if;
 begin v_headers:=coalesce(current_setting('request.headers',true),'{}')::jsonb; v_ip:=split_part(coalesce(v_headers->>'x-forwarded-for',''),',',1)::inet;
 exception when others then v_ip:=null; end;
 if v_ip is null then v_ip:='0.0.0.0'::inet; end if;
 if v_path like '%rpc/create_guest_order%' then perform private.enforce_api_rate_limit(v_ip,'guest_checkout',5,600);
 elsif v_path like '%rpc/track_guest_order%' then perform private.enforce_api_rate_limit(v_ip,'order_tracking',20,600);
 elsif v_path like '%/contact_messages%' then perform private.enforce_api_rate_limit(v_ip,'contact_form',5,600);
 elsif v_path like '%/newsletter_subscribers%' then perform private.enforce_api_rate_limit(v_ip,'newsletter',3,600);
 else perform private.enforce_api_rate_limit(v_ip,'data_api_write',120,300); end if;
end; $$;
revoke all on function private.check_request() from public;
grant execute on function private.check_request() to anon,authenticated;
alter role authenticator set pgrst.db_pre_request='private.check_request';
drop function if exists public.check_request();
notify pgrst,'reload config';
