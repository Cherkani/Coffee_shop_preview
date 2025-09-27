-- =========================================================
-- CoffeeShop SaaS: Core schema + RLS
-- =========================================================

-- Extensions
create extension if not exists pgcrypto; -- for gen_random_uuid()

-- =========================================================
-- Enums
-- =========================================================
do $$ begin
  create type order_status as enum ('queued','in_progress','ready','paid','void');
exception when duplicate_object then null; end $$;

do $$ begin
  create type inv_tx_type as enum ('deduct_on_sale','manual_adjust');
exception when duplicate_object then null; end $$;

-- =========================================================
-- Platform / Tenancy
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

-- =========================================================
-- Domain: Catalog
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

-- =========================================================
-- Domain: Inventory & Recipes
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

-- =========================================================
-- Domain: Orders & Payments
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

-- =========================================================
-- Domain: Inventory transactions & Alerts
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

-- =========================================================
-- Indexes (performance)
-- =========================================================
create index if not exists idx_orders_loc_created on orders (location_id, created_at);
create index if not exists idx_payments_loc_paidat on payments (location_id, paid_at);
create index if not exists idx_invtx_loc_created on inventory_tx (location_id, created_at);
create index if not exists idx_order_items_order on order_items (order_id);
create index if not exists idx_recipe_items_ing on recipe_items (ingredient_id);
create index if not exists idx_products_active on products (location_id, is_active);

-- =========================================================
-- Helper Functions (RLS helpers)
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

-- =========================================================
-- Business Logic: Cash Pay RPC (atomic)
-- =========================================================
create or replace function pay_cash(p_order_id uuid, p_amount_cents int)
returns void
language plpgsql
security definer
as $$
declare v_org uuid; v_loc uuid;
begin
  -- Scope check
  select org_id, location_id into v_org, v_loc from orders where id = p_order_id;
  if v_org is null then
    raise exception 'order not found';
  end if;
  if not (is_superuser() or user_is_location_admin(v_loc) or user_is_location_cashier(v_loc)) then
    raise exception 'not authorized to pay this order';
  end if;

  insert into payments (org_id, location_id, order_id, method, amount_cents)
  values (v_org, v_loc, p_order_id, 'cash', p_amount_cents);

  update orders set status='paid' where id = p_order_id;
end $$;

-- =========================================================
-- Triggers: Deduct inventory on order -> paid + low-stock alerts
-- =========================================================
create or replace function deduct_inventory_on_paid()
returns trigger language plpgsql as $$
begin
  if NEW.status = 'paid' and coalesce(OLD.status,'queued') <> 'paid' then
    -- Insert inventory transactions for all recipe ingredients
    insert into inventory_tx (org_id, location_id, ingredient_id, qty, reason, order_id)
    select
      o.org_id,
      o.location_id,
      ri.ingredient_id,
      - (ri.qty * oi.qty) as qty,  -- deduction is negative
      'deduct_on_sale',
      o.id
    from orders o
    join order_items oi on oi.order_id = o.id
    join recipes r on r.org_id = o.org_id and r.location_id = o.location_id
                  and r.product_id = oi.product_id
                  and (r.size_id = oi.size_id or r.size_id is null)
    join recipe_items ri on ri.recipe_id = r.id
    where o.id = NEW.id;

    -- Apply to on_hand
    update ingredients i
    set on_hand = i.on_hand + tx.sum_qty
    from (
      select ingredient_id, sum(qty) as sum_qty
      from inventory_tx
      where order_id = NEW.id
      group by ingredient_id
    ) tx
    where tx.ingredient_id = i.id;

    -- Create low-stock alerts
    insert into alerts (org_id, location_id, kind, payload)
    select i.org_id, i.location_id, 'low_stock',
           jsonb_build_object('ingredient_id', i.id, 'name', i.name, 'on_hand', i.on_hand)
    from ingredients i
    where i.org_id = NEW.org_id
      and i.location_id = NEW.location_id
      and i.on_hand <= i.low_stock_threshold
    on conflict do nothing;
  end if;
  return NEW;
end $$;

drop trigger if exists trg_deduct_on_paid on orders;
create trigger trg_deduct_on_paid
after update on orders
for each row execute function deduct_inventory_on_paid();

-- Optional: enforce cashier discount cap (10%)
create or replace function enforce_cashier_discount()
returns trigger language plpgsql as $$
declare v_loc uuid; v_is_cashier boolean; v_sum int;
begin
  v_loc := coalesce(NEW.location_id, OLD.location_id);
  v_is_cashier := user_is_location_cashier(v_loc);
  if v_is_cashier then
    select coalesce(sum(line_total_cents),0)
      into v_sum
    from order_items where order_id = coalesce(NEW.id, OLD.id);
    if NEW.discount_cents > (v_sum * 0.10) then
      raise exception 'cashier discount exceeds 10%% cap';
    end if;
  end if;
  return NEW;
end $$;

drop trigger if exists trg_enforce_cashier_discount on orders;
create trigger trg_enforce_cashier_discount
before insert or update on orders
for each row execute function enforce_cashier_discount();

-- =========================================================
-- RLS: Enable
-- =========================================================
alter table orgs enable row level security;
alter table subscriptions enable row level security;
alter table locations enable row level security;
alter table org_members enable row level security;
alter table location_members enable row level security;
alter table kds_tokens enable row level security;

