-- =========================================================
-- CoffeeShop SaaS: Platform / Tenancy
-- =========================================================

-- Platform superusers (platform-level, outside tenant roles)
create table if not exists platform_superusers (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- Tenants (organizations)
create table if not exists orgs (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Subscription (optional but useful)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  plan text not null,                            -- e.g. 'starter','growth'
  status text not null,                          -- 'trialing','active','past_due','canceled'
  renews_at timestamptz,
  created_at timestamptz not null default now()
);

-- Locations (coffee shops) within an org
create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  name text not null,
  timezone text default 'UTC',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Org-level membership (Owner role)
create table if not exists org_members (
  org_id uuid not null references orgs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);

-- Location-level membership (Admin/Cashier)
create table if not exists location_members (
  location_id uuid not null references locations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','cashier')),
  created_at timestamptz not null default now(),
  primary key (location_id, user_id)
);

-- KDS device tokens per location (no user login)
create table if not exists kds_tokens (
  id uuid primary key default gen_random_uuid(),
  location_id uuid not null references locations(id) on delete cascade,
  token text not null unique,
  created_at timestamptz not null default now(),
  revoked boolean not null default false
);
