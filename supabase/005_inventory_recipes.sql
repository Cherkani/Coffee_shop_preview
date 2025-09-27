-- =========================================================
-- CoffeeShop SaaS: Domain - Inventory & Recipes
-- =========================================================

create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  name text not null,
  unit text not null, -- 'g','ml','piece'
  on_hand numeric not null default 0,
  low_stock_threshold numeric not null default 0,
  unit_cost_cents int not null default 0, -- for COGS
  created_at timestamptz not null default now(),
  unique (org_id, location_id, name)
);

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  size_id uuid references sizes(id) on delete set null, -- null = size-agnostic
  created_at timestamptz not null default now()
);

create table if not exists recipe_items (
  recipe_id uuid references recipes(id) on delete cascade,
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete restrict,
  qty numeric not null check (qty > 0),
  created_at timestamptz not null default now(),
  primary key (recipe_id, ingredient_id)
);