alter table products enable row level security;
alter table sizes enable row level security;
alter table product_prices enable row level security;
alter table modifier_groups enable row level security;
alter table modifiers enable row level security;
alter table product_modifier_groups enable row level security;

alter table ingredients enable row level security;
alter table recipes enable row level security;
alter table recipe_items enable row level security;

alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_item_modifiers enable row level security;

alter table payments enable row level security;
alter table inventory_tx enable row level security;
alter table alerts enable row level security;

-- =========================================================
-- RLS: Policies
-- =========================================================

-- orgs
create policy orgs_read on orgs
  for select using (is_superuser() or user_is_org_owner(id));

create policy orgs_update on orgs
  for update using (is_superuser() or user_is_org_owner(id))
  with check (is_superuser() or user_is_org_owner(id));

-- subscriptions
create policy subs_read on subscriptions
  for select using (is_superuser() or user_is_org_owner(org_id));

create policy subs_write on subscriptions
  for all using (is_superuser() or user_is_org_owner(org_id))
  with check (is_superuser() or user_is_org_owner(org_id));

-- locations
create policy locations_read on locations
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(id));

create policy locations_insert on locations
  for insert with check (is_superuser() or user_is_org_owner(org_id));

create policy locations_update on locations
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(id));

-- org_members
create policy org_members_read on org_members
  for select using (is_superuser() or user_is_org_owner(org_id));

create policy org_members_write on org_members
  for all using (is_superuser() or user_is_org_owner(org_id))
  with check (is_superuser() or user_is_org_owner(org_id));

-- location_members
create policy location_members_read on location_members
  for select using (
    is_superuser() or
    exists (select 1 from locations l where l.id = location_members.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_members.location_id)
  );

create policy location_members_write on location_members
  for all using (
    is_superuser() or
    exists (select 1 from locations l where l.id = location_members.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_members.location_id)
  )
  with check (
    is_superuser() or
    exists (select 1 from locations l where l.id = location_members.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_members.location_id)
  );

-- KDS tokens (location admins & owners can read/manage)
create policy kds_tokens_read on kds_tokens
  for select using (
    is_superuser() or
    exists (select 1 from locations l where l.id = kds_tokens.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_id)
  );

create policy kds_tokens_write on kds_tokens
  for all using (
    is_superuser() or
    exists (select 1 from locations l where l.id = kds_tokens.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_id)
  )
  with check (
    is_superuser() or
    exists (select 1 from locations l where l.id = kds_tokens.location_id and user_is_org_owner(l.org_id)) or
    user_is_location_admin(location_id)
  );

-- Catalog (products, sizes, prices, modifier groups, modifiers, mapping)
create policy products_select on products
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy products_insert on products
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy products_update on products
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy sizes_select on sizes
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy sizes_insert on sizes
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy sizes_update on sizes
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy product_prices_select on product_prices
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy product_prices_insert on product_prices
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy product_prices_update on product_prices
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy modifier_groups_select on modifier_groups
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy modifier_groups_insert on modifier_groups
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy modifier_groups_update on modifier_groups
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy modifiers_select on modifiers
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy modifiers_insert on modifiers
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy modifiers_update on modifiers
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy pmg_select on product_modifier_groups
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy pmg_write on product_modifier_groups
  for all using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

-- Inventory & Recipes
create policy ingredients_select on ingredients
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy ingredients_insert on ingredients
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy ingredients_update on ingredients
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy recipes_select on recipes
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy recipes_insert on recipes
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));
create policy recipes_update on recipes
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy recipe_items_select on recipe_items
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy recipe_items_write on recipe_items
  for all using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

-- Orders & Items & Modifiers
create policy orders_select on orders
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy orders_insert on orders
  for insert with check (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id));
create policy orders_update on orders
  for update using (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id))
  with check (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id));

create policy order_items_select on order_items
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy order_items_write on order_items
  for all using (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id))
  with check (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id));

create policy oim_select on order_item_modifiers
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy oim_write on order_item_modifiers
  for all using (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id))
  with check (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id));

-- Payments
create policy payments_select on payments
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy payments_insert on payments
  for insert with check (is_superuser() or user_is_location_admin(location_id) or user_is_location_cashier(location_id));

-- Inventory TX & Alerts
create policy invtx_select on inventory_tx
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy invtx_insert on inventory_tx
  for insert with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

create policy alerts_select on alerts
  for select using (is_superuser() or user_is_org_owner(org_id) or user_in_location(location_id));
create policy alerts_write on alerts
  for update using (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id))
  with check (is_superuser() or user_is_org_owner(org_id) or user_is_location_admin(location_id));

-- =========================================================
-- (Optional) Guard: prevent cashiers from setting status to 'void'
-- =========================================================
create or replace function prevent_cashier_void()
returns trigger language plpgsql as $$
begin
  if user_is_location_cashier(coalesce(NEW.location_id, OLD.location_id))
     and NEW.status = 'void' then
    raise exception 'cashier cannot void orders';
  end if;
  return NEW;
end $$;

drop trigger if exists trg_prevent_cashier_void on orders;
create trigger trg_prevent_cashier_void
before insert or update on orders
for each row execute function prevent_cashier_void();
