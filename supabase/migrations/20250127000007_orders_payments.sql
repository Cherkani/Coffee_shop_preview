-- =========================================================
-- CoffeeShop SaaS: Domain - Orders & Payments
-- =========================================================

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  number bigserial, -- global sequence (OK for MVP)
  created_at timestamptz not null default now(),
  status order_status not null default 'queued',
  cashier_id uuid references auth.users(id) on delete set null,
  discount_cents int not null default 0,
  notes text
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  size_id uuid references sizes(id) on delete set null,
  qty int not null check (qty > 0) default 1,
  base_price_cents int not null,
  line_total_cents int not null,
  created_at timestamptz not null default now()
);

create table if not exists order_item_modifiers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  order_item_id uuid not null references order_items(id) on delete cascade,
  modifier_id uuid not null references modifiers(id) on delete restrict,
  price_delta_cents int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references orgs(id) on delete cascade,
  location_id uuid not null references locations(id) on delete cascade,
  order_id uuid not null references orders(id) on delete restrict,
  method text not null check (method in ('cash')),
  amount_cents int not null,
  paid_at timestamptz not null default now()
);
