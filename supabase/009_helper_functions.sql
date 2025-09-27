-- =========================================================
-- CoffeeShop SaaS: Helper Functions (RLS helpers)
-- =========================================================

create or replace function is_superuser() returns boolean
language sql stable as $$
  select exists (select 1 from platform_superusers where user_id = auth.uid())
$$;

create or replace function user_is_org_owner(p_org uuid) returns boolean
language sql stable as $$
  select exists (
    select 1 from org_members where org_id = p_org and user_id = auth.uid() and role='owner'
  )
$$;

create or replace function user_in_location(p_loc uuid) returns boolean
language sql stable as $$
  select exists (
    select 1 from location_members where location_id = p_loc and user_id = auth.uid()
  )
$$;

create or replace function user_is_location_admin(p_loc uuid) returns boolean
language sql stable as $$
  select exists (
    select 1 from location_members where location_id = p_loc and user_id = auth.uid() and role='admin'
  )
$$;

create or replace function user_is_location_cashier(p_loc uuid) returns boolean
language sql stable as $$
  select exists (
    select 1 from location_members where location_id = p_loc and user_id = auth.uid() and role='cashier'
  )
$$;
