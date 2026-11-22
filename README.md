# AZMEYRA Store

A React + Vite storefront for AZMEYRA.

## Local development

1. Install Node.js 20 or newer.
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add the Supabase project URL and publishable (anon) key.
4. Run: `npm run dev`

## Supabase setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/migrations/0001_initial_schema.sql`.
3. In **Project Settings → API**, copy the Project URL and publishable key (legacy anon key is also supported).
4. Add these values to Vercel Environment Variables and your local `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Redeploy the Vercel project after saving environment variables.

## Admin setup

New signups receive the `customer` role. Never allow public signup to assign admin privileges.

After creating the owner's account, run this in the Supabase SQL Editor, replacing the email:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'YOUR-ADMIN-EMAIL'
);
```

Only the designated admin profile can access protected admin policies. Keep the Supabase `service_role` key private and never add it to a `VITE_*` variable or browser code.

## Current backend scope

- Supabase client and typed-by-contract data access helpers.
- Customer signup/sign-in/sign-out helpers.
- Public active catalogue reads.
- Guest Cash on Delivery order RPC that calculates prices and checks/decrements stock in the database.
- Customer-owned order reads, admin-only catalogue/order management, contact and newsletter policies.

Online bKash/Nagad payments must remain disabled until merchant credentials and a verified server-side gateway callback are configured. SMS/email notifications and production admin UI are subsequent integration steps.

The existing storefront still uses demo/local browser state until the UI is connected to these helpers and the database has been populated with approved product records.
