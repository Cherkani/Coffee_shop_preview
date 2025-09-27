-- =========================================================
-- CoffeeShop SaaS: Domain - Catalog
-- =========================================================

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  name text not null,
  category text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists sizes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (org_id, location_id, name)
);

create table if not exists product_prices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  size_id uuid not null references sizes(id) on delete restrict,
  price_cents int not null check (price_cents >= 0),
  created_at timestamptz not null default now(),
  unique (product_id, size_id)
);

create table if not exists modifier_groups (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  name text not null,
  required boolean not null default false,
  min_choices int not null default 0,
  max_choices int, -- null = unlimited
  created_at timestamptz not null default now()
);

create table if not exists modifiers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  group_id uuid not null references modifier_groups(id) on delete cascade,
  name text not null,
  price_delta_cents int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists product_modifier_groups (
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  group_id uuid not null references modifier_groups(id) on delete cascade,
  sort_order int not null default 0,
  primary key (product_id, group_id)
);
