-- =========================================================
-- CoffeeShop SaaS: Domain - Inventory Transactions & Alerts
-- =========================================================

create table if not exists inventory_tx (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  ingredient_id uuid not null references ingredients(id) on delete restrict,
  qty numeric not null,
  reason inv_tx_type not null,
  order_id uuid references orders(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  kind text not null check (kind in ('low_stock')),
  payload jsonb not null,
  created_at timestamptz not null default now(),
  resolved boolean not null default false
);
